import { UseFormReturn } from 'react-hook-form'
import { z } from 'zod'

import FormLabel from '@/components/form-label'
import { categories } from '@/types/category'
import { FormProductSchema } from '@/variables/productFormDetailFields'

import FormCategorySelection from '../form-category-selection'
import { FormControl, FormDescription, FormField, FormItem, FormMessage } from '../ui/form'
import { Input } from '../ui/input'
import { Textarea } from '../ui/textarea'
import UploadProductImages from './UploadProductImages'

interface BasicInformationProps {
  form: UseFormReturn<z.infer<typeof FormProductSchema>>
  resetSignal?: boolean
}
const BasicInformation = ({ form, resetSignal }: BasicInformationProps) => {
  return (
    <div className='bg-white rounded-lg shadow-md p-4 lg:p-6 space-y-4'>
      <h3 className='font-bold text-xl'>Thông tin cơ bản</h3>
      <FormField
        control={form.control}
        name='images'
        render={({ field }) => (
          <FormItem className='w-full'>
            <div className='flex w-full'>
              <div className='w-[15%] space-y-1'>
                <FormLabel required>Hình ảnh sản phẩm</FormLabel>
                <FormDescription>Support only .jpg, .jpeg, .png & max 1MB file</FormDescription>
              </div>
              <FormControl>
                <div className='w-full space-y-1'>
                  <UploadProductImages field={field} />
                  <FormMessage />
                </div>
              </FormControl>
            </div>
          </FormItem>
        )}
      />
      <div className='space-y-2 w-full'>
        <div className='flex w-full'>
          <FormField
            control={form.control}
            name='name'
            render={({ field }) => (
              <FormItem className='w-full'>
                <div className='w-full flex'>
                  <div className='w-[15%]'>
                    <FormLabel required>Tên sản phẩm</FormLabel>
                  </div>
                  <div className='w-full space-y-1'>
                    <FormControl>
                      <Input
                        placeholder='Tên sản phẩm + Thương hiệu + Model + Thông số kỹ thuật'
                        className='border-primary/40'
                        {...field}
                        value={field.value ?? ''}
                      />
                    </FormControl>
                    <FormMessage />
                  </div>
                </div>
                <div className='text-sm text-muted-foreground text-right'>{field?.value?.length ?? 0}/120</div>
              </FormItem>
            )}
          />
        </div>
      </div>
      <div className='space-y-2 w-full'>
        <div className='flex w-full'>
          <FormField
            control={form.control}
            name='category'
            render={({ field }) => (
              <FormItem className='w-full'>
                <div className='w-full flex'>
                  <div className='w-[15%]'>
                    <FormLabel required>Ngành hàng</FormLabel>
                  </div>
                  <div className='w-full space-y-1'>
                    <FormControl>
                      <FormCategorySelection
                        categories={categories}
                        onSelect={(selected: string) => {
                          field.onChange(selected)
                        }}
                        resetSignal={resetSignal}
                      />
                    </FormControl>
                    <FormMessage />
                  </div>
                </div>
              </FormItem>
            )}
          />
        </div>
      </div>
      <div className='space-y-2 w-full'>
        <div className='w-full'>
          <FormField
            control={form.control}
            name='description'
            render={({ field }) => (
              <FormItem className='w-full'>
                <div className='flex w-full'>
                  <div className='w-[15%]'>
                    <FormLabel required>Mô tả sản phẩm</FormLabel>
                  </div>
                  <div className='w-full space-y-1'>
                    <FormControl>
                      <Textarea placeholder='Mô tả sản phẩm' className='border-primary/40' {...field} />
                    </FormControl>
                    <FormMessage />
                  </div>
                </div>
              </FormItem>
            )}
          />
          <div className='text-sm text-muted-foreground text-right'>0/3000</div>
        </div>
      </div>
    </div>
  )
}

export default BasicInformation
