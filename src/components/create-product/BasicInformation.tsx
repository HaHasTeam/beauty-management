import 'react-quill-new/dist/quill.snow.css'

import { useEffect, useRef } from 'react'
import { UseFormReturn } from 'react-hook-form'
import ReactQuill from 'react-quill-new'
import { z } from 'zod'

import FormLabel from '@/components/form-label'
import { ICategory } from '@/types/category'
import { FormProductSchema } from '@/variables/productFormDetailFields'
import { modules } from '@/variables/textEditor'

import FormCategorySelection from '../form-category-selection'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '../ui/accordion'
import { FormControl, FormDescription, FormField, FormItem, FormMessage } from '../ui/form'
import { Input } from '../ui/input'
import UploadProductImages from './UploadProductImages'

interface BasicInformationProps {
  form: UseFormReturn<z.infer<typeof FormProductSchema>>
  resetSignal?: boolean
  defineFormSignal?: boolean
  useCategoryData: ICategory[]
  setActiveStep: React.Dispatch<number>
  activeStep: number
  setCompleteSteps: React.Dispatch<React.SetStateAction<number[]>>
}
const BasicInformation = ({
  form,
  resetSignal,
  defineFormSignal,
  useCategoryData,
  activeStep,
  setActiveStep,
  setCompleteSteps
}: BasicInformationProps) => {
  const basicInfoRef = useRef<HTMLDivElement>(null)
  const BASIC_INFORMATION_INDEX = 1
  const productImages = form.watch('images')
  const productName = form.watch('name')
  const productDescription = form.watch('category')
  const productCategory = form.watch('description')

  // Scroll to the BasicInformation section when activeStep is 1
  useEffect(() => {
    if (activeStep === BASIC_INFORMATION_INDEX && basicInfoRef.current) {
      basicInfoRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }, [activeStep])
  useEffect(() => {
    setCompleteSteps((prevSteps) => {
      if (
        productImages?.length > 0 &&
        productName?.length > 0 &&
        productCategory?.length > 0 &&
        productDescription?.length > 0
      ) {
        return prevSteps.includes(BASIC_INFORMATION_INDEX) ? prevSteps : [...prevSteps, BASIC_INFORMATION_INDEX]
      } else {
        return prevSteps.filter((index) => index !== BASIC_INFORMATION_INDEX)
      }
    })
  }, [
    form,
    productCategory?.length,
    productDescription?.length,
    productImages?.length,
    productName?.length,
    setCompleteSteps
  ])
  return (
    <div
      className='w-full p-4 lg:p-6 bg-white rounded-lg shadow-md space-y-4'
      ref={basicInfoRef}
      onClick={() => setActiveStep(BASIC_INFORMATION_INDEX)}
    >
      <Accordion type='single' collapsible className='w-full' defaultValue='description'>
        <AccordionItem value='description'>
          <AccordionTrigger className='pt-0 text-left font-medium no-underline hover:no-underline'>
            <h2 className='font-bold text-xl'>Thông tin cơ bản</h2>
          </AccordionTrigger>
          <AccordionContent>
            <div className='space-y-4'>
              <FormField
                control={form.control}
                name='images'
                render={({ field }) => (
                  <FormItem className='w-full'>
                    <div className='flex w-full gap-2'>
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
                        <div className='w-full flex gap-2'>
                          <div className='w-[15%] flex items-center'>
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
                        <div className='w-full flex gap-2'>
                          <div className='w-[15%] flex items-center'>
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
                        <div className='flex w-full gap-2'>
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
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  )
}

export default BasicInformation
