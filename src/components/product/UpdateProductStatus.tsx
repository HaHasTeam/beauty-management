import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { CircleChevronRight, Siren } from 'lucide-react'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { z } from 'zod'
import { useShallow } from 'zustand/react/shallow'

import useHandleServerError from '@/hooks/useHandleServerError'
import { useToast } from '@/hooks/useToast'
import { getAllProductApi, getProductApi, updateProductStatusApi } from '@/network/apis/product'
import { getUpdateProductStatusSchema } from '@/schemas/product.schema'
import { useStore } from '@/stores/store'
import { ProductEnum, RoleEnum } from '@/types/enum'
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
  const { user } = useStore(
    useShallow((state) => ({
      user: state.user
    }))
  )

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
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: [getProductApi.queryKey] }),
        queryClient.invalidateQueries({
          queryKey: [getAllProductApi.queryKey]
        })
      ])
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
      buttonText: t(`status.button_${ProductEnum.INACTIVE}`),
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
      buttonText: t(`status.button_${ProductEnum.OFFICIAL}`),
      alertDescription: t(`createProduct.statusDescription.${ProductEnum.INACTIVE}`),
      nextStatus: ProductEnum.OFFICIAL
    },
    [ProductEnum.BANNED]: {
      borderColor: 'border-red-400',
      bgColor: 'bg-red-200',
      bgTagColor: 'bg-red-300',
      titleColor: 'text-red-600',
      alertVariant: 'bg-red-200 rounded-lg p-3 border',
      buttonBg: 'bg-green-500 hover:bg-green-400',
      alertTitle: t(`status.${ProductEnum.BANNED}`),
      buttonText: t(`status.button_${ProductEnum.OFFICIAL}`),
      alertDescription: t(`createProduct.statusDescription.${ProductEnum.BANNED}`),
      nextStatus: ProductEnum.OFFICIAL
    },
    [ProductEnum.UN_PUBLISHED]: {
      borderColor: 'border-purple-400',
      bgColor: 'bg-purple-200',
      bgTagColor: 'bg-purple-300',
      titleColor: 'text-purple-600',
      alertVariant: 'bg-purple-200 rounded-lg p-3 border',
      buttonBg: 'bg-green-500 hover:bg-green-400',
      alertTitle: t(`status.${ProductEnum.UN_PUBLISHED}`),
      buttonText: t(`status.button_${ProductEnum.OFFICIAL}`),
      alertDescription: t(`createProduct.statusDescription.${ProductEnum.UN_PUBLISHED}`),
      nextStatus: ProductEnum.OFFICIAL
    },
    [ProductEnum.FLASH_SALE]: {
      borderColor: 'border-orange-400',
      bgColor: 'bg-orange-200',
      bgTagColor: 'bg-orange-300',
      titleColor: 'text-orange-600',
      alertVariant: 'bg-orange-200 rounded-lg p-3 border',
      buttonBg: 'bg-green-500 hover:bg-green-400',
      alertTitle: t(`status.${ProductEnum.FLASH_SALE}`),
      buttonText: t(`status.button_${ProductEnum.OFFICIAL}`),
      alertDescription: t(`createProduct.statusDescription.${ProductEnum.FLASH_SALE}`),
      nextStatus: ProductEnum.OFFICIAL
    }
  }
  const getNextStatusButtons = (currentStatus: ProductEnum) => {
    if (currentStatus === ProductEnum.BANNED && (user.role === RoleEnum.MANAGER || user.role === RoleEnum.STAFF)) {
      return []
    }
    const buttons = []

    if (currentStatus === ProductEnum.UN_PUBLISHED || currentStatus === ProductEnum.INACTIVE) {
      buttons.push({
        status: ProductEnum.OFFICIAL,
        text: t(`status.button_${ProductEnum.OFFICIAL}`),
        bg: 'bg-green-500 hover:bg-green-400'
      })
    }
    if (
      currentStatus === ProductEnum.OFFICIAL ||
      currentStatus === ProductEnum.FLASH_SALE ||
      currentStatus === ProductEnum.OUT_OF_STOCK
    ) {
      buttons.push({
        status: ProductEnum.UN_PUBLISHED,
        text: t(`status.button_${ProductEnum.UN_PUBLISHED}`),
        bg: 'bg-purple-500 hover:bg-purple-400'
      })
    }
    if (currentStatus === ProductEnum.BANNED && (user.role === RoleEnum.ADMIN || user.role === RoleEnum.OPERATOR)) {
      buttons.push({
        status: ProductEnum.UN_PUBLISHED,
        text: t(`status.button_UN_BANNED`),
        bg: 'bg-purple-500 hover:bg-purple-400'
      })
    }

    if (
      currentStatus === ProductEnum.UN_PUBLISHED ||
      currentStatus === ProductEnum.FLASH_SALE ||
      currentStatus === ProductEnum.OFFICIAL ||
      currentStatus === ProductEnum.OUT_OF_STOCK
    ) {
      buttons.push({
        status: ProductEnum.INACTIVE,
        text: t(`status.button_${ProductEnum.INACTIVE}`),
        bg: 'bg-gray-500 hover:bg-gray-400'
      })
    }
    if (
      currentStatus !== ProductEnum.INACTIVE &&
      currentStatus !== ProductEnum.BANNED &&
      (user?.role === RoleEnum.ADMIN || user?.role === RoleEnum.OPERATOR)
    ) {
      buttons.push({
        status: ProductEnum.BANNED,
        text: t(`status.button_${ProductEnum.BANNED}`),
        bg: 'bg-red-500 hover:bg-red-400'
      })
    }

    return buttons
  }

  const config = statusConfig[product.status as ProductEnum]
  if (!config) return null

  const buttonsToShow = getNextStatusButtons(product.status as ProductEnum)
  return (
    <div className={`${config.alertVariant} ${config.borderColor}`}>
      <div className='flex items-center gap-2 justify-between'>
        <div className='flex items-center gap-2'>
          <Siren className='size-4' />
          <div className='flex flex-col gap-1'>
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
          {/* {config.nextStatus && config.nextStatus !== '' && (
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
          )} */}
          {buttonsToShow.length > 0 &&
            buttonsToShow.map((button, index) => (
              <Button
                key={index}
                onClick={() => {
                  handleUpdateStatus({ status: button.status })
                }}
                loading={isLoading}
                className={`${button.bg} flex gap-2`}
              >
                {button.text}
                <CircleChevronRight />
              </Button>
            ))}
        </div>
      </div>
    </div>
  )
}
