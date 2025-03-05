import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { Dispatch, SetStateAction, useEffect, useId, useMemo, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { z } from 'zod'

import useHandleServerError from '@/hooks/useHandleServerError'
import { useToast } from '@/hooks/useToast'
import {
  getAllConsultationCriteriaApi,
  getConsultationCriteriaByIdApi,
  updateConsultationCriteriaApi
} from '@/network/apis/consultation-criteria'
import { getConsultationCriteriaDataSchema } from '@/schemas/consultation-criteria.schema'
import { IResponseConsultationCriteriaData } from '@/types/consultation-criteria'

import Button from '../button'
import LoadingLayer from '../loading-icon/LoadingLayer'
import { Form } from '../ui/form'
import FormConsultationCriteria from './FormConsultationCriteria'

interface UpdateConsultationCriteriaSectionProps {
  consultationCriteria: IResponseConsultationCriteriaData
  setOpen: Dispatch<SetStateAction<boolean>>
}
const UpdateConsultationCriteriaSection = ({
  consultationCriteria,
  setOpen
}: UpdateConsultationCriteriaSectionProps) => {
  const [isLoading, setIsLoading] = useState(false)
  const { t } = useTranslation()
  const id = useId()
  const { successToast } = useToast()
  const handleServerError = useHandleServerError()
  const queryClient = useQueryClient()
  const ConsultationCriteriaDataSchema = getConsultationCriteriaDataSchema()

  // Store original sections for comparison
  const originalSections = useMemo(() => {
    return consultationCriteria.consultationCriteriaSections || []
  }, [consultationCriteria])

  const defaultValues: IResponseConsultationCriteriaData = useMemo(() => {
    return {
      id: consultationCriteria.id ?? '',
      title: consultationCriteria.title ?? '',
      consultationCriteriaSections: consultationCriteria.consultationCriteriaSections ?? [],
      status: consultationCriteria.status ?? '',
      systemServices: consultationCriteria.systemServices ?? [],
      createdAt: consultationCriteria.createdAt ?? '',
      updatedAt: consultationCriteria.updatedAt ?? ''
    }
  }, [consultationCriteria])

  const form = useForm<z.infer<typeof ConsultationCriteriaDataSchema>>({
    resolver: zodResolver(ConsultationCriteriaDataSchema),
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
  const { mutateAsync: updateConsultationCriteriaFn } = useMutation({
    mutationKey: [updateConsultationCriteriaApi.mutationKey],
    mutationFn: updateConsultationCriteriaApi.fn,
    onSuccess: () => {
      successToast({
        message: `${t('systemService.updateConsultationCriteriaSuccess')}`
      })
      queryClient.invalidateQueries({
        queryKey: [getConsultationCriteriaByIdApi.queryKey, consultationCriteria.id as string]
      })
      queryClient.invalidateQueries({
        queryKey: [getAllConsultationCriteriaApi.queryKey]
      })
      handleReset()
    }
  })
  const onSubmit = form.handleSubmit(async (values) => {
    try {
      setIsLoading(true)
      const transformedValues = {
        ...values,
        id: consultationCriteria.id ?? ''
      }

      await updateConsultationCriteriaFn({
        params: consultationCriteria.id ?? '',
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
        <h3 className='text-lg font-semibold text-center text-primary'>
          {t('systemService.updateConsultationCriteria')}
        </h3>
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
            <FormConsultationCriteria form={form} originalSections={originalSections} />
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

export default UpdateConsultationCriteriaSection
