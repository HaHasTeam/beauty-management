import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { SaveIcon, Siren, Zap } from 'lucide-react'
import { useEffect, useId, useRef } from 'react'
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
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Routes, routesConfig } from '@/configs/routes'
import useHandleServerError from '@/hooks/useHandleServerError'
import { useToast } from '@/hooks/useToast'
import { addFlashSaleApi, getFlashSaleByIdApi, updateFlashSaleApi } from '@/network/apis/flash-sale'
import { TAddFlashSaleRequestParams, TUpdateFlashSaleRequestParams } from '@/network/apis/flash-sale/type'
import { getProductApi } from '@/network/apis/product'
import { FlashSaleStatusEnum } from '@/types/flash-sale'

import ClassificationConfig from './ClassificationConfig'
import { convertFlashSaleToForm, convertFormToFlashSale, formSchema } from './helper'

const FlashSaleDetails = () => {
  const id = useId()
  const params = useParams()
  const prevProductRef = useRef<string>('')

  const queryClient = useQueryClient()
  const itemId = params.id !== 'add' ? params.id : undefined
  const { data: flashSale, isFetching: isGettingFlashSale } = useQuery({
    queryKey: [getFlashSaleByIdApi.queryKey, itemId as string],
    queryFn: getFlashSaleByIdApi.fn,
    enabled: !!itemId
  })
  // const triggerImageUploadRef = useRef<TriggerUploadRef>(null)

  const navigate = useNavigate()
  const { successToast } = useToast()
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      product: '',
      startTime: '',
      endTime: '',
      discount: undefined,
      initialClassifications: [],
      productClassifications: [{}]
    }
  })

  const { mutateAsync: addFlashSaleFn } = useMutation({
    mutationKey: [addFlashSaleApi.mutationKey],
    mutationFn: addFlashSaleApi.fn,
    onSuccess: () => {
      successToast({
        message: 'Amazing! flash sale has been added successfully.'
      })
      form.reset()
    }
  })

  const { mutateAsync: updateFlashSaleFn, isPending: isUpdatingFlashSale } = useMutation({
    mutationKey: [updateFlashSaleApi.mutationKey],
    mutationFn: updateFlashSaleApi.fn,
    onSuccess: () => {
      successToast({
        message: 'Amazing! flash sale has been updated successfully.'
      })
    }
  })

  const handleServerError = useHandleServerError()

  // Handle form submission
  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      if (itemId) {
        await updateFlashSaleFn(convertFormToFlashSale(values) as TUpdateFlashSaleRequestParams)
        queryClient.invalidateQueries({
          queryKey: [getFlashSaleByIdApi.queryKey, itemId as string]
        })
        queryClient.invalidateQueries({
          queryKey: [getProductApi.queryKey]
        })
      } else {
        // await triggerImageUploadRef.current?.trigger()
        // const newImages = form.watch('images')
        await addFlashSaleFn(
          convertFormToFlashSale({
            ...values
            // images: newImages
          }) as TAddFlashSaleRequestParams
        )
        navigate(routesConfig[Routes.FLASH_SALE].getPath())
      }
    } catch (error) {
      handleServerError({
        error,
        form
      })
    }
  }

  useEffect(() => {
    if (flashSale?.data) {
      const data = convertFlashSaleToForm(flashSale.data)

      // Ensure productClassifications is never undefined or empty
      const safeData = {
        ...data,
        productClassifications:
          data.productClassifications && data.productClassifications.length > 0 ? data.productClassifications : [{}]
      }

      form.reset(safeData)
      // Update the prevProductRef with the loaded product ID
      prevProductRef.current = flashSale.data.product.id
    }
  }, [flashSale?.data, form])

  const flashSaleData = flashSale?.data

  const handleChangeStatus = async (status: FlashSaleStatusEnum) => {
    try {
      const values = form.getValues()
      await updateFlashSaleFn({
        id: values.id ?? '',
        status: status
      })
      queryClient.invalidateQueries({
        queryKey: [getFlashSaleByIdApi.queryKey, itemId as string]
      })
      queryClient.invalidateQueries({
        queryKey: [getProductApi.queryKey]
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
    switch (flashSaleData?.status) {
      case FlashSaleStatusEnum.ACTIVE:
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
                  This flash sale is currently active and visible to your customers. If you want to make any changes,
                  please inactivate it first.
                </AlertDescription>
              </div>
            </div>
            <AlertAction
              onClick={() => {
                handleChangeStatus(FlashSaleStatusEnum.INACTIVE)
              }}
              loading={isUpdatingFlashSale}
              variant={'default'}
            >
              {'Close event'}
            </AlertAction>
          </Alert>
        )
      case FlashSaleStatusEnum.INACTIVE:
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
                  This flash sale is currently inactive and not visible to your customers.
                </AlertDescription>
              </div>
            </div>
            <AlertAction
              onClick={() => {
                handleChangeStatus(FlashSaleStatusEnum.ACTIVE)
              }}
              loading={isUpdatingFlashSale}
              variant={'success'}
            >
              {'Open event'}
            </AlertAction>
          </Alert>
        )
      case FlashSaleStatusEnum.WAITING:
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
                  This flash sale is currently waiting and not visible to your customers. If you want to make any
                  changes, please inactivate it first.
                </AlertDescription>
              </div>
            </div>
            <AlertAction
              onClick={() => {
                handleChangeStatus(FlashSaleStatusEnum.INACTIVE)
              }}
              loading={isUpdatingFlashSale}
              variant={'default'}
            >
              {'Close event'}
            </AlertAction>
          </Alert>
        )
      case FlashSaleStatusEnum.SOLD_OUT:
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
                  This flash sale is currently sold out and not visible to your customers. If you want to make any
                  changes, please inactivate it first.
                </AlertDescription>
              </div>
            </div>
            <AlertAction
              onClick={() => {
                handleChangeStatus(FlashSaleStatusEnum.INACTIVE)
              }}
              loading={isUpdatingFlashSale}
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
    switch (flashSaleData?.status) {
      default:
        return (
          <div className='flex items-center justify-end'>
            {
              <Button type='submit' form={`form-${id}`} loading={form.formState.isSubmitting}>
                <SaveIcon />
                Save Flash Sale Product
              </Button>
            }
          </div>
        )
    }
  }

  return (
    <>
      {isGettingFlashSale && <LoadingContentLayer />}
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
                <Zap />
                Flash Sale Product Details
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className='gap-4 grid grid-flow-row grid-cols-1 sm:grid-cols-2'>
                <FormField
                  control={form.control}
                  name='product'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel required>Flash Sale Product</FormLabel>
                      <SelectProduct {...field} multiple={false} readOnly={!!itemId} />
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name={`discount`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel required>Discount %</FormLabel>
                      <FormControl>
                        <Input
                          type='percentage'
                          placeholder='
                          e.g. 12.5%
                         '
                          {...field}
                        />
                      </FormControl>
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
                        <FormLabel required>Start Time Of Flash Sale</FormLabel>
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
                        <FormLabel required>End Time Of Flash Sale</FormLabel>
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
          {<ClassificationConfig form={form} productId={form.watch('product')} />}
        </form>
        {getFooter()}
      </Form>
    </>
  )
}

export default FlashSaleDetails
