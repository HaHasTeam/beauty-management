import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { type Row } from '@tanstack/react-table'
import { XIcon } from 'lucide-react'
import * as React from 'react'
import { useId } from 'react'
import { useForm } from 'react-hook-form'
import { GrStatusGood } from 'react-icons/gr'
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
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger
} from '@/components/ui/drawer'
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form'
import { Textarea } from '@/components/ui/textarea'
import useHandleServerError from '@/hooks/useHandleServerError'
import { useMediaQuery } from '@/hooks/useMediaQuery'
import { activateAccountMutateApi } from '@/network/apis/auth'
import { getAllUserApi } from '@/network/apis/user'
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

  const handleServerError = useHandleServerError()
  const isDesktop = useMediaQuery('(min-width: 640px)')
  const form = useForm<z.infer<typeof reasonSchema>>({
    resolver: zodResolver(reasonSchema),
    defaultValues: {
      reason: ''
    }
  })
  const id = useId()
  const { mutateAsync: updateStatusAccountMutation } = useMutation({
    mutationKey: [activateAccountMutateApi.mutationKey],
    mutationFn: activateAccountMutateApi.fn
  })
  const updateStatusAccount = async ({ accounts }: { status: string; accounts: TUser[] }) => {
    const updatePromises = accounts.map((item) => updateStatusAccountMutation(item.id))

    // Wait for all updates to complete
    await Promise.all(updatePromises)
    await queryClient.invalidateQueries({ queryKey: [getAllUserApi.queryKey] })
    form.reset()
    // await queryClient.invalidateQueries({ queryKey: ['getAllBrands', 'updateStatusBrandById'] })
    props.onOpenChange?.(false)
  }
  async function onSubmit() {
    try {
      const formatData = {
        status: status,
        accounts: accounts
      }

      await updateStatusAccount(formatData)
    } catch (error) {
      handleServerError({
        error,
        form
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
              Update status {accounts.length} Selected {accounts.length > 1 ? 'Accounts' : 'Account'}
            </Button>
          </DialogTrigger>
        ) : null}
        <DialogContent className='sm:max-w-2xl'>
          <Form {...form}>
            <form
              noValidate
              onSubmit={form.handleSubmit(onSubmit)}
              // className='w-full flex-col gap-8 flex'
              id={`form-${id}`}
            >
              <DialogHeader className='my-2'>
                <DialogTitle className='flex items-center gap-2'>
                  <GrStatusGood className='size-6' aria-hidden='true' />
                  Are you sure to update status to {status} {accounts.length >= 2 ? 'these accounts' : 'this accounts'}?
                </DialogTitle>
                <DialogDescription>
                  You are about to <b className='uppercase'>Update</b>{' '}
                  {accounts.map((Account, index) => (
                    <div className='' key={index}>
                      <Badge className='mr-1'>{Account.email}</Badge>
                    </div>
                  ))}
                  . After update , the Account will be active on platform. Please check the Account information before
                  update.
                </DialogDescription>
                {status === UserStatusEnum.BANNED && (
                  <FormField
                    control={form.control}
                    name='reason'
                    render={({ field }) => (
                      <FormItem className='my-2'>
                        <FormLabel required>Reason</FormLabel>
                        <FormControl>
                          <Textarea rows={3} placeholder='reason' className='resize-none' {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}
              </DialogHeader>
              <DialogFooter className='gap-2 sm:space-x-0 my-2 '>
                <DialogClose asChild>
                  <Button
                    variant='outline'
                    onClick={() => {
                      form.reset()
                    }}
                  >
                    Cancel
                  </Button>
                </DialogClose>
                <Button type='submit' aria-label='Update Selected rows' variant='default' className='text-white'>
                  Update To {status}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    )
  }

  return (
    <Drawer {...props}>
      {showTrigger ? (
        <DrawerTrigger asChild>
          <Button variant='default' size='sm' className='text-white'>
            <XIcon className='size-4' aria-hidden='true' />
            Update {accounts.length} Selected {accounts.length > 1 ? 'accounts' : 'account'}
          </Button>
        </DrawerTrigger>
      ) : null}
      <DrawerContent>
        <Form {...form}>
          <form
            noValidate
            onSubmit={form.handleSubmit(onSubmit)}
            // className='w-full flex-col gap-8 flex'
            id={`form-${id}`}
          >
            <DrawerHeader className='my-2'>
              <DrawerTitle>Are you absolutely sure?</DrawerTitle>
              <DrawerDescription>
                You are about to <b className='uppercase'>update</b>{' '}
                {accounts.map((account, index) => (
                  <Badge className='mr-1' key={index}>
                    {account.username}
                  </Badge>
                ))}
                . After update , the account will be active on platform. Please check the account information before
                update.
              </DrawerDescription>
              {/* {status === AccountStatus.DENIED && (
                <FormField
                  control={form.control}
                  name='reason'
                  render={({ field }) => (
                    <FormItem className='my-2'>
                      <FormLabel required>Reason</FormLabel>
                      <FormControl>
                        <Textarea rows={3} placeholder='reason' className='resize-none' {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )} */}
            </DrawerHeader>

            <DrawerFooter className='gap-2 sm:space-x-0'>
              <DrawerClose asChild>
                <Button variant='outline'>Cancel</Button>
              </DrawerClose>
              <Button aria-label='Update Selected rows' className='text-white' variant='default' type='submit'>
                Update Account{accounts.length > 1 ? 's' : ''}
              </Button>
            </DrawerFooter>
          </form>
        </Form>
      </DrawerContent>
    </Drawer>
  )
}
