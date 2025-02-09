import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation } from '@tanstack/react-query'
import { AlertTriangle } from 'lucide-react'
import { Dispatch, SetStateAction, useId, useMemo, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { z } from 'zod'

import Label from '@/components/form-label'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import useHandleServerError from '@/hooks/useHandleServerError'
import { useToast } from '@/hooks/useToast'
import { cancelOrderApi } from '@/network/apis/order'
import { CancelOrderSchema } from '@/schemas/order.schema'

import AlertMessage from '../alert/AlertMessage'
import Button from '../button'
import { Form, FormControl, FormField, FormItem, FormMessage } from '../ui/form'
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '../ui/select'
import { Textarea } from '../ui/textarea'

interface CancelOrderDialogProps {
  orderId: string
  open: boolean
  setOpen: Dispatch<SetStateAction<boolean>>
  onOpenChange: (open: boolean) => void
  setIsTrigger: Dispatch<SetStateAction<boolean>>
}

export default function CancelOrderDialog({
  orderId,
  open,
  setOpen,
  onOpenChange,
  setIsTrigger
}: CancelOrderDialogProps) {
  const { t } = useTranslation()
  const { successToast } = useToast()
  const formId = useId()
  const handleServerError = useHandleServerError()
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [isOtherReason, setIsOtherReason] = useState<boolean>(false)

  const reasons: { value: string }[] = useMemo(
    () => [
      { value: t('order.cancelOrderReasonByBrand.OUT_OF_STOCK') },
      { value: t('order.cancelOrderReasonByBrand.INCORRECT_PRICING') },
      { value: t('order.cancelOrderReasonByBrand.SUSPICIOUS_ORDER') },
      { value: t('order.cancelOrderReasonByBrand.PAYMENT_FAILED') },
      { value: t('order.cancelOrderReasonByBrand.UNDELIVERABLE_ADDRESS') },
      { value: t('order.cancelOrderReasonByBrand.MINIMUM_ORDER_NOT_MET') },
      { value: t('order.cancelOrderReasonByBrand.POLICY_VIOLATION') },
      { value: t('order.cancelOrderReasonByBrand.CUSTOMER_REQUEST') },
      { value: t('order.cancelOrderReasonByBrand.DAMAGED_PRODUCT') },
      { value: t('order.cancelOrderReasonByBrand.SHIPPING_ISSUE') },
      { value: t('order.cancelOrderReason.other') }
    ],
    [t]
  )
  const defaultOrderValues = {
    reason: '',
    otherReason: ''
  }
  const handleReset = () => {
    form.reset()
    setIsOtherReason(false)
    setOpen(false)
  }
  const form = useForm<z.infer<typeof CancelOrderSchema>>({
    resolver: zodResolver(CancelOrderSchema),
    defaultValues: defaultOrderValues
  })
  const { mutateAsync: cancelOrderFn } = useMutation({
    mutationKey: [cancelOrderApi.mutationKey],
    mutationFn: cancelOrderApi.fn,
    onSuccess: () => {
      successToast({
        message: t('order.cancelSuccess')
      })
      setIsTrigger((prev) => !prev)
      handleReset()
    }
  })
  async function onSubmit(values: z.infer<typeof CancelOrderSchema>) {
    try {
      setIsLoading(true)
      const payload = isOtherReason ? { reason: values.otherReason } : { reason: values.reason }
      await cancelOrderFn({ orderId, ...payload })
      setIsLoading(false)
    } catch (error) {
      setIsLoading(false)
      handleServerError({
        error,
        form
      })
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='sm:max-w-[425px] md:max-w-[700px]'>
        <DialogHeader className='flex flex-row items-start gap-4'>
          <AlertTriangle className='mt-2 h-6 w-6 text-orange-500' />
          <div className='flex-1 gap-2 items-start'>
            <DialogTitle className='text-lg'>{t(`order.cancelOrder`)}</DialogTitle>
            <DialogDescription></DialogDescription>
          </div>
        </DialogHeader>

        <AlertMessage message={t('order.cancelOrderDescription')} textSize='medium' />
        <Form {...form}>
          <form
            noValidate
            onSubmit={form.handleSubmit(onSubmit)}
            className='w-full grid gap-4 mb-8'
            id={`form-${formId}`}
          >
            <FormField
              control={form.control}
              name='reason'
              render={({ field }) => (
                <FormItem className='w-full'>
                  <div className='w-full flex gap-2'>
                    <div className='w-1/5 flex items-center'>
                      <Label required className='w-fit'>
                        {t('order.cancelOrderReason.reason')}
                      </Label>
                    </div>
                    <div className='w-full space-y-1'>
                      <FormControl>
                        <Select
                          value={field.value ?? ''}
                          onValueChange={(value) => {
                            field.onChange(value)
                            setIsOtherReason(value === t('order.cancelOrderReason.other'))
                          }}
                          required
                          name='reason'
                        >
                          <SelectTrigger>
                            <SelectValue {...field} placeholder={t('order.cancelOrderReason.selectAReason')} />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectGroup>
                              {reasons.map((reason) => (
                                <SelectItem key={reason.value} value={reason.value}>
                                  {reason.value}
                                </SelectItem>
                              ))}
                            </SelectGroup>
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormMessage />
                    </div>
                  </div>
                </FormItem>
              )}
            />
            {isOtherReason && (
              <FormField
                control={form.control}
                name='otherReason'
                render={({ field }) => (
                  <FormItem className='w-full'>
                    <div className='w-full flex gap-2'>
                      <div className='w-1/5 flex items-center'>
                        <Label required className='w-fit'>
                          {t('order.cancelOrderReason.otherReason')}
                        </Label>
                      </div>
                      <div className='w-full space-y-1'>
                        <FormControl>
                          <Textarea
                            id='otherReason'
                            {...field}
                            className='w-full p-2 border rounded-md focus:outline-none focus:ring'
                            placeholder={t('order.cancelOrderReason.enterReason')}
                            rows={4}
                            value={field.value ?? ''}
                          />
                        </FormControl>
                        <FormMessage />
                      </div>
                    </div>
                  </FormItem>
                )}
              />
            )}
            <div className='flex justify-end gap-2 mt-4'>
              <Button type='button' variant='outline' onClick={() => onOpenChange(false)}>
                {t(`button.cancel`)}
              </Button>
              <Button loading={isLoading} type='submit'>
                {t(`button.ok`)}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
