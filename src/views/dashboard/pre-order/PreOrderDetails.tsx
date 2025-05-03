import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import _ from 'lodash'
import { Calendar, SaveIcon, Siren } from 'lucide-react'
import { useEffect, useId, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useNavigate, useParams } from 'react-router-dom'
import * as z from 'zod'

import Button from '@/components/button'
import { FlexDatePicker } from '@/components/flexible-date-picker/FlexDatePicker'
import FormLabel from '@/components/form-label'
import LoadingContentLayer from '@/components/loading-icon/LoadingContentLayer'
import SelectProduct from '@/components/select-product'
import { Alert, AlertAction, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Form, FormField, FormItem, FormMessage } from '@/components/ui/form'
import { Routes, routesConfig } from '@/configs/routes'
import useHandleServerError from '@/hooks/useHandleServerError'
import { useToast } from '@/hooks/useToast'
import { uploadFilesApi } from '@/network/apis/file'
import { addPreOderApi, getPreOrderByIdApi, updatePreOrderApi } from '@/network/apis/pre-order'
import { TAddPreOderRequestParams, TUpdatePreOrderRequestParams } from '@/network/apis/pre-order/type'
import { ClassificationStatusEnum } from '@/types/classification'
import { StatusEnum } from '@/types/enum'
import { FileStatusEnum, TServerFile } from '@/types/file'
import { IImage } from '@/types/image'
import { PreOrderStatusEnum, TPreOrder } from '@/types/pre-order'
import { ProductClassificationTypeEnum } from '@/types/product'

import ClassificationConfigFlex from './ClassificationConfigFlex'
import { convertPreProductToForm, formSchema, SchemaType } from './helper'

const PreOrderDetails = () => {
  const id = useId()
  const [resetSignal, setResetSignal] = useState(false)
  const [defineFormSignal, setDefineFormSignal] = useState(false)
  const params = useParams()
  const queryClient = useQueryClient()
  const itemId = params.id !== 'add' ? params.id : undefined
  const { data: preProduct, isFetching: isGettingPreProduct } = useQuery({
    queryKey: [getPreOrderByIdApi.queryKey, itemId as string],
    queryFn: getPreOrderByIdApi.fn,
    enabled: !!itemId
  })
  const { mutateAsync: uploadFilesFn } = useMutation({
    mutationKey: [uploadFilesApi.mutationKey],
    mutationFn: uploadFilesApi.fn
  })

  const navigate = useNavigate()
  const { successToast } = useToast()
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      product: '',
      startTime: '',
      endTime: '',
      productClassifications: []
    }
  })

  const product = form.watch('product')
  useEffect(() => {
    if (!itemId && product) {
      setResetSignal((prev) => !prev)
    }
  }, [product, itemId])
  const { mutateAsync: addPreProductFn } = useMutation({
    mutationKey: [addPreOderApi.mutationKey],
    mutationFn: addPreOderApi.fn,
    onSuccess: () => {
      successToast({
        message: 'Amazing! Pre-order product has been added successfully.'
      })
      form.reset()
    }
  })

  const { mutateAsync: updatePreProductFn, isPending: isUpdatingPreProduct } = useMutation({
    mutationKey: [updatePreOrderApi.mutationKey],
    mutationFn: updatePreOrderApi.fn,
    onSuccess: () => {
      successToast({
        message: 'Amazing! Pre-order has been updated successfully.'
      })
    }
  })

  const handleServerError = useHandleServerError()
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

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      {
        const originalClassifications = preProduct?.data?.productClassifications ?? []
        let processedClassifications = []
        {
          // Track IDs of classifications in form values
          const formClassificationIds = new Set(
            values.productClassifications
              ?.map((classification) => classification.id)
              .filter((id): id is string => id !== undefined)
          )

          // Process classifications
          const activeClassifications = await Promise.all(
            (values.productClassifications ?? []).map(async (classification, index) => {
              const originalClassImages = preProduct?.data?.productClassifications?.[index]?.images ?? []
              const processedClassImages = await processImages(
                originalClassImages as Array<IImage | TServerFile>,
                classification?.images ?? []
              )

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
                original.id &&
                !formClassificationIds.has(original.id) &&
                original.status !== ClassificationStatusEnum.INACTIVE
            )
            .map((classification) => ({
              ...classification,
              status: StatusEnum.INACTIVE,
              isAvailable: false
            }))

          processedClassifications = [...activeClassifications, ...inactiveClassifications]
        }

        let transformedData = {
          ...values,
          productClassifications: processedClassifications.map((classification) => ({
            ...classification
          }))
        }
        const isStartTimeDirty = form.formState.dirtyFields.startTime
        const isEndTimeDirty = form.formState.dirtyFields.endTime
        if (!isEndTimeDirty) {
          transformedData = { ...transformedData, endTime: '' }
        }
        if (!isStartTimeDirty) {
          transformedData = { ...transformedData, startTime: '' }
        }
        const cleanedData = _.omitBy(transformedData, (value) => value === undefined || Boolean(value) === false)
        if (itemId) {
          await updatePreProductFn(cleanedData as TUpdatePreOrderRequestParams)
          queryClient.invalidateQueries({
            queryKey: [getPreOrderByIdApi.queryKey, itemId as string]
          })
        } else {
          await addPreProductFn(cleanedData as unknown as TAddPreOderRequestParams)
          navigate(routesConfig[Routes.PRE_ORDER].getPath())
        }
      }
    } catch (error) {
      handleServerError({
        error,
        form
      })
    }
  }

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
    if (preProduct?.data) {
      const productClassifications = preProduct?.data?.productClassifications ?? []

      // Check for type === CUSTOM
      const hasCustomType = productClassifications.some(
        (classification) =>
          classification?.type === ProductClassificationTypeEnum.CUSTOM &&
          classification.status === ClassificationStatusEnum.ACTIVE
      )

      // Determine productClassifications and fallback price/quantity
      const updatedProductClassifications = hasCustomType
        ? productClassifications
            .filter((classification) => classification.status === ClassificationStatusEnum.ACTIVE)
            .map((classification) => ({
              ...classification,
              id: classification?.id,
              color: classification?.color || '',
              size: classification?.size || '',
              other: classification?.other || '',
              images: classification.images?.filter((img) => img.status === FileStatusEnum.ACTIVE || !img.status) || []
            }))
        : []

      const processFormValue = async () => {
        const classificationImages = updatedProductClassifications?.map(
          (classification) =>
            classification?.images
              ?.map((image) => image?.fileUrl)
              .filter((fileUrl): fileUrl is string => fileUrl !== undefined) ?? []
        )
        const [convertedClassificationImages] = await Promise.all([
          Promise.all(classificationImages.map(convertUrlsToFiles))
        ])

        const formValue: SchemaType = {
          id: preProduct?.data?.id,
          product: preProduct?.data?.product?.id,
          startTime: preProduct?.data?.startTime,
          endTime: preProduct?.data?.endTime,
          productClassifications: updatedProductClassifications?.map((classification, index) => ({
            ...classification,
            images: convertedClassificationImages[index] || []
          })) as unknown as SchemaType['productClassifications']
        }
        form.reset(formValue)
        setDefineFormSignal((prev) => !prev)
      }
      processFormValue()
    }
  }, [form, resetSignal, preProduct?.data])

  useEffect(() => {
    if (preProduct?.data) {
      form.reset(convertPreProductToForm(preProduct.data), {
        keepDirty: false
      })
    }
  }, [preProduct?.data, form])

  const preProductData = preProduct?.data

  const handleChangeStatus = async (status: PreOrderStatusEnum) => {
    try {
      const values = form.getValues()
      await updatePreProductFn({
        id: values.id ?? '',
        status: status
      })
      queryClient.invalidateQueries({
        queryKey: [getPreOrderByIdApi.queryKey, itemId as string]
      })
    } catch (error) {
      handleServerError({
        error,
        form
      })
    }
  }

  const getHeader = (preProductData: TPreOrder) => {
    if (!itemId) return null
    switch (preProductData?.status) {
      case PreOrderStatusEnum.ACTIVE:
        return (
          <Alert variant={'success'}>
            <div className='flex items-center gap-2'>
              <Siren className='size-4' />
              <div>
                <AlertTitle className='flex items-center gap-2'>
                  <span className='p-0.5 px-2 rounded-lg border border-green-300 bg-green-400 text-white'>Active</span>
                  <span className='font-bold uppercase text-xs'>status</span>
                </AlertTitle>
                <AlertDescription>
                  This pre-order product is currently active and visible to your customers. If you want to make any
                  changes, please inactivate it first.
                </AlertDescription>
              </div>
            </div>
            <AlertAction
              onClick={() => {
                handleChangeStatus(PreOrderStatusEnum.CANCELLED)
              }}
              loading={isUpdatingPreProduct}
              variant={'default'}
            >
              {'Close event'}
            </AlertAction>
          </Alert>
        )
      case PreOrderStatusEnum.INACTIVE:
        return (
          <Alert variant={'default'}>
            <div className='flex items-center gap-2'>
              <Siren className='size-4' />
              <div>
                <AlertTitle className='flex items-center gap-2'>
                  <span className='p-0.5 px-2 rounded-lg border border-gray-300 bg-gray-400 text-white'>Inactive</span>
                  <span className='font-bold uppercase text-xs'>status</span>
                </AlertTitle>
                <AlertDescription>
                  This pre-order product is currently inactive and not visible to your customers. To update, you must
                  first update the start time and end time of the event.
                </AlertDescription>
              </div>
            </div>
            {/* <AlertAction
              onClick={() => {
                handleChangeStatus(PreOrderStatusEnum.WAITING)
              }}
              loading={isUpdatingPreProduct}
              variant={'success'}
            >
              {'Open event'}
            </AlertAction> */}
          </Alert>
        )
      case PreOrderStatusEnum.WAITING:
        return (
          <Alert variant={'warning'}>
            <div className='flex items-center gap-2'>
              <Siren className='size-4' />
              <div>
                <AlertTitle className='flex items-center gap-2'>
                  <span className='p-0.5 px-2 rounded-lg border border-yellow-300 bg-yellow-400 text-white'>
                    Waiting
                  </span>
                  <span className='font-bold uppercase text-xs'>status</span>
                </AlertTitle>
                <AlertDescription>
                  This pre-order product is currently waiting and not visible to your customers. If you want to make any
                  changes, please inactivate it first.
                </AlertDescription>
              </div>
            </div>
            <AlertAction
              onClick={() => {
                handleChangeStatus(PreOrderStatusEnum.CANCELLED)
              }}
              loading={isUpdatingPreProduct}
              variant={'default'}
            >
              {'Close event'}
            </AlertAction>
          </Alert>
        )
      case PreOrderStatusEnum.SOLD_OUT:
        return (
          <Alert variant={'highlight'}>
            <div className='flex items-center gap-2'>
              <Siren className='size-4' />
              <div>
                <AlertTitle className='flex items-center gap-2'>
                  <span className='p-0.5 px-2 rounded-lg border border-purple-300 bg-purple-400  text-white'>
                    Sold Out
                  </span>
                  <span className='font-bold uppercase text-xs'>status</span>
                </AlertTitle>
                <AlertDescription>
                  This pre-order product is currently sold out and not visible to your customers. If you want to make
                  any changes, please inactivate it first.
                </AlertDescription>
              </div>
            </div>
            {/* <AlertAction
              onClick={() => {
                handleChangeStatus(PreOrderStatusEnum.INACTIVE)
              }}
              loading={isUpdatingPreProduct}
              variant={'default'}
            >
              {'Close event'}
            </AlertAction> */}
          </Alert>
        )
      case PreOrderStatusEnum.CANCELLED:
        return (
          <Alert variant={'destructive'}>
            <div className='flex items-center gap-2'>
              <Siren className='size-4' />
              <div>
                <AlertTitle className='flex items-center gap-2'>
                  <span className='p-0.5 px-2 rounded-lg border border-red-300 bg-red-400  text-white'>Cancelled</span>
                  <span className='font-bold uppercase text-xs'>status</span>
                </AlertTitle>
                <AlertDescription>
                  This event is currently cancelled. Make a new one if you want launch a new event.
                </AlertDescription>
              </div>
            </div>
            {/* <AlertAction
              onClick={() => {
                handleChangeStatus(PreOrderStatusEnum.INACTIVE)
              }}
              loading={isUpdatingPreProduct}
              variant={'default'}
            >
              {'Close event'}
            </AlertAction> */}
          </Alert>
        )
      default:
        return null
    }
  }

  const getFooter = () => {
    switch (preProductData?.status) {
      case PreOrderStatusEnum.CANCELLED:
        return null
      default:
        return (
          <div className='flex items-center justify-end'>
            {
              <Button type='submit' form={`form-${id}`} loading={form.formState.isSubmitting}>
                <SaveIcon />
                Save preOrder product
              </Button>
            }
          </div>
        )
    }
  }
  return (
    <>
      {isGettingPreProduct && <LoadingContentLayer />}
      {preProductData && getHeader(preProductData)}
      <Form {...form}>
        <form
          noValidate
          onSubmit={form.handleSubmit(onSubmit)}
          className='w-full flex-col gap-8 flex'
          id={`form-${id}`}
        >
          <Card>
            <CardHeader>
              <CardTitle className='flex items-center gap-1'>
                <Calendar />
                Pre-order Product Details
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className='gap-4 grid grid-flow-row grid-cols-1 sm:grid-cols-2'>
                <FormField
                  control={form.control}
                  name='product'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel required>Product</FormLabel>
                      <SelectProduct
                        {...field}
                        multiple={false}
                        readOnly={!!itemId}
                        brandId={preProductData?.product.brand?.id || ''}
                      />
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name='startTime'
                  render={({ field, formState }) => {
                    return (
                      <FormItem>
                        <FormLabel required>Start Time Of Event</FormLabel>
                        <FlexDatePicker
                          showTime
                          onlyFutureDates
                          field={field}
                          formState={{
                            ...formState,
                            ...form
                          }}
                        />
                        <FormMessage />
                      </FormItem>
                    )
                  }}
                />
                <FormField
                  control={form.control}
                  name='endTime'
                  render={({ field, formState }) => {
                    return (
                      <FormItem>
                        <FormLabel required>End Time Of Event</FormLabel>
                        <FlexDatePicker
                          showTime
                          onlyFutureDates
                          field={field}
                          formState={{
                            ...formState,
                            ...form
                          }}
                        />
                        <FormMessage />
                      </FormItem>
                    )
                  }}
                />
                {/* <FormField
                  control={form.control}
                  name='images'
                  render={({ field }) => {
                    return (
                      <FormItem className='flex flex-col sm:col-span-2 col-span-1'>
                        <FormLabel required>Images Of Flash Sale</FormLabel>
                        <UploadFiles
                          triggerRef={triggerImageUploadRef}
                          form={form}
                          field={field}
                          dropZoneConfigOptions={{
                            maxFiles: 6
                          }}
                        />
                        <FormMessage />
                      </FormItem>
                    )
                  }}
                /> */}
              </div>
            </CardContent>
          </Card>
          {
            <ClassificationConfigFlex
              form={form}
              resetSignal={resetSignal}
              defineFormSignal={defineFormSignal}
              mode={itemId ? 'update' : 'create'}
            />
          }
        </form>
        {getFooter()}
      </Form>
    </>
  )
}

export default PreOrderDetails
