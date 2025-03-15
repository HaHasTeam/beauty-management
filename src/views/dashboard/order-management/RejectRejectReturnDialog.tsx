import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { AlertTriangle } from 'lucide-react'
import { Dispatch, SetStateAction, useId, useMemo, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { z } from 'zod'

import Button from '@/components/button'
import Label from '@/components/form-label'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form'
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import useHandleServerError from '@/hooks/useHandleServerError'
import { useToast } from '@/hooks/useToast'
import {
  getCancelAndReturnRequestApi,
  getOrderByIdApi,
  getStatusTrackingByIdApi,
  makeDecisionOnComplaintRequestApi,
  makeDecisionOnRejectReturnRequestOrderApi
} from '@/network/apis/order'
import { CancelOrderSchema } from '@/schemas/order.schema'
import { RequestStatusEnum } from '@/types/enum'

interface RejectRejectReturnProps {
  open: boolean
  setOpen: Dispatch<SetStateAction<boolean>>
  onOpenChange: (open: boolean) => void
  requestId: string
  reasonItem: string
  dialogTitle: string
  successTitle: string
  dialogMessage: string
  item: string
}

export default function RejectRejectReturn({
  open,
  setOpen,
  onOpenChange,
  requestId,
  reasonItem,
  dialogMessage,
  dialogTitle,
  successTitle,
  item
}: RejectRejectReturnProps) {
  const { t } = useTranslation()
  const { successToast } = useToast()
  const formId = useId()
  const handleServerError = useHandleServerError()
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [isOtherReason, setIsOtherReason] = useState<boolean>(false)
  const queryClient = useQueryClient()

  const reasons: { value: string }[] = useMemo(
    () => [
      { value: t(`return.${reasonItem}.validReturnRequest`) },
      { value: t(`return.${reasonItem}.insufficientJustification`) },
      { value: t(`return.${reasonItem}.missingEvidence`) },
      { value: t(`return.${reasonItem}.policyCompliance`) },
      // { value: t(`return.${reasonItem}.customerProtection`) },
      // { value: t(`return.${reasonItem}.escalationRequired`) },
      { value: t(`return.${reasonItem}.other`) }
    ],
    [reasonItem, t]
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
  const { mutateAsync: makeDecisionOnRejectReturnRequestOrderFn } = useMutation({
    mutationKey: [makeDecisionOnRejectReturnRequestOrderApi.mutationKey],
    mutationFn: makeDecisionOnRejectReturnRequestOrderApi.fn,
    onSuccess: () => {
      successToast({
        message: t(`return.${successTitle}`)
      })
      queryClient.invalidateQueries({
        queryKey: [getOrderByIdApi.queryKey]
      })
      queryClient.invalidateQueries({
        queryKey: [getStatusTrackingByIdApi.queryKey]
      })
      queryClient.invalidateQueries({
        queryKey: [getCancelAndReturnRequestApi.queryKey]
      })
      handleReset()
    }
  })
  const { mutateAsync: makeDecisionOnComplaintRequestFn } = useMutation({
    mutationKey: [makeDecisionOnComplaintRequestApi.mutationKey],
    mutationFn: makeDecisionOnComplaintRequestApi.fn,
    onSuccess: () => {
      successToast({
        message: t(`return.${successTitle}`)
      })
      queryClient.invalidateQueries({
        queryKey: [getOrderByIdApi.queryKey]
      })
      queryClient.invalidateQueries({
        queryKey: [getStatusTrackingByIdApi.queryKey]
      })
      queryClient.invalidateQueries({
        queryKey: [getCancelAndReturnRequestApi.queryKey]
      })
      handleReset()
    }
  })
  async function onSubmit(values: z.infer<typeof CancelOrderSchema>) {
    try {
      setIsLoading(true)
      const payload = isOtherReason ? { reasonRejected: values.otherReason } : { reasonRejected: values.reason }
      if (item === 'decisionComplaint') {
        await makeDecisionOnComplaintRequestFn({
          requestId: requestId ?? '',
          status: RequestStatusEnum.REJECTED,
          ...payload
        })
      }
      if (item === 'decisionRejectReturn') {
        await makeDecisionOnRejectReturnRequestOrderFn({
          requestId: requestId ?? '',
          status: RequestStatusEnum.REJECTED,
          ...payload
        })
      }
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
            <DialogTitle className='text-lg'>{t(`return.${dialogTitle}`)}</DialogTitle>
            <DialogDescription className='text-justify'>{t(`return.${dialogMessage}`)}</DialogDescription>
          </div>
        </DialogHeader>

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
                    <div className='w-1/6 flex items-center'>
                      <Label required className='w-fit'>
                        {t('order.cancelOrderReason.reason')}
                      </Label>
                    </div>
                    <div className='w-5/6 space-y-1'>
                      <FormControl>
                        <Select
                          value={field.value ?? ''}
                          onValueChange={(value) => {
                            field.onChange(value)
                            setIsOtherReason(value === t(`return.${reasonItem}.other`))
                          }}
                          required
                          name='reason'
                        >
                          <SelectTrigger className='border-primary/40'>
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
