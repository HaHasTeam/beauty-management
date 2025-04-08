import { Shapes, Tag, Trash2 } from 'lucide-react'
import { useEffect } from 'react'
import { useFieldArray, UseFormReturn } from 'react-hook-form'

import Button from '@/components/button'
import FormLabel from '@/components/form-label'
import SelectClassification from '@/components/select-classification'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { FormControl, FormDescription, FormField, FormItem, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'
import { ProductClassificationTypeEnum } from '@/types/product'
import { formatCurrency, formatNumber } from '@/utils/number'

import { SchemaType } from './helper'

type Props = {
  form: UseFormReturn<SchemaType>
  productId: string
}

const ClassificationConfig = ({ form, productId }: Props) => {
  // Setup field array for managing multiple classifications
  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: 'productClassifications'
  })

  // Get current classifications from form
  const classificationList = form.watch('productClassifications') || []
  const discount = Number(form.watch('discount') ?? 0) * 100

  // Initialize empty classification when product changes and no classifications exist
  useEffect(() => {
    // If we have a product ID but no classifications, add an empty one to start
    if (productId && fields.length === 0) {
      // Using 'any' is necessary here due to complex nested type requirements
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      append({} as any)
    }
  }, [productId, fields.length, append])

  // Handle adding a new classification
  const handleAddMore = async () => {
    const isValid = await form.trigger('productClassifications')
    if (isValid) {
      // Using 'any' is necessary here due to complex nested type requirements
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      append({} as any)
    }
  }

  // Handle removing a classification
  const handleRemove = (index: number) => () => {
    remove(index)
  }

  // Prevent removing the last classification
  const isRemoveDisabled = fields.length === 1

  return (
    <Card>
      <CardHeader className='text-primary mb-0'>
        <CardTitle className='flex items-center gap-1 text-lg'>
          <Shapes />
          Classifications Details
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className='gap-4 grid grid-flow-row grid-cols-1'>
          <Accordion type='multiple' className='w-full space-y-4' value={fields.map((_, index) => String(index))}>
            {fields.map((_, index) => {
              // Handle potential undefined classifications during loading
              if (!classificationList[index] || !classificationList[index]?.rawClassification) {
                return (
                  <Card key={`classification-placeholder-${index}`}>
                    <CardContent>
                      <AccordionItem value={String(index)} className='border-none'>
                        <AccordionTrigger className='hover:no-underline'>
                          <div className='flex items-center gap-2 w-full'>
                            <span className='bg-gray-300 px-4 py-1 text-white rounded-3xl items-center flex gap-1 uppercase text-xs font-extrabold'>
                              <Tag strokeWidth={3} size={16} />
                              Select a classification...
                            </span>
                          </div>
                        </AccordionTrigger>
                        <AccordionContent>
                          <div className='gap-4 grid grid-flow-row grid-cols-1 sm:grid-cols-2'>
                            <FormField
                              control={form.control}
                              name={`productClassifications.${index}.rawClassification`}
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel required>Classification Of Product</FormLabel>
                                  <SelectClassification {...field} productId={productId} value={field.value} />
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                    </CardContent>
                  </Card>
                )
              }

              // Extract values for display with proper null checking
              const price = classificationList[index]?.rawClassification?.price ?? 0
              const discountPrice = (Number(price) * (100 - discount)) / 100
              const quantity = classificationList[index]?.append?.quantity ?? 0
              const title = classificationList[index]?.rawClassification?.title || 'Classification'

              return (
                <Card key={`classification-${index}`}>
                  <CardContent>
                    <AccordionItem value={String(index)} className='border-none'>
                      <AccordionTrigger className='hover:no-underline'>
                        <div className='flex items-center gap-2 w-full'>
                          <span className='bg-green-600 px-4 py-1 text-white rounded-3xl items-center flex gap-1 uppercase text-xs font-extrabold'>
                            <Tag strokeWidth={3} size={16} />
                            {title}{' '}
                            <span className='text-xs text-red-600 px-1 bg-red-100 rounded-3xl'>
                              -{formatNumber(discount, '%')}
                            </span>
                          </span>

                          <div className='flex items-center gap-1'>
                            <span className='font-light line-through'>{formatCurrency(price)}</span>
                            <span className='text-green-500'>{formatCurrency(discountPrice)}</span>
                            <span className='text-xs text-blue-600 px-1 bg-blue-100 rounded-3xl'>
                              Only <b>{formatNumber(quantity, ' items available')}</b>
                            </span>
                          </div>

                          <button
                            className='ml-auto mr-2 disabled:opacity-20 cursor-pointer'
                            onClick={handleRemove(index)}
                            disabled={isRemoveDisabled}
                            type='button'
                          >
                            <Trash2 color='red' strokeWidth={3} size={20} />
                          </button>
                        </div>
                      </AccordionTrigger>
                      <AccordionContent>
                        <div className='gap-4 grid grid-flow-row grid-cols-1 sm:grid-cols-2'>
                          <FormField
                            control={form.control}
                            name={`productClassifications.${index}.rawClassification`}
                            render={({ field }) => {
                              const isDefault =
                                classificationList[index]?.rawClassification?.type ===
                                ProductClassificationTypeEnum.DEFAULT
                              return (
                                <FormItem className={cn(isDefault && 'hidden')}>
                                  <FormLabel required>Classification Of Product</FormLabel>
                                  <SelectClassification
                                    {...field}
                                    productId={productId}
                                    value={field.value}
                                    initialClassification={classificationList[index]?.initialClassification}
                                  />
                                  <FormMessage />
                                </FormItem>
                              )
                            }}
                          />
                          <FormField
                            control={form.control}
                            name={`productClassifications.${index}.append.quantity`}
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel required>Quantity</FormLabel>
                                <FormControl>
                                  <Input
                                    type='quantity'
                                    placeholder='e.g. 100'
                                    {...field}
                                    symbol={'Items'}
                                    maxVal={classificationList[index]?.rawClassification?.quantity ?? 0}
                                  />
                                </FormControl>
                                <FormDescription>
                                  This is the quantity of the flash sale that take from initial quantity.
                                </FormDescription>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  </CardContent>
                </Card>
              )
            })}
          </Accordion>
          <div className='mb-4 flex w-full gap-2'>
            <Button size='sm' type='button' onClick={handleAddMore}>
              Add more
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export default ClassificationConfig
