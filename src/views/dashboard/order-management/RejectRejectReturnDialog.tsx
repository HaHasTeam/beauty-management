import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { AlertTriangle } from 'lucide-react'
import { Dispatch, SetStateAction, useId, useMemo, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { z } from 'zod'

import AlertMessage from '@/components/alert/AlertMessage'
import Button from '@/components/button'
import Label from '@/components/form-label'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form'
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import useHandleServerError from '@/hooks/useHandleServerError'
import { useToast } from '@/hooks/useToast'
import {
  getOrderByIdApi,
  getRejectReturnRequestApi,
  getStatusTrackingByIdApi,
  makeDecisionOnRejectReturnRequestOrderApi
} from '@/network/apis/order'
import { CancelOrderSchema } from '@/schemas/order.schema'
import { RequestStatusEnum } from '@/types/enum'

interface RejectRejectReturnProps {
  open: boolean
  setOpen: Dispatch<SetStateAction<boolean>>
  onOpenChange: (open: boolean) => void
  requestId: string
}

export default function RejectRejectReturn({ open, setOpen, onOpenChange, requestId }: RejectRejectReturnProps) {
  const { t } = useTranslation()
  const { successToast } = useToast()
  const formId = useId()
  const handleServerError = useHandleServerError()
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [isOtherReason, setIsOtherReason] = useState<boolean>(false)
  const queryClient = useQueryClient()

  const reasons: { value: string }[] = useMemo(() => [{ value: t('order.cancelOrderReason.other') }], [t])
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
  const { mutateAsync: makeDecisionOnRejectReturnRequestOrderFn } = useMutation({
    mutationKey: [makeDecisionOnRejectReturnRequestOrderApi.mutationKey],
    mutationFn: makeDecisionOnRejectReturnRequestOrderApi.fn,
    onSuccess: () => {
      successToast({
        message: t('order.successMakeDecisionOnReject')
      })
      queryClient.invalidateQueries({
        queryKey: [getOrderByIdApi.queryKey]
      })
      queryClient.invalidateQueries({
        queryKey: [getStatusTrackingByIdApi.queryKey]
      })
      queryClient.invalidateQueries({
        queryKey: [getRejectReturnRequestApi.queryKey]
      })
      handleReset()
    }
  })
  async function onSubmit(values: z.infer<typeof CancelOrderSchema>) {
    try {
      setIsLoading(true)
      const payload = isOtherReason ? { reasonRejected: values.otherReason } : { reasonRejected: values.reason }
      await makeDecisionOnRejectReturnRequestOrderFn({
        requestId: requestId ?? '',
        status: RequestStatusEnum.REJECTED,
        ...payload
      })
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
            <DialogTitle className='text-lg'>{t(`order.rejectRequestRejectOrder`)}</DialogTitle>
            <DialogDescription></DialogDescription>
          </div>
        </DialogHeader>

        <AlertMessage message={t('order.rejectRequestRejectOrderMessage')} textSize='medium' />
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
              <Button
                type='button'
                variant='outline'
                onClick={() => {
                  onOpenChange(false)
                  handleReset()
                }}
              >
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
