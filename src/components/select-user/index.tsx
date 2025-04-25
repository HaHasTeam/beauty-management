import { useQuery } from '@tanstack/react-query'
import { User as UserIcon } from 'lucide-react'
import { forwardRef, HTMLAttributes, ReactElement, ReactNode, useCallback, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
// Removed react-select type imports
// import { GroupBase, OnChangeValue, Select } from 'react-select'
import { useShallow } from 'zustand/react/shallow'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { getAccountFilterApi } from '@/network/apis/user'
import { TGetAccountFilterRequestParams } from '@/network/apis/user/type'
import { useStore } from '@/stores/store'
import { TUser } from '@/types/user'

import { TOption } from '../ui/react-select'
import LocalAsyncSelect from '../ui/react-select/AsyncSelect'

// Define Props using react-select types - Simplified
type SelectUserProps = Omit<HTMLAttributes<HTMLDivElement>, 'onChange' | 'value'> & {
  query?: TGetAccountFilterRequestParams
  includeSelf?: boolean
  multiple?: boolean
  value?: string | string[] | null
  onChange?: (value: string | string[] | null) => void
  placeholder?: string
  className?: string
  // Removed complex Omit for now
}

// Simple initials helper function
const getInitials = (name: string): string => {
  const words = name.split(' ').filter(Boolean)
  if (words.length === 0) return ''
  if (words.length === 1) return words[0].charAt(0).toUpperCase()
  return (words[0].charAt(0) + words[words.length - 1].charAt(0)).toUpperCase()
}

// Apply truncation and force height/nowrap
const getItemDisplay = (user: TUser, isSelf: boolean): ReactElement => {
  const imgUrl = user?.avatar
  const name = `${user?.firstName || ''} ${user?.lastName || ''}`.trim() || user.username
  const email = user.email
  const initials = getInitials(name)
  const role = typeof user.role === 'string' ? user.role.toLowerCase().replace(/_/g, ' ') : 'User'

  return (
    <div className='flex items-center gap-3 py-1.5 px-1 w-full overflow-hidden whitespace-nowrap h-fit'>
      <Avatar className='size-5 border border-slate-100 shadow-sm flex-shrink-0'>
        <AvatarImage src={imgUrl} alt={name} />
        <AvatarFallback className='text-xs font-medium bg-slate-100 text-slate-600'>
          {initials || <UserIcon className='size-4' />}
        </AvatarFallback>
      </Avatar>
      <div className='flex-1 min-w-0 flex items-center gap-2 justify-between'>
        <div className='flex-1 min-w-0 flex items-baseline gap-2'>
          <span className='text-sm font-medium text-slate-800 truncate' title={name}>
            {name}
          </span>
          <span className='text-xs text-muted-foreground truncate' title={email}>
            {email}
          </span>
        </div>
        <div className='flex items-center gap-1.5 flex-shrink-0'>
          {isSelf && (
            <Badge variant='secondary' className='text-xs px-1.5 py-0 h-4'>
              Me
            </Badge>
          )}
          <span className='capitalize text-[11px] bg-slate-100 px-1.5 rounded font-medium'>{role}</span>
        </div>
      </div>
    </div>
  )
}

// Revert Ref type to HTMLDivElement based on reference file format
const SelectUser = forwardRef<HTMLDivElement, SelectUserProps>((props, ref) => {
  const {
    placeholder = 'Select a user',
    className,
    query,
    onChange,
    value,
    multiple = false,
    includeSelf = false,
    ...rest
  } = props

  const { t } = useTranslation()

  const { data: filteredAccounts, isFetching: isGettingFilteredAccounts } = useQuery({
    queryKey: [getAccountFilterApi.queryKey, query as TGetAccountFilterRequestParams],
    queryFn: getAccountFilterApi.fn
  })
  const { user: self } = useStore(useShallow((state) => ({ user: state.user })))

  const listUser = useMemo(() => {
    const selfUser = includeSelf && self ? [self] : []
    const otherUsers = filteredAccounts?.data.items || []
    const uniqueOtherUsers = otherUsers.filter((u) => !(includeSelf && self && u.id === self.id))
    return [...selfUser, ...uniqueOtherUsers]
  }, [includeSelf, self, filteredAccounts?.data.items])

  const getUserLabel = useCallback(
    (user: TUser, isSelf: boolean): string => {
      const name = `${user?.firstName || ''} ${user?.lastName || ''}`.trim() || user.username
      const email = user.email
      return isSelf ? `${t('common.me', 'Me')} - ${name} (${email})` : `${name} (${email})`
    },
    [t]
  )

  const userOptions: TOption[] = useMemo(() => {
    if (!listUser) return []
    return listUser.map((user) => {
      const isSelf = self?.id === user.id
      return {
        value: user.id,
        label: getUserLabel(user, isSelf),
        display: getItemDisplay(user, isSelf)
      }
    })
  }, [listUser, self, getUserLabel])

  const selectedOptions = useMemo(() => {
    const findOption = (id: string): TOption | null => {
      const user = listUser.find((item) => item.id === id)
      if (!user) return null
      const isSelf = self?.id === user.id
      return {
        value: user.id,
        label: getUserLabel(user, isSelf),
        display: getItemDisplay(user, isSelf)
      }
    }

    if (multiple) {
      if (!Array.isArray(value)) return []
      return value.map(findOption).filter((opt): opt is TOption => opt !== null)
    } else {
      if (typeof value !== 'string') return null
      return findOption(value)
    }
  }, [value, listUser, multiple, self, getUserLabel])

  const promiseOptions = useCallback(
    (inputValue: string): Promise<TOption[]> => {
      const lowerInputValue = inputValue.toLowerCase()
      const filtered = userOptions.filter((option) => option.label?.toLowerCase().includes(lowerInputValue))
      return Promise.resolve(filtered)
    },
    [userOptions]
  )

  // Revert handler signature to use 'any'
  const handleChange = useCallback(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (newValue: any) => {
      if (multiple) {
        const selectedValues = newValue as TOption[] | null
        onChange?.(selectedValues?.map((opt) => opt.value as string) ?? [])
      } else {
        const selectedValue = newValue as TOption | null
        onChange?.(selectedValue?.value != null ? String(selectedValue.value) : null)
      }
    },
    [multiple, onChange]
  )

  // Revert formatOptionLabel signature to use 'any'
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const formatOptionLabel = (data: any): ReactNode => {
    return data?.display as ReactElement
  }

  return (
    <LocalAsyncSelect
      {...rest}
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      ref={ref as any}
      cacheOptions
      defaultOptions={userOptions}
      loadOptions={promiseOptions}
      value={selectedOptions}
      isMulti={multiple}
      placeholder={placeholder}
      className={className}
      isLoading={isGettingFilteredAccounts}
      isClearable
      isSearchable
      onChange={handleChange}
      formatOptionLabel={formatOptionLabel}
    />
  )
})

SelectUser.displayName = 'SelectUser'

export default SelectUser
