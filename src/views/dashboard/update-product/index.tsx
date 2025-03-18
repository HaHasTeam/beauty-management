import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useEffect, useId, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { useNavigate, useParams } from 'react-router-dom'
import { z } from 'zod'

import Empty from '@/components/empty/Empty'
import LoadingLayer from '@/components/loading-icon/LoadingLayer'
import { StepTrackingVertical } from '@/components/step-tracking'
import { Button } from '@/components/ui/button'
import { Form } from '@/components/ui/form'
import { Routes, routesConfig } from '@/configs/routes'
import { getSteps } from '@/constants/helper'
import useHandleServerError from '@/hooks/useHandleServerError'
import { useToast } from '@/hooks/useToast'
import { getAllCategoryApi } from '@/network/apis/category'
import { uploadFilesApi } from '@/network/apis/file'
import { getProductApi, updateProductApi } from '@/network/apis/product'
import { getUserProfileApi } from '@/network/apis/user'
import { ICategory } from '@/types/category'
import { ClassificationStatusEnum } from '@/types/classification'
import { StatusEnum } from '@/types/enum'
import { TServerFile } from '@/types/file'
import {
  ICreateProduct,
  IServerCreateProduct,
  IServerProductClassification,
  ProductClassificationTypeEnum,
  ProductEnum
} from '@/types/product'
import { IImage } from '@/types/productImage'
import { getFormProductSchema } from '@/variables/productFormDetailFields'

// import { FormProductSchema } from '@/variables/productFormDetailFields'
import BasicInformation from '../create-product/BasicInformation'
import DetailInformation from '../create-product/DetailInformation'
import SalesInformation from '../create-product/SalesInformation'

const UpdateProduct = () => {
  const { t } = useTranslation()
  const { id } = useParams()
  const productId = id ?? ''
  const formId = useId()
  const queryClient = useQueryClient()
  const [resetSignal, setResetSignal] = useState(false)
  const [isValid, setIsValid] = useState(true)
  const [defineFormSignal, setDefineFormSignal] = useState(false)
  const [categories, setCategories] = useState<ICategory[]>([])
  const [activeStep, setActiveStep] = useState(1)
  const [completeSteps, setCompleteSteps] = useState<number[]>([])
  const [isLoading, setIsLoading] = useState(false)

  const { successToast } = useToast()
  const navigate = useNavigate()
  const handleServerError = useHandleServerError()
  const FormProductSchema = getFormProductSchema()

  const defaultProductValues = {
    name: '',
    brand: '',
    category: '',
    images: [],
    certificates: [],
    description: '',
    detail: {},
    productClassifications: [],
    status: ''
  }

  const { data: useProfileData, isFetching: isGettingProfile } = useQuery({
    queryKey: [getUserProfileApi.queryKey],
    queryFn: getUserProfileApi.fn
  })
  const { data: useCategoryData, isFetching: isGettingCategory } = useQuery({
    queryKey: [getAllCategoryApi.queryKey],
    queryFn: getAllCategoryApi.fn
  })

  const { data: productData, isFetching: isGettingProduct } = useQuery({
    queryKey: [getProductApi.queryKey, productId as string],
    queryFn: getProductApi.fn,
    enabled: !!productId
  })

  const form = useForm<z.infer<typeof FormProductSchema>>({
    resolver: zodResolver(FormProductSchema),
    defaultValues: defaultProductValues
  })

  const handleReset = () => {
    // form.reset()
    setResetSignal((prev) => !prev)
    // setActiveStep(1)
    // setCompleteSteps([])
    setDefineFormSignal((prev) => !prev)
  }

  const { mutateAsync: uploadFilesFn } = useMutation({
    mutationKey: [uploadFilesApi.mutationKey],
    mutationFn: uploadFilesApi.fn
  })

  const { mutateAsync: updateProductFn } = useMutation({
    mutationKey: [updateProductApi.mutationKey],
    mutationFn: updateProductApi.fn,
    onSuccess: () => {
      successToast({
        message: t('createProduct.successUpdate'),
        description:
          form.getValues('status') === ProductEnum.OFFICIAL
            ? t('createProduct.successOfficialDescription')
            : t('createProduct.successInactiveDescription')
      })
      queryClient.invalidateQueries({
        queryKey: [getProductApi.queryKey, productId as string]
      })
      handleReset()
    }
  })
  const convertFileToUrl = async (files: File[]) => {
    const formData = new FormData()
    files.forEach((file) => {
      formData.append('files', file)
    })

    const uploadedFilesResponse = await uploadFilesFn(formData)

    return uploadedFilesResponse.data
  }
  const processImages = async (
    originalImages: Array<IImage | TServerFile>,
    currentImages: (File | IImage | TServerFile)[]
  ) => {
    const processedImages: Array<IImage> = []

    // Track original image IDs to check for deletions
    const originalImageIds = new Set(originalImages.filter((img) => img.id).map((img) => img.id))

    // Process current images
    for (const img of currentImages) {
      if (img instanceof File) {
        // New file upload
        const uploadedUrls = await convertFileToUrl([img])
        processedImages.push({ fileUrl: uploadedUrls[0] })
      } else if (typeof img === 'object' && img.fileUrl) {
        // Existing image
        processedImages.push({
          id: img.id,
          fileUrl: img.fileUrl
        })

        // Remove from tracked original images
        if (img.id) {
          originalImageIds.delete(img.id)
        }
      }
    }

    // Mark deleted images as inactive
    originalImageIds.forEach((id) => {
      const deletedImage = originalImages.find((img) => img.id === id)
      if (deletedImage) {
        processedImages.push({
          id,
          fileUrl: deletedImage.fileUrl,
          status: StatusEnum.INACTIVE
        })
      }
    })

    return processedImages
  }

  // const processCertificate = async (
  //   originalCertificates: string[] | undefined,
  //   newCertificate: File[] | undefined
  // ): Promise<(File | IImage)[]> => {
  //   // If no new certificate is provided
  //   if (!newCertificate?.length) {
  //     // If there were original certificates, mark them all as inactive
  //     if (originalCertificates?.length) {
  //       return originalCertificates.map((cert) => ({
  //         fileUrl: cert,
  //         status: StatusEnum.INACTIVE
  //       }))
  //     }
  //     return []
  //   }

  //   // If there's a new certificate file, upload it
  //   if (newCertificate[0] instanceof File) {
  //     const uploadedUrls = await convertFileToUrl([newCertificate[0]])
  //     return [{ fileUrl: uploadedUrls[0] }]
  //   }

  //   // Keep existing certificates if no changes
  //   return originalCertificates?.length ? originalCertificates.map((cert) => ({ fileUrl: cert })) : []
  // }

  async function onSubmit(values: z.infer<typeof FormProductSchema>) {
    try {
      if (isValid) {
        const originalClassifications = productData?.data?.productClassifications ?? []
        setIsLoading(true)
        // Process product images
        const processedMainImages = await processImages(productData?.data?.images ?? [], values.images)

        // Process certificate
        const processedCertificates = await processImages(productData?.data?.certificates ?? [], values.certificates)

        let processedClassifications: IServerProductClassification[] = []

        // Handle case when form has no product classifications but has price, quantity, and sku
        if (
          (!values.productClassifications || values.productClassifications.length === 0) &&
          values.price !== undefined &&
          values.price > 0 &&
          values.quantity !== undefined &&
          values.quantity > 0 &&
          values.sku !== undefined &&
          values.sku.length > 0
        ) {
          // Find existing default classification
          const defaultClassification = originalClassifications.find(
            (classification) => classification.type === ProductClassificationTypeEnum.DEFAULT
          )

          if (defaultClassification) {
            // Update existing default classification
            processedClassifications = originalClassifications.map((classification) => {
              if (classification.type === ProductClassificationTypeEnum.DEFAULT) {
                return {
                  ...classification,
                  price: values.price,
                  quantity: values.quantity,
                  sku: values.sku,
                  status: StatusEnum.ACTIVE
                }
              }
              return {
                ...classification,
                status: StatusEnum.INACTIVE,
                isAvailable: false
              }
            })
          } else {
            // Create new default classification
            processedClassifications = [
              ...originalClassifications.map((classification) => ({
                ...classification,
                status: StatusEnum.INACTIVE,
                isAvailable: false
              })),
              {
                title: 'Default',
                images: [],
                price: values.price,
                quantity: values.quantity,
                type: ProductClassificationTypeEnum.DEFAULT,
                sku: values.sku,
                status: StatusEnum.ACTIVE
              }
            ]
          }
        } else {
          // Track IDs of classifications in form values
          const formClassificationIds = new Set(
            values.productClassifications
              ?.map((classification) => classification.id)
              .filter((id): id is string => id !== undefined)
          )

          // Process classifications
          const activeClassifications = await Promise.all(
            (values.productClassifications ?? []).map(async (classification, index) => {
              const originalClassImages = productData?.data?.productClassifications?.[index]?.images ?? []
              const processedClassImages = await processImages(originalClassImages, classification?.images ?? [])

              // Include the original ID if it exists
              const originalClassification = originalClassifications.find((oc) => oc.id === classification.id)

              return {
                ...classification,
                id: originalClassification?.id,
                color: classification?.color && classification?.color?.length > 0 ? classification.color : null,
                size: classification?.size && classification?.size?.length > 0 ? classification.size : null,
                other: classification?.other && classification?.other?.length > 0 ? classification.other : null,
                images: processedClassImages,
                status: StatusEnum.ACTIVE
              }
            })
          )

          // Add inactive status to classifications that are not in form values
          const inactiveClassifications = originalClassifications
            .filter(
              (original) =>
                original.id && !formClassificationIds.has(original.id) && original.status !== StatusEnum.INACTIVE
            )
            .map((classification) => ({
              ...classification,
              status: StatusEnum.INACTIVE,
              isAvailable: false
            }))

          processedClassifications = [...activeClassifications, ...inactiveClassifications]
        }

        const transformedData: IServerCreateProduct = {
          name: values?.name,
          brand: productData?.data?.brand?.id ?? '',
          category: values?.category,
          status: values?.status,
          images: processedMainImages,
          certificates: processedCertificates,
          description: values?.description,
          sku: values?.sku ?? '',
          detail: JSON.stringify(values.detail),
          productClassifications: processedClassifications.map((classification) => ({
            ...classification,
            type: classification.type ?? ProductClassificationTypeEnum.DEFAULT,
            price: classification.price ?? 1000,
            quantity: classification.quantity ?? 1,
            sku: classification.sku ?? values.sku ?? ''
          }))
        }
        await updateProductFn({ productId: id ?? '', data: transformedData })

        setIsLoading(false)
      }
    } catch (error) {
      setIsLoading(false)
      handleServerError({
        error,
        form
      })
    }
  }
  useEffect(() => {
    if (useProfileData?.data?.brands?.[0]?.id) {
      form.setValue('brand', useProfileData.data.brands[0].id)
    }
  }, [useProfileData, form, resetSignal])
  useEffect(() => {
    if (useCategoryData?.data) {
      setCategories(useCategoryData.data)
    }
  }, [form, resetSignal, useCategoryData])
  const convertUrlsToFiles = async (urls: string[]) => {
    try {
      const files = await Promise.all(
        urls.map(async (url) => {
          const response = await fetch(url)
          const blob = await response.blob()
          return new File([blob], url.split('/').pop() || 'image', { type: blob.type })
        })
      )
      return files
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (_error) {
      return []
    }
  }
  useEffect(() => {
    if (productData && productData?.data) {
      const productClassifications = productData?.data?.productClassifications ?? []

      // Check for type === CUSTOM
      const hasCustomType = productClassifications.some(
        (classification) =>
          classification?.type === ProductClassificationTypeEnum.CUSTOM &&
          classification.status === ClassificationStatusEnum.ACTIVE
      )

      // Determine productClassifications and fallback price/quantity
      const updatedProductClassifications = hasCustomType
        ? productClassifications
            .filter((classification) => classification.status === StatusEnum.ACTIVE)
            .map((classification) => ({
              ...classification,
              id: classification?.id,
              color: classification?.color || '',
              size: classification?.size || '',
              other: classification?.other || '',
              images: classification.images?.filter((img) => img.status === StatusEnum.ACTIVE || !img.status) || []
            }))
        : []
      const fallbackPrice = !hasCustomType ? productClassifications[0]?.price : undefined
      const fallbackQuantity = !hasCustomType ? productClassifications[0]?.quantity : undefined

      const processFormValue = async () => {
        const mainImages = productData?.data?.images
          ?.filter((image) => image.status === StatusEnum.ACTIVE || !image.status)
          ?.map((image) => image.fileUrl)
          .filter((fileUrl): fileUrl is string => fileUrl !== undefined)

        const certificateUrls = productData?.data?.certificates
          ?.filter((cert) => cert.status === StatusEnum.ACTIVE || !cert.status)
          ?.map((cert) => cert.fileUrl)
          .filter((fileUrl): fileUrl is string => fileUrl !== undefined)

        const classificationImages = updatedProductClassifications?.map(
          (classification) =>
            classification?.images
              ?.map((image) => image?.fileUrl)
              .filter((fileUrl): fileUrl is string => fileUrl !== undefined) ?? []
        )

        const [convertedMainImages, convertedClassificationImages, convertedCertificate] = await Promise.all([
          convertUrlsToFiles(mainImages),
          Promise.all(classificationImages.map(convertUrlsToFiles)),
          certificateUrls ? convertUrlsToFiles(certificateUrls) : null
        ])

        const formValue: ICreateProduct = {
          id: productData?.data?.id,
          name: productData?.data?.name,
          brand: productData?.data?.brand?.id,
          category: productData?.data?.category?.id,
          images: convertedMainImages,
          description: productData?.data?.description,
          detail: JSON?.parse(productData?.data?.detail ?? ''),
          certificates: convertedCertificate ? convertedCertificate : [],
          productClassifications: updatedProductClassifications?.map((classification, index) => ({
            ...classification,
            images: convertedClassificationImages[index] || []
          })),
          status: productData?.data?.status ?? '',
          price: fallbackPrice,
          quantity: fallbackQuantity,
          sku: productData?.data?.sku ?? ''
        }
        form.reset(formValue)
        setDefineFormSignal((prev) => !prev)
      }
      processFormValue()
    }
  }, [form, resetSignal, productData, isGettingCategory, isGettingProduct])

  return (
    <>
      {(isGettingProduct || isGettingCategory || isGettingProfile || isLoading) && <LoadingLayer />}
      {!isGettingProduct &&
        productData &&
        productData?.data &&
        productData?.data?.status !== ProductEnum.INACTIVE &&
        productData?.data?.status !== ProductEnum.BANNED && (
          <div className='space-y-3 relative flex sm:gap-3 gap-0 justify-between'>
            <div className='lg:w-[72%] md:w-[70%] sm:w-[85%] w-full'>
              <Form {...form}>
                <form
                  noValidate
                  onSubmit={form.handleSubmit(onSubmit)}
                  className='w-full grid gap-4 mb-8'
                  id={`form-${formId}`}
                >
                  <BasicInformation
                    form={form}
                    resetSignal={resetSignal}
                    defineFormSignal={defineFormSignal}
                    useCategoryData={categories}
                    setActiveStep={setActiveStep}
                    activeStep={activeStep}
                    setCompleteSteps={setCompleteSteps}
                  />
                  <DetailInformation
                    form={form}
                    resetSignal={resetSignal}
                    useCategoryData={categories}
                    defineFormSignal={defineFormSignal}
                    setIsValid={setIsValid}
                    setActiveStep={setActiveStep}
                    activeStep={activeStep}
                    setCompleteSteps={setCompleteSteps}
                    isValid={isValid}
                  />
                  <SalesInformation
                    form={form}
                    resetSignal={resetSignal}
                    defineFormSignal={defineFormSignal}
                    setIsValid={setIsValid}
                    setActiveStep={setActiveStep}
                    activeStep={activeStep}
                    setCompleteSteps={setCompleteSteps}
                    mode='update'
                  />
                  <div className='w-full flex flex-row-reverse justify-start gap-3'>
                    <Button type='submit' onClick={() => form.setValue('status', ProductEnum.OFFICIAL)}>
                      {t('button.submit')}
                    </Button>
                    {/* <Button
                    variant='outline'
                    type='submit'
                    className='border border-primary hover:bg-primary/10 text-primary hover:text-primary'
                    onClick={() => form.setValue('status', ProductEnum.INACTIVE)}
                  >
                    {t('button.submitAndHide')}
                  </Button> */}
                    <Button
                      variant='outline'
                      className='border border-primary hover:bg-primary/10 text-primary hover:text-primary'
                      type='submit'
                      onClick={() => {
                        handleReset()
                        navigate(routesConfig[Routes.PRODUCT_LIST].getPath())
                      }}
                    >
                      {t('button.cancel')}
                    </Button>
                  </div>
                </form>
              </Form>
            </div>
            <div className='lg:w-[28%] md:w-[30%] sm:w-[15%] w-0 sm:block hidden'>
              <div className='fixed right-8'>
                <StepTrackingVertical
                  steps={getSteps()}
                  setActiveStep={setActiveStep}
                  activeStep={activeStep}
                  completeSteps={completeSteps}
                />
              </div>
            </div>
            {/* <ConfirmDialog
            open={openDialog}
            onOpenChange={setOpenDialog}
            onConfirm={handleConfirmedSubmit}
            item={'productClassification'}
          /> */}
          </div>
        )}
      {!isGettingProduct && productData && productData?.data && productData?.data?.status === ProductEnum.BANNED && (
        <div className='h-[600px] w-full flex justify-center items-center'>
          <Empty title={t('empty.productBanned.title')} description={t('empty.productBanned.description')} />
        </div>
      )}
      {!isGettingProduct &&
        (!productData ||
          !productData?.data ||
          (productData && productData?.data && productData?.data?.status === ProductEnum.INACTIVE)) && (
          <div className='h-[600px] w-full flex justify-center items-center'>
            <Empty title={t('empty.productDetail.title')} description={t('empty.productDetail.description')} />
          </div>
        )}
    </>
  )
}

export default UpdateProduct
