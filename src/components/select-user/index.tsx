import { useQuery } from '@tanstack/react-query'
import { Image } from 'lucide-react'
import { ChangeEvent, forwardRef, HTMLAttributes, useCallback, useMemo } from 'react'
import { useShallow } from 'zustand/react/shallow'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { getAccountFilterApi } from '@/network/apis/user'
import { TGetAccountFilterRequestParams } from '@/network/apis/user/type'
import { useStore } from '@/stores/store'
import { TUser } from '@/types/user'

import { InputProps } from '../ui/input'
import { TOption } from '../ui/react-select'
import AsyncSelect from '../ui/react-select/AsyncSelect'

type Props = HTMLAttributes<HTMLSelectElement> &
  InputProps & {
    query?: TGetAccountFilterRequestParams
    includeSelf?: boolean
  }

const getItemDisplay = (user: TUser) => {
  const imgUrl = user?.avatar
  return (
    <div className='flex items-center gap-1'>
      <Avatar className='bg-transparent size-5'>
        <AvatarImage src={imgUrl} />
        <AvatarFallback className='bg-transparent'>
          <Image className='size-4' />
        </AvatarFallback>
      </Avatar>
      <span>{user?.email}</span>
    </div>
  )
}

const SelectUser = forwardRef<HTMLSelectElement, Props>((props) => {
  const {
    placeholder = 'Select a user',
    className,
    query,
    onChange,
    value,
    multiple = false,
    includeSelf = false
  } = props

  const { data: filteredAccounts, isFetching: isGettingFilteredAccounts } = useQuery({
    queryKey: [getAccountFilterApi.queryKey, query as TGetAccountFilterRequestParams],
    queryFn: getAccountFilterApi.fn
  })
  const { user: self } = useStore(
    useShallow((state) => {
      return {
        user: state.user
      }
    })
  )

  const listUser = useMemo(() => {
    const extraItem = includeSelf && self ? [self] : []
    return [...extraItem, ...(filteredAccounts?.data.items || [])]
  }, [includeSelf, self, filteredAccounts?.data.items])

  const userOptions = useMemo(() => {
    if (!listUser) return []
    return listUser.map((user) => ({
      value: user?.id,
      label: self?.id === user.id ? 'Me' + ` | ${user.email}` : user?.email,
      display: getItemDisplay({ ...user, email: self?.id === user.id ? 'Me' + ` | ${user.email}` : user?.email })
    }))
  }, [listUser, self])

  const selectedOptions = useMemo(() => {
    if (multiple) {
      if (!value) return []
      const options = value as string[]
      return options
        .map((option) => {
          const item = listUser.find((item) => item.id === option)
          if (!item) return null
          return {
            value: item?.id,
            label: self?.id === item.id ? 'Me' + ` | ${item.email}` : item?.email,
            display: getItemDisplay({
              ...item,
              email: self?.id === item.id ? 'Me' + ` | ${item.email}` : item?.email
            })
          }
        })
        .filter(Boolean)
    } else {
      if (!value) return null
      const item = listUser.find((item) => item.id === value)
      if (!item) return null
      return {
        value: item?.id,
        label: self?.id === item.id ? 'Me' + ` | ${item.email}` : item?.email,
        display: getItemDisplay(item as TUser)
      }
    }
  }, [value, listUser, multiple, self])

  const promiseOptions = useCallback(
    (inputValue: string) => {
      if (!inputValue) {
        return Promise.resolve(userOptions)
      }
      const filteredOptions = userOptions.filter((option) =>
        option.label?.toLowerCase().includes(inputValue.toLowerCase())
      )
      return Promise.resolve(filteredOptions)
    },
    [userOptions]
  )

  return (
    <AsyncSelect
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
      onChange={(options) => {
        if (multiple) {
          const optionValues = options as TOption[]
          if (onChange) onChange(optionValues.map((option) => option.value) as unknown as ChangeEvent<HTMLInputElement>)
        } else {
          const optionValues = options as TOption
          if (onChange) onChange(optionValues?.value as unknown as ChangeEvent<HTMLInputElement>)
        }
      }}
    />
  )
})

SelectUser.displayName = 'SelectUser'

export default SelectUser
