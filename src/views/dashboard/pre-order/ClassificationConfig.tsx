import { Shapes, Tag, Trash2 } from 'lucide-react'
import { useFieldArray, UseFormReturn } from 'react-hook-form'

import Button from '@/components/button'
import UploadFiles, { TriggerUploadRef } from '@/components/file-input/UploadFiles'
import FormLabel from '@/components/form-label'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { TFile } from '@/types/file'
import { ProductClassificationTypeEnum } from '@/types/product'
import { formatCurrency, formatNumber } from '@/utils/number'

import { SchemaType } from './helper'

type Props = {
  form: UseFormReturn<SchemaType>
  productId: string
  triggerImageUploadRef: React.RefObject<TriggerUploadRef>
}

const ClassificationConfig = ({ form, triggerImageUploadRef }: Props) => {
  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: 'productClassifications'
  })

  const classificationList = fields

  const isRemoveDisabled = fields.length === 1

  const handleAddMore = async () => {
    const res = await form.trigger('productClassifications')
    if (res) {
      append({
        append: {
          images: [] as TFile[],
          type: ProductClassificationTypeEnum.CUSTOM
        }
      } as SchemaType['productClassifications'][0])
    }
  }

  const handleRemove = (index: number) => () => {
    remove(index)
  }
  // const classificationErrors = form.formState.errors.productClassifications
  // const errorIndex =
  //   classificationErrors !== undefined
  //     ? String((classificationErrors as object[]).findIndex((value) => !!value))
  //     : undefined

  const handleChangeTitle = (index: number, title: string) => {
    form.setValue(`productClassifications.${index}.append.title`, title)
  }

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
          <Accordion
            type='multiple'
            className='w-full border-none space-y-4'
            value={classificationList.map((_, index) => String(index))}
          >
            {fields.map((_, index) => {
              const quantity = classificationList[index]?.append?.quantity ?? 0
              const color = classificationList[index]?.append?.color ?? ''
              const size = classificationList[index]?.append?.size ?? ''
              const other = classificationList[index]?.append?.other ?? ''

              const cmpArray = [color, size, other]
              const autoTitle = cmpArray.filter((item) => item).join(' - ')

              return (
                <Card>
                  <CardContent>
                    <AccordionItem value={String(index)} key={index} className='border-none'>
                      <AccordionTrigger className='hover:no-underline'>
                        <div className='flex items-center gap-2 w-full'>
                          <span className='bg-green-600 px-4 py-1 text-white rounded-3xl items-center flex gap-1 uppercase text-xs font-extrabold'>
                            <Tag strokeWidth={3} size={16} />
                            {autoTitle}
                          </span>

                          <div className='flex items-center gap-1'>
                            <span className='font-light'>
                              {formatCurrency(classificationList[index].append?.price ?? 0)}
                            </span>
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
                        <div className='gap-4 grid grid-flow-row grid-cols-1 sm:grid-cols-3'>
                          {/* <FormField
                        control={form.control}
                        name={`productClassifications.${index}.rawClassification`}
                        render={({ field }) => {
                          return (
                            <FormItem>
                              <FormLabel required>Classification Of Product</FormLabel>
                              <SelectClassification {...field} productId={productId} value={field.value} />
                              <FormMessage />
                            </FormItem>
                          )
                        }}
                      /> */}
                          {/* <FormField
                            control={form.control}
                            name={`productClassifications.${index}.append.title`}
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel required>Title Of Classification</FormLabel>
                                <FormControl>
                                  <Input {...field} placeholder='e.g. Blue' value={[autoTitle]} readOnly />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          /> */}
                          <FormField
                            control={form.control}
                            name={`productClassifications.${index}.append.sku`}
                            shouldUnregister
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel required>SKU Of Classification</FormLabel>
                                <FormControl>
                                  <Input {...field} placeholder='e.g. BLUE-2025' />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={form.control}
                            name={`productClassifications.${index}.append.quantity`}
                            shouldUnregister
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel required>Quantity Of Product</FormLabel>
                                <FormControl>
                                  <Input type='quantity' placeholder='e.g. 100' {...field} symbol={'Items'} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            shouldUnregister
                            control={form.control}
                            name={`productClassifications.${index}.append.price`}
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel required>Price Of Classification</FormLabel>
                                <FormControl>
                                  <Input type='currency' placeholder='e.g. 100,000' {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <div className='col-span-3 grid grid-cols-3 gap-4 max-sm:grid-cols-1'>
                            <FormField
                              control={form.control}
                              shouldUnregister
                              name={`productClassifications.${index}.append.color`}
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Color</FormLabel>
                                  <FormControl>
                                    <Input
                                      placeholder='e.g. red'
                                      {...field}
                                      onChange={(value) => {
                                        handleChangeTitle(index, autoTitle)
                                        field.onChange(value)
                                      }}
                                    />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            <FormField
                              control={form.control}
                              shouldUnregister
                              name={`productClassifications.${index}.append.size`}
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Size</FormLabel>
                                  <FormControl>
                                    <Input
                                      placeholder='e.g. XXL'
                                      {...field}
                                      onChange={(value) => {
                                        handleChangeTitle(index, autoTitle)
                                        field.onChange(value)
                                      }}
                                    />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            <FormField
                              control={form.control}
                              shouldUnregister
                              name={`productClassifications.${index}.append.other`}
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Other</FormLabel>
                                  <FormControl>
                                    <Input
                                      placeholder='e.g. Other classification type'
                                      {...field}
                                      onChange={(value) => {
                                        handleChangeTitle(index, autoTitle)
                                        field.onChange(value)
                                      }}
                                    />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </div>
                          <FormField
                            control={form.control}
                            shouldUnregister
                            name={`productClassifications.${index}.append.images`}
                            render={({ field }) => {
                              return (
                                <FormItem className='flex flex-col sm:col-span-2 col-span-1'>
                                  <FormLabel>Images Of Product</FormLabel>
                                  <UploadFiles
                                    triggerRef={triggerImageUploadRef}
                                    form={form}
                                    field={field}
                                    dropZoneConfigOptions={{
                                      maxFiles: 6
                                    }}
                                  />
                                  <FormMessage />
                                </FormItem>
                              )
                            }}
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
