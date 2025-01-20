import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'

import ProductTag from '@/components/product-tag'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Routes, routesConfig } from '@/configs/routes'
import { IClassification } from '@/types/classification'
import { ClassificationTypeEnum, OrderEnum, ShippingStatusEnum } from '@/types/enum'

interface ProductOrderDetailLandscapeProps {
  productImage: string
  productId: string
  productName: string
  eventType: string
  unitPriceAfterDiscount: number
  unitPriceBeforeDiscount: number
  subTotal: number
  productQuantity: number
  productClassification: IClassification | null
  status: ShippingStatusEnum
  isFeedback: boolean
}
const ProductOrderDetailLandscape = ({
  productImage,
  productId,
  productName,
  eventType,
  productQuantity,
  unitPriceAfterDiscount,
  unitPriceBeforeDiscount,
  subTotal,
  productClassification,
  status,
  isFeedback
}: ProductOrderDetailLandscapeProps) => {
  const { t } = useTranslation()
  return (
    <div className='w-full py-4 border-b border-gray-200'>
      <div className='w-full flex gap-2 items-center p-2 md:p-3 lg:p-4'>
        <div className='flex gap-1 items-center lg:w-[10%] md:w-[10%] sm:w-[14%] w-[16%]'>
          <Link to={routesConfig[Routes.PRODUCT_LIST].path + '/' + productId}>
            <div className='md:w-20 md:h-20 sm:w-20 sm:h-20 h-16 w-16'>
              <img src={productImage} alt={productName} className='object-cover w-full h-full' />
            </div>
          </Link>
        </div>

        <div className='flex sm:flex-row flex-col lg:w-[67%] md:w-[67%] sm:w-[66%] w-[54%] gap-2'>
          <div className='order-1 flex gap-1 items-center xl:w-[50%] lg:w-[45%] md:w-[40%] w-full'>
            <div className='flex flex-col gap-1'>
              <Link to={routesConfig[Routes.PRODUCT_LIST].path + '/' + productId}>
                <h3 className='lg:text-sm text-xs line-clamp-2'>{productName}</h3>
              </Link>
              <div>
                {eventType && eventType !== '' && eventType !== OrderEnum.NORMAL && (
                  <ProductTag tag={eventType} size='small' />
                )}
              </div>
              <div className='sm:flex gap-2 hidden'>
                {status === ShippingStatusEnum.COMPLETED && (
                  <Button variant='outline' size='sm' className='border border-primary text-primary'>
                    {t('order.buyAgain')}
                  </Button>
                )}
                {status === ShippingStatusEnum.COMPLETED && (
                  <Button variant='outline' size='sm' className='border border-primary text-primary'>
                    {t('order.buyAgain')}
                  </Button>
                )}
                {!isFeedback && (
                  <Button variant='outline' size='sm' className='border border-primary text-primary'>
                    {t('order.writeFeedback')}
                  </Button>
                )}
              </div>
            </div>
          </div>
          <div className='order-3 sm:order-2 xl:w-[30%] lg:w-[30%] md:w-[30%] w-full'>
            {productClassification?.type === ClassificationTypeEnum?.CUSTOM && (
              <div className='w-full flex items-center gap-2'>
                <Label>
                  <span className='text-muted-foreground lg:text-sm text-xs overflow-ellipsis'>
                    {t('productDetail.classification')}:
                  </span>
                </Label>
                <span className='line-clamp-2 lg:text-sm md:text-sm sm:text-xs text-xs text-primary font-medium'>
                  {[
                    productClassification?.color && `${productClassification.color}`,
                    productClassification?.size && `${productClassification.size}`,
                    productClassification?.other && `${productClassification.other}`
                  ]
                    .filter(Boolean)
                    .join(', ')}
                </span>
              </div>
            )}
          </div>
          {unitPriceBeforeDiscount - unitPriceAfterDiscount > 0 ? (
            <div className='order-2 sm:order-3 w-full md:w-[25%] lg:w-[25%] xl:w-[20%] flex gap-1 items-center justify-start sm:justify-center'>
              <span className='text-gray-400 xl:text-base lg:text-sm text-xs line-through'>
                {t('productCard.price', { price: unitPriceBeforeDiscount })}
              </span>
              <span className='text-red-500 xl:text-base lg:text-sm md:text-sm sm:text-xs text-xs'>
                {t('productCard.currentPrice', { price: unitPriceAfterDiscount })}
              </span>
            </div>
          ) : (
            <div className='order-2 sm:order-3 w-full md:w-[25%] lg:w-[25%] xl:w-[20%] flex gap-1 items-center justify-start sm:justify-center'>
              <span className='xl:text-base lg:text-sm md:text-sm sm:text-xs text-xs'>
                {t('productCard.price', { price: unitPriceBeforeDiscount })}
              </span>
            </div>
          )}

          <div className='order-4 flex gap-2 sm:hidden flex-wrap'>
            {status === ShippingStatusEnum.COMPLETED && (
              <Button variant='outline' size='sm' className='border border-primary text-primary'>
                {t('order.buyAgain')}
              </Button>
            )}

            {!isFeedback && (
              <Button variant='outline' size='sm' className='border border-primary text-primary'>
                {t('order.writeFeedback')}
              </Button>
            )}
          </div>
        </div>

        <div className='w-[10%] md:w-[9%] sm:w-[8%] text-center'>
          <span className='lg:text-sm md:text-sm sm:text-xs text-xs'>{productQuantity}</span>
        </div>
        <span className='font-medium text-red-500 lg:text-base md:text-sm sm:text-xs text-xs w-[20%] md:w-[14%] sm:w-[12%] text-center'>
          {t('productCard.currentPrice', { price: subTotal })}
        </span>
      </div>
    </div>
  )
}

export default ProductOrderDetailLandscape
