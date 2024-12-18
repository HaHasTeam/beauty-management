import 'react-quill-new/dist/quill.snow.css'

import { ImagePlus } from 'lucide-react'
import { useEffect, useRef } from 'react'
import { UseFormReturn } from 'react-hook-form'
import ReactQuill from 'react-quill-new'
import { z } from 'zod'

import FormCategorySelection from '@/components/form-category-selection'
import FormLabel from '@/components/form-label'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import { FormControl, FormDescription, FormField, FormItem, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { ICategory } from '@/types/category'
import { FormProductSchema } from '@/variables/productFormDetailFields'
import { modules } from '@/variables/textEditor'

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
  const productDescription = form.watch('description')
  const productCategory = form.watch('category')

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
                          <UploadProductImages
                            field={field}
                            vertical={false}
                            dropZoneConfigOptions={{ maxFiles: 7 }}
                            renderFileItemUI={(file) => {
                              return (
                                <div
                                  key={file?.name}
                                  className='hover:border-primary w-32 h-32 rounded-lg border border-gay-300 p-0'
                                >
                                  <img
                                    src={URL?.createObjectURL(file)}
                                    alt={file?.name}
                                    className='object-contain w-full h-full rounded-lg'
                                    onLoad={() => URL?.revokeObjectURL(URL?.createObjectURL(file))}
                                  />
                                </div>
                              )
                            }}
                            renderInputUI={(_isDragActive, files, maxFiles) => {
                              return (
                                <div className='w-32 h-32 hover:bg-primary/15 p-4 rounded-lg border flex flex-col gap-2 items-center justify-center text-center border-dashed border-primary transition-all duration-500'>
                                  <ImagePlus className='w-12 h-12 text-primary' />

                                  <p className='text-sm text-primary'>
                                    Drag & drop or browse file ({files?.length ?? 0}/{maxFiles})
                                  </p>
                                </div>
                              )
                            }}
                          />
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
                                modules={{
                                  ...modules,
                                  clipboard: {
                                    ...modules.clipboard,
                                    matchVisual: false
                                  }
                                }}
                                placeholder='Mô tả sản phẩm'
                                style={{ borderRadius: 10, borderColor: '#FEE9DC' }}
                                className='border-primary/40'
                                theme='snow'
                                {...field}
                                onChange={(content, _delta, _source, editor) => {
                                  // Get plain text and trim
                                  const text = editor.getText().trim()

                                  // Truncate if exceeds limit
                                  if (text.length > 5000) {
                                    // Create a new Quill instance to manipulate content
                                    const truncatedContent = content.split(' ').slice(0, 5000).join(' ')

                                    field.onChange(truncatedContent)
                                  } else {
                                    field.onChange(content)
                                  }
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
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  )
}

export default BasicInformation
