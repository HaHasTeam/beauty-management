import { zodResolver } from '@hookform/resolvers/zod'
import { AlertTriangle } from 'lucide-react'
import { Dispatch, SetStateAction, useId, useState } from 'react'
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
import { CancelOrderSchema } from '@/schemas/order.schema'

interface ReasonDialogProps {
  open: boolean
  isLoading: boolean
  setOpen: Dispatch<SetStateAction<boolean>>
  onOpenChange: (open: boolean) => void
  reasons: { value: string }[]
  onConfirm: (reason: string) => void
  item: string
}

export default function ReasonDialog({
  open,
  setOpen,
  onOpenChange,
  reasons,
  onConfirm,
  item,
  isLoading
}: ReasonDialogProps) {
  const { t } = useTranslation()
  const formId = useId()
  const handleServerError = useHandleServerError()
  const [isOtherReason, setIsOtherReason] = useState<boolean>(false)

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

  async function onSubmit(values: z.infer<typeof CancelOrderSchema>) {
    try {
      if (isOtherReason) {
        onConfirm(values.otherReason)
      } else {
        onConfirm(values.reason)
      }
    } catch (error) {
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
            <DialogTitle className='text-lg'>{t(`reason.${item}.title`)}</DialogTitle>
            <DialogDescription>{t(`reason.${item}.message`)}</DialogDescription>
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
              <Button type='submit' loading={isLoading}>
                {t(`button.ok`)}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
