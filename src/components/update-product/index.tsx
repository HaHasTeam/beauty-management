import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useEffect, useId, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useNavigate, useParams } from 'react-router-dom'
import { z } from 'zod'

import { Routes, routesConfig } from '@/configs/routes'
import { steps } from '@/constants/helper'
import { productFormMessage, productPageMessage } from '@/constants/message'
import useHandleServerError from '@/hooks/useHandleServerError'
import { useToast } from '@/hooks/useToast'
import { uploadFilesApi } from '@/network/apis/file'
import { getAllCategoryApi } from '@/network/apis/category'
import { getUserProfileApi } from '@/network/apis/user'
import { getProductApi, updateProductApi } from '@/network/product'
import { ICategory } from '@/types/category'
import { StatusEnum } from '@/types/enum'
import { ICreateProduct, IServerCreateProduct, ProductClassificationTypeEnum, ProductEnum } from '@/types/product'
import { IImage } from '@/types/productImage'
import { FormProductSchema } from '@/variables/productFormDetailFields'

import BasicInformation from '../create-product/BasicInformation'
import DetailInformation from '../create-product/DetailInformation'
import SalesInformation from '../create-product/SalesInformation'
import Empty from '../empty/Empty'
import LoadingLayer from '../loading-icon/LoadingLayer'
import { StepTrackingVertical } from '../step-tracking'
import { Button } from '../ui/button'
import { Form } from '../ui/form'

const UpdateProduct = () => {
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

  const defaultProductValues = {
    name: '',
    brand: '',
    category: '',
    images: [],
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
    form.reset()
    setResetSignal((prev) => !prev)
    setActiveStep(1)
    setCompleteSteps([])
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
        message:
          form.getValues('status') === ProductEnum.OFFICIAL
            ? productFormMessage.successUpdateOfficialMessage
            : productFormMessage.successUpdateInactiveMessage
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
  async function onSubmit(values: z.infer<typeof FormProductSchema>) {
    try {
      setIsLoading(true)
      if (isValid) {
        const processImages = async (originalImages: Array<IImage>, currentImages: (File | IImage)[]) => {
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

        // Process product images
        const processedMainImages = await processImages(productData?.data[0]?.images ?? [], values.images)

        // Process classification images
        const processedClassifications = await Promise.all(
          (values.productClassifications ?? []).map(async (classification, index) => {
            const originalClassImages = productData?.data[0]?.productClassifications?.[index]?.images ?? []

            const processedClassImages = await processImages(originalClassImages, classification?.images ?? [])

            return {
              ...classification,
              images: processedClassImages
            }
          })
        )

        const transformedData: IServerCreateProduct = {
          name: values?.name,
          brand: productData?.data[0]?.brand?.id ?? '',
          category: values?.category,
          status: values?.status,
          images: processedMainImages,

          description: values?.description,
          sku: values?.sku ?? '',
          detail: JSON.stringify(values.detail), // Convert detail object to a string
          productClassifications:
            processedClassifications.length > 0
              ? processedClassifications
              : [
                  {
                    title: 'Default',
                    images: [],
                    price: values.price ?? 1000,
                    quantity: values.quantity ?? 1,
                    type: ProductClassificationTypeEnum.DEFAULT,
                    sku: values.sku ?? ''
                  }
                ]
        }
        await updateProductFn({ productId: id ?? '', data: transformedData })
        setIsLoading(false)
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
    if (productData && productData?.data && productData?.data?.length > 0) {
      const productClassifications = productData?.data[0]?.productClassifications ?? []

      // Check for type === CUSTOM
      const hasCustomType = productClassifications.some(
        (classification) => classification?.type === ProductClassificationTypeEnum.CUSTOM
      )

      // Determine productClassifications and fallback price/quantity
      const updatedProductClassifications = hasCustomType
        ? productClassifications.map((classification) => ({
            ...classification,
            images: classification.images?.filter((img) => img.status === StatusEnum.ACTIVE || !img.status) || []
          }))
        : []
      const fallbackPrice = !hasCustomType ? productClassifications[0]?.price : undefined
      const fallbackQuantity = !hasCustomType ? productClassifications[0]?.quantity : undefined

      const processFormValue = async () => {
        const mainImages = productData?.data[0]?.images
          ?.filter((image) => image.status === StatusEnum.ACTIVE || !image.status)
          ?.map((image) => image.fileUrl)
          .filter((fileUrl): fileUrl is string => fileUrl !== undefined)

        const classificationImages = updatedProductClassifications?.map(
          (classification) =>
            classification?.images
              ?.map((image) => image?.fileUrl)
              .filter((fileUrl): fileUrl is string => fileUrl !== undefined) ?? []
        )

        const [convertedMainImages, convertedClassificationImages] = await Promise.all([
          convertUrlsToFiles(mainImages),
          Promise.all(classificationImages.map(convertUrlsToFiles))
        ])

        const formValue: ICreateProduct = {
          id: productData?.data[0]?.id,
          name: productData?.data[0]?.name,
          brand: productData?.data[0]?.brand?.id,
          category: productData?.data[0]?.category?.id,
          images: convertedMainImages,
          description: productData?.data[0]?.description,
          detail: JSON?.parse(productData?.data[0]?.detail ?? ''),
          productClassifications: updatedProductClassifications?.map((classification, index) => ({
            ...classification,
            images: convertedClassificationImages[index] || []
          })),
          status: productData?.data[0]?.status ?? '',
          price: fallbackPrice,
          quantity: fallbackQuantity
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
      {productData && productData?.data && productData?.data?.length > 0 ? (
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
                />
                <div className='w-full flex flex-row-reverse justify-start gap-3'>
                  <Button type='submit' onClick={() => form.setValue('status', ProductEnum.OFFICIAL)}>
                    Submit and Show
                  </Button>
                  <Button variant='outline' type='submit' onClick={() => form.setValue('status', ProductEnum.INACTIVE)}>
                    Submit and Hide
                  </Button>
                  <Button
                    variant='outline'
                    type='submit'
                    onClick={() => {
                      handleReset()
                      navigate(routesConfig[Routes.PRODUCT_LIST].getPath())
                    }}
                  >
                    Hủy
                  </Button>
                </div>
              </form>
            </Form>
          </div>
          <div className='lg:w-[28%] md:w-[30%] sm:w-[15%] w-0 sm:block hidden'>
            <div className='fixed right-8'>
              <StepTrackingVertical
                steps={steps}
                setActiveStep={setActiveStep}
                activeStep={activeStep}
                completeSteps={completeSteps}
              />
            </div>
          </div>
        </div>
      ) : (
        <div className='h-[600px] w-full flex justify-center items-center'>
          <Empty title={productPageMessage.emptyProductTitle} description={productPageMessage.emptyProductMessage} />
        </div>
      )}
    </>
  )
}

export default UpdateProduct
