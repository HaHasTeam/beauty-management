import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { type Row } from '@tanstack/react-table'
import { CheckCircle2, XCircle } from 'lucide-react'
import * as React from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

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
import { Form } from '@/components/ui/form'
import useHandleServerError from '@/hooks/useHandleServerError'
import { useMediaQuery } from '@/hooks/useMediaQuery'
import { useToast } from '@/hooks/useToast'
import { filterVouchersApi, getAllVouchersApi, updateStatusVoucherByIdApi } from '@/network/apis/voucher'
import { reasonSchema } from '@/schemas'
import { StatusEnum } from '@/types/enum'
import { TVoucher } from '@/types/voucher'

interface UpdateStatusVoucherDialogProps extends React.ComponentPropsWithoutRef<typeof Dialog> {
  Vouchers: Row<TVoucher>['original'][]
  showTrigger?: boolean
  onSuccess?: (Voucher: Row<TVoucher>['original'][]) => void
  status: StatusEnum
}

export function UpdateStatusVoucherDialog({
  Vouchers,
  showTrigger = true,
  onSuccess,
  status,
  ...props
}: UpdateStatusVoucherDialogProps) {
  const { successToast } = useToast()
  const queryClient = useQueryClient()
  const handleServerError = useHandleServerError()
  const isDesktop = useMediaQuery('(min-width: 640px)')
  const isActivating = status === StatusEnum.ACTIVE

  const form = useForm<z.infer<typeof reasonSchema>>({
    resolver: zodResolver(reasonSchema),
    defaultValues: {
      reason: ''
    }
  })

  const id = React.useId()
  const { mutateAsync: updateVouchersFn, isPending: isUpdatingVouchers } = useMutation({
    mutationKey: [updateStatusVoucherByIdApi.mutationKey],
    mutationFn: async () => {
      const promises = Vouchers.map((voucher) =>
        updateStatusVoucherByIdApi.fn({
          voucherId: voucher.id,
          status: status
        })
      )
      return Promise.all(promises)
    },
    onSuccess: () => {
      const actionText = isActivating ? 'activated' : 'deactivated'
      successToast({
        message: `Voucher${Vouchers.length > 1 ? 's' : ''} ${actionText} successfully`,
        description: `Successfully ${actionText} ${Vouchers.length} voucher${Vouchers.length > 1 ? 's' : ''}.`
      })
      queryClient.invalidateQueries({ queryKey: [getAllVouchersApi.queryKey] })
      queryClient.invalidateQueries({ queryKey: [filterVouchersApi.queryKey] })
    }
  })

  async function onSubmit() {
    try {
      await updateVouchersFn()
      onSuccess?.(Vouchers)
      props.onOpenChange?.(false)
    } catch (error) {
      handleServerError({
        error,
        form
      })
    }
  }

  // Get icon and color classes based on the action
  const getActionStyles = () => {
    if (isActivating) {
      return {
        icon: CheckCircle2,
        headerBg: 'bg-green-50',
        iconColor: 'text-green-500',
        textColor: 'text-green-800',
        buttonVariant: 'default' as const
      }
    } else {
      return {
        icon: XCircle,
        headerBg: 'bg-amber-50',
        iconColor: 'text-amber-500',
        textColor: 'text-amber-800',
        buttonVariant: 'secondary' as const
      }
    }
  }

  const styles = getActionStyles()
  const ActionIcon = styles.icon
  const actionText = isActivating ? 'Activate' : 'Deactivate'

  // Create content to use in both desktop and mobile views
  const content = (
    <Form {...form}>
      <form noValidate onSubmit={form.handleSubmit(onSubmit)} id={`form-${id}`}>
        <div className={`rounded-md ${styles.headerBg} p-4 mb-6`}>
          <div className='flex'>
            <div className='flex-shrink-0'>
              <ActionIcon className={`h-5 w-5 ${styles.iconColor}`} aria-hidden='true' />
            </div>
            <div className='ml-3'>
              <h3 className={`text-sm font-medium ${styles.textColor}`}>
                {actionText} Voucher{Vouchers.length > 1 ? 's' : ''}
              </h3>
              <div className={`mt-2 text-sm ${styles.textColor}`}>
                <p>
                  You are about to {actionText.toLowerCase()} {Vouchers.length > 1 ? 'these vouchers' : 'this voucher'}.
                  {isActivating
                    ? ' Once activated, the voucher will be available for use.'
                    : ' Once deactivated, the voucher will not be usable until activated again.'}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className='mb-6'>
          <div className='flex flex-wrap gap-1'>
            {Vouchers.map((voucher) => (
              <Badge key={voucher.id} variant='outline' className='bg-slate-100'>
                {voucher.name} ({voucher.code})
              </Badge>
            ))}
          </div>
        </div>

        <DialogFooter className='gap-2 sm:space-x-0'>
          <DialogClose asChild>
            <Button variant='outline' disabled={isUpdatingVouchers}>
              Cancel
            </Button>
          </DialogClose>
          <Button
            type='submit'
            variant={styles.buttonVariant}
            disabled={isUpdatingVouchers}
            loading={isUpdatingVouchers}
          >
            {isUpdatingVouchers ? 'Processing...' : `${actionText} Voucher${Vouchers.length > 1 ? 's' : ''}`}
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
            <Button variant={isActivating ? 'default' : 'secondary'} size='sm' className='gap-1'>
              <ActionIcon className='h-3.5 w-3.5' />
              <span>
                {actionText} Voucher{Vouchers.length > 1 ? 's' : ''}
              </span>
            </Button>
          </DialogTrigger>
        ) : null}
        <DialogContent className='sm:max-w-md'>
          <DialogHeader>
            <DialogTitle className='flex items-center gap-2'>
              <ActionIcon className={`size-5 ${styles.iconColor}`} aria-hidden='true' />
              {actionText} Voucher{Vouchers.length > 1 ? 's' : ''}
            </DialogTitle>
            <DialogDescription>
              Are you sure you want to {actionText.toLowerCase()}{' '}
              {Vouchers.length > 1 ? 'these vouchers' : 'this voucher'}?
            </DialogDescription>
          </DialogHeader>
          {content}
        </DialogContent>
      </Dialog>
    )
  }

  return (
    <Drawer {...props}>
      {showTrigger ? (
        <DrawerTrigger asChild>
          <Button variant={isActivating ? 'default' : 'secondary'} size='sm' className='gap-1'>
            <ActionIcon className='h-3.5 w-3.5' />
            <span>
              {actionText} Voucher{Vouchers.length > 1 ? 's' : ''}
            </span>
          </Button>
        </DrawerTrigger>
      ) : null}
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle className='flex items-center gap-2'>
            <ActionIcon className={`size-5 ${styles.iconColor}`} aria-hidden='true' />
            {actionText} Voucher{Vouchers.length > 1 ? 's' : ''}
          </DrawerTitle>
          <DrawerDescription>
            Are you sure you want to {actionText.toLowerCase()}{' '}
            {Vouchers.length > 1 ? 'these vouchers' : 'this voucher'}?
          </DrawerDescription>
        </DrawerHeader>

        <div className='px-4'>{content}</div>

        <DrawerFooter>
          <DrawerClose asChild>
            <Button variant='outline' disabled={isUpdatingVouchers}>
              Cancel
            </Button>
          </DrawerClose>
          <Button
            type='button'
            form={`form-${id}`}
            variant={styles.buttonVariant}
            disabled={isUpdatingVouchers}
            loading={isUpdatingVouchers}
            onClick={form.handleSubmit(onSubmit)}
          >
            {isUpdatingVouchers ? 'Processing...' : `${actionText} Voucher${Vouchers.length > 1 ? 's' : ''}`}
          </Button>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  )
}
