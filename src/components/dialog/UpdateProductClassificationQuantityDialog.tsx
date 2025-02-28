import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { AlertTriangle } from 'lucide-react'
import { Dispatch, SetStateAction, useId, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { z } from 'zod'

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import useHandleServerError from '@/hooks/useHandleServerError'
import { useToast } from '@/hooks/useToast'
import { getAllProductApi, getProductApi } from '@/network/apis/product'
import { updateProductClassificationsQuantityApi } from '@/network/apis/product-classification'
import { IUpdateProductClassificationQuantitySchema } from '@/network/apis/product-classification/type'
import { getUpdateProductClassificationsQuantitySchema } from '@/schemas/product-classification.schema'
import { ClassificationTypeEnum, StatusEnum } from '@/types/enum'
import { IImage } from '@/types/image'
import { IResponseProduct } from '@/types/product'

import AlertMessage from '../alert/AlertMessage'
import Button from '../button'
import State from '../state'
import { Form, FormControl, FormField, FormItem, FormMessage } from '../ui/form'
import { InputNormal } from '../ui/input'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table'

interface UpdateProductClassificationQuantityDialogProps {
  product: IResponseProduct
  open: boolean
  setOpen: Dispatch<SetStateAction<boolean>>
  onOpenChange: (open: boolean) => void
  productQuantityWarning: number
}

export default function UpdateProductClassificationQuantityDialog({
  product,
  open,
  setOpen,
  onOpenChange,
  productQuantityWarning
}: UpdateProductClassificationQuantityDialogProps) {
  const { t } = useTranslation()
  const { successToast } = useToast()
  const handleServerError = useHandleServerError()
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const queryClient = useQueryClient()
  const UpdateProductQuantitySchema = getUpdateProductClassificationsQuantitySchema()
  const formId = useId()

  const hasCustomActive = product.productClassifications?.some(
    (classification) =>
      classification.type === ClassificationTypeEnum.CUSTOM && classification.status === StatusEnum.ACTIVE
  )

  const customClassifications = product.productClassifications?.filter(
    (classification) =>
      classification.type === ClassificationTypeEnum.CUSTOM && classification.status === StatusEnum.ACTIVE
  )

  const defaultClassification = product.productClassifications?.filter(
    (classification) =>
      classification.type === ClassificationTypeEnum.DEFAULT && classification.status === StatusEnum.ACTIVE
  )[0]
  const defaultValues = {
    classifications: hasCustomActive
      ? customClassifications.map((classification) => ({
          classificationId: classification.id,
          quantity: classification.quantity || 0
        }))
      : [
          {
            classificationId: defaultClassification?.id || '',
            quantity: defaultClassification?.quantity || 0
          }
        ]
  }

  const form = useForm<z.infer<typeof UpdateProductQuantitySchema>>({
    resolver: zodResolver(UpdateProductQuantitySchema),
    defaultValues: defaultValues
  })
  const watchedValues = form.watch('classifications') || {}
  const quantities = Object.values(watchedValues).map((item) => item.quantity || 0)
  const totalQuantity = quantities.reduce((sum, q) => sum + q, 0)
  const isQuantityTooLow = totalQuantity <= productQuantityWarning

  const { mutateAsync: updateProductQuantityFn } = useMutation({
    mutationKey: [updateProductClassificationsQuantityApi.mutationKey],
    mutationFn: updateProductClassificationsQuantityApi.fn,
    onSuccess: async () => {
      successToast({
        message: t('createProduct.updateProductClassificationQuantitySuccess')
      })
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: [getProductApi.queryKey] }),
        queryClient.invalidateQueries({ queryKey: [getAllProductApi.queryKey] })
      ])
      handleReset()
    }
  })

  async function onSubmit(values: IUpdateProductClassificationQuantitySchema) {
    try {
      setIsLoading(true)
      if (!isQuantityTooLow) {
        const payload = values.classifications.map((item) => ({
          classificationId: item.classificationId,
          quantity: Number(item.quantity)
        }))

        await updateProductQuantityFn(payload)
      }

      setIsLoading(false)
    } catch (error) {
      setIsLoading(false)
      handleServerError({
        error,
        form
      })
    }
  }

  const handleReset = () => {
    form.reset()
    setOpen(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='md:max-w-3xl sm:max-w-lg'>
        <DialogHeader className='flex flex-row items-start gap-4'>
          <AlertTriangle className='mt-2 h-6 w-6 text-orange-500' />
          <div className='flex-1 gap-2 items-start'>
            <DialogTitle className='text-lg'>{t(`order.cancelOrder`)}</DialogTitle>
            <DialogDescription></DialogDescription>
          </div>
        </DialogHeader>

        {isQuantityTooLow && (
          <AlertMessage
            message={t('productFormMessage.totalQuantityTooLow', { count: productQuantityWarning })}
            textSize='small'
          />
        )}
        <Form {...form}>
          <form noValidate onSubmit={form.handleSubmit(onSubmit)} className='w-full grid gap-4' id={`form-${formId}`}>
            {hasCustomActive ? (
              <Table className='w-full hover:bg-transparent items-center'>
                <TableHeader>
                  <TableRow>
                    <TableHead>{t('createProduct.sku')}</TableHead>
                    <TableHead>
                      <div className='flex justify-center'>{t('productDetail.images')}</div>
                    </TableHead>
                    <TableHead>
                      <div className='flex justify-end'>{t('cart.price')}</div>
                    </TableHead>
                    <TableHead>
                      <div className='flex justify-center'>{t('productDetail.quantity')}</div>
                    </TableHead>
                    <TableHead>
                      <div className='flex justify-center'>{t('orderDetail.status')}</div>
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {customClassifications.map((variant, index) => (
                    <TableRow key={index}>
                      <TableCell>{variant.sku === '' ? '-' : variant.sku}</TableCell>
                      <TableCell>
                        <div
                          className={`grid ${variant.images.length > 1 && 'sm:grid-cols-2'} grid-cols-1 gap-2 place-items-center w-full`}
                        >
                          {variant.images.map((image: IImage) => (
                            <div key={image.id} className='relative aspect-square w-32 h-32 rounded-lg overflow-hidden'>
                              <img className='object-cover w-full h-full' src={image.fileUrl} alt={variant.title} />
                            </div>
                          ))}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className='flex justify-end'>{t('productCard.price', { price: variant.price })}</div>
                        <div className='h-5'></div>
                      </TableCell>
                      <TableCell>
                        <div className='flex justify-center'>
                          <FormField
                            control={form.control}
                            name={`classifications.${index}.classificationId`}
                            render={({ field }) => (
                              <FormItem>
                                <FormControl>
                                  <InputNormal
                                    placeholder={t('createProduct.inputQuantity')}
                                    type='text'
                                    {...field}
                                    className='hidden'
                                  />
                                </FormControl>
                                <div className='h-5'>
                                  <FormMessage />
                                </div>
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={form.control}
                            name={`classifications.${index}.quantity`}
                            render={({ field }) => (
                              <FormItem>
                                <FormControl>
                                  <InputNormal
                                    placeholder={t('createProduct.inputQuantity')}
                                    type='number'
                                    {...field}
                                    value={field.value ?? ''}
                                    onChange={(e) => {
                                      const value = e.target.value
                                      field.onChange(value && parseFloat(value))
                                    }}
                                    className='border-primary/40 w-full'
                                  />
                                </FormControl>
                                <div className='h-5'>
                                  <FormMessage />
                                </div>
                              </FormItem>
                            )}
                          />
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className='flex justify-center'>
                          <State state={variant.status ?? StatusEnum.INACTIVE} />
                        </div>
                        <div className='h-5'></div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <>
                <FormField
                  control={form.control}
                  name={`classifications.${0}.classificationId`}
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <InputNormal
                          placeholder={t('createProduct.inputQuantity')}
                          type='text'
                          {...field}
                          className='hidden'
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name={`classifications.${0}.quantity`}
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <InputNormal
                          placeholder={t('createProduct.inputQuantity')}
                          type='number'
                          {...field}
                          value={field.value ?? ''}
                          onChange={(e) => {
                            const value = e.target.value
                            field.onChange(value && parseFloat(value))
                          }}
                          className='border-primary/40 w-full'
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </>
            )}
            <div className='flex justify-end gap-2 mt-4'>
              <Button
                type='button'
                variant='outline'
                onClick={() => {
                  onOpenChange(false)
                  handleReset()
                }}
              >
                {t(`button.cancel`)}
              </Button>
              <Button loading={isLoading} type='submit'>
                {t(`button.ok`)}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
