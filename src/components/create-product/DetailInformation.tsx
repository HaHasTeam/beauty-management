/* eslint-disable @typescript-eslint/no-unused-vars */
import './index.css'

import { useEffect, useRef, useState } from 'react'
import { UseFormReturn } from 'react-hook-form'
import { z } from 'zod'

import FormSelect from '@/components/form-select'
import { ICategory } from '@/types/category'
import { FormProductSchema, IProductFormFields } from '@/variables/productFormDetailFields'

import AlertCustom from '../alert'
import { FlexDatePicker } from '../flexible-date-picker/FlexDatePicker'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '../ui/accordion'
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '../ui/form'
import { Input } from '../ui/input'

interface DetailInformationProps {
  form: UseFormReturn<z.infer<typeof FormProductSchema>>
  resetSignal?: boolean
  isValid?: boolean
  defineFormSignal?: boolean
  useCategoryData: ICategory[]
  setIsValid: React.Dispatch<boolean>
  setActiveStep: React.Dispatch<number>
  activeStep: number
  setCompleteSteps: React.Dispatch<React.SetStateAction<number[]>>
}
export default function DetailInformation({
  form,
  resetSignal,
  defineFormSignal,
  useCategoryData,
  setIsValid,
  setActiveStep,
  activeStep,
  isValid,
  setCompleteSteps
}: DetailInformationProps) {
  const [productDetailField, setProductDetailField] = useState<IProductFormFields[]>([])
  const MAX_MULTI_SELECT_ITEMS = 5
  const DETAIL_INFORMATION_INDEX = 2
  const selectedCategory = form.watch('category')
  const detailValue = form.watch('detail')
  const detailInfoRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const findCategoryById = (categories: ICategory[], id: string): ICategory | undefined => {
      for (const category of categories) {
        // Check current category
        if (category.id === id) return category

        // Recursively search subcategories
        if (category.subCategories && category.subCategories.length > 0) {
          const foundInSubcategories = findCategoryById(category.subCategories, id)
          if (foundInSubcategories) return foundInSubcategories
        }
      }
      return undefined
    }

    const categoryDetails = findCategoryById(useCategoryData, selectedCategory)?.detail
    if (categoryDetails) {
      const convertedArray = Object.entries(categoryDetails ?? {}).map(([key, value]) => {
        return { id: key, ...value }
      })
      setProductDetailField(convertedArray ?? [])
    } else {
      setProductDetailField([])
    }
  }, [selectedCategory, useCategoryData])

  useEffect(() => {
    if (activeStep === DETAIL_INFORMATION_INDEX && detailInfoRef.current) {
      detailInfoRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }, [activeStep])

  useEffect(() => {
    // Get all required fields
    const requiredFields = productDetailField.filter((field) => field.required).map((field) => field.id)

    // Check if all required fields are filled
    const allRequiredFieldsFilled = requiredFields.every((fieldId) => {
      const fieldValue = form.getValues(`detail.${fieldId}`)

      // Handle different input types
      if (fieldValue === undefined || fieldValue === '') return false
      if (Array.isArray(fieldValue) && fieldValue.length === 0) return false

      return true
    })

    // Update form validity
    setIsValid(allRequiredFieldsFilled)
    setCompleteSteps((prevSteps) => {
      const newSteps = new Set(prevSteps)
      if (allRequiredFieldsFilled && selectedCategory !== '') {
        newSteps.add(DETAIL_INFORMATION_INDEX)
      } else {
        newSteps.delete(DETAIL_INFORMATION_INDEX)
      }
      return Array.from(newSteps)
    })
  }, [productDetailField, setIsValid, setCompleteSteps, form, isValid, selectedCategory])

  return (
    <div
      className='w-full p-4 lg:p-6 bg-white rounded-lg shadow-md space-y-4'
      ref={detailInfoRef}
      onClick={() => setActiveStep(DETAIL_INFORMATION_INDEX)}
    >
      <Accordion
        type='single'
        collapsible
        disabled={selectedCategory === '' || selectedCategory === undefined}
        defaultChecked={selectedCategory === '' || selectedCategory === undefined}
        className={`w-full only:overflow-visible ${(selectedCategory === '' || selectedCategory === undefined) && 'opacity-50'}`}
        defaultValue='description'
      >
        <AccordionItem value='description' className='last:overflow-visible'>
          <AccordionTrigger className='pt-0 text-left font-medium no-underline hover:no-underline overflow-visible'>
            <h2 className='font-bold text-xl'>Thông tin chi tiết</h2>
          </AccordionTrigger>
          <AccordionContent className='overflow-visible'>
            {!productDetailField || productDetailField?.length === 0 ? (
              <AlertCustom message='Vui lòng chọn danh mục để xem các thông tin' />
            ) : (
              <div>
                <div className='flex items-center justify-end'>
                  <span className='text-sm text-muted-foreground'>
                    Hoàn thành:{' '}
                    {
                      Object.entries(detailValue ?? {}).filter(([_, value]) => {
                        if (Array.isArray(value)) {
                          return value.length > 0
                        }
                        return value !== undefined && value !== ''
                      }).length
                    }
                    /{productDetailField.length}
                  </span>
                </div>

                <div className='grid grid-cols-2 gap-6'>
                  {productDetailField.map((formField) => (
                    <div key={formField.id} className='space-y-2'>
                      <FormField
                        control={form.control}
                        name={`detail.${formField.id}`}
                        render={({ field, formState }) => (
                          <FormItem>
                            <FormLabel>
                              <div className='flex items-center gap-1 '>
                                {formField?.required && <span className='text-destructive'>*</span>}
                                <div className='flex gap-1 justify-between items-center'>
                                  <label className='text-sm'>{formField.label}</label>
                                  {formField.type === 'multipleChoice' && (
                                    <span className='text-xs text-muted-foreground text-right'>
                                      {Array.isArray(field?.value) ? field?.value?.length : 0}/{MAX_MULTI_SELECT_ITEMS}
                                    </span>
                                  )}
                                </div>
                              </div>
                            </FormLabel>

                            {formField.type === 'singleChoice' && (
                              <FormSelect
                                fieldId={formField?.id}
                                fieldLabel={formField?.label}
                                placeholder={'Vui lòng chọn'}
                                emptyText={'Không có kết quả'}
                                items={formField?.options ?? []}
                                inputPlaceholder={'Nhập vào'}
                                buttonText={'Thêm thuộc tính mới'}
                                type='singleChoice'
                                form={form}
                                resetSignal={resetSignal}
                                defineFormSignal={defineFormSignal}
                                required={formField?.required}
                                setIsValid={setIsValid}
                              />
                            )}
                            {formField.type === 'multipleChoice' && (
                              <FormSelect
                                fieldId={formField?.id}
                                fieldLabel={formField?.label}
                                placeholder={'Vui lòng chọn'}
                                emptyText={'Không có kết quả'}
                                items={formField?.options ?? []}
                                inputPlaceholder={'Nhập vào'}
                                buttonText={'Thêm thuộc tính mới'}
                                type='multipleChoice'
                                maxMultiSelectItems={MAX_MULTI_SELECT_ITEMS}
                                form={form}
                                resetSignal={resetSignal}
                                defineFormSignal={defineFormSignal}
                                required={formField?.required}
                                setIsValid={setIsValid}
                              />
                            )}
                            {formField.type === 'input' && (
                              <FormControl>
                                <Input
                                  type={formField?.inputType}
                                  className='border-primary/40'
                                  placeholder={'Vui lòng điền vào'}
                                  {...field}
                                  value={field?.value ?? ''}
                                  required={formField?.required}
                                  onChange={(e) => {
                                    if (e.target.value !== '') {
                                      setIsValid(true)
                                      field.onChange(e.target.value)
                                    } else {
                                      field.onChange(e.target.value)
                                      setIsValid(false)
                                    }
                                  }}
                                />
                              </FormControl>
                            )}
                            {formField.type === 'date' && (
                              <>
                                <FormControl>
                                  <FlexDatePicker
                                    onlyFutureDates={formField?.onlyFutureDates}
                                    onlyPastDates={formField?.onlyPastDates}
                                    showTime={formField?.showTime}
                                    field={field}
                                    formState={{
                                      ...formState,
                                      ...form
                                    }}
                                    buttonClassName='border border-primary/40 focus:ring-1 focus:ring-ring hover:ring-1 hover:ring-ring'
                                    required={formField?.required}
                                  />
                                </FormControl>
                              </>
                            )}

                            <FormMessage />
                            {formField?.required &&
                            (field?.value === undefined || field?.value === '') &&
                            formField?.type !== 'multipleChoice' &&
                            formField?.type !== 'singleChoice' ? (
                              <span className='text-xs text-destructive font-semibold'>
                                Vui lòng {formField?.type === 'date' ? 'chọn' : 'nhập'} {formField?.label}
                              </span>
                            ) : null}
                          </FormItem>
                        )}
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  )
}
