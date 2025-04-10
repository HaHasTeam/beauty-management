import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Calendar, SaveIcon, Siren } from 'lucide-react'
import { useEffect, useId, useRef } from 'react'
import { useForm } from 'react-hook-form'
import { useNavigate, useParams } from 'react-router-dom'
import * as z from 'zod'

import Button from '@/components/button'
import { TriggerUploadRef } from '@/components/file-input/UploadFiles'
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
import { addPreOderApi, getPreOrderByIdApi, updatePreOrderApi } from '@/network/apis/pre-order'
import { TAddPreOderRequestParams, TUpdatePreOrderRequestParams } from '@/network/apis/pre-order/type'
import { PreOrderStatusEnum } from '@/types/pre-order'
import { ProductClassificationTypeEnum } from '@/types/product'

import ClassificationConfig from './ClassificationConfig'
import { convertFormToPreProduct, convertPreProductToForm, formSchema } from './helper'

const PreOrderDetails = () => {
  const id = useId()
  const params = useParams()
  const triggerRef = useRef<TriggerUploadRef>(null)
  const queryClient = useQueryClient()
  const itemId = params.id !== 'add' ? params.id : undefined
  const { data: preProduct, isFetching: isGettingPreProduct } = useQuery({
    queryKey: [getPreOrderByIdApi.queryKey, itemId as string],
    queryFn: getPreOrderByIdApi.fn,
    enabled: !!itemId
  })

  const navigate = useNavigate()
  const { successToast } = useToast()
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      product: '',
      startTime: '',
      endTime: '',
      productClassifications: [
        {
          append: {
            images: [],
            type: ProductClassificationTypeEnum.CUSTOM
          }
        }
      ]
    }
  })

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

  async function onSubmit() {
    try {
      const triggerFns = triggerRef.current?.triggers
      if (triggerFns) {
        await Promise.all(triggerFns.map((trigger) => trigger()))
      }
      const values = form.getValues()
      if (itemId) {
        await updatePreProductFn(convertFormToPreProduct(values) as TUpdatePreOrderRequestParams)
        queryClient.invalidateQueries({
          queryKey: [getPreOrderByIdApi.queryKey, itemId as string]
        })
      } else {
        await addPreProductFn(
          convertFormToPreProduct({
            ...values
          }) as TAddPreOderRequestParams
        )
        navigate(routesConfig[Routes.PRE_ORDER].getPath())
      }
    } catch (error) {
      handleServerError({
        error,
        form
      })
    }
  }

  useEffect(() => {
    if (preProduct?.data) {
      form.reset(convertPreProductToForm(preProduct.data))
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

  const getHeader = () => {
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
                handleChangeStatus(PreOrderStatusEnum.INACTIVE)
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
                  This pre-order product is currently inactive and not visible to your customers.
                </AlertDescription>
              </div>
            </div>
            <AlertAction
              onClick={() => {
                handleChangeStatus(PreOrderStatusEnum.ACTIVE)
              }}
              loading={isUpdatingPreProduct}
              variant={'success'}
            >
              {'Open event'}
            </AlertAction>
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
                handleChangeStatus(PreOrderStatusEnum.INACTIVE)
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
            <AlertAction
              onClick={() => {
                handleChangeStatus(PreOrderStatusEnum.INACTIVE)
              }}
              loading={isUpdatingPreProduct}
              variant={'default'}
            >
              {'Reopen event'}
            </AlertAction>
          </Alert>
        )
      default:
        return null
    }
  }

  const getFooter = () => {
    switch (preProductData?.status) {
      default:
        return (
          <div className='flex items-center justify-end'>
            {
              <Button type='submit' form={`form-${id}`} loading={form.formState.isSubmitting}>
                <SaveIcon />
                Save Pre-order Product
              </Button>
            }
          </div>
        )
    }
  }
  return (
    <>
      {isGettingPreProduct && <LoadingContentLayer />}
      {getHeader()}
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
                      <SelectProduct {...field} multiple={false} />
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
          {<ClassificationConfig form={form} productId={form.watch('product')} triggerImageUploadRef={triggerRef} />}
        </form>
        {getFooter()}
      </Form>
    </>
  )
}

export default PreOrderDetails
