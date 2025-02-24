// import { zodResolver } from '@hookform/resolvers/zod'
// import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
// import { useEffect, useId, useState } from 'react'
// import { useForm } from 'react-hook-form'
// import { useTranslation } from 'react-i18next'
// import { useParams } from 'react-router-dom'

// import LoadingLayer from '@/components/loading-icon/LoadingLayer'
// import SystemServiceForm from '@/components/system-service/SystemServiceForm'
// import useHandleServerError from '@/hooks/useHandleServerError'
// import { useToast } from '@/hooks/useToast'
// import { uploadFilesApi } from '@/network/apis/file'
// import { getAllSystemServiceApi, getSystemServiceByIdApi, updateSystemServiceApi } from '@/network/apis/system-service'
// import { SystemServiceSchema } from '@/schemas/system-service.schema'
// import { ServiceTypeEnum, StatusEnum } from '@/types/enum'
// import { IUpdateSystemServiceFormData } from '@/types/system-service'

// const UpdateSystemService = () => {
//   const { id } = useParams()
//   const { t } = useTranslation()
//   const [isLoading, setIsLoading] = useState(false)
//   const { successToast } = useToast()
//   const handleServerError = useHandleServerError()
//   const queryClient = useQueryClient()
//   const formId = useId()

//   // Fetch existing service data
//   const { data: serviceData, isLoading: isLoadingService } = useQuery({
//     queryKey: [getSystemServiceByIdApi.queryKey, id as string],
//     queryFn: getSystemServiceByIdApi.fn,
//     enabled: !!id
//   })

//   const defaultValues: IUpdateSystemServiceFormData = {
//     id: '',
//     name: '',
//     description: '',
//     images: [],
//     category: '',
//     type: ServiceTypeEnum.STANDARD,
//     resultSheet: {
//       id: '',
//       resultSheetSections: [
//         {
//           section: '',
//           orderIndex: 1,
//           mandatory: true,
//           description: '',
//           status: StatusEnum.ACTIVE
//         }
//       ]
//     },
//     status: StatusEnum.ACTIVE
//   }

//   const form = useForm<IUpdateSystemServiceFormData>({
//     resolver: zodResolver(SystemServiceSchema),
//     defaultValues
//   })

//   // Set form values when service data is loaded
//   useEffect(() => {
//     if (serviceData && serviceData.data) {
//       const formattedData = {
//         ...serviceData,
//         category: serviceData.data.category.id,
//         resultSheetData: {
//           title: serviceData.data.resultSheet.title,
//           resultSheetSections: serviceData.data.resultSheet.resultSheetSections.map((section) => ({
//             ...section,
//             id: section.id,
//             status: section.status
//           }))
//         }
//       }
//       form.reset(formattedData)
//     }
//   }, [serviceData, form])

//   const { mutateAsync: updateServiceFn } = useMutation({
//     mutationKey: [updateSystemServiceApi.mutationKey],
//     mutationFn: updateSystemServiceApi.fn,
//     onSuccess: () => {
//       successToast({
//         message: t('systemService.updateSuccessMessage')
//       })
//       queryClient.invalidateQueries({
//         queryKey: [getAllSystemServiceApi.queryKey]
//       })
//       queryClient.invalidateQueries({
//         queryKey: [getSystemServiceByIdApi.queryKey]
//       })
//     }
//   })

//   const { mutateAsync: uploadFilesFn } = useMutation({
//     mutationKey: [uploadFilesApi.mutationKey],
//     mutationFn: uploadFilesApi.fn
//   })

//   const convertFileToUrl = async (files: File[]) => {
//     const formData = new FormData()
//     files.forEach((file) => {
//       formData.append('files', file)
//     })
//     const uploadedFilesResponse = await uploadFilesFn(formData)
//     return uploadedFilesResponse.data
//   }

//   const handleDeleteSection = (index: number) => {
//     const currentSections = form.getValues('resultSheetData.resultSheetSections')
//     const updatedSections = currentSections
//       .map((section, i) => {
//         if (i === index) {
//           // If section has an id, mark it as inactive instead of removing
//           if (section.id) {
//             return { ...section, status: StatusEnum.INACTIVE }
//           }
//           // If no id (new section), remove it
//           return null
//         }
//         return section
//       })
//       .filter(Boolean) // Remove null values (new sections that were deleted)

//     // Update orderIndex for remaining active sections
//     const reorderedSections = updatedSections
//       .filter((section) => section.status === StatusEnum.ACTIVE)
//       .map((section, i) => ({
//         ...section,
//         orderIndex: i + 1
//       }))

//     // Combine active and inactive sections
//     const finalSections = [
//       ...reorderedSections,
//       ...updatedSections.filter((section) => section.status === StatusEnum.INACTIVE)
//     ]

//     form.setValue('resultSheetData.resultSheetSections', finalSections)
//   }

//   const onSubmit = async (values: IUpdateSystemServiceFormData) => {
//     try {
//       setIsLoading(true)

//       // Handle image uploads for new images
//       const newImages = values.images.filter((img) => img instanceof File)
//       let imgUrls = []

//       if (newImages.length > 0) {
//         imgUrls = await convertFileToUrl(newImages)
//       }

//       // Combine existing and new images
//       const existingImages = values.images.filter((img) => typeof img === 'object' && 'fileUrl' in img)
//       const transformedImages = [
//         ...existingImages,
//         ...imgUrls.map((url) => ({
//           fileUrl: url,
//           status: StatusEnum.ACTIVE
//         }))
//       ]

//       const transformData = {
//         ...values,
//         id: id,
//         images: transformedImages,
//         resultSheet: {
//           id: serviceData.resultSheet.id,
//           title: values.resultSheetData.title,
//           resultSheetSections: values.resultSheetData.resultSheetSections.map((section) => ({
//             ...section,
//             status: section.status || StatusEnum.ACTIVE
//           }))
//         }
//       }

//       await updateServiceFn(transformData)
//       setIsLoading(false)
//     } catch (error) {
//       setIsLoading(false)
//       handleServerError({
//         error,
//         form
//       })
//     }
//   }

//   if (isLoadingService) {
//     return <LoadingLayer />
//   }

//   return <SystemServiceForm isLoading={isLoading} onSubmit={onSubmit} form={form} formId={formId} isUpdate={true} />
// }

const UpdateSystemService = () => {
  return <div></div>
}
export default UpdateSystemService
