import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { CircleChevronRight, Siren } from 'lucide-react'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { z } from 'zod'

import useHandleServerError from '@/hooks/useHandleServerError'
import { useToast } from '@/hooks/useToast'
import { updateProductStatusApi } from '@/network/apis/product'
import { getProductApi } from '@/network/product'
import { getUpdateProductStatusSchema } from '@/schemas/product.schema'
import { ProductEnum } from '@/types/enum'
import { IResponseProduct } from '@/types/product'

import Button from '../button'
import { AlertDescription } from '../ui/alert'

interface UpdateProductStatusProps {
  product: IResponseProduct
}

export default function UpdateProductStatus({ product }: UpdateProductStatusProps) {
  const { t } = useTranslation()
  const { successToast } = useToast()
  const handleServerError = useHandleServerError()
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const queryClient = useQueryClient()
  const UpdateProductStatusSchema = getUpdateProductStatusSchema()

  const defaultProductValues = {
    status: ''
  }
  const handleReset = () => {
    form.reset()
  }
  const form = useForm<z.infer<typeof UpdateProductStatusSchema>>({
    resolver: zodResolver(UpdateProductStatusSchema),
    defaultValues: defaultProductValues
  })
  const { mutateAsync: updateProductStatusFn } = useMutation({
    mutationKey: [updateProductStatusApi.mutationKey],
    mutationFn: updateProductStatusApi.fn,
    onSuccess: async () => {
      successToast({
        message: t('createProduct.updateProductStatusSuccess')
      })
      await Promise.all([queryClient.invalidateQueries({ queryKey: [getProductApi.queryKey] })])
      handleReset()
    }
  })
  async function handleUpdateStatus(values: z.infer<typeof UpdateProductStatusSchema>) {
    try {
      setIsLoading(true)
      await updateProductStatusFn({ id: product?.id ?? '', status: values.status })
      setIsLoading(false)
    } catch (error) {
      setIsLoading(false)
      handleServerError({
        error,
        form
      })
    }
  }

  if (!product) return null
  const statusConfig = {
    [ProductEnum.PRE_ORDER]: {
      borderColor: 'border-yellow-300',
      bgColor: 'bg-yellow-100',
      bgTagColor: 'bg-yellow-200',
      titleColor: 'text-yellow-500',
      alertVariant: 'bg-yellow-50 rounded-lg p-3 border',
      buttonBg: '',
      alertTitle: t(`status.${ProductEnum.PRE_ORDER}`),
      buttonText: '',
      alertDescription: t(`createProduct.statusDescription.${ProductEnum.PRE_ORDER}`),
      nextStatus: ''
    },
    [ProductEnum.OFFICIAL]: {
      borderColor: 'border-green-300',
      bgColor: 'bg-green-100',
      bgTagColor: 'bg-green-300',
      titleColor: 'text-green-600',
      alertVariant: 'bg-green-100 rounded-lg p-3 border',
      buttonBg: 'bg-gray-500 hover:bg-gray-400',
      alertTitle: t(`status.${ProductEnum.OFFICIAL}`),
      buttonText: t(`status.${ProductEnum.INACTIVE}`),
      alertDescription: t(`createProduct.statusDescription.${ProductEnum.OFFICIAL}`),
      nextStatus: ProductEnum.INACTIVE
    },
    [ProductEnum.OUT_OF_STOCK]: {
      borderColor: 'border-red-300',
      bgColor: 'bg-red-100',
      bgTagColor: 'bg-red-200',
      titleColor: 'text-red-600',
      alertVariant: 'bg-red-100 rounded-lg p-3 border',
      buttonBg: '',
      alertTitle: t(`status.${ProductEnum.OUT_OF_STOCK}`),
      buttonText: '',
      alertDescription: t(`createProduct.statusDescription.${ProductEnum.OUT_OF_STOCK}`),
      nextStatus: ''
    },
    [ProductEnum.INACTIVE]: {
      borderColor: 'border-gray-400',
      bgColor: 'bg-gray-200',
      bgTagColor: 'bg-gray-300',
      titleColor: 'text-gray-600',
      alertVariant: 'bg-gray-200 rounded-lg p-3 border',
      buttonBg: 'bg-green-500 hover:bg-green-400',
      alertTitle: t(`status.${ProductEnum.INACTIVE}`),
      buttonText: t(`status.${ProductEnum.OFFICIAL}`),
      alertDescription: t(`createProduct.statusDescription.${ProductEnum.INACTIVE}`),
      nextStatus: ProductEnum.OFFICIAL
    }
  }

  const config = statusConfig[product.status as ProductEnum]
  if (!config) return null
  return (
    <div className={`${config.alertVariant} ${config.borderColor}`}>
      <div className='flex items-center gap-2 justify-between'>
        <div className='flex items-center gap-2'>
          <Siren className='size-4' />
          <div className='flex flex-col gap-1'>
            {/* <AlertTitle className='flex items-center gap-2'>
            <span
              className={`p-0.5 px-2 rounded-lg border ${config.borderColor} ${config.bgColor} ${config.titleColor}`}
            >
              {config.alertTitle}
            </span>
          </AlertTitle> */}
            <div>
              <span
                className={`px-2 py-1 sm:text-sm text-xs rounded-full uppercase cursor-default font-bold ${config.titleColor} ${config.bgTagColor}`}
              >
                {config.alertTitle}
              </span>
            </div>
            <AlertDescription>{config.alertDescription}</AlertDescription>
          </div>
        </div>
        <div className='flex gap-2 items-center'>
          {config.nextStatus && config.nextStatus !== '' && (
            <Button
              onClick={() => {
                handleUpdateStatus({ status: config.nextStatus })
              }}
              loading={isLoading}
              className={`${config.buttonBg} flex gap-2`}
            >
              {config.buttonText}
              <CircleChevronRight />
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}
