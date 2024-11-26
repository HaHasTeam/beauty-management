import { format } from 'date-fns'
import { CalendarIcon } from 'lucide-react'
import { Dispatch, SetStateAction, useState } from 'react'

import FormSelect from '@/components/form-select'
import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import { Input } from '@/components/ui/input'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { cn } from '@/lib/utils'
import { IOption } from '@/types/option'
import { IFormValues } from '@/types/productForm'
import { productFormDetailFields } from '@/variables/productFormDetailFields'

interface DetailInformationProps {
  formValues: IFormValues
  setFormValues: Dispatch<SetStateAction<IFormValues>>
}
export default function DetailInformation({ formValues, setFormValues }: DetailInformationProps) {
  const MAX_MULTI_SELECT_ITEMS = 5
  const [date, setDate] = useState<Date>()

  const handleChange = (fieldId: string, value: IOption[] | string) => {
    setFormValues(
      (prevValues: IFormValues): IFormValues => ({
        ...prevValues,
        [fieldId]: value ?? (Array.isArray(value) ? [] : '')
      })
    )
  }

  return (
    <div className='w-full p-4 lg:p-6 bg-white rounded-lg shadow-md space-y-4'>
      <div className='mb-6 flex items-center justify-between'>
        <h2 className='text-lg font-semibold'>Thông tin chi tiết</h2>
        <span className='text-sm text-muted-foreground'>
          Hoàn thành: {Object.keys(formValues).length} / {productFormDetailFields.length}
        </span>
      </div>

      <div className='grid grid-cols-2 gap-6'>
        {productFormDetailFields.map((field) => (
          <div key={field.id} className='space-y-2'>
            <div className='flex gap-1 justify-between items-center'>
              <label className='text-sm'>{field.label}</label>
              {field.type === 'multiselect' && (
                <span className='text-xs text-muted-foreground text-right'>
                  {Array.isArray(formValues[field.id]) ? formValues[field.id]?.length : 0}/{MAX_MULTI_SELECT_ITEMS}
                </span>
              )}
            </div>
            {field.type === 'select' && (
              <FormSelect
                fieldId={field?.id}
                placeholder={'Vui lòng chọn'}
                emptyText={'Không có kết quả'}
                items={field?.options ?? []}
                inputPlaceholder={'Nhập vào'}
                buttonText={'Thêm thuộc tính mới'}
                type='select'
                handleChange={handleChange}
              />
            )}
            {field.type === 'multiselect' && (
              <FormSelect
                fieldId={field?.id}
                placeholder={'Vui lòng chọn'}
                emptyText={'Không có kết quả'}
                items={field?.options ?? []}
                inputPlaceholder={'Nhập vào'}
                buttonText={'Thêm thuộc tính mới'}
                type='multiselect'
                maxMultiSelectItems={MAX_MULTI_SELECT_ITEMS}
                handleChange={handleChange}
              />
            )}
            {field.type === 'input' && (
              <Input
                className='border-primary/40'
                placeholder={field.placeholder}
                onChange={(e) => handleChange(field?.id, e.target.value)}
              />
            )}
            {field.type === 'date' && (
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant={'outline'}
                    className={cn('w-full justify-start text-left font-normal', !date && 'text-muted-foreground')}
                  >
                    <CalendarIcon className='mr-2 h-4 w-4' />
                    {date ? format(date, 'PPP') : 'Chọn ngày'}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className='w-auto p-0'>
                  <Calendar
                    mode='single'
                    selected={date}
                    onSelect={setDate}
                    initialFocus
                    onDayClick={() => handleChange(field?.id, date?.toISOString() ?? '')}
                  />
                </PopoverContent>
              </Popover>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
