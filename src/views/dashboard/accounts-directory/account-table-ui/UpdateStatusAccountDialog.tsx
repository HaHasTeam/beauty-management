import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { type Row } from '@tanstack/react-table'
import { CheckCircle, CheckCircle2, InfoIcon } from 'lucide-react'
import * as React from 'react'
import { useId } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

import Button from '@/components/button'
import FormLabel from '@/components/form-label'
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
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger
} from '@/components/ui/drawer'
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form'
import { Textarea } from '@/components/ui/textarea'
import useHandleServerError from '@/hooks/useHandleServerError'
import { useMediaQuery } from '@/hooks/useMediaQuery'
import { useToast } from '@/hooks/useToast'
import { activateAccountMutateApi } from '@/network/apis/auth'
import { getAccountFilterApi } from '@/network/apis/user'
import { reasonSchema } from '@/schemas'
import { TUser, UserStatusEnum } from '@/types/user'

interface UpdateStatusAccountDialogProps extends React.ComponentPropsWithoutRef<typeof Dialog> {
  accounts: Row<TUser>['original'][]
  showTrigger?: boolean
  status: UserStatusEnum
}

export function UpdateStatusAccountDialog({
  accounts,
  showTrigger = true,
  status,
  ...props
}: UpdateStatusAccountDialogProps) {
  const queryClient = useQueryClient()
  const { successToast, errorToast } = useToast()
  const handleServerError = useHandleServerError()
  const isDesktop = useMediaQuery('(min-width: 640px)')
  const form = useForm<z.infer<typeof reasonSchema>>({
    resolver: zodResolver(reasonSchema),
    defaultValues: {
      reason: ''
    }
  })
  const id = useId()
  const { mutateAsync: updateStatusAccountMutation, isPending } = useMutation({
    mutationKey: [activateAccountMutateApi.mutationKey],
    mutationFn: activateAccountMutateApi.fn,
    onSuccess: () => {
      successToast({
        message: 'Account(s) activated successfully',
        description: `Successfully activated ${accounts.length} account(s).`
      })
    },
    onError: () => {
      errorToast({
        message: 'Error',
        description: 'Failed to activate the account(s). Please try again.'
      })
    }
  })

  const updateStatusAccount = async () => {
    try {
      // Process all accounts
      const updatePromises = accounts.map((item) => updateStatusAccountMutation(item.id))
      // Wait for all updates to complete
      await Promise.all(updatePromises)
      await queryClient.invalidateQueries({ queryKey: [getAccountFilterApi.queryKey] })
      form.reset()
      props.onOpenChange?.(false)
    } catch (error) {
      handleServerError({
        error,
        form
      })
    }
  }

  // Get display name for each account
  const getDisplayName = (account: TUser) => {
    if (account.firstName || account.lastName) {
      return `${account.firstName || ''} ${account.lastName || ''}`.trim()
    }
    return account.username || account.email || 'Unknown User'
  }

  // Create content to use in both desktop and mobile views
  const content = (
    <Form {...form}>
      <form noValidate onSubmit={form.handleSubmit(updateStatusAccount)} id={`form-${id}`}>
        <DialogHeader>
          <DialogTitle className='flex items-center gap-2'>
            <CheckCircle2 className='size-5 text-green-500' aria-hidden='true' />
            Activate User{accounts.length > 1 ? 's' : ''}
          </DialogTitle>
          <DialogDescription>
            {accounts.length === 1
              ? 'Are you sure you want to activate this user account? This will enable full platform access.'
              : `Are you sure you want to activate these ${accounts.length} user accounts? This will enable full platform access.`}
          </DialogDescription>
        </DialogHeader>

        <div className='py-4'>
          <div className='flex flex-wrap gap-1 mb-4'>
            {accounts.map((account) => (
              <Badge key={account.id} variant='outline' className='bg-slate-100'>
                {getDisplayName(account)}
              </Badge>
            ))}
          </div>

          <div className='rounded-md bg-green-50 p-4 mb-4'>
            <div className='flex'>
              <div className='flex-shrink-0'>
                <InfoIcon className='h-5 w-5 text-green-400' aria-hidden='true' />
              </div>
              <div className='ml-3'>
                <h3 className='text-sm font-medium text-green-800'>What happens next?</h3>
                <div className='mt-2 text-sm text-green-700'>
                  <p>Activating a user account means:</p>
                  <ul className='list-disc pl-5 space-y-1 mt-2'>
                    <li>The user will gain full access to the platform</li>
                    <li>They will be able to log in immediately</li>
                    <li>They will be notified via email about their account activation</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {status === UserStatusEnum.BANNED && (
            <FormField
              control={form.control}
              name='reason'
              render={({ field }) => (
                <FormItem>
                  <FormLabel required>Reason for activation</FormLabel>
                  <FormControl>
                    <Textarea
                      rows={3}
                      placeholder='Please provide a reason for activating this account...'
                      className='resize-none'
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}
        </div>

        <DialogFooter className='gap-2 sm:space-x-0'>
          <DialogClose asChild>
            <Button variant='outline' disabled={isPending}>
              Cancel
            </Button>
          </DialogClose>
          <Button
            type='submit'
            variant='default'
            className='bg-green-600 hover:bg-green-700 text-white'
            disabled={isPending}
            loading={isPending}
          >
            {isPending ? 'Activating...' : 'Activate User' + (accounts.length > 1 ? 's' : '')}
          </Button>
        </DialogFooter>
      </form>
    </Form>
  )

  if (isDesktop) {
    return (
      <Dialog {...props}>
        {showTrigger ? (
          <DialogTrigger asChild>
            <Button
              variant='outline'
              size='sm'
              className='gap-1 border-green-200 bg-green-50 text-green-700 hover:bg-green-100'
            >
              <CheckCircle className='h-3.5 w-3.5' />
              <span>Activate {accounts.length > 1 ? `${accounts.length} Users` : 'User'}</span>
            </Button>
          </DialogTrigger>
        ) : null}
        <DialogContent className='sm:max-w-md'>{content}</DialogContent>
      </Dialog>
    )
  }

  return (
    <Drawer {...props}>
      {showTrigger ? (
        <DrawerTrigger asChild>
          <Button
            variant='outline'
            size='sm'
            className='gap-1 border-green-200 bg-green-50 text-green-700 hover:bg-green-100'
          >
            <CheckCircle className='h-3.5 w-3.5' />
            <span>Activate {accounts.length > 1 ? `${accounts.length} Users` : 'User'}</span>
          </Button>
        </DrawerTrigger>
      ) : null}
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle className='flex items-center gap-2'>
            <CheckCircle2 className='size-5 text-green-500' aria-hidden='true' />
            Activate User{accounts.length > 1 ? 's' : ''}
          </DrawerTitle>
          <DrawerDescription>
            {accounts.length === 1
              ? 'Are you sure you want to activate this user account? This will enable full platform access.'
              : `Are you sure you want to activate these ${accounts.length} user accounts? This will enable full platform access.`}
          </DrawerDescription>
        </DrawerHeader>

        <div className='px-4'>{content}</div>
      </DrawerContent>
    </Drawer>
  )
}
