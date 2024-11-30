import { UseFormReturn } from 'react-hook-form'
import { z } from 'zod'

import FormSelect from '@/components/form-select'
import { FormProductSchema, productFormDetailFields } from '@/variables/productFormDetailFields'

import { FlexDatePicker } from '../flexible-date-picker/FlexDatePicker'
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '../ui/form'
import { Input } from '../ui/input'

interface DetailInformationProps {
  form: UseFormReturn<z.infer<typeof FormProductSchema>>
  resetSignal?: boolean
}
export default function DetailInformation({ form, resetSignal }: DetailInformationProps) {
  const MAX_MULTI_SELECT_ITEMS = 5

  return (
    <div className='w-full p-4 lg:p-6 bg-white rounded-lg shadow-md space-y-4'>
      <div className='mb-6 flex items-center justify-between'>
        <h2 className='font-bold text-xl'>Thông tin chi tiết</h2>
        <span className='text-sm text-muted-foreground'>Hoàn thành: 0 / {productFormDetailFields.length}</span>
      </div>

      <div className='grid grid-cols-2 gap-6'>
        {productFormDetailFields.map((formField) => (
          <div key={formField.id} className='space-y-2'>
            <FormField
              control={form.control}
              name={`detail.${formField.id}`}
              render={({ field, formState }) => (
                <FormItem>
                  <FormLabel>
                    <div className='flex gap-1 justify-between items-center'>
                      <label className='text-sm'>{formField.label}</label>
                      {formField.type === 'multiselect' && (
                        <span className='text-xs text-muted-foreground text-right'>
                          {field?.value?.length ?? 0}/{MAX_MULTI_SELECT_ITEMS}
                        </span>
                      )}
                    </div>
                  </FormLabel>

                  {formField.type === 'select' && (
                    <FormSelect
                      fieldId={formField?.id}
                      placeholder={'Vui lòng chọn'}
                      emptyText={'Không có kết quả'}
                      items={formField?.options ?? []}
                      inputPlaceholder={'Nhập vào'}
                      buttonText={'Thêm thuộc tính mới'}
                      type='select'
                      form={form}
                      resetSignal={resetSignal}
                    />
                  )}
                  {formField.type === 'multiselect' && (
                    <FormSelect
                      fieldId={formField?.id}
                      placeholder={'Vui lòng chọn'}
                      emptyText={'Không có kết quả'}
                      items={formField?.options ?? []}
                      inputPlaceholder={'Nhập vào'}
                      buttonText={'Thêm thuộc tính mới'}
                      type='multiselect'
                      maxMultiSelectItems={MAX_MULTI_SELECT_ITEMS}
                      form={form}
                      resetSignal={resetSignal}
                    />
                  )}
                  {formField.type === 'input' && (
                    <FormControl>
                      <Input
                        className='border-primary/40'
                        placeholder={formField.placeholder}
                        {...field}
                        value={field?.value ?? ''}
                      />
                    </FormControl>
                  )}
                  {formField.type === 'date' && (
                    <FormControl>
                      <FlexDatePicker
                        onlyFutureDates
                        field={field}
                        formState={{
                          ...formState,
                          ...form
                        }}
                        buttonClassName='border border-primary/40 focus:ring-1 focus:ring-ring hover:ring-1 hover:ring-ring'
                      />
                    </FormControl>
                  )}

                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        ))}
      </div>
    </div>
  )
}
