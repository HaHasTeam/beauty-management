import { useMutation } from '@tanstack/react-query'
import { type Row } from '@tanstack/react-table'
import { XIcon } from 'lucide-react'
import * as React from 'react'
import { FaBan } from 'react-icons/fa'

import Button from '@/components/button'
import { Badge } from '@/components/ui/badge'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog'
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger
} from '@/components/ui/drawer'
import useHandleServerError from '@/hooks/useHandleServerError'
import { useMediaQuery } from '@/hooks/useMediaQuery'
import { useToast } from '@/hooks/useToast'
import { updateUsersListStatusApi } from '@/network/apis/user'
import { TUser, UserStatusEnum } from '@/types/user'

interface BanAccountsDialogProps extends React.ComponentPropsWithoutRef<typeof Dialog> {
  accounts: Row<TUser>['original'][]
  showTrigger?: boolean
  onSuccess?: () => void
}

export function BanAccountsDialog({ accounts, showTrigger = true, onSuccess, ...props }: BanAccountsDialogProps) {
  const { successToast } = useToast()
  const handleServerError = useHandleServerError()
  const isDesktop = useMediaQuery('(min-width: 640px)')
  const { mutateAsync: banUsersFn, isPending: isBanningUsers } = useMutation({
    mutationKey: [updateUsersListStatusApi.mutationKey],
    mutationFn: updateUsersListStatusApi.fn,
    onSuccess: () => {
      successToast({
        message: 'Amazing! Your action has been completed!'
      })
    }
  })

  async function onBan() {
    try {
      await banUsersFn({
        ids: accounts.map((account) => account.id),
        status: UserStatusEnum.BANNED
      })
      props.onOpenChange?.(false)
      onSuccess?.()
    } catch (error) {
      handleServerError({
        error
      })
    }
  }

  if (isDesktop) {
    return (
      <Dialog {...props}>
        {showTrigger ? (
          <DialogTrigger asChild>
            <Button variant='destructive' size='sm' className='text-white'>
              <XIcon className='size-4' aria-hidden='true' />
              Ban {accounts.length} Selected {accounts.length > 1 ? 'Users' : 'User'}
            </Button>
          </DialogTrigger>
        ) : null}
        <DialogContent className='sm:max-w-2xl'>
          <DialogHeader>
            <DialogTitle className='flex items-center gap-2'>
              <FaBan className='size-6' aria-hidden='true' />
              Are you sure to ban {accounts.length >= 2 ? 'these accounts' : 'this account'}?
            </DialogTitle>
            <DialogDescription>
              You are about to <b className='uppercase'>ban</b>{' '}
              {accounts.map((account) => (
                <Badge className='mr-1'>{account.username}</Badge>
              ))}
              . After banning, the accounts will be disabled. Please check the accounts before banning.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className='gap-2 sm:space-x-0'>
            <DialogClose asChild>
              <Button variant='outline'>Cancel</Button>
            </DialogClose>
            <Button
              aria-label='Ban Selected rows'
              variant='destructive'
              className='text-white'
              onClick={onBan}
              disabled={isBanningUsers}
              loading={isBanningUsers}
            >
              Ban User{accounts.length > 1 ? 's' : ''}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    )
  }

  return (
    <Drawer {...props}>
      {showTrigger ? (
        <DrawerTrigger asChild>
          <Button variant='destructive' size='sm' className='text-white'>
            <XIcon className='size-4' aria-hidden='true' />
            Ban {accounts.length} Selected {accounts.length > 1 ? 'Users' : 'User'}
          </Button>
        </DrawerTrigger>
      ) : null}
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>Are you absolutely sure?</DrawerTitle>
          <DrawerDescription>
            You are about to <b className='uppercase'>ban</b>{' '}
            {accounts.map((account) => (
              <Badge className='mr-1'>{account.username}</Badge>
            ))}
            . After banning, the accounts will be disabled. Please check the accounts before banning.
          </DrawerDescription>
        </DrawerHeader>
        <DrawerFooter className='gap-2 sm:space-x-0'>
          <DrawerClose asChild>
            <Button variant='outline'>Cancel</Button>
          </DrawerClose>
          <Button
            aria-label='Ban Selected rows'
            className='text-white'
            variant='destructive'
            onClick={onBan}
            disabled={isBanningUsers}
            loading={isBanningUsers}
          >
            Ban User{accounts.length > 1 ? 's' : ''}
          </Button>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  )
}
