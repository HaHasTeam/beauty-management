'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { ImageIcon, Search, Trash2 } from 'lucide-react'
import { useId, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import type { z } from 'zod'

import fallBackImage from '@/assets/images/fallBackImage.jpg'
import Button from '@/components/button'
import FormLabel from '@/components/form-label'
import { Card, CardContent } from '@/components/ui/card'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Form, FormControl, FormDescription, FormField, FormItem, FormMessage } from '@/components/ui/form'
import { Textarea } from '@/components/ui/textarea'
import useHandleServerError from '@/hooks/useHandleServerError'
import { useToast } from '@/hooks/useToast'
import { updateBookingStatusApi } from '@/network/apis/booking/details'
import { uploadFilesApi } from '@/network/apis/file'
import { getConsultationResultSchema } from '@/schemas/booking.schema'
import type { IBooking } from '@/types/booking'
import { BookingStatusEnum } from '@/types/enum'
import type { IResponseProduct, IServerProductClassification } from '@/types/product'

import UploadMediaFiles from '../file-input/UploadMediaFiles'
import ImageWithFallback from '../image/ImageWithFallback'
import ProductSearchDialog from '../product/ProductSearchDialog'
import { ScrollArea } from '../ui/scroll-area'

// Extend IResponseProduct to include selectedClassification
interface ExtendedResponseProduct extends IResponseProduct {
  selectedClassification?: IServerProductClassification
}

interface CompleteConsultingCallDialogProps {
  booking: IBooking
  isOpen: boolean
  onClose: () => void
}

// Define a type for selected products with classification
// interface SelectedProductWithClassification {
//   product: IResponseProduct
//   classification?: IServerProductClassification
// }

// Extended type for product classifications with additional data
interface ExtendedProductClassification {
  productClassificationId: string
  name: string
  price?: number
  imageUrl?: string
  productId: string
  productName: string
  classificationType?: string
}

const ConsultationResultDialog = ({ booking, isOpen, onClose }: CompleteConsultingCallDialogProps) => {
  const MAX_IMAGES = 3
  const MAX_SIZE_NUMBER = 15
  const MAX_SIZE = MAX_SIZE_NUMBER * 1024 * 1024
  const { t } = useTranslation()
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const { successToast } = useToast()
  const handleServerError = useHandleServerError()
  const id = useId()
  const queryClient = useQueryClient()
  const ConsultationResultSchema = getConsultationResultSchema()

  // Get the consultation criteria from the booking
  const consultationCriteria = booking?.consultantService?.systemService.consultationCriteria || {
    id: '',
    consultationCriteriaSections: []
  }

  // Format criteria sections for form
  const formattedCriteriaSections = consultationCriteria.consultationCriteriaSections || []

  // Prepare default values for the form
  const defaultFormValues = {
    criteriaId: consultationCriteria.id,
    criteria: formattedCriteriaSections.map((section) => ({
      section: section.section,
      orderIndex: section.orderIndex
    })),
    results: formattedCriteriaSections.map((section) => ({
      section: section.section,
      orderIndex: section.orderIndex,
      answers: '',
      images: []
    })),
    suggestedProductClassifications: []
  }

  const [searchModalVisible, setSearchModalVisible] = useState(false)
  const [selectedProducts, setSelectedProducts] = useState<ExtendedResponseProduct[]>([])
  const [productClassificationsMap, setProductClassificationsMap] = useState<
    Map<string, ExtendedProductClassification>
  >(new Map())

  const form = useForm<z.infer<typeof ConsultationResultSchema>>({
    resolver: zodResolver(ConsultationResultSchema),
    defaultValues: defaultFormValues
  })

  const handleReset = () => {
    form.reset(defaultFormValues)
    setSelectedProducts([])
    setProductClassificationsMap(new Map())
  }

  const { mutateAsync: uploadFilesFn } = useMutation({
    mutationKey: [uploadFilesApi.mutationKey],
    mutationFn: uploadFilesApi.fn
  })

  const convertFileToUrl = async (files: File[]) => {
    const formData = new FormData()
    files.forEach((file) => {
      formData.append('files', file)
    })

    const uploadedFilesResponse = await uploadFilesFn(formData)
    return uploadedFilesResponse.data
  }

  const { mutateAsync: updateBookingStatusFn } = useMutation({
    mutationKey: [updateBookingStatusApi.mutationKey],
    mutationFn: updateBookingStatusApi.fn,
    onSuccess: async () => {
      successToast({
        message: t('booking.submitConsultationResultSuccess')
      })
      await Promise.all([queryClient.invalidateQueries({ queryKey: ['getBookingById'] })])
      handleReset()
      onClose()
    }
  })

  const handleSubmit = async (values: z.infer<typeof ConsultationResultSchema>) => {
    try {
      setIsLoading(true)

      const formatReulst = await Promise.all(
        values.results.map(async (item) => {
          const imgUrls = item.images ? await convertFileToUrl(item.images) : []

          return {
            ...item,
            images: imgUrls.map((el) => ({
              name: '',
              fileUrl: el
            }))
          }
        })
      )
      await updateBookingStatusFn({
        id: booking.id,
        status: BookingStatusEnum.SENDED_RESULT_SHEET,
        consultationResult: {
          ...values,
          results: formatReulst
        }
      })
      setIsLoading(false)
    } catch (error) {
      setIsLoading(false)
      handleServerError({
        error,
        form
      })
    }
  }

  // Function to remove a product classification
  const handleRemoveProductClassification = (id: string) => {
    // Get the current product classifications from the form
    const currentValues = form.getValues().suggestedProductClassifications

    // Filter out the one to remove
    const updatedClassifications = currentValues.filter((p) => p.productClassificationId !== id)

    // Update the form value
    form.setValue('suggestedProductClassifications', updatedClassifications)

    // Remove from the map
    const newMap = new Map(productClassificationsMap)
    newMap.delete(id)
    setProductClassificationsMap(newMap)

    // Update the selected products state
    const productId = Array.from(productClassificationsMap.values()).find(
      (item) => item.productClassificationId === id
    )?.productId

    if (productId) {
      setSelectedProducts((prev) =>
        prev.filter(
          (item) => item.id !== productId || (item.selectedClassification && item.selectedClassification.id !== id)
        )
      )
    }
  }

  // Function to handle product selection from the search dialog
  const handleSelectProducts = (products: ExtendedResponseProduct[]) => {
    // Create a new map to store extended product classification data
    const newProductClassificationsMap = new Map<string, ExtendedProductClassification>()
    const formProductClassifications: { productClassificationId: string; name: string; productId: string }[] = []

    // Process each product
    products.forEach((product) => {
      // Get the selected classification from the product
      const selectedClassification = product.selectedClassification

      // Add to form data and map
      if (selectedClassification) {
        const classificationId = selectedClassification.id || ''
        const classificationTitle = selectedClassification.title == 'Default' ? '' : selectedClassification.title || ''

        // Only add if we have a valid classification ID
        if (classificationId) {
          formProductClassifications.push({
            productClassificationId: classificationId,
            productId: product.id || '',
            name: product.name || ''
          })

          newProductClassificationsMap.set(classificationId, {
            productClassificationId: classificationId,
            name: classificationTitle,
            price: selectedClassification.price,
            imageUrl: product.images?.[0]?.fileUrl,
            productId: product.id || '',
            productName: product.name || '',
            classificationType: classificationTitle === 'default' ? '' : classificationTitle
          })
        }
      } else {
        // If no classification, use the product directly
        const productId = product.id || ''
        if (productId) {
          formProductClassifications.push({
            productClassificationId: productId,
            productId: productId,
            name: product.name || ''
          })

          newProductClassificationsMap.set(productId, {
            productClassificationId: productId,
            name: product.name || '',
            imageUrl: product.images?.[0]?.fileUrl,
            productId: productId,
            productName: product.name || ''
          })
        }
      }
    })

    // Update states
    setSelectedProducts(products)
    setProductClassificationsMap(newProductClassificationsMap)
    form.setValue('suggestedProductClassifications', formProductClassifications)
  }

  // Display booking form answers for reference
  const bookingFormAnswer = booking?.bookingFormAnswer || { form: [], answers: [] }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className='xl:max-w-7xl lg:max-w-7xl sm:max-w-2xl max-h-[90vh] overflow-y-auto'>
        <DialogHeader>
          <DialogTitle className='text-primary'>{t('booking.completeConsultation')}</DialogTitle>
          <DialogDescription className='text-justify'>{t('booking.completeConsultationDescription')}</DialogDescription>
        </DialogHeader>

        <div className='w-full flex flex-col sm:flex-row gap-3 justify-between relative'>
          <ScrollArea className='sm:w-1/2 w-full h-[75vh]'>
            <div className='mb-6 p-4 bg-primary/10 rounded-md h-fit'>
              <h3 className='font-semibold mb-2 text-primary'>{t('booking.customerResponses')}</h3>
              <div className='space-y-3'>
                {bookingFormAnswer.answers?.map((answer, index) => (
                  <div key={`answer-${index}`} className='space-y-1'>
                    <p className='font-medium'>{answer.question}</p>
                    <div className='pl-4'>
                      {answer.answers.text ? (
                        <p className='text-sm'>{answer.answers.text}</p>
                      ) : (
                        <div className='flex flex-wrap gap-1'>
                          {Object.values(answer.answers).map((value, i) => (
                            <span key={i} className='text-sm bg-primary/10 rounded px-2 py-1 text-primary'>
                              {value}
                            </span>
                          ))}
                        </div>
                      )}
                      <div className='flex gap-2 items-center mt-2'>
                        {(answer.images ?? []).map((item, imageIndex) => {
                          return (
                            <ImageWithFallback
                              key={imageIndex}
                              src={item.fileUrl || '/placeholder.svg'}
                              fallback={fallBackImage}
                              alt={''}
                              className='object-cover aspect-square w-32 h-32 rounded-md'
                            />
                          )
                        })}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </ScrollArea>
          <ScrollArea className='sm:w-1/2 w-full h-[75vh]'>
            <Form {...form}>
              <form noValidate onSubmit={form.handleSubmit(handleSubmit)} className='space-y-6' id={`form-${id}`}>
                <div className='space-y-6'>
                  {formattedCriteriaSections.map((section, index) => (
                    <div key={`section-${index}`} className='p-4 border border-primary rounded-md'>
                      <h3 className='font-medium mb-2 text-primary'>{section.section}</h3>
                      <p className='text-sm text-muted-foreground mb-4 whitespace-pre-line'>{section.description}</p>

                      <FormField
                        control={form.control}
                        name={`results.${index}.answers`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className='text-primary' required={section.mandatory}>
                              {t('booking.yourEvaluation')}
                            </FormLabel>
                            <FormControl>
                              <Textarea
                                placeholder={t('booking.enterYourEvaluation')}
                                className='resize-none'
                                rows={4}
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <div className='mt-4'>
                        <FormField
                          control={form.control}
                          name={`results.${index}.images`}
                          render={({ field }) => (
                            <FormItem className='w-full'>
                              <div className='w-full flex flex-col gap-2'>
                                <div className='w-full space-y-1'>
                                  <FormLabel className='text-primary'>{t('feedback.uploadImages')}</FormLabel>
                                  <FormDescription>{t('booking.imagesHint')}</FormDescription>
                                </div>
                                <div className='w-full space-y-1'>
                                  <UploadMediaFiles
                                    field={field}
                                    vertical={false}
                                    isAcceptImage={true}
                                    isAcceptVideo={false}
                                    maxImages={MAX_IMAGES}
                                    maxVideos={0}
                                    dropZoneConfigOptions={{
                                      maxFiles: MAX_IMAGES,
                                      maxSize: MAX_SIZE
                                    }}
                                    renderFileItemUI={(file) => (
                                      <div
                                        key={file.name}
                                        className='hover:border-primary w-32 h-32 rounded-lg border border-gay-300 p-0 relative'
                                      >
                                        <ImageWithFallback
                                          src={URL.createObjectURL(file) || '/placeholder.svg'}
                                          alt={file.name}
                                          fallback={fallBackImage}
                                          className='object-contain w-full h-full rounded-lg'
                                          onLoad={() => URL.revokeObjectURL(URL.createObjectURL(file))}
                                        />
                                      </div>
                                    )}
                                    renderInputUI={(_isDragActive, files, maxFiles) => (
                                      <div className='w-32 h-32 hover:bg-primary/15 p-4 rounded-lg border flex flex-col gap-2 items-center justify-center text-center border-dashed border-primary transition-all duration-500'>
                                        <ImageIcon className='w-8 h-8 text-primary' />
                                        <p className='text-xs text-muted-foreground'>
                                          {files.length}/{maxFiles} {t('media.imagesFile')}
                                        </p>
                                      </div>
                                    )}
                                  />
                                  <FormMessage />
                                </div>
                              </div>
                            </FormItem>
                          )}
                        />
                      </div>
                    </div>
                  ))}
                </div>

                <div className='p-4 border border-primary rounded-md'>
                  <h3 className='font-medium mb-4 text-primary'>{t('booking.suggestedProducts')}</h3>

                  <div className='flex flex-col gap-4'>
                    <div className='flex gap-2'>
                      <Button
                        type='button'
                        variant='outline'
                        className='flex items-center gap-2 w-full'
                        onClick={() => setSearchModalVisible(true)}
                      >
                        <Search className='h-4 w-4' />
                        {t('booking.searchForProducts')}
                      </Button>
                    </div>

                    {/* Display selected products as cards */}
                    {form.watch('suggestedProductClassifications')?.length > 0 && (
                      <div className='grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4'>
                        {Array.from(productClassificationsMap.values()).map((product) => (
                          <Card key={product.productClassificationId} className='overflow-hidden border border-muted'>
                            <CardContent className='p-3 flex gap-3'>
                              {/* Product Image */}
                              <div className='h-16 w-16 rounded-md overflow-hidden flex-shrink-0'>
                                <ImageWithFallback
                                  src={product.imageUrl || '/placeholder.svg'}
                                  fallback={fallBackImage}
                                  alt={product.productName}
                                  className='object-cover w-full h-full'
                                />
                              </div>

                              {/* Product Info */}
                              <div className='flex-1 min-w-0 flex flex-col justify-between'>
                                <div>
                                  <p className='font-medium truncate'>{product.productName}</p>
                                  {product.classificationType && (
                                    <p className='text-sm text-muted-foreground truncate'>
                                      {product.classificationType}
                                    </p>
                                  )}
                                </div>

                                <div className='flex justify-between items-center mt-1'>
                                  <p className='font-medium'>
                                    {product.price !== undefined
                                      ? t('productCard.price', { price: product.price })
                                      : t('product.priceNotAvailable')}
                                  </p>
                                  <button
                                    type='button'
                                    onClick={() => handleRemoveProductClassification(product.productClassificationId)}
                                    className='text-destructive hover:text-destructive/80 transition-colors'
                                  >
                                    <Trash2 className='h-4 w-4' />
                                  </button>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                <div className='flex justify-end space-x-2'>
                  <Button variant='outline' type='button' onClick={onClose}>
                    {t('common.cancel')}
                  </Button>
                  <Button type='submit' loading={isLoading}>
                    {t('common.submit')}
                  </Button>
                </div>
              </form>
            </Form>
          </ScrollArea>
        </div>
        {/* Product Search Dialog */}
        <ProductSearchDialog
          open={searchModalVisible}
          onOpenChange={setSearchModalVisible}
          onSelectProducts={handleSelectProducts}
          initialSelectedProducts={selectedProducts}
          title={t('booking.selectProducts')}
        />
      </DialogContent>
    </Dialog>
  )
}

export default ConsultationResultDialog
