import { useMutation, useQueryClient } from '@tanstack/react-query'
import { Banknote, Info, Percent, Siren, TicketPercent, Wand2 } from 'lucide-react'
import { useId } from 'react'
import type { UseFormReturn } from 'react-hook-form'
import { LuSaveAll } from 'react-icons/lu'
import { useNavigate } from 'react-router-dom'
import type { z } from 'zod'
import { useShallow } from 'zustand/react/shallow'

import Button from '@/components/button'
import { FlexDatePicker } from '@/components/flexible-date-picker/FlexDatePicker'
import FormLabel from '@/components/form-label'
import { Alert, AlertAction, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { buttonVariants } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import { Textarea } from '@/components/ui/textarea'
import { Routes, routesConfig } from '@/configs/routes'
import useGrant from '@/hooks/useGrant'
import useHandleServerError from '@/hooks/useHandleServerError'
import { useToast } from '@/hooks/useToast'
import { cn } from '@/lib/utils'
import { createVoucherApi, getAllVouchersApi, getVoucherByIdApi, updateVoucherByIdApi } from '@/network/apis/voucher'
import { voucherCreateSchema } from '@/schemas'
import { useStore } from '@/stores/store'
import {
  DiscountTypeEnum,
  discountTypeEnumArray,
  RoleEnum,
  StatusEnum,
  VoucherEnum,
  VoucherVisibilityEnum
} from '@/types/enum'
import type { TVoucher } from '@/types/voucher'
import { generateMeaningfulCode } from '@/utils'

import VoucherProductsCard from './VoucherProductsSection'

function VoucherForm({
  voucherData,
  form
}: {
  voucherData?: TVoucher
  form: UseFormReturn<z.infer<typeof voucherCreateSchema>>
}) {
  const { userData } = useStore(
    useShallow((state) => ({
      userData: state.user
    }))
  )

  // Function to convert formatted currency back to number

  const { successToast } = useToast()
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const id = useId()
  const { mutateAsync: updateVoucherMutation, isPending: isUpdating } = useMutation({
    mutationKey: [updateVoucherByIdApi.mutationKey, voucherData?.id],
    mutationFn: updateVoucherByIdApi.fn,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [getVoucherByIdApi.queryKey, voucherData?.id] })
      successToast({ message: ' Update successfully.' })
    }
  })
  const { mutateAsync: createVoucherMutation } = useMutation({
    mutationKey: [createVoucherApi.mutationKey],
    mutationFn: createVoucherApi.fn,
    onSuccess: () => {
      form.reset()
      queryClient.invalidateQueries({ queryKey: [getAllVouchersApi.queryKey] })

      navigate(routesConfig[Routes.VOUCHER].getPath())

      successToast({ message: 'Create Voucher has been successfully completed.' })
    }
  })

  const handleServerError = useHandleServerError()
  async function onSubmit(values: z.infer<typeof voucherCreateSchema>) {
    try {
      const formatData = {
        name: values.name,
        code: values.code,
        type: VoucherEnum.NORMAL,
        discountType: values.discountType,
        discountValue: values.discountValue,
        maxDiscount: values.maxDiscount,
        minOrderValue: values.minOrderValue,
        description: values.description,
        status: values.status ? StatusEnum.ACTIVE : StatusEnum.INACTIVE,
        amount: values.amount,
        startTime: values.startTime,
        endTime: values.endTime,
        brandId: userData?.brands?.length ? userData.brands[0].id : '',
        applyProductIds: values.selectedProducts,
        applyType: values.applyType,
        visibility: values.visibility ? VoucherVisibilityEnum.PUBLIC : VoucherVisibilityEnum.WALLET
      }

      if (voucherData) {
        await updateVoucherMutation({
          id: voucherData.id,
          ...formatData
        })
      } else {
        await createVoucherMutation({
          ...formatData
        })
      }
    } catch (error) {
      handleServerError({
        error,
        form
      })
    }
  }

  const handleChangeStatus = async (status: StatusEnum) => {
    try {
      await updateVoucherMutation({
        id: voucherData?.id || '',
        status: status
      })
      queryClient.invalidateQueries({
        queryKey: [getVoucherByIdApi.queryKey, id as string]
      })
    } catch (error) {
      handleServerError({
        error,
        form
      })
    }
  }
  const isGrant = useGrant([RoleEnum.ADMIN, RoleEnum.MANAGER, RoleEnum.STAFF, RoleEnum.OPERATOR])

  const getHeader = () => {
    if (!id) return null
    switch (voucherData?.status) {
      case StatusEnum.ACTIVE:
        return (
          <Alert variant={'success'}>
            <div className='flex items-center gap-2'>
              <Siren className='size-4' />
              <div>
                <AlertTitle className='flex items-center gap-2'>
                  <span className='p-0.5 px-2 rounded-lg border border-green-300 bg-green-400 text-white'>Active</span>
                  <span className='font-bold uppercase text-xs'>status</span>
                </AlertTitle>
                <AlertDescription>This voucher is currently active and visible to your customers.</AlertDescription>
              </div>
            </div>
            {isGrant ? (
              <AlertAction
                onClick={() => {
                  handleChangeStatus(StatusEnum.INACTIVE)
                }}
                loading={isUpdating}
                variant={'default'}
              >
                {'Close voucher'}
              </AlertAction>
            ) : null}
          </Alert>
        )
      case StatusEnum.INACTIVE:
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
                  This voucher is currently inactive and not visible to your customers.
                </AlertDescription>
              </div>
            </div>
            {isGrant ? (
              <AlertAction
                onClick={() => {
                  handleChangeStatus(StatusEnum.ACTIVE)
                }}
                loading={isUpdating}
                variant={'success'}
              >
                {'Open voucher'}
              </AlertAction>
            ) : null}
          </Alert>
        )

      default:
        return null
    }
  }
  return (
    <>
      {getHeader()}
      <Form {...form}>
        <form
          noValidate
          onSubmit={form.handleSubmit(onSubmit)}
          className='w-full flex-col gap-8 flex'
          id={`form-${id}`}
        >
          {/* Card 1: Basic Information */}
          <Card>
            <CardHeader>
              <CardTitle className='flex items-center gap-2'>
                <Info /> Basic Information
              </CardTitle>
            </CardHeader>
            <CardContent className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
              {/* Name */}
              <FormField
                control={form.control}
                name='name'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel required>Name of voucher program</FormLabel>
                    <FormControl>
                      <Input placeholder='eg. Allure Voucher' {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Combined Code and Visibility Field */}
              <FormItem>
                <div className='flex justify-between items-center'>
                  <FormLabel required className='mb-0'>
                    Voucher code & Visibility
                  </FormLabel>
                  <button
                    type='button'
                    onClick={() => {
                      const random = generateMeaningfulCode('ALLURE').toUpperCase()
                      form.setValue('code', random)
                      form.clearErrors('code')
                    }}
                    className={cn(buttonVariants({ variant: 'link', size: 'sm' }), 'p-0 h-fit flex items-center')}
                  >
                    Generate Code <Wand2 className='ml-1 h-4 w-4' />
                  </button>
                </div>
                <div className='flex w-full'>
                  {/* Code Input Part */}
                  <FormField
                    control={form.control}
                    name='code'
                    render={({ field }) => (
                      <FormControl>
                        <Input
                          placeholder='e.g. ALLURE-ABC123'
                          {...field}
                          onChange={(e) => {
                            field.onChange(e.target.value.toUpperCase())
                          }}
                          className='rounded-r-none focus-visible:ring-offset-0 flex-1' // Adjusted styling
                        />
                      </FormControl>
                    )}
                  />
                  {/* Visibility Addon Part */}
                  <FormField
                    control={form.control}
                    name='visibility'
                    render={({ field }) => (
                      <div
                        className={cn(
                          'flex items-center w-fit rounded-md rounded-l-none border border-l-0 border-input bg-background px-3 py-2 text-sm gap-2',
                          'ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2'
                        )}
                      >
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                            id={`visibility-checkbox-${id}`}
                          />
                        </FormControl>
                        <FormLabel
                          htmlFor={`visibility-checkbox-${id}`}
                          className='mb-0 whitespace-nowrap cursor-pointer'
                        >
                          Public
                        </FormLabel>
                      </div>
                    )}
                  />
                </div>
                {/* Message for Code Field */}
                <FormField
                  control={form.control}
                  name='code' // Show message linked to the code input
                  render={() => <FormMessage className='mt-1.5' />} // Add margin top
                />
              </FormItem>

              <FormField
                control={form.control}
                name='startTime'
                render={({ field, formState }) => {
                  return (
                    <FormItem className='flex flex-col'>
                      <FormLabel required>Start time</FormLabel>
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
                    <FormItem className='flex flex-col'>
                      <FormLabel required>End time</FormLabel>
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
            </CardContent>
          </Card>

          {/* Card 2: Discount Settings */}
          <Card>
            <CardHeader>
              <CardTitle className='flex items-center gap-2'>
                <TicketPercent /> Discount Settings
              </CardTitle>
            </CardHeader>
            <CardContent className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
              {/* Combined Discount Type Select and Discount Value Input */}
              <div className='col-span-2 flex gap-4 items-center'>
                <FormField
                  control={form.control}
                  name='discountValue' // Outer field controls the value
                  render={({ field: discountValueField }) => (
                    <FormItem className='flex-1'>
                      <FormLabel required>Discount value</FormLabel>
                      {/* Inner field controls the type and resets value on change */}
                      <FormField
                        control={form.control}
                        name='discountType'
                        render={({ field: discountTypeField }) => {
                          const discountType = discountTypeField.value as DiscountTypeEnum
                          return (
                            <div className='flex w-full items-start'>
                              {' '}
                              {/* Use items-start for alignment with potential message */}
                              {/* Left Part: Select Discount Type */}
                              <Select
                                value={discountTypeField.value}
                                onValueChange={(value) => {
                                  discountTypeField.onChange(value)
                                  // Reset discount value when changing type
                                  form.setValue('discountValue', 0)
                                  form.clearErrors('discountValue')
                                }}
                              >
                                <FormControl>
                                  <SelectTrigger
                                    className={cn(
                                      'inline-flex items-center rounded-none rounded-l-lg border border-input disabled:cursor-not-allowed disabled:opacity-50 h-10 px-3',
                                      'whitespace-nowrap' // Prevent wrapping
                                    )}
                                    style={{ width: 'auto' }} // Auto width based on content
                                  >
                                    <SelectValue placeholder='Type' />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  {discountTypeEnumArray.map((item) => (
                                    <SelectItem key={item.id} value={item.value}>
                                      <div className='flex items-center gap-1.5'>
                                        {item.value === DiscountTypeEnum.PERCENTAGE ? (
                                          <Percent className='h-4 w-4' />
                                        ) : (
                                          <Banknote className='h-4 w-4' />
                                        )}
                                        {/* Optional: Keep text if needed {item.label} */}
                                      </div>
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                              {/* Right Part: Input Discount Value */}
                              <FormControl>
                                <Input
                                  className='-ms-px rounded-s-none shadow-none flex-1 h-10 focus-visible:ring-offset-0' // Adjusted styling
                                  placeholder={`${discountType === DiscountTypeEnum.AMOUNT ? 'eg. 100,000' : 'eg. 10'}`}
                                  {...discountValueField}
                                  type={discountType === DiscountTypeEnum.AMOUNT ? 'currency' : 'percentage'}
                                  // Keep the original onChange if needed for formatting, or use the default field.onChange
                                />
                              </FormControl>
                            </div>
                          )
                        }}
                      />
                      {/* Message for value validation */}
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Row for Discount Value and Max Discount - Original discountValue field removed */}
                <div className='flex gap-4 items-center flex-1'>
                  {form.watch('discountType') == DiscountTypeEnum.PERCENTAGE && (
                    <FormField
                      control={form.control}
                      name='maxDiscount'
                      render={({ field }) => (
                        <FormItem className='flex-1'>
                          <FormLabel>Max discount</FormLabel>
                          <FormControl>
                            <Input type='currency' placeholder='eg. 100,000' {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  )}
                  <FormField
                    control={form.control}
                    name='amount'
                    render={({ field }) => (
                      <FormItem className='flex-1'>
                        <FormLabel>Limit quantity</FormLabel>
                        <FormControl>
                          <Input type='number' {...field} placeholder='eg. 100' symbol='mã' />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              {/* Min Order Value Type Radio - Replaced with Switch + Conditional Input */}
              <div className='col-span-1 sm:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4 items-start'>
                <FormField
                  control={form.control}
                  name='orderValueType'
                  render={({ field }) => (
                    <FormItem className={cn('flex flex-col', field.value !== 'limited' && 'col-span-1 sm:col-span-2')}>
                      {' '}
                      {/* Span full if off */}
                      <FormLabel>Limit minimum order value?</FormLabel>
                      <FormControl>
                        {/* Replace RadioGroup with Switch */}
                        <Switch
                          checked={field.value === 'limited'}
                          onCheckedChange={(checked) => {
                            const newValue = checked ? 'limited' : 'noLimit'
                            field.onChange(newValue)
                            if (!checked) {
                              // Clear minOrderValue when disabling the limit
                              form.setValue('minOrderValue', undefined)
                              form.clearErrors('minOrderValue')
                            }
                          }}
                        />
                      </FormControl>
                      <FormMessage /> {/* Message for the switch itself, if any */}
                    </FormItem>
                  )}
                />

                {/* Min Order Value Input (Conditional) */}
                {form.watch('orderValueType') === 'limited' && (
                  <FormField
                    control={form.control}
                    name='minOrderValue'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel required>Minimum order value</FormLabel>
                        <FormControl>
                          <Input {...field} type='currency' placeholder='eg. 100,000' />
                        </FormControl>
                        {/* Removed FormDescription for recommendation */}
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}
              </div>

              {/* Description */}
              <FormField
                control={form.control}
                name='description'
                render={({ field }) => (
                  <FormItem className='col-span-1 sm:col-span-2'>
                    <FormLabel>Description Of Voucher</FormLabel>
                    <FormControl>
                      <Textarea rows={3} placeholder='eg. Discount 10% for all products in the store' {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          {/* Product Applicability Card */}
          <VoucherProductsCard form={form} />

          {/* Save Button - Moved to the end */}
          {isGrant ? (
            <div className='flex justify-end mt-4'>
              <Button
                type='submit'
                className='flex gap-2 items-center'
                form={`form-${id}`}
                loading={form.formState.isSubmitting}
              >
                <LuSaveAll />
                <span>{voucherData ? 'Update Voucher' : 'Create Voucher'}</span>
              </Button>
            </div>
          ) : null}
        </form>
      </Form>
    </>
  )
}

export default VoucherForm
