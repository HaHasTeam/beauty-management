import { useEffect, useState } from 'react'
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
  defineFormSignal?: boolean
  useCategoryData: ICategory[]
  setIsValid: React.Dispatch<boolean>
}
export default function DetailInformation({
  form,
  resetSignal,
  defineFormSignal,
  useCategoryData,
  setIsValid
}: DetailInformationProps) {
  const [productDetailField, setProductDetailField] = useState<IProductFormFields[]>([])
  const MAX_MULTI_SELECT_ITEMS = 5
  const selectedCategory = form.watch('category')

  useEffect(() => {
    const categoryDetails = useCategoryData.find((cat) => cat.id === selectedCategory)?.detail

    if (categoryDetails) {
      const convertedArray = Object.entries(categoryDetails ?? {}).map(([key, value]) => {
        return { id: key, ...value }
      })
      setProductDetailField(convertedArray ?? [])
    } else {
      setProductDetailField([])
    }
  }, [selectedCategory, useCategoryData])

  const handleValidateInput = (required: boolean | undefined, inputValue: string) => {
    if (required && (inputValue === undefined || inputValue === '' || inputValue === null)) {
      setIsValid(false)
    } else {
      setIsValid(true)
    }
  }
  return (
    <div className='w-full p-4 lg:p-6 bg-white rounded-lg shadow-md space-y-4'>
      <Accordion
        type='single'
        collapsible
        disabled={selectedCategory === '' || selectedCategory === undefined}
        defaultChecked={selectedCategory === '' || selectedCategory === undefined}
        className={`w-full ${(selectedCategory === '' || selectedCategory === undefined) && 'opacity-50'}`}
        defaultValue='description'
      >
        <AccordionItem value='description'>
          <AccordionTrigger className='text-left font-medium no-underline hover:no-underline'>
            <h2 className='font-bold text-xl'>Thông tin chi tiết</h2>
          </AccordionTrigger>
          <AccordionContent>
            {!productDetailField || productDetailField?.length === 0 ? (
              <AlertCustom message='Vui lòng chọn danh mục để xem các thông tin' />
            ) : (
              <div>
                <div className='flex items-center justify-end'>
                  <span className='text-sm text-muted-foreground'>Hoàn thành: 0 / {productDetailField.length}</span>
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
                                  onChange={(e) => handleValidateInput(formField?.required, e.target.value)}
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
                                <div>
                                  {formField?.required &&
                                    (form.getValues(`detail.${formField.id}`) === '' ||
                                      form.getValues(`detail.${formField.id}`) === undefined) && (
                                      <span className='font-semibold text-destructive text-xs'>
                                        Vui lòng chọn {formField?.label}
                                      </span>
                                    )}
                                </div>
                              </>
                            )}

                            <FormMessage />
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
