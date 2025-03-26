'use client'

import { useQuery } from '@tanstack/react-query'
import { Check, ChevronsUpDown, Loader2, Search, User } from 'lucide-react'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'

import { Button } from '@/components/ui/button'
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { cn } from '@/lib/utils'
import { getAccountFilterApi } from '@/network/apis/user'
import { RoleEnum, StatusEnum } from '@/types/enum'

interface UserSelectProps {
  onSelect: (userId: string) => void
  disabled?: boolean
}

export function UserSelect({ onSelect, disabled = false }: UserSelectProps) {
  const { t } = useTranslation()
  const [open, setOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedUser, setSelectedUser] = useState<{ id: string; name: string; email: string } | null>(null)

  const { data: users, isLoading } = useQuery({
    queryKey: [
      getAccountFilterApi.queryKey,
      {
        search: searchTerm,
        role: RoleEnum.OPERATOR,
        status: StatusEnum.ACTIVE
      }
    ],
    queryFn: getAccountFilterApi.fn,
    enabled: open,
    select(data) {
      return data.data.items
    }
  })

  const handleSelect = (userId: string, userName: string, userEmail: string) => {
    // First update the selected user
    setSelectedUser({ id: userId, name: userName, email: userEmail })
    // Then call the onSelect callback
    onSelect(userId)
    // Finally close the popover
    setTimeout(() => setOpen(false), 0)
  }

  return (
    <Popover open={open} onOpenChange={setOpen} modal>
      <PopoverTrigger asChild>
        <Button
          variant='outline'
          role='combobox'
          aria-expanded={open}
          className='w-full justify-between'
          disabled={disabled}
        >
          {selectedUser ? (
            <div className='flex items-center'>
              <User className='mr-2 h-4 w-4' />
              {selectedUser.name}
            </div>
          ) : (
            <span>{t('Select a user')}</span>
          )}
          <ChevronsUpDown className='ml-2 h-4 w-4 shrink-0 opacity-50' />
        </Button>
      </PopoverTrigger>
      <PopoverContent className='w-[300px] p-0' align='start'>
        <Command shouldFilter={false}>
          <div className='flex items-center border-b px-3'>
            <Search className='mr-2 h-4 w-4 shrink-0 opacity-50' />
            <CommandInput
              placeholder={t('Search users...')}
              className='flex-1'
              value={searchTerm}
              onValueChange={setSearchTerm}
            />
          </div>
          {isLoading ? (
            <div className='py-6 text-center'>
              <Loader2 className='h-6 w-6 animate-spin mx-auto' />
              <p className='text-sm text-muted-foreground mt-2'>{t('Loading users...')}</p>
            </div>
          ) : (
            <CommandList>
              <CommandEmpty>{t('No users found.')}</CommandEmpty>
              <CommandGroup>
                {(users ?? []).map((user) => (
                  <CommandItem
                    key={user.id}
                    value={user.id}
                    onSelect={() => {
                      // Prevent the default behavior
                      handleSelect(user.id, user.username, user.email)
                    }}
                  >
                    <User className='mr-2 h-4 w-4' />
                    <div className='flex flex-col'>
                      <span>{user.username}</span>
                      <span className='text-xs text-muted-foreground'>{user.email}</span>
                    </div>
                    <Check
                      className={cn('ml-auto h-4 w-4', selectedUser?.id === user.id ? 'opacity-100' : 'opacity-0')}
                    />
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          )}
        </Command>
      </PopoverContent>
    </Popover>
  )
}
