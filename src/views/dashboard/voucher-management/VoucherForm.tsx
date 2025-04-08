import { useMutation, useQueryClient } from '@tanstack/react-query'
import { Info } from 'lucide-react'
import { useEffect, useId, useState } from 'react'
import type { UseFormReturn } from 'react-hook-form'
import { LuSaveAll } from 'react-icons/lu'
import { useNavigate } from 'react-router-dom'
import type { z } from 'zod'
import { useShallow } from 'zustand/react/shallow'

import Button from '@/components/button'
import CardSection from '@/components/card-section'
import { FlexDatePicker } from '@/components/flexible-date-picker/FlexDatePicker'
import FormLabel from '@/components/form-label'
import { buttonVariants } from '@/components/ui/button'
import { Form, FormControl, FormDescription, FormField, FormItem, FormMessage } from '@/components/ui/form'
import { InputNormal } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import { Textarea } from '@/components/ui/textarea'
import { Routes, routesConfig } from '@/configs/routes'
import useHandleServerError from '@/hooks/useHandleServerError'
import { useToast } from '@/hooks/useToast'
import { cn } from '@/lib/utils'
import { createVoucherApi, getAllVouchersApi, getVoucherByIdApi, updateVoucherByIdApi } from '@/network/apis/voucher'
import { voucherCreateSchema } from '@/schemas'
// import { voucherCreateSchema } from '@/schemas'
// import type { voucherCreateSchema } from '@/schemas'
import { useStore } from '@/stores/store'
import {
  DiscountTypeEnum,
  discountTypeEnumArray,
  StatusEnum,
  voucherEnumArray,
  VoucherVisibilityEnum
} from '@/types/enum'
import type { TVoucher } from '@/types/voucher'
import { generateCouponCode } from '@/utils'

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
  function formatCurrency(value: string) {
    const number = value.replace(/\D/g, '')
    return number.replace(/\B(?=(\d{3})+(?!\d))/g, '.')
  }

  // Function to convert formatted currency back to number
  function parseCurrency(value: string): number {
    return Number.parseInt(value.replace(/\./g, ''), 10) || 0
  }

  const { successToast } = useToast()
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const id = useId()

  const { mutateAsync: updateVoucherMutation } = useMutation({
    mutationKey: [updateVoucherByIdApi.mutationKey, voucherData?.id],
    mutationFn: updateVoucherByIdApi.fn,
    onSuccess: () => {
      navigate(routesConfig[Routes.VOUCHER].getPath())
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
        type: values.type,
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
  const orderValueType = form.watch('orderValueType')
  const [displayValue, setDisplayValue] = useState<string>('')

  useEffect(() => {
    if (form.getValues('minOrderValue')) {
      setDisplayValue(formatCurrency(form.getValues('minOrderValue')?.toString() || ''))
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [form.getValues('minOrderValue')])
  return (
    <>
      <Form {...form}>
        <form
          noValidate
          onSubmit={form.handleSubmit(onSubmit)}
          className='w-full flex-col gap-8 flex'
          id={`form-${id}`}
        >
          <CardSection
            title={'Thông tin cơ bản'}
            description='Please fill all information'
            rightComponent={
              <Button
                type='submit'
                className='flex gap-2 items-center'
                form={`form-${id}`}
                loading={form.formState.isSubmitting}
              >
                <LuSaveAll />
                <span>{voucherData ? 'Update Voucher' : 'Create Voucher'}</span>
              </Button>
            }
          >
            <div className='grid gap-4 grid-cols-1'>
              <FormField
                control={form.control}
                name='type'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel required>Loại voucher</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder='Select voucher type' />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {voucherEnumArray.map((item) => (
                          <SelectItem key={item.id} value={item.value}>
                            {item.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>

                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name='name'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel required>Tên chương trình giảm giá</FormLabel>
                    <FormControl>
                      <InputNormal placeholder='Điền tên mã giảm giá' {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='code'
                render={({ field }) => (
                  <FormItem>
                    <div className='flex justify-between'>
                      <FormLabel required>Mã Giảm giá</FormLabel>
                      <button
                        type='button'
                        onClick={() => {
                          const random = generateCouponCode()
                          form.setValue('code', random)
                        }}
                        className={cn(buttonVariants({ variant: 'link' }), 'p-0 w-fit h-fit')}
                      >
                        tạo mã bất kỳ <Info />
                      </button>
                    </div>
                    <FormControl>
                      <InputNormal placeholder='Code' {...field} />
                    </FormControl>
                    <FormMessage />
                    <FormDescription>Chỉ bao gồm từ 5 - 10 ký tự thường và chữ số.</FormDescription>
                  </FormItem>
                )}
              />

              {/* <Label>Thời gian hiệu lực</Label> */}
              <div className='grid gap-4 grid-cols-2 '>
                <FormField
                  control={form.control}
                  name='startTime'
                  render={({ field, formState }) => {
                    return (
                      <FormItem className='flex flex-col'>
                        <FormLabel required>Thời gian bắt đầu</FormLabel>
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
                          This is the start time that will be displayed on your voucher details.
                        </FormDescription>
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
                        <FormLabel required>Thời gian kết thúc</FormLabel>
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
                          This is the end time that will be displayed on your voucher details.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )
                  }}
                />
              </div>
              {/* <FormField
                control={form.control}
                name='visibility'
                render={({ field }) => (
                  <FormItem className='flex gap-2 items-center'>
                    <FormLabel>Chế độ hiển thị</FormLabel>
                    <div className=''>
                      <div className='flex gap-2 items-center mb-1'>
                        <FormControl>
                          <Switch checked={field.value} onCheckedChange={field.onChange} />
                        </FormControl>
                        <span className='text-[0.8rem] text-muted-foreground'>Công Khai</span>
                      </div>
                      <FormDescription>
                        Mã giảm giá được hiện trong trang chi tiết sản phẩm và cho tất cả các khách hàng.
                      </FormDescription>
                    </div>
                  </FormItem>
                )}
              /> */}
              <FormField
                control={form.control}
                name='visibility'
                render={({ field }) => (
                  <FormItem className='flex flex-row items-center justify-between rounded-lg border p-4'>
                    <div className='space-y-0.5'>
                      <FormLabel>Chế độ hiển thị</FormLabel>
                      <FormDescription>
                        Mã giảm giá được hiện trong trang chi tiết sản phẩm và cho tất cả các khách hàng.
                      </FormDescription>
                    </div>
                    <FormControl>
                      <Switch checked={field.value} onCheckedChange={field.onChange} />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>
          </CardSection>
          <CardSection title={'Thiết lập mã giảm giá'} description='Please fill all information'>
            <div className='grid gap-4 grid-cols-1'>
              <FormField
                control={form.control}
                name='discountType'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Loại giảm giá</FormLabel>
                    <FormControl>
                      <RadioGroup
                        onValueChange={(value) => {
                          field.onChange(value)
                          // Reset discount value to 0 when changing type
                          form.setValue('discountValue', 0)
                          form.clearErrors('discountValue')
                        }}
                        defaultValue={field.value}
                        className='flex flex-col sm:flex-row space-y-5 sm:space-y-0 sm:space-x-4'
                      >
                        {discountTypeEnumArray.map((item) => {
                          return (
                            <FormItem className='flex items-center space-x-3 space-y-0' key={item.id}>
                              <FormControl>
                                <RadioGroupItem value={item.value} />
                              </FormControl>
                              <FormLabel>{item.label}</FormLabel>
                            </FormItem>
                          )
                        })}
                      </RadioGroup>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name='discountValue'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel required>Giá trị giảm giá</FormLabel>
                    <FormDescription className='flex items-center gap-2'>
                      <Info className='h-4 w-4 text-primary' />
                      {form.watch('discountType') === DiscountTypeEnum.PERCENTAGE ? (
                        <span className='text-sm'>Mức đề xuất: 10%</span>
                      ) : (
                        <span className='text-sm'>Mức đề xuất: 10.000 đ</span>
                      )}
                      <button
                        type='button'
                        className='text-sm text-primary'
                        onClick={() => {
                          if (form.watch('discountType') === DiscountTypeEnum.PERCENTAGE) {
                            form.setValue('discountValue', 10)
                          } else {
                            form.setValue('discountValue', 10000)
                          }
                          form.clearErrors('discountValue')
                        }}
                      >
                        Áp dụng
                      </button>
                    </FormDescription>
                    <FormControl>
                      <div className='relative'>
                        <InputNormal
                          type='number'
                          {...field}
                          value={field.value || ''}
                          onChange={(e) => {
                            const value = e.target.valueAsNumber
                            if (form.watch('discountType') === DiscountTypeEnum.PERCENTAGE) {
                              // Validate percentage value (0-100)
                              if (isNaN(value) || value < 0 || value > 100) {
                                form.setError('discountValue', {
                                  type: 'manual',
                                  message: 'Giá trị phần trăm phải từ 0 đến 100'
                                })
                              } else {
                                form.clearErrors('discountValue')
                              }
                            }
                            field.onChange(isNaN(value) ? 0 : value)
                          }}
                          placeholder={
                            form.watch('discountType') === DiscountTypeEnum.PERCENTAGE
                              ? 'Điền phần trăm (0-100)'
                              : 'Điền số tiền'
                          }
                        />
                        {form.watch('discountType') === DiscountTypeEnum.PERCENTAGE && (
                          <span className='absolute right-3 top-1/2 -translate-y-1/2'>%</span>
                        )}
                        {form.watch('discountType') === DiscountTypeEnum.AMOUNT && (
                          <span className='absolute right-3 top-1/2 -translate-y-1/2'>đ</span>
                        )}
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {form.watch('discountType') == DiscountTypeEnum.PERCENTAGE && (
                <FormField
                  control={form.control}
                  name='maxDiscount'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Số tiền giảm giá tối đa</FormLabel>
                      <FormControl>
                        <InputNormal
                          type='number'
                          placeholder='Max Discount'
                          {...field}
                          onChange={(e) => field.onChange(e.target.valueAsNumber || 0)}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}

              {/* <FormField
                control={form.control}
                name='minOrderValue'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Giá trị đơn hàng tối thiểu</FormLabel>
                    <FormControl>
                      <InputNormal
                        className='min-h-[50px] w-full px-4 py-3 focus:outline-0 dark:placeholder:text-zinc-400'
                        placeholder='Min Order Value'
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              /> */}

              <FormField
                control={form.control}
                name='orderValueType'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Giá trị đơn hàng tối thiểu</FormLabel>
                    <FormControl>
                      <RadioGroup
                        onValueChange={(value) => {
                          field.onChange(value)
                          if (value === 'noLimit') {
                            // Clear minOrderValue when selecting "no limit"
                            form.setValue('minOrderValue', undefined)
                          }
                        }}
                        defaultValue={field.value}
                        className='flex flex-col sm:flex-row space-y-5 sm:space-y-0 sm:space-x-4'
                      >
                        <div className='flex items-center space-x-2'>
                          <RadioGroupItem value='noLimit' id='noLimit' />
                          <Label htmlFor='noLimit'>Không ràng buộc</Label>
                        </div>
                        <div className='flex items-center space-x-2'>
                          <RadioGroupItem value='limited' id='limited' />
                          <Label htmlFor='limited'>Có ràng buộc</Label>
                        </div>
                      </RadioGroup>
                    </FormControl>
                  </FormItem>
                )}
              />
              {orderValueType === 'limited' && (
                <FormField
                  control={form.control}
                  name='minOrderValue'
                  render={({ field }) => {
                    return (
                      <FormItem>
                        <FormLabel>Giá trị tối thiểu</FormLabel>
                        <FormControl>
                          <div className='relative'>
                            <InputNormal
                              className='pr-8'
                              value={displayValue}
                              onChange={(e) => {
                                const formatted = formatCurrency(e.target.value)
                                setDisplayValue(formatted)

                                // Store the actual integer value in the form
                                const numericValue = parseCurrency(formatted)
                                field.onChange(numericValue)
                              }}
                              placeholder='Điền số tiền'
                            />
                            <span className='absolute right-3 top-1/2 -translate-y-1/2'>đ</span>
                          </div>
                        </FormControl>
                        <FormDescription className='flex items-center gap-1.5 text-xs'>
                          <Info className='h-3 w-3' />
                          Mức đề xuất: 100.000 đ
                          <button
                            type='button'
                            className='text-primary text-xs ml-1'
                            onClick={() => {
                              // Set both the display value and the actual form value
                              setDisplayValue('100.000')
                              form.setValue('minOrderValue', 100000)
                              form.clearErrors('minOrderValue')
                            }}
                          >
                            Áp dụng
                          </button>
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )
                  }}
                />
              )}

              <FormField
                control={form.control}
                name='amount'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Số lượng mã giảm giá</FormLabel>
                    <FormControl>
                      <InputNormal
                        type='number'
                        {...field}
                        onChange={(e) => field.onChange(e.target.valueAsNumber || 0)}
                        placeholder='Điền số lượng'
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name='description'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Mô Tả</FormLabel>
                    <FormControl>
                      <Textarea rows={3} placeholder='Điền mô tả' className='resize-none' {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </CardSection>
          <VoucherProductsCard form={form} />
        </form>
      </Form>
    </>
  )
}

export default VoucherForm
