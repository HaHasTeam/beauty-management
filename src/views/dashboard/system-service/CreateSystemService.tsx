import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useId, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'

import SystemServiceForm from '@/components/system-service/SystemServiceForm'
import useHandleServerError from '@/hooks/useHandleServerError'
import { useToast } from '@/hooks/useToast'
import { getAllConsultationCriteriaApi } from '@/network/apis/consultation-criteria'
import { uploadFilesApi } from '@/network/apis/file'
import { createSystemServiceApi, getAllSystemServiceApi } from '@/network/apis/system-service'
import { getSystemServiceSchema, ISystemServiceFormData } from '@/schemas/system-service.schema'
import { ServiceTypeEnum, StatusEnum } from '@/types/enum'

const CreateSystemService = () => {
  const { t } = useTranslation()
  const [isLoading, setIsLoading] = useState(false)
  const { successToast } = useToast()
  const handleServerError = useHandleServerError()
  const queryClient = useQueryClient()
  const id = useId()
  const SystemServiceSchema = getSystemServiceSchema()

  const defaultValues: ISystemServiceFormData = {
    name: '',
    description: '',
    images: [],
    category: '',
    type: ServiceTypeEnum.STANDARD,
    consultationCriteriaData: {
      title: '',
      consultationCriteriaSections: [
        {
          section: '',
          orderIndex: 1,
          mandatory: true,
          description: ''
        }
      ]
    },
    status: StatusEnum.ACTIVE
  }

  const form = useForm<ISystemServiceFormData>({
    resolver: zodResolver(SystemServiceSchema),
    defaultValues
  })

  const { mutateAsync: createServiceFn } = useMutation({
    mutationKey: [createSystemServiceApi.mutationKey],
    mutationFn: createSystemServiceApi.fn,
    onSuccess: async () => {
      successToast({
        message: t('systemService.createSuccessMessage')
      })
      form.reset()

      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: [getAllSystemServiceApi]
        }),
        queryClient.invalidateQueries({
          queryKey: [getAllConsultationCriteriaApi]
        })
      ])
    }
  })

  const { mutateAsync: uploadFilesFn } = useMutation({
    mutationKey: [uploadFilesApi.mutationKey],
    mutationFn: uploadFilesApi.fn
  })

  const convertFileToUrl = async (files: File[]) => {
    const formData = new FormData()
    files.forEach((file) => {
      formData.append('files', file)
    })

    const uploadedFilesResponse = await uploadFilesFn(formData)

    return uploadedFilesResponse.data
  }

  const onSubmit = async (values: ISystemServiceFormData) => {
    try {
      setIsLoading(true)
      const imgUrls = await convertFileToUrl(values.images)
      const transformData = {
        ...values,
        images: imgUrls.map((image) => ({
          fileUrl: image // Transform image strings to objects
        }))
      }
      await createServiceFn(transformData)
      setIsLoading(false)
    } catch (error) {
      setIsLoading(false)
      handleServerError({
        error,
        form
      })
    }
  }
  return <SystemServiceForm isLoading={isLoading} onSubmit={onSubmit} form={form} formId={`form-${id}`} />
}

export default CreateSystemService
