import { Plus, X } from 'lucide-react'
import { UseFormReturn } from 'react-hook-form'
import { z } from 'zod'

import FormLabel from '@/components/form-label'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { FormProductSchema } from '@/variables/productFormDetailFields'

import { FormControl, FormField, FormItem, FormMessage } from '../ui/form'

interface BasicInformationProps {
  form: UseFormReturn<z.infer<typeof FormProductSchema>>
}

export default function SalesInformation({ form }: BasicInformationProps) {
  return (
    <div className='w-full p-4 lg:p-6 bg-white rounded-lg shadow-md space-y-4'>
      <div className='space-y-6'>
        <div className='flex items-center justify-between'>
          <h2 className='text-lg font-semibold'>Thông tin bán hàng</h2>
        </div>
        <div>
          <FormField
            control={form.control}
            name='productClassifications'
            render={({ field }) => (
              <FormItem className='w-full'>
                <div className='w-full flex'>
                  <div className='w-[15%]'>
                    <FormLabel>Phân loại hàng</FormLabel>
                  </div>
                  <div className='w-full space-y-1'>
                    <div className='w-full space-y-3'>
                      <Button
                        variant='outline'
                        size='sm'
                        type='button'
                        className='flex items-center gap-1'
                        onClick={() => {
                          const updated = [...(field?.value ?? []), { title: '', price: 0, quantity: 1 }]
                          field.onChange(updated)
                        }}
                      >
                        <Plus className='w-4 h-4' />
                        Thêm nhóm phân loại
                      </Button>
                      {(field?.value ?? []).length > 0 &&
                        (field?.value ?? []).map((classification, index) => (
                          <div className='relative bg-primary/5 rounded-lg p-4' key={classification?.title || index}>
                            <X
                              onClick={() => {}}
                              className='text-destructive hover:cursor-pointer hover:text-destructive/80 absolute right-4 top-4'
                            />
                            <FormControl>
                              <div className='space-y-2'>
                                <div className='flex gap-2'>
                                  <div className='w-[10%]'>
                                    <FormLabel>Phân loại {index + 1}</FormLabel>
                                  </div>
                                  <div className='w-[50%]'>
                                    <Input
                                      placeholder='e.g. Color, etc'
                                      className='border-primary/40'
                                      {...field}
                                      value={''}
                                    />
                                  </div>
                                </div>
                                <div className='flex gap-2'>
                                  <div className='w-[10%]'>
                                    <FormLabel>Tùy chọn</FormLabel>
                                  </div>
                                  <div className='w-[50%]'>
                                    <Input
                                      placeholder='e.g. Red, etc'
                                      className='border-primary/40'
                                      {...field}
                                      value={classification?.title ?? ''}
                                    />
                                  </div>
                                </div>
                                <div>
                                  <Input
                                    type='number'
                                    placeholder='Nhập vào'
                                    className='border-primary/40'
                                    {...field}
                                    value={classification?.price ?? ''}
                                    onChange={(e) => {
                                      const value = e.target.value
                                      const updated = [...(field?.value ?? [])]
                                      updated[index].price = value ? parseFloat(value) : undefined
                                      field.onChange(updated)
                                    }}
                                  />
                                </div>
                                <div>
                                  <Input
                                    type='number'
                                    placeholder='Nhập vào'
                                    className='border-primary/40'
                                    {...field}
                                    value={classification?.quantity ?? ''}
                                    onChange={(e) => {
                                      const value = e.target.value
                                      const updated = [...(field?.value ?? [])]
                                      updated[index].quantity = value ? parseFloat(value) : undefined
                                      field.onChange(updated)
                                    }}
                                  />
                                </div>
                              </div>
                            </FormControl>
                          </div>
                        ))}
                    </div>
                    <FormMessage />
                  </div>
                </div>
              </FormItem>
            )}
          />
        </div>
        {form?.getValues()?.productClassifications?.length === 0 && (
          <div>
            <FormField
              control={form.control}
              name='price'
              render={({ field }) => (
                <FormItem className='w-full'>
                  <div className='w-full flex'>
                    <div className='w-[15%]'>
                      <FormLabel required>Giá</FormLabel>
                    </div>
                    <div className='w-full space-y-1'>
                      <FormControl>
                        <Input
                          type='number'
                          placeholder='Nhập vào'
                          className='border-primary/40'
                          {...field}
                          value={field.value ?? ''}
                          onChange={(e) => {
                            const value = e.target.value
                            field.onChange(value ? parseFloat(value) : undefined)
                          }}
                        />
                      </FormControl>
                      <FormMessage />
                    </div>
                  </div>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='quantity'
              render={({ field }) => (
                <FormItem className='w-full'>
                  <div className='w-full flex'>
                    <div className='w-[15%]'>
                      <FormLabel required>Kho hàng</FormLabel>
                    </div>
                    <div className='w-full space-y-1'>
                      <FormControl>
                        <Input
                          type='number'
                          placeholder='Nhập vào'
                          className='border-primary/40'
                          {...field}
                          value={field.value ?? ''}
                          onChange={(e) => {
                            const value = e.target.value
                            field.onChange(value ? parseFloat(value) : undefined)
                          }}
                        />
                      </FormControl>
                      <FormMessage />
                    </div>
                  </div>
                </FormItem>
              )}
            />
          </div>
        )}
      </div>
    </div>
  )
}
