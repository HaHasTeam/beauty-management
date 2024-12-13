import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useId } from 'react'
import { UseFormReturn } from 'react-hook-form'
import { LuSaveAll } from 'react-icons/lu'
import { useNavigate } from 'react-router-dom'
import { z } from 'zod'
import { useShallow } from 'zustand/react/shallow'

import Button from '@/components/button'
import CardSection from '@/components/card-section'
import { FlexDatePicker } from '@/components/flexible-date-picker/FlexDatePicker'
import FormLabel from '@/components/form-label'
import { Form, FormControl, FormDescription, FormField, FormItem, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { Routes, routesConfig } from '@/configs/routes'
import useHandleServerError from '@/hooks/useHandleServerError'
import { useToast } from '@/hooks/useToast'
import { createVoucherApi, getAllVouchersApi } from '@/network/apis/voucher'
import { voucherCreateSchema } from '@/schemas'
import { useStore } from '@/stores/store'
import { TVoucher } from '@/types/voucher'

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

  const { successToast } = useToast()
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const id = useId()
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
        status: values.status,
        amount: values.amount,
        startTime: new Date(values.startTime),
        endTime: new Date(values.endTime),
        brandId: userData?.brands?.length ? userData.brands[0].id : ''
      }
      await createVoucherMutation(formatData)
    } catch (error) {
      handleServerError({
        error,
        form
      })
    }
  }
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
                      <FormControl className='min-h-[50px] w-full px-4 py-3 focus:outline-0 dark:placeholder:text-zinc-400'>
                        <SelectTrigger>
                          <SelectValue placeholder='Select voucher type' />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {[
                          { id: 1, value: 'GROUP_BUYING' },
                          {
                            id: 2,
                            value: 'NORMAL'
                          }
                        ].map((item) => (
                          <SelectItem key={item.id} value={item.value}>
                            {item.value}
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
                      <Input
                        className='min-h-[50px] px-4 py-3 focus:outline-0 dark:placeholder:text-zinc-400'
                        placeholder='
            Điền tên mã giảm giá
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
                name='code'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel required>Mã Giảm giá</FormLabel>
                    <FormControl>
                      <Input
                        className='min-h-[50px] w-full px-4 py-3 focus:outline-0 dark:placeholder:text-zinc-400'
                        placeholder='Code'
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className='flex gap-2'>
                <Label>Thời gian hiệu lực</Label>
                <div className='grid gap-4 grid-cols-2 max-w-lg'>
                  <FormField
                    control={form.control}
                    name='startTime'
                    render={({ field, formState }) => {
                      return (
                        <FormItem className='flex flex-col'>
                          {/* <FormLabel required>Thời gian hiệu lực bắt đầu</FormLabel> */}
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
                          {/* <FormLabel required>Thời gian hiệu lực kết thúc</FormLabel> */}
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
              </div>
            </div>
          </CardSection>
          <CardSection title={'Thiết lập mã giảm giá'} description='Please fill all information'>
            <div className='grid gap-4 grid-cols-2'>
              <FormField
                control={form.control}
                name='discountValue'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel required>Số tiền giảm giá</FormLabel>
                    <FormControl>
                      <Input
                        className='min-h-[50px] w-full px-4 py-3 focus:outline-0 dark:placeholder:text-zinc-400'
                        placeholder='Discount Value'
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name='maxDiscount'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Giảm giá tối đa</FormLabel>
                    <FormControl>
                      <Input
                        className='min-h-[50px] w-full px-4 py-3 focus:outline-0 dark:placeholder:text-zinc-400'
                        placeholder='Max Discount'
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='minOrderValue'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Giá trị đơn hàng tối thiểu</FormLabel>
                    <FormControl>
                      <Input
                        className='min-h-[50px] w-full px-4 py-3 focus:outline-0 dark:placeholder:text-zinc-400'
                        placeholder='Min Order Value'
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='amount'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Số lượng mã</FormLabel>
                    <FormControl>
                      <Input
                        className='min-h-[50px] w-full px-4 py-3 focus:outline-0 dark:placeholder:text-zinc-400'
                        placeholder='Amount'
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name='discountType'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel required>Loại giảm giá</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl className='min-h-[50px] w-full px-4 py-3 focus:outline-0 dark:placeholder:text-zinc-400'>
                        <SelectTrigger>
                          <SelectValue placeholder='Select discount type' />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {[
                          { id: 1, value: 'PERCENTAGE' },
                          {
                            id: 2,
                            value: 'AMOUNT'
                          }
                        ].map((item) => (
                          <SelectItem key={item.id} value={item.value}>
                            {item.value}
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
                name='description'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea placeholder='description' className='resize-none' {...field} />
                      {/* <Input
                        className='min-h-[50px] w-full px-4 py-3 focus:outline-0 dark:placeholder:text-zinc-400'
                        placeholder='
                 description
                    '
                        {...field}
                      /> */}
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </CardSection>
        </form>
      </Form>
    </>
  )
}

export default VoucherForm
