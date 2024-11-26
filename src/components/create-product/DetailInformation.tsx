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
  const [date, setDate] = useState<Date>()

  const handleChange = (fieldId: string, value: IOption | IOption[] | string) => {
    setFormValues(
      (prevValues: IFormValues): IFormValues => ({
        ...prevValues,
        [fieldId]: value ?? (Array.isArray(value) ? [] : '')
      })
    )
  }

  return (
    <div className='w-full p-6 bg-white shadow-lg rounded-lg'>
      <div className='mb-6 flex items-center justify-between'>
        <h2 className='text-lg font-semibold'>Thông tin chi tiết</h2>
        <span className='text-sm text-muted-foreground'>
          Hoàn thành: {Object.keys(formValues).length} / {productFormDetailFields.length}
        </span>
      </div>

      <div className='grid grid-cols-2 gap-6'>
        {productFormDetailFields.map((field) => (
          <div key={field.id} className='space-y-2'>
            <label className='text-sm'>{field.label}</label>
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
                maxMultiSelectItems={5}
                handleChange={handleChange}
              />
            )}
            {field.type === 'input' && (
              <Input placeholder={field.placeholder} onChange={(e) => handleChange(field?.id, e.target.value)} />
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
            {field.helperText && <span className='text-xs text-muted-foreground'>{field.helperText}</span>}
          </div>
        ))}
      </div>
    </div>
  )
}
