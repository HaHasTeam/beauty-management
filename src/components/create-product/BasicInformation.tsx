import 'react-quill-new/dist/quill.snow.css'

import { UseFormReturn } from 'react-hook-form'
import ReactQuill from 'react-quill-new'
import { z } from 'zod'

import FormLabel from '@/components/form-label'
import { ICategory } from '@/types/category'
import { FormProductSchema } from '@/variables/productFormDetailFields'
import { modules } from '@/variables/textEditor'

import FormCategorySelection from '../form-category-selection'
import { FormControl, FormDescription, FormField, FormItem, FormMessage } from '../ui/form'
import { Input } from '../ui/input'
import UploadProductImages from './UploadProductImages'

interface BasicInformationProps {
  form: UseFormReturn<z.infer<typeof FormProductSchema>>
  resetSignal?: boolean
  defineFormSignal?: boolean
  useCategoryData: ICategory[]
}
const BasicInformation = ({ form, resetSignal, defineFormSignal, useCategoryData }: BasicInformationProps) => {
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
                  <UploadProductImages field={field} maxFileInput={7} />
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
                    <FormLabel required>Danh mục</FormLabel>
                  </div>
                  <div className='w-full space-y-1'>
                    <FormControl>
                      <FormCategorySelection
                        categories={useCategoryData}
                        onSelect={(selected: string) => {
                          field.onChange(selected)
                        }}
                        form={form}
                        resetSignal={resetSignal}
                        defineFormSignal={defineFormSignal}
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
                      <ReactQuill
                        modules={modules}
                        placeholder='Mô tả sản phẩm'
                        style={{ borderRadius: 10, borderColor: '#FEE9DC' }}
                        className='border-primary/40'
                        theme='snow'
                        {...field}
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
    </div>
  )
}

export default BasicInformation
