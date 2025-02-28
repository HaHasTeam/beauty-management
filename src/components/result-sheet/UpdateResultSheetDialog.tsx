import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useId, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { z } from 'zod'

import useHandleServerError from '@/hooks/useHandleServerError'
import { useToast } from '@/hooks/useToast'
import { getResultSheetByIdApi, updateResultSheetApi } from '@/network/apis/result-sheet'
import { getResultSheetDataSchema } from '@/schemas/result-sheet.schema'
import { IResponseResultSheetData } from '@/types/result-sheet'

import Button from '../button'
import LoadingLayer from '../loading-icon/LoadingLayer'
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog'
import { Form } from '../ui/form'
import { ScrollArea } from '../ui/scroll-area'
import FormResultSheet from './FormResultSheet'

interface UpdateResultSheetDialogProps {
  triggerComponent: React.ReactElement<unknown>
  resultSheet: IResponseResultSheetData
}
const UpdateResultSheetDialog = ({ resultSheet, triggerComponent }: UpdateResultSheetDialogProps) => {
  const [isLoading, setIsLoading] = useState(false)
  const [open, setOpen] = useState(false)
  const { t } = useTranslation()
  const id = useId()
  const { successToast } = useToast()
  const handleServerError = useHandleServerError()
  const queryClient = useQueryClient()
  const ResultSheetDataSchema = getResultSheetDataSchema()

  const defaultValues: IResponseResultSheetData = {
    id: resultSheet.id ?? '',
    title: resultSheet.title ?? '',
    resultSheetSections: resultSheet.resultSheetSections ?? [],
    status: resultSheet.status ?? '',
    systemServices: resultSheet.systemServices ?? [],
    createdAt: resultSheet.createdAt ?? '',
    updatedAt: resultSheet.updatedAt ?? ''
  }

  const form = useForm<z.infer<typeof ResultSheetDataSchema>>({
    resolver: zodResolver(ResultSheetDataSchema),
    defaultValues
  })
  const handleReset = () => {
    form.reset()
    setOpen(false)
  }
  const { mutateAsync: updateResultSheetFn } = useMutation({
    mutationKey: [updateResultSheetApi.mutationKey],
    mutationFn: updateResultSheetApi.fn,
    onSuccess: () => {
      successToast({
        message: `${t('address.updateSuccess')}`
      })
      queryClient.invalidateQueries({
        queryKey: [getResultSheetByIdApi.queryKey, resultSheet.id as string]
      })
      handleReset()
    }
  })
  async function onSubmit(values: z.infer<typeof ResultSheetDataSchema>) {
    try {
      setIsLoading(true)
      const transformedValues = {
        ...values,
        id: resultSheet.id ?? ''
      }

      await updateResultSheetFn({ params: resultSheet.id ?? '', data: transformedValues })
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
              <DialogTitle>{t('systemService.updateResultSheet')}</DialogTitle>
            </div>
          </DialogHeader>
          <Form {...form}>
            <form noValidate onSubmit={form.handleSubmit(onSubmit)} className='w-full' id={`form-${id}`}>
              <div>
                {/* Form Result Sheet */}
                <ScrollArea className='h-80 pr-2'>
                  <FormResultSheet form={form} />
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

export default UpdateResultSheetDialog
