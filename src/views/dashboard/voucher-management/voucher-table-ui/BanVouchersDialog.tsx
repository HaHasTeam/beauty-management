import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { type Row } from '@tanstack/react-table'
import { AlertTriangle, XIcon } from 'lucide-react'
import * as React from 'react'
import { useForm } from 'react-hook-form'
import { FaBan } from 'react-icons/fa'
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
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import useHandleServerError from '@/hooks/useHandleServerError'
import { useMediaQuery } from '@/hooks/useMediaQuery'
import { useToast } from '@/hooks/useToast'
import { getAllVouchersApi, updateStatusVoucherByIdApi } from '@/network/apis/voucher'
import { reasonSchemaRequire } from '@/schemas'
import { StatusEnum } from '@/types/enum'
import { TVoucher } from '@/types/voucher'

// Predefined ban reasons
const BAN_REASONS = [
  'Expired promotion',
  'Incorrect pricing',
  'Invalid voucher terms',
  'Suspicious usage patterns',
  'Replaced by a newer voucher',
  'Brand request',
  'Technical issues',
  'Other'
]

interface BanVouchersDialogProps extends React.ComponentPropsWithoutRef<typeof Dialog> {
  Vouchers: Row<TVoucher>['original'][]
  showTrigger?: boolean
  onSuccess?: (Vouchers: Row<TVoucher>['original'][]) => void
}

export function BanVouchersDialog({ Vouchers, showTrigger = true, onSuccess, ...props }: BanVouchersDialogProps) {
  const { successToast } = useToast()
  const queryClient = useQueryClient()
  const handleServerError = useHandleServerError()
  const isDesktop = useMediaQuery('(min-width: 640px)')
  const [selectedReason, setSelectedReason] = React.useState<string>('')
  const [customReason, setCustomReason] = React.useState<string>('')

  const form = useForm<z.infer<typeof reasonSchemaRequire>>({
    resolver: zodResolver(reasonSchemaRequire),
    defaultValues: {
      reason: ''
    }
  })

  const id = React.useId()
  const { mutateAsync: banVouchersFn, isPending: isBanningVouchers } = useMutation({
    mutationKey: [updateStatusVoucherByIdApi.mutationKey],
    mutationFn: async () => {
      const promises = Vouchers.map((voucher) =>
        updateStatusVoucherByIdApi.fn({
          voucherId: voucher.id,
          status: StatusEnum.BANNED
        })
      )
      return Promise.all(promises)
    },
    onSuccess: () => {
      successToast({
        message: 'Voucher(s) banned successfully',
        description: `Successfully banned ${Vouchers.length} voucher(s).`
      })
      queryClient.invalidateQueries({ queryKey: [getAllVouchersApi.queryKey] })
    }
  })

  // Get the actual ban reason based on selection
  const getReasonText = () => {
    if (selectedReason === 'Other') {
      return customReason.trim()
    }
    return selectedReason
  }

  React.useEffect(() => {
    if (selectedReason) {
      form.setValue('reason', getReasonText())
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedReason, customReason, form])

  async function onSubmit() {
    try {
      await banVouchersFn()
      props.onOpenChange?.(false)
      onSuccess?.(Vouchers)
    } catch (error) {
      handleServerError({
        error,
        form
      })
    }
  }

  // Check if form is valid for submission
  const isFormValid = () => {
    if (!selectedReason) return false
    if (selectedReason === 'Other' && !customReason.trim()) return false
    return true
  }

  // Create content to use in both desktop and mobile views
  const content = (
    <Form {...form}>
      <form noValidate onSubmit={form.handleSubmit(onSubmit)} id={`form-${id}`}>
        <DialogHeader>
          <DialogTitle className='flex items-center gap-2'>
            <FaBan className='size-5 text-red-500' aria-hidden='true' />
            Ban Voucher{Vouchers.length > 1 ? 's' : ''}
          </DialogTitle>
          <DialogDescription>
            {Vouchers.length === 1
              ? 'Are you sure you want to ban this voucher? This action will prevent it from being used on the platform.'
              : `Are you sure you want to ban these ${Vouchers.length} vouchers? This action will prevent them from being used on the platform.`}
          </DialogDescription>
        </DialogHeader>

        <div className='py-4'>
          <div className='flex flex-wrap gap-1 mb-4'>
            {Vouchers.map((voucher) => (
              <Badge key={voucher.id} variant='outline' className='bg-slate-100'>
                {voucher.name} ({voucher.code})
              </Badge>
            ))}
          </div>

          <div className='rounded-md bg-red-50 p-4 mb-4'>
            <div className='flex'>
              <div className='flex-shrink-0'>
                <AlertTriangle className='h-5 w-5 text-red-400' aria-hidden='true' />
              </div>
              <div className='ml-3'>
                <h3 className='text-sm font-medium text-red-800'>Important information</h3>
                <div className='mt-2 text-sm text-red-700'>
                  <p>Banning a voucher means:</p>
                  <ul className='list-disc pl-5 space-y-1 mt-2'>
                    <li>The voucher will no longer be valid for any transactions</li>
                    <li>Users with this voucher in their wallet will not be able to use it</li>
                    <li>The voucher will not appear in any public listings</li>
                    <li>This action can be reversed later if needed</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          <div className='grid gap-4'>
            <div className='grid gap-2'>
              <Label htmlFor='reason'>Reason for Banning</Label>
              <Select value={selectedReason} onValueChange={setSelectedReason}>
                <SelectTrigger>
                  <SelectValue placeholder='Select a reason' />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Common Reasons</SelectLabel>
                    {BAN_REASONS.map((reason) => (
                      <SelectItem key={reason} value={reason}>
                        {reason}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>

              {selectedReason === 'Other' && (
                <div className='mt-4'>
                  <Label htmlFor='customReason'>Custom Reason</Label>
                  <Textarea
                    id='customReason'
                    value={customReason}
                    onChange={(e) => setCustomReason(e.target.value)}
                    placeholder='Please provide a detailed reason for banning...'
                    className='min-h-24 mt-2 resize-none'
                  />
                </div>
              )}
            </div>
          </div>

          <FormField
            control={form.control}
            name='reason'
            render={({ field }) => (
              <FormItem className='hidden'>
                <FormControl>
                  <Textarea {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <DialogFooter className='gap-2 sm:space-x-0'>
          <DialogClose asChild>
            <Button variant='outline' disabled={isBanningVouchers}>
              Cancel
            </Button>
          </DialogClose>
          <Button
            type='submit'
            variant='destructive'
            disabled={isBanningVouchers || !isFormValid()}
            loading={isBanningVouchers}
          >
            {isBanningVouchers ? 'Banning...' : 'Ban Voucher' + (Vouchers.length > 1 ? 's' : '')}
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
            <Button variant='destructive' size='sm' className='gap-1'>
              <XIcon className='h-3.5 w-3.5' />
              <span>Ban {Vouchers.length > 1 ? `${Vouchers.length} Vouchers` : 'Voucher'}</span>
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
          <Button variant='destructive' size='sm' className='gap-1'>
            <XIcon className='h-3.5 w-3.5' />
            <span>Ban {Vouchers.length > 1 ? `${Vouchers.length} Vouchers` : 'Voucher'}</span>
          </Button>
        </DrawerTrigger>
      ) : null}
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle className='flex items-center gap-2'>
            <FaBan className='size-5 text-red-500' aria-hidden='true' />
            Ban Voucher{Vouchers.length > 1 ? 's' : ''}
          </DrawerTitle>
          <DrawerDescription>
            {Vouchers.length === 1
              ? 'Are you sure you want to ban this voucher? This action will prevent it from being used on the platform.'
              : `Are you sure you want to ban these ${Vouchers.length} vouchers? This action will prevent them from being used on the platform.`}
          </DrawerDescription>
        </DrawerHeader>

        <div className='px-4'>{content}</div>

        <DrawerFooter>
          <DrawerClose asChild>
            <Button variant='outline' disabled={isBanningVouchers}>
              Cancel
            </Button>
          </DrawerClose>
          <Button
            type='button'
            form={`form-${id}`}
            variant='destructive'
            disabled={isBanningVouchers || !isFormValid()}
            loading={isBanningVouchers}
            onClick={form.handleSubmit(onSubmit)}
          >
            {isBanningVouchers ? 'Banning...' : 'Ban Voucher' + (Vouchers.length > 1 ? 's' : '')}
          </Button>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  )
}
