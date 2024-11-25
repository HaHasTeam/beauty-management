import { format } from 'date-fns'
import { CalendarIcon } from 'lucide-react'
import { useState } from 'react'

import FormMultiSelect from '@/components/form-multiselect'
import FormSelect from '@/components/form-select'
import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import { Input } from '@/components/ui/input'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { cn } from '@/lib/utils'

export default function DetailInformation() {
  const [date, setDate] = useState<Date>()
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [progress, setProgress] = useState(0)

  // Data for form fields
  const formFields = [
    {
      id: 0,
      label: 'Tên tổ chức chịu trách nhiệm sản xuất',
      type: 'multiselect',
      options: [
        { value: 'org1', label: 'Organization 1' },
        { value: 'org2', label: 'Organization 2' }
      ],
      helperText: '0/5'
    },
    {
      id: 1,
      label: 'Địa chỉ tổ chức chịu trách nhiệm sản xuất',
      type: 'multiselect',
      options: [
        { value: 'address1', label: 'Address 1' },
        { value: 'address2', label: 'Address 2' }
      ],
      helperText: '0/5'
    },
    {
      id: 2,
      label: 'Thành phần',
      type: 'input',
      placeholder: 'Vui lòng điền vào'
    },
    {
      id: 3,
      label: 'Hạn sử dụng',
      type: 'select',
      options: [
        { value: '1', label: '1 tháng' },
        { value: '2', label: '2 tháng' },
        { value: '3', label: '3 tháng' },
        { value: '6', label: '6 tháng' },
        { value: '12', label: '12 tháng' },
        { value: '24', label: '24 tháng' },
        { value: '36', label: '36 tháng' }
      ]
    },
    {
      id: 4,
      label: 'Thể tích',
      type: 'select',
      options: [
        { value: '10ml', label: '10ml' },
        { value: '20ml', label: '20ml' },
        { value: '30ml', label: '30ml' },
        { value: '50ml', label: '50ml' },
        { value: '100ml', label: '100ml' },
        { value: '150ml', label: '150ml' },
        { value: '200ml', label: '200ml' },
        { value: '250ml', label: '250ml' },
        { value: '300ml', label: '300ml' },
        { value: '400ml', label: '400ml' },
        { value: '500ml', label: '500ml' },
        { value: '750ml', label: '750ml' },
        { value: '1L', label: '1L' }
      ]
    },
    {
      id: 5,
      label: 'Số lô sản xuất',
      type: 'input',
      placeholder: 'Vui lòng điền vào'
    },
    {
      id: 6,
      label: 'Ngày hết hạn',
      type: 'date'
    },
    {
      id: 7,
      label: 'Xuất xứ',
      type: 'select',
      options: [
        { value: 'vn', label: 'Việt Nam' },
        { value: 'other', label: 'Khác' }
      ]
    },
    {
      id: 8,
      label: 'Trọng lượng',
      type: 'select',
      options: [
        { value: '10g', label: '10g' },
        { value: '20g', label: '20g' },
        { value: '30g', label: '30g' },
        { value: '50g', label: '50g' },
        { value: '100g', label: '100g' },
        { value: '150g', label: '150g' },
        { value: '200g', label: '200g' },
        { value: '250g', label: '250g' },
        { value: '300g', label: '300g' },
        { value: '400g', label: '400g' },
        { value: '500g', label: '500g' },
        { value: '750g', label: '750g' },
        { value: '1kg', label: '1kg' },
        { value: '1.5kg', label: '1.5kg' },
        { value: '2kg', label: '2kg' },
        { value: '3kg', label: '3kg' },
        { value: '5kg', label: '5kg' }
      ]
    },
    {
      id: 9,
      label: 'Kiểu đóng gói',
      type: 'select',
      options: [
        { value: 'single', label: 'Bộ đơn' },
        { value: 'double', label: 'Bộ đôi' }
      ]
    },
    {
      id: 10,
      label: 'Công thức',
      type: 'select',
      options: [
        { value: 'sponge', label: 'Dạng mút' },
        { value: 'towel', label: 'Khăn' },
        { value: 'cream', label: 'Dạng kem' },
        { value: 'gelatinous', label: 'Dạng sánh' },
        { value: 'liquid', label: 'Dạng lỏng' },
        { value: 'powder', label: 'Bột' },
        { value: 'solid', label: 'Rắn' },
        { value: 'glue-like', label: 'Dạng keo' }
      ]
    },
    {
      id: 11,
      label: 'Thành phần hoạt tính',
      type: 'multiselect',
      options: [{ value: 'natural', label: 'Tự nhiên' }],
      helperText: '0/5'
    },
    {
      id: 12,
      label: 'Loại da',
      type: 'multiselect',
      options: [
        { value: 'all', label: 'Mọi loại da' },
        { value: 'combination', label: 'Da hỗn hợp' },
        { value: 'normal', label: 'Da thường' },
        { value: 'dry', label: 'Da khô' },
        { value: 'oily', label: 'Da dầu' },
        { value: 'acne', label: 'Da mụn trứng cá' },
        { value: 'sensitive', label: 'Da nhạy cảm' },
        { value: 'rough', label: 'Da sần' }
      ],
      helperText: '0/5'
    },
    {
      id: 13,
      label: 'Loại bộ mỹ phẩm',
      type: 'select',
      options: [
        { value: 'face', label: 'Chăm sóc da mặt' },
        { value: 'lip', label: 'Chăm sóc môi' },
        { value: 'eye', label: 'Chăm sóc mắt' },
        { value: 'multi-function', label: 'Đa năng' }
      ]
    },
    {
      id: 14,
      label: 'Chăm sóc da',
      type: 'select',
      options: [
        { value: 'large-pores', label: 'Lỗ chân lông to' },
        { value: 'oily-skin', label: 'Da dầu' },
        { value: 'hydrating', label: 'Dưỡng ẩm' },
        { value: 'spf-coverage', label: 'Bảo vệ SPF' },
        { value: 'long-lasting', label: 'Lâu trôi' }
      ]
    },
    {
      id: 15,
      label: 'Loại đặc biệt',
      type: 'multiselect',
      options: [
        { value: 'antibacterial', label: 'Chống vi khuẩn' },
        { value: 'disinfectant', label: 'Khử trùng' },
        { value: 'fragrance-free', label: 'Không chất tạo mùi' },
        { value: 'tear-free', label: 'Không cay mắt' },
        { value: 'no-rinse', label: 'Không rửa' },
        { value: 'chemical-free', label: 'Không hóa chất' },
        { value: 'paraben-free', label: 'Không chứa paraben' },
        { value: 'baby-safe', label: 'An toàn cho bé' },
        { value: 'soap-free', label: 'Không xà phòng' },
        { value: 'hypoallergenic', label: 'Không gây dị ứng' },
        { value: 'alcohol-free', label: 'Không chứa cồn' },
        { value: 'organic', label: 'Hữu cơ' }
      ],
      helperText: '0/5'
    },
    {
      id: 16,
      label: 'Loại phiên bản',
      type: 'select',
      options: [
        { value: 'normal', label: 'Thông thường' },
        { value: 'limited', label: 'Limited Edition' }
      ]
    },
    {
      id: 17,
      label: 'Quantity per pack',
      type: 'select',
      options: [
        { value: '1', label: '1' },
        { value: '2', label: '2' },
        { value: '5', label: '5' },
        { value: '8', label: '8' },
        { value: '10', label: '10' },
        { value: '15', label: '15' },
        { value: '20', label: '20' }
      ]
    }
  ]

  return (
    <div className='w-full max-w-4xl mx-auto p-6'>
      <div className='mb-6 flex items-center justify-between'>
        <h2 className='text-lg font-semibold'>Thông tin chi tiết</h2>
        <span className='text-sm text-muted-foreground'>
          Hoàn thành: {progress} / {formFields.length}
        </span>
      </div>

      <div className='grid grid-cols-2 gap-6'>
        {formFields.map((field) => (
          <div key={field.id} className='space-y-2'>
            <label className='text-sm'>{field.label}</label>
            {field.type === 'select' && (
              <FormSelect
                placeholder={'Vui lòng chọn'}
                emptyText={'Không có kết quả'}
                items={field?.options ?? []}
                inputPlaceholder={'Nhập vào'}
                buttonText={'Thêm thuộc tính mới'}
              />
            )}
            {field.type === 'multiselect' && <FormMultiSelect />}
            {field.type === 'input' && <Input placeholder={field.placeholder} />}
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
                  <Calendar mode='single' selected={date} onSelect={setDate} initialFocus />
                </PopoverContent>
              </Popover>
            )}
            {field.helperText && <span className='text-xs text-muted-foreground'>{field.helperText}</span>}
          </div>
        ))}
        <div className='col-span-2 flex justify-end'>
          <Button type='submit' className='w-full sm:w-auto'>
            Lưu thông tin
          </Button>
        </div>
      </div>
    </div>
  )
}
