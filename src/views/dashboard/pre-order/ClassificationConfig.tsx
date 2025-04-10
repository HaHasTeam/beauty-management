import { Package, Plus, Trash2 } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useFieldArray, UseFormReturn } from 'react-hook-form'

import UploadFiles, { TriggerUploadRef } from '@/components/file-input/UploadFiles'
import FormLabel from '@/components/form-label'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog'
import { FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { TFile } from '@/types/file'
import { ProductClassificationTypeEnum } from '@/types/product'

import { SchemaType } from './helper'

type Props = {
  form: UseFormReturn<SchemaType>
  triggerImageUploadRef: React.RefObject<TriggerUploadRef>
  productId?: string
}

const MAX_CLASSIFICATION_LEVEL = 3
const MAX_PRODUCT_CLASSIFICATION_IMAGES = 6

const ClassificationConfig = ({ form, triggerImageUploadRef, productId }: Props) => {
  const { fields, append, remove, replace } = useFieldArray({
    control: form.control,
    name: 'productClassifications'
  })

  // State for delete confirmation dialog
  const [dialogOpen, setDialogOpen] = useState(false)
  const [indexToDelete, setIndexToDelete] = useState<number | null>(null)
  const [classificationsOptions, setClassificationsOptions] = useState<{ title: string; options: string[] }[]>([
    { title: 'color', options: [] },
    { title: 'size', options: [] },
    { title: 'other', options: [] }
  ])
  const [previousProductId, setPreviousProductId] = useState<string | undefined>(productId)

  // Handle showing delete confirmation dialog
  const handleShowDeleteDialog = (index: number) => {
    const classification = fields[index]
    if (classification?.id) {
      setIndexToDelete(index)
      setDialogOpen(true)
    } else {
      remove(index)
    }
  }

  // Handle confirming deletion in dialog
  const handleConfirmDelete = () => {
    if (indexToDelete !== null) {
      remove(indexToDelete)
      setIndexToDelete(null)
      setDialogOpen(false)
    }
  }

  // Handle cancelling deletion
  const handleCancelDelete = () => {
    setIndexToDelete(null)
    setDialogOpen(false)
  }

  const handleAddMore = async () => {
    const res = await form.trigger('productClassifications')
    if (res) {
      append({
        append: {
          images: [] as TFile[],
          type: ProductClassificationTypeEnum.CUSTOM,
          color: '',
          size: '',
          other: '',
          price: 0,
          quantity: 0,
          sku: '',
          title: ''
        },
        rawClassification: {
          images: []
        }
      } as SchemaType['productClassifications'][0])
    }
  }

  // Reset classifications when product changes
  useEffect(() => {
    // Only reset if productId changes and is not undefined
    if (productId && productId !== previousProductId) {
      // Clear all existing classifications first
      replace([])

      // Then add one empty classification
      append({
        append: {
          images: [] as TFile[],
          type: ProductClassificationTypeEnum.CUSTOM,
          color: '',
          size: '',
          other: '',
          price: 0,
          quantity: 0,
          sku: '',
          title: ''
        },
        rawClassification: {
          images: []
        }
      } as SchemaType['productClassifications'][0])

      // Reset initialClassifications
      form.setValue('initialClassifications', [])

      // Update the previous product id
      setPreviousProductId(productId)
    }
  }, [productId, previousProductId, replace, append, form])

  // Synchronize form data with internal state
  useEffect(() => {
    // Extract unique classification values from form data
    const colorValues = new Set<string>()
    const sizeValues = new Set<string>()
    const otherValues = new Set<string>()

    fields.forEach((field) => {
      if (field.append?.color) colorValues.add(field.append.color)
      if (field.append?.size) sizeValues.add(field.append.size)
      if (field.append?.other) otherValues.add(field.append.other)
    })

    // Update classifications options
    setClassificationsOptions([
      { title: 'color', options: Array.from(colorValues).filter(Boolean) },
      { title: 'size', options: Array.from(sizeValues).filter(Boolean) },
      { title: 'other', options: Array.from(otherValues).filter(Boolean) }
    ])
  }, [fields])

  return (
    <div className='w-full p-4 lg:p-6 bg-white rounded-lg shadow-md space-y-4'>
      <Accordion
        type='single'
        collapsible
        className='w-full'
        defaultValue='product-classifications'
        disabled={!productId}
      >
        <AccordionItem value='product-classifications'>
          <AccordionTrigger className='pt-0 text-left font-medium no-underline hover:no-underline'>
            <div className='flex gap-2 items-center text-primary'>
              <Package className='w-5 h-5' />
              <h2 className='font-bold text-xl'>Classification Information</h2>
            </div>
          </AccordionTrigger>
          <AccordionContent>
            {!productId ? (
              <div className='text-center p-4 bg-yellow-50 border border-yellow-200 rounded-md text-yellow-700'>
                Please select a product first to configure classifications
              </div>
            ) : (
              <div className='space-y-3'>
                <div className='w-full space-y-3'>
                  <div className='w-full flex gap-2 items-center'>
                    <div className='w-[20%] flex items-center'>
                      <FormLabel required>Product Classification</FormLabel>
                    </div>
                    {fields.length < MAX_CLASSIFICATION_LEVEL && (
                      <Button
                        variant='outline'
                        size='sm'
                        type='button'
                        className='flex items-center gap-1'
                        onClick={handleAddMore}
                      >
                        <Plus className='w-4 h-4' />
                        Add Classification
                      </Button>
                    )}
                  </div>

                  <div className='w-full space-y-1'>
                    <div className='w-full space-y-3'>
                      {/* Classification Options Section */}
                      <div className='bg-primary/10 rounded-lg p-4 space-y-3'>
                        <div className='flex items-center justify-between'>
                          <h3 className='text-md font-semibold text-primary'>Classification Types</h3>
                        </div>
                        {classificationsOptions.map((classification, index) => (
                          <div className='bg-primary/10 rounded-lg p-4 space-y-3' key={classification?.title || index}>
                            <div className='space-y-2'>
                              <div className='flex gap-2 items-center'>
                                <FormLabel>
                                  {classification.title.charAt(0).toUpperCase() + classification.title.slice(1)}
                                </FormLabel>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* Classification Table Section */}
                      {fields.length > 0 && (
                        <div className='mt-4 bg-primary/10 rounded-lg p-4 space-y-2'>
                          <h3 className='text-md font-semibold text-primary'>Classifications</h3>
                          <div>
                            <Table className='hover:bg-transparent items-center'>
                              <TableHeader>
                                <TableRow>
                                  <TableHead>
                                    <FormLabel required className='justify-center text-center'>
                                      Color
                                    </FormLabel>
                                  </TableHead>
                                  <TableHead>
                                    <FormLabel required className='justify-center text-center'>
                                      Size
                                    </FormLabel>
                                  </TableHead>
                                  <TableHead>
                                    <FormLabel required className='justify-center text-center'>
                                      Other
                                    </FormLabel>
                                  </TableHead>
                                  <TableHead>
                                    <FormLabel required className='justify-center text-center'>
                                      Price
                                    </FormLabel>
                                  </TableHead>
                                  <TableHead>
                                    <FormLabel required className='justify-center text-center'>
                                      Quantity
                                    </FormLabel>
                                  </TableHead>
                                  <TableHead>
                                    <FormLabel required className='justify-center text-center'>
                                      SKU
                                    </FormLabel>
                                  </TableHead>
                                  <TableHead>
                                    <FormLabel className='justify-center text-center'>Images</FormLabel>
                                  </TableHead>
                                  <TableHead>
                                    <FormLabel className='justify-center text-center'>Action</FormLabel>
                                  </TableHead>
                                </TableRow>
                              </TableHeader>
                              <TableBody>
                                {fields.map((field, index) => (
                                  <TableRow key={field.id}>
                                    <TableCell>
                                      <FormField
                                        control={form.control}
                                        name={`productClassifications.${index}.append.color`}
                                        shouldUnregister
                                        render={({ field }) => (
                                          <FormItem>
                                            <FormControl>
                                              <Input placeholder='e.g. Red' {...field} />
                                            </FormControl>
                                            <FormMessage />
                                          </FormItem>
                                        )}
                                      />
                                    </TableCell>
                                    <TableCell>
                                      <FormField
                                        control={form.control}
                                        name={`productClassifications.${index}.append.size`}
                                        shouldUnregister
                                        render={({ field }) => (
                                          <FormItem>
                                            <FormControl>
                                              <Input placeholder='e.g. XL' {...field} />
                                            </FormControl>
                                            <FormMessage />
                                          </FormItem>
                                        )}
                                      />
                                    </TableCell>
                                    <TableCell>
                                      <FormField
                                        control={form.control}
                                        name={`productClassifications.${index}.append.other`}
                                        shouldUnregister
                                        render={({ field }) => (
                                          <FormItem>
                                            <FormControl>
                                              <Input placeholder='e.g. Style' {...field} />
                                            </FormControl>
                                            <FormMessage />
                                          </FormItem>
                                        )}
                                      />
                                    </TableCell>
                                    <TableCell>
                                      <FormField
                                        control={form.control}
                                        name={`productClassifications.${index}.append.price`}
                                        shouldUnregister
                                        render={({ field }) => (
                                          <FormItem>
                                            <FormControl>
                                              <Input type='number' placeholder='e.g. 100000' {...field} />
                                            </FormControl>
                                            <FormMessage />
                                          </FormItem>
                                        )}
                                      />
                                    </TableCell>
                                    <TableCell>
                                      <FormField
                                        control={form.control}
                                        name={`productClassifications.${index}.append.quantity`}
                                        shouldUnregister
                                        render={({ field }) => (
                                          <FormItem>
                                            <FormControl>
                                              <Input type='number' placeholder='e.g. 10' {...field} />
                                            </FormControl>
                                            <FormMessage />
                                          </FormItem>
                                        )}
                                      />
                                    </TableCell>
                                    <TableCell>
                                      <FormField
                                        control={form.control}
                                        name={`productClassifications.${index}.append.sku`}
                                        shouldUnregister
                                        render={({ field }) => (
                                          <FormItem>
                                            <FormControl>
                                              <Input placeholder='e.g. RED-XL-001' {...field} />
                                            </FormControl>
                                            <FormMessage />
                                          </FormItem>
                                        )}
                                      />
                                    </TableCell>
                                    <TableCell>
                                      <FormField
                                        control={form.control}
                                        name={`productClassifications.${index}.append.images`}
                                        shouldUnregister
                                        render={({ field }) => (
                                          <FormItem>
                                            <div className='flex w-full'>
                                              <FormControl>
                                                <div className='relative w-full space-y-1 flex flex-col justify-center items-center'>
                                                  <UploadFiles
                                                    triggerRef={triggerImageUploadRef}
                                                    form={form}
                                                    field={field}
                                                    dropZoneConfigOptions={{
                                                      maxFiles: MAX_PRODUCT_CLASSIFICATION_IMAGES
                                                    }}
                                                  />
                                                  <FormMessage />
                                                </div>
                                              </FormControl>
                                            </div>
                                          </FormItem>
                                        )}
                                      />
                                    </TableCell>
                                    <TableCell>
                                      <div className='flex justify-center align-middle'>
                                        <Trash2
                                          onClick={() => handleShowDeleteDialog(index)}
                                          className={`text-destructive cursor-pointer hover:text-destructive/80 ${
                                            fields.length <= 1 ? 'opacity-40' : ''
                                          }`}
                                          size={18}
                                        />
                                      </div>
                                    </TableCell>
                                  </TableRow>
                                ))}
                              </TableBody>
                            </Table>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </AccordionContent>
        </AccordionItem>
      </Accordion>

      {/* Delete Confirmation Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Classification Deletion</DialogTitle>
            <DialogDescription>
              Deleting this classification and recreating it with similar information may affect current shopping
              activities. Customers who have ordered with this classification might be impacted.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className='mt-4 flex space-x-2 justify-end'>
            <Button variant='outline' type='button' onClick={handleCancelDelete}>
              Cancel
            </Button>
            <Button variant='destructive' type='button' onClick={handleConfirmDelete}>
              Confirm Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default ClassificationConfig
