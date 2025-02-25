import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { Dispatch, SetStateAction, useEffect, useId, useMemo, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { z } from 'zod'

import useHandleServerError from '@/hooks/useHandleServerError'
import { useToast } from '@/hooks/useToast'
import { getAllResultSheetApi, getResultSheetByIdApi, updateResultSheetApi } from '@/network/apis/result-sheet'
import { getResultSheetDataSchema } from '@/schemas/result-sheet.schema'
import { IResponseResultSheetData } from '@/types/result-sheet'

import Button from '../button'
import LoadingLayer from '../loading-icon/LoadingLayer'
import { Form } from '../ui/form'
import FormResultSheet from './FormResultSheet'

interface UpdateResultSheetSectionProps {
  resultSheet: IResponseResultSheetData
  setOpen: Dispatch<SetStateAction<boolean>>
}
const UpdateResultSheetSection = ({ resultSheet, setOpen }: UpdateResultSheetSectionProps) => {
  const [isLoading, setIsLoading] = useState(false)
  const { t } = useTranslation()
  const id = useId()
  const { successToast } = useToast()
  const handleServerError = useHandleServerError()
  const queryClient = useQueryClient()
  const ResultSheetDataSchema = getResultSheetDataSchema()

  // Store original sections for comparison
  const originalSections = useMemo(() => {
    return resultSheet.resultSheetSections || []
  }, [resultSheet])

  const defaultValues: IResponseResultSheetData = useMemo(() => {
    return {
      id: resultSheet.id ?? '',
      title: resultSheet.title ?? '',
      resultSheetSections: resultSheet.resultSheetSections ?? [],
      status: resultSheet.status ?? '',
      systemServices: resultSheet.systemServices ?? [],
      createdAt: resultSheet.createdAt ?? '',
      updatedAt: resultSheet.updatedAt ?? ''
    }
  }, [resultSheet])

  const form = useForm<z.infer<typeof ResultSheetDataSchema>>({
    resolver: zodResolver(ResultSheetDataSchema),
    defaultValues
  })

  useEffect(() => {
    // Reset form with new values
    form.reset(defaultValues)
  }, [form, defaultValues])

  const handleReset = () => {
    form.reset()
    setOpen(false)
  }
  const { mutateAsync: updateResultSheetFn } = useMutation({
    mutationKey: [updateResultSheetApi.mutationKey],
    mutationFn: updateResultSheetApi.fn,
    onSuccess: () => {
      successToast({
        message: `${t('systemService.updateResultSheetSuccess')}`
      })
      queryClient.invalidateQueries({
        queryKey: [getResultSheetByIdApi.queryKey, resultSheet.id as string]
      })
      queryClient.invalidateQueries({
        queryKey: [getAllResultSheetApi.queryKey]
      })
      handleReset()
    }
  })
  const onSubmit = form.handleSubmit(async (values) => {
    try {
      setIsLoading(true)
      const transformedValues = {
        ...values,
        id: resultSheet.id ?? ''
      }

      await updateResultSheetFn({
        params: resultSheet.id ?? '',
        data: transformedValues
      })
      setIsLoading(false)
    } catch (error) {
      setIsLoading(false)
      handleServerError({
        error,
        form
      })
    }
  })

  // Prevent form submission on enter key
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault()
    }
  }
  return (
    <div className='w-full'>
      {isLoading && <LoadingLayer />}

      <div className='flex justify-center items-center'>
        <h3 className='text-lg font-semibold text-center text-primary'>{t('systemService.updateResultSheet')}</h3>
      </div>

      <Form {...form}>
        <form
          noValidate
          onSubmit={(e) => {
            e.preventDefault()
            onSubmit(e)
          }}
          onKeyDown={handleKeyDown}
          className='w-full'
          id={`form-${id}`}
        >
          <div>
            {/* Form Result Sheet */}
            <FormResultSheet form={form} originalSections={originalSections} />
          </div>
          <div className='flex justify-end gap-2 w-full'>
            <Button
              type='button'
              variant='outline'
              className='border border-primary hover:bg-primary/10 text-primary hover:text-primary'
              onClick={() => setOpen(false)}
            >
              {t('dialog.cancel')}
            </Button>
            <Button
              form={`form-${id}`}
              onClick={(e) => {
                e.preventDefault()
                onSubmit(e)
              }}
              type='button'
              loading={isLoading}
            >
              {t('dialog.ok')}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  )
}

export default UpdateResultSheetSection
