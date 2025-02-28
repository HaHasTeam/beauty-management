import { CircleChevronRight, Siren } from 'lucide-react'
import { useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'

import { ProductQuantityWarningEnum } from '@/types/enum'
import { IResponseProduct } from '@/types/product'

import Button from '../button'
import UpdateProductClassificationQuantityDialog from '../dialog/UpdateProductClassificationQuantityDialog'
import { AlertDescription } from '../ui/alert'

interface UpdateProductQuantityProps {
  product: IResponseProduct
  productQuantityWarning: number
}

export default function UpdateProductQuantity({ product, productQuantityWarning }: UpdateProductQuantityProps) {
  const { t } = useTranslation()
  const [openUpdateProductClassificationQuantityDialog, setOpenUpdateProductClassificationQuantityDialog] =
    useState<boolean>(false)

  const productQuantity = useMemo(() => {
    return product?.productClassifications?.reduce((total, item) => total + (item.quantity || 0), 0) ?? 0
  }, [product])

  if (!product) return null
  const statusConfig = {
    [ProductQuantityWarningEnum.ALMOST_OUT]: {
      borderColor: 'border-yellow-300',
      bgColor: 'bg-yellow-100',
      bgTagColor: 'bg-yellow-200',
      titleColor: 'text-yellow-500',
      alertVariant: 'bg-yellow-50 rounded-lg p-3 border',
      buttonBg: 'bg-green-500 hover:bg-green-400',
      alertTitle: t(`status.${ProductQuantityWarningEnum.ALMOST_OUT}`),
      buttonText: t('createProduct.restockNow'),
      alertDescription: t(`createProduct.statusDescription.${ProductQuantityWarningEnum.ALMOST_OUT}`),
      nextStatus: t('createProduct.restockNow')
    },
    [ProductQuantityWarningEnum.SOLD_OUT]: {
      borderColor: 'border-red-300',
      bgColor: 'bg-red-100',
      bgTagColor: 'bg-red-200',
      titleColor: 'text-red-600',
      alertVariant: 'bg-red-100 rounded-lg p-3 border',
      buttonBg: 'bg-green-500 hover:bg-green-400',
      alertTitle: t(`status.${ProductQuantityWarningEnum.SOLD_OUT}`),
      buttonText: t('createProduct.restockNow'),
      alertDescription: t(`createProduct.statusDescription.${ProductQuantityWarningEnum.SOLD_OUT}`),
      nextStatus: t('createProduct.restockNow')
    }
  }

  const productStatus =
    productQuantity === 0 ? ProductQuantityWarningEnum.SOLD_OUT : ProductQuantityWarningEnum.ALMOST_OUT
  const config = statusConfig[productStatus]
  if (!config) return null
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
          {config.nextStatus && config.nextStatus !== '' && (
            <Button
              onClick={() => {
                setOpenUpdateProductClassificationQuantityDialog(true)
              }}
              className={`${config.buttonBg} flex gap-2`}
            >
              {config.buttonText}
              <CircleChevronRight />
            </Button>
          )}
        </div>
      </div>
      {product.productClassifications.length > 0 && (
        <UpdateProductClassificationQuantityDialog
          onOpenChange={() => setOpenUpdateProductClassificationQuantityDialog(false)}
          open={openUpdateProductClassificationQuantityDialog}
          product={product}
          setOpen={setOpenUpdateProductClassificationQuantityDialog}
          productQuantityWarning={productQuantityWarning}
        />
      )}
    </div>
  )
}
