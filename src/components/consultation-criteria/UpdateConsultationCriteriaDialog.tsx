import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useId, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { z } from 'zod'

import useHandleServerError from '@/hooks/useHandleServerError'
import { useToast } from '@/hooks/useToast'
import { getConsultationCriteriaByIdApi, updateConsultationCriteriaApi } from '@/network/apis/consultation-criteria'
import { getConsultationCriteriaDataSchema } from '@/schemas/consultation-criteria.schema'
import { IResponseConsultationCriteriaData } from '@/types/consultation-criteria'

import Button from '../button'
import LoadingLayer from '../loading-icon/LoadingLayer'
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog'
import { Form } from '../ui/form'
import { ScrollArea } from '../ui/scroll-area'
import FormConsultationCriteria from './FormConsultationCriteria'

interface UpdateConsultationCriteriaDialogProps {
  triggerComponent: React.ReactElement<unknown>
  consultationCriteria: IResponseConsultationCriteriaData
}
const UpdateConsultationCriteriaDialog = ({
  consultationCriteria,
  triggerComponent
}: UpdateConsultationCriteriaDialogProps) => {
  const [isLoading, setIsLoading] = useState(false)
  const [open, setOpen] = useState(false)
  const { t } = useTranslation()
  const id = useId()
  const { successToast } = useToast()
  const handleServerError = useHandleServerError()
  const queryClient = useQueryClient()
  const ConsultationCriteriaDataSchema = getConsultationCriteriaDataSchema()

  const defaultValues: IResponseConsultationCriteriaData = {
    id: consultationCriteria.id ?? '',
    title: consultationCriteria.title ?? '',
    consultationCriteriaSections: consultationCriteria.consultationCriteriaSections ?? [],
    status: consultationCriteria.status ?? '',
    systemServices: consultationCriteria.systemServices ?? [],
    createdAt: consultationCriteria.createdAt ?? '',
    updatedAt: consultationCriteria.updatedAt ?? ''
  }

  const form = useForm<z.infer<typeof ConsultationCriteriaDataSchema>>({
    resolver: zodResolver(ConsultationCriteriaDataSchema),
    defaultValues
  })
  const handleReset = () => {
    form.reset()
    setOpen(false)
  }
  const { mutateAsync: updateConsultationCriteriaFn } = useMutation({
    mutationKey: [updateConsultationCriteriaApi.mutationKey],
    mutationFn: updateConsultationCriteriaApi.fn,
    onSuccess: () => {
      successToast({
        message: `${t('address.updateSuccess')}`
      })
      queryClient.invalidateQueries({
        queryKey: [getConsultationCriteriaByIdApi.queryKey, consultationCriteria.id as string]
      })
      handleReset()
    }
  })
  async function onSubmit(values: z.infer<typeof ConsultationCriteriaDataSchema>) {
    try {
      setIsLoading(true)
      const transformedValues = {
        ...values,
        id: consultationCriteria.id ?? ''
      }

      await updateConsultationCriteriaFn({ params: consultationCriteria.id ?? '', data: transformedValues })
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
    <div>
      {isLoading && <LoadingLayer />}

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>{triggerComponent}</DialogTrigger>
        <DialogContent className='max-w-md sm:max-w-xl lg:max-w-3xl'>
          <DialogHeader>
            <div className='flex justify-between items-center'>
              <DialogTitle>{t('systemService.updateConsultationCriteria')}</DialogTitle>
            </div>
          </DialogHeader>
          <Form {...form}>
            <form noValidate onSubmit={form.handleSubmit(onSubmit)} className='w-full' id={`form-${id}`}>
              <div>
                {/* Form Result Sheet */}
                <ScrollArea className='h-80 pr-2'>
                  <FormConsultationCriteria form={form} />
                </ScrollArea>
              </div>
              <DialogFooter>
                <div className='flex justify-end gap-2 w-full'>
                  <Button type='button' variant='outline' onClick={() => setOpen(false)}>
                    {t('dialog.cancel')}
                  </Button>
                  <Button type='submit' loading={isLoading}>
                    {t('dialog.ok')}
                  </Button>
                </div>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default UpdateConsultationCriteriaDialog
