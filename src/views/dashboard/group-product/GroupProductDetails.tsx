import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Boxes, Rocket, SaveIcon, Siren, TicketPlus, Tickets } from 'lucide-react'
import { useEffect, useId, useMemo } from 'react'
import { useForm } from 'react-hook-form'
import { useNavigate, useParams } from 'react-router-dom'
import * as z from 'zod'
import { useShallow } from 'zustand/react/shallow'

import Button from '@/components/button'
import FormLabel from '@/components/form-label'
import LoadingContentLayer from '@/components/loading-icon/LoadingContentLayer'
import SelectProduct from '@/components/select-product'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Form, FormControl, FormDescription, FormField, FormItem, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Switch } from '@/components/ui/switch'
import { Textarea } from '@/components/ui/textarea'
import { Routes, routesConfig } from '@/configs/routes'
import useHandleServerError from '@/hooks/useHandleServerError'
import { useToast } from '@/hooks/useToast'
import { cn } from '@/lib/utils'
import {
  createGroupProductApi,
  getGroupProductByIdApi,
  toggleGroupProductStatusApi,
  updateGroupProductApi
} from '@/network/apis/group-product'
import { TUpdateGroupProductRequestParams } from '@/network/apis/group-product/type'
import { useStore } from '@/stores/store'
import { DiscountTypeEnum, VoucherApplyTypeEnum } from '@/types/enum'
import { GroupProductStatusEnum } from '@/types/group-product'
import { generateCouponCode } from '@/utils'

import { convertFormToGroupProduct, convertGroupProductToForm, formSchema } from './helper'
import VoucherThresholds from './VoucherThresholds'

const initialCode = generateCouponCode()

const GroupProductDetails = () => {
  const id = useId()
  const { userData } = useStore(
    useShallow((state) => ({
      userData: state.user
    }))
  )

  const brandId = useMemo(() => (userData?.brands?.length ? userData.brands[0].id : ''), [userData])

  const params = useParams()
  const itemId = params.id !== 'add' ? params.id : undefined
  const queryClient = useQueryClient()
  const { data: groupProduct, isFetching: isGettingGroupProduct } = useQuery({
    queryKey: [getGroupProductByIdApi.queryKey, itemId as string],
    queryFn: getGroupProductByIdApi.fn,
    enabled: !!itemId
  })

  const navigate = useNavigate()
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      maxAmountOption: {
        hasMaxBuyAmount: true
      },
      startTimeOption: {
        hasStartTime: false
      },
      endTimeOption: {
        hasEndTime: false
      },
      criterias: [
        {
          threshold: undefined,
          voucher: {
            applyType: VoucherApplyTypeEnum.ALL,
            name: "Group's Voucher " + initialCode,
            description: undefined,
            discountType: DiscountTypeEnum.AMOUNT,
            code: 'group-voucher-' + initialCode
          }
        }
      ]
    }
  })

  const { mutateAsync: addGroupProductFn } = useMutation({
    mutationKey: [createGroupProductApi.mutationKey],
    mutationFn: createGroupProductApi.fn,
    onSuccess: () => {
      successToast({
        message: 'Amazing! Group product has been added successfully.'
      })
      form.reset()
    }
  })

  const { mutateAsync: toggleGroupProductStatusFn, isPending: isTogglingGroupProductStatus } = useMutation({
    mutationKey: [toggleGroupProductStatusApi.mutationKey],
    mutationFn: toggleGroupProductStatusApi.fn,
    onSuccess: () => {
      successToast({
        message: 'Amazing! Group product status has been updated successfully.'
      })
      queryClient.invalidateQueries({
        queryKey: [getGroupProductByIdApi.queryKey, itemId as string]
      })
    }
  })

  const { mutateAsync: updateGroupProductFn } = useMutation({
    mutationKey: [updateGroupProductApi.mutationKey],
    mutationFn: updateGroupProductApi.fn,
    onSuccess: () => {
      successToast({
        message: 'Amazing! Group product has been updated successfully.'
      })
    }
  })

  const handleServerError = useHandleServerError()
  const { successToast } = useToast()

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      if (itemId) {
        await updateGroupProductFn(
          convertFormToGroupProduct({
            ...values,
            brandId
          }) as TUpdateGroupProductRequestParams
        )
        queryClient.invalidateQueries({
          queryKey: [getGroupProductByIdApi.queryKey, itemId as string]
        })
      } else {
        await addGroupProductFn(
          convertFormToGroupProduct({
            ...values,
            brandId
          })
        )
        navigate(routesConfig[Routes.GROUP_PRODUCT].getPath())
      }
    } catch (error) {
      handleServerError({
        error,
        form
      })
    }
  }

  useEffect(() => {
    if (groupProduct?.data) {
      form.reset(convertGroupProductToForm(groupProduct.data))
    }
  }, [groupProduct?.data, form])

  return (
    <>
      {isGettingGroupProduct && <LoadingContentLayer />}
      {itemId && (
        <Alert variant={groupProduct?.data.status === GroupProductStatusEnum.ACTIVE ? 'success' : 'warning'}>
          <div className='flex items-center gap-2'>
            <Siren className='size-4' />
            <div className='flex flex-col'>
              <AlertTitle className='flex items-center gap-2'>
                {groupProduct?.data.status === GroupProductStatusEnum.ACTIVE ? (
                  <span className='p-0.5 px-2 rounded-lg border border-green-300 bg-green-400 text-green-600'>
                    Active
                  </span>
                ) : (
                  <span className='p-0.5 px-2 rounded-lg border border-yellow-300 bg-yellow-400 text-yellow-600'>
                    Inactive
                  </span>
                )}
                <span className='font-bold uppercase text-xs'>status</span>
              </AlertTitle>

              <AlertDescription>
                {groupProduct?.data.status === GroupProductStatusEnum.ACTIVE
                  ? 'This group product is currently active and can be viewed by your customers. If you want to make any changes, please inactivate it first.'
                  : 'This group product is currently inactive and cannot be viewed by your customers.'}
              </AlertDescription>
            </div>
          </div>
        </Alert>
      )}

      <Card className={'h-min flex items-center align-center max-w-full py-4 px-4 dark:border-zinc-800'}>
        <div className='flex gap-4 items-center justify-between w-full flex-wrap'>
          {!itemId && (
            <div>
              <h1 className='text-2xl font-bold dark:text-white flex items-center gap-2'>
                <TicketPlus size={28} strokeWidth={3} absoluteStrokeWidth />
                <span>Add Group Product</span>
              </h1>
              <p className='text-muted-foreground'>
                You are about to add a group product. Please fill out the form below.
              </p>
            </div>
          )}
          {itemId && (
            <div>
              <h1 className='text-2xl font-bold dark:text-white flex items-center gap-2'>
                <TicketPlus size={28} strokeWidth={3} absoluteStrokeWidth />
                <div className='flex items-center gap-2 flex-nowrap'>
                  <span>Edit Group Product</span>
                  <span>
                    <span className='text-primary max-lg:text-sm truncate w-[100px]'>#{groupProduct?.data?.id}</span>
                  </span>
                </div>
              </h1>
              <p className='text-muted-foreground'>
                {groupProduct?.data?.status === GroupProductStatusEnum.ACTIVE
                  ? 'If you want to make any changes, please inactivate it first.'
                  : 'This group product is currently inactive and cannot be viewed by your customers.'}
              </p>
            </div>
          )}
          {itemId && (
            <Button
              variant={'secondary'}
              className='uppercase font-light shadow-lg'
              size={'sm'}
              loading={isTogglingGroupProductStatus}
              onClick={() => {
                toggleGroupProductStatusFn(itemId)
              }}
            >
              {groupProduct?.data.status === GroupProductStatusEnum.ACTIVE ? (
                <Rocket className='rotate-90' />
              ) : (
                <Rocket />
              )}
              {groupProduct?.data.status === GroupProductStatusEnum.ACTIVE ? 'Inactivate group' : 'Activate group'}
            </Button>
          )}
        </div>
      </Card>

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
                <Boxes />
                Group Product Details
              </CardTitle>
              <CardDescription>
                Configure the group product campaign details. This will be displayed on the dashboard.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className='gap-4 grid grid-flow-row grid-cols-1 sm:grid-cols-2'>
                <FormField
                  control={form.control}
                  name='name'
                  render={({ field }) => {
                    return (
                      <FormItem>
                        <FormLabel required>Name Of Group Product</FormLabel>
                        <Input {...field} placeholder={`e.g. "Mystery box"`} />
                        <FormDescription>
                          This is the name that will be displayed on your group product details.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )
                  }}
                />
                <FormField
                  control={form.control}
                  name='productIds'
                  render={({ field }) => {
                    return (
                      <FormItem>
                        <FormLabel required>Products</FormLabel>
                        <SelectProduct {...field} multiple />
                        <FormDescription>
                          Select the products that will be included in this group product.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )
                  }}
                />
                <FormField
                  control={form.control}
                  name='description'
                  render={({ field }) => (
                    <FormItem className='col-span-1 sm:col-span-2'>
                      <FormLabel>Description Of Group Product</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder='
                         e.g. Invite your friends to join this group and get a special discount. The more friends you invite, the bigger the discount you will get.
                        '
                          {...field}
                          rows={5}
                        />
                      </FormControl>
                      <FormDescription>
                        This is the description that will be displayed on your group product details.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className='col-span-1 sm:col-span-2 gap-4 grid grid-flow-row grid-cols-1 sm:grid-cols-2'>
                  <FormField
                    control={form.control}
                    name={`maxAmountOption.hasMaxBuyAmount`}
                    render={({ field }) => (
                      <FormItem
                        className={cn(!form.watch('maxAmountOption.hasMaxBuyAmount') && 'col-span-1 sm:col-span-2')}
                      >
                        <FormLabel required>Enable Maximum Buy Amount ?</FormLabel>
                        <FormControl>
                          <Switch checked={field.value} onCheckedChange={field.onChange} className='' />
                        </FormControl>
                        <FormDescription>
                          If enabled, this will allow you to set the maximum buy amount for this group product.
                        </FormDescription>
                      </FormItem>
                    )}
                  />

                  {form.watch('maxAmountOption.hasMaxBuyAmount') && (
                    <FormField
                      control={form.control}
                      shouldUnregister
                      name='maxAmountOption.maxBuyAmountEachPerson'
                      render={({ field }) => {
                        return (
                          <FormItem>
                            <FormLabel required>Maximum Buy Amount Each Person</FormLabel>
                            <Input {...field} placeholder={`e.g. 10`} type='quantity' />
                            <FormDescription>
                              This is the maximum amount that each person can buy for this group product.
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )
                      }}
                    />
                  )}
                </div>

                {/* <div className='col-span-1 sm:col-span-2 gap-4 grid grid-flow-row grid-cols-1 sm:grid-cols-2'>
                  <FormField
                    control={form.control}
                    shouldUnregister
                    name={`startTimeOption.hasStartTime`}
                    render={({ field }) => (
                      <FormItem
                        className={cn(!form.watch('startTimeOption.hasStartTime') && 'col-span-1 sm:col-span-2')}
                      >
                        <FormLabel required>Schedule Start Time?</FormLabel>
                        <FormControl>
                          <Switch checked={field.value} onCheckedChange={field.onChange} className='' />
                        </FormControl>
                        <FormDescription>
                          If enabled, this will allow you to schedule the start time of your group product.
                        </FormDescription>
                      </FormItem>
                    )}
                  />
                  {form.watch('startTimeOption.hasStartTime') && (
                    <FormField
                      shouldUnregister
                      control={form.control}
                      name='startTimeOption.startTime'
                      render={({ field, formState }) => {
                        return (
                          <FormItem>
                            <FormLabel required>Start Time</FormLabel>
                            <FlexDatePicker
                              showTime
                              onlyFutureDates
                              field={field}
                              formState={{
                                ...formState,
                                ...form
                              }}
                            />
                            <FormDescription>
                              This is the start time that will be displayed on your group product details.
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )
                      }}
                    />
                  )}
                </div>
                <div className='col-span-1 sm:col-span-2 gap-4 grid grid-flow-row grid-cols-1 sm:grid-cols-2'>
                  <FormField
                    control={form.control}
                    name={`endTimeOption.hasEndTime`}
                    render={({ field }) => (
                      <FormItem className={cn(!form.watch('endTimeOption.hasEndTime') && 'col-span-1 sm:col-span-2')}>
                        <FormLabel required>Schedule End Time?</FormLabel>
                        <FormControl>
                          <Switch checked={field.value} onCheckedChange={field.onChange} className='' />
                        </FormControl>
                        <FormDescription>
                          If enabled, this will allow you to schedule the end time of your group product.
                        </FormDescription>
                      </FormItem>
                    )}
                  />
                  {form.watch('endTimeOption.hasEndTime') && (
                    <FormField
                      control={form.control}
                      name='endTimeOption.endTime'
                      render={({ field, formState }) => {
                        return (
                          <FormItem>
                            <FormLabel required>End Time</FormLabel>
                            <FlexDatePicker
                              showTime
                              onlyFutureDates
                              field={field}
                              formState={{
                                ...formState,
                                ...form
                              }}
                            />
                            <FormDescription>
                              This is the end time that will be displayed on your group product details.
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )
                      }}
                    />
                  )}
                </div> */}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className='flex items-center gap-1'>
                <Tickets />
                Voucher Strategy
              </CardTitle>
              <CardDescription>
                Configure the voucher strategy for your group product. This will be displayed on the dashboard.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className='w-full'>
                <VoucherThresholds form={form} />
              </div>
            </CardContent>
          </Card>
          <div className='flex items-center justify-end'>
            {(!itemId || groupProduct?.data.status !== GroupProductStatusEnum.ACTIVE) && (
              <Button type='submit' form={`form-${id}`} loading={form.formState.isSubmitting}>
                <SaveIcon />
                Save Group Product
              </Button>
            )}
          </div>
        </form>
      </Form>
    </>
  )
}

export default GroupProductDetails
