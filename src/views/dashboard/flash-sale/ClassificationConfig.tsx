import { CheckCircle2, CircleDashed, PackageOpen, Shapes, Trash2 } from 'lucide-react'
import { useEffect } from 'react'
import { useFieldArray, UseFormReturn } from 'react-hook-form'

import Button from '@/components/button'
import FormLabel from '@/components/form-label'
import SelectClassification from '@/components/select-classification'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import { Badge } from '@/components/ui/badge'
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
                        <AccordionTrigger className='hover:no-underline px-2 py-1 rounded-md hover:bg-gray-50/50 transition-colors'>
                          <div className='flex items-center gap-2 w-full'>
                            <Badge variant='outline' className='border-gray-200 bg-gray-50 text-gray-700 gap-1'>
                              <CircleDashed className='h-3.5 w-3.5' />
                              <span className='whitespace-nowrap'>Select a classification...</span>
                            </Badge>
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
                      <AccordionTrigger className='hover:no-underline px-2 py-2 rounded-md hover:bg-green-50/50 transition-colors'>
                        <div className='flex items-center gap-3 w-full'>
                          <Badge variant='default' className='bg-green-500 hover:bg-green-600 text-white gap-1.5'>
                            <CheckCircle2 className='h-3.5 w-3.5' />
                            <span className='whitespace-nowrap font-medium'>{title}</span>
                          </Badge>

                          <div className='flex items-center gap-1.5 flex-grow'>
                            <Badge
                              variant='outline'
                              className='border-red-200 bg-red-50 text-red-700 gap-1 whitespace-nowrap'
                            >
                              -{formatNumber(discount, '%')}
                            </Badge>

                            <div className='flex items-center gap-1 px-2 py-0.5 bg-gray-50 rounded'>
                              <span className='font-light line-through text-xs text-gray-500'>
                                {formatCurrency(price)}
                              </span>
                              <span className='text-green-600 font-medium text-sm'>
                                {formatCurrency(discountPrice)}
                              </span>
                            </div>

                            <Badge variant='outline' className='border-blue-200 bg-blue-50 text-blue-700 gap-1 ml-auto'>
                              <PackageOpen className='h-3.5 w-3.5' />
                              <span className='whitespace-nowrap'>{formatNumber(quantity, ' items')}</span>
                            </Badge>
                          </div>

                          <button
                            className='flex-shrink-0 p-1.5 rounded-full hover:bg-red-50 disabled:opacity-20 cursor-pointer transition-colors'
                            onClick={handleRemove(index)}
                            disabled={isRemoveDisabled}
                            type='button'
                          >
                            <Trash2 color='red' strokeWidth={2.5} size={16} />
                          </button>
                        </div>
                      </AccordionTrigger>
                      <AccordionContent>
                        <div className='gap-4 grid grid-flow-row grid-cols-1 sm:grid-cols-2 p-1'>
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
