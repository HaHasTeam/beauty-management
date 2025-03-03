import { useTranslation } from 'react-i18next'

import { IBrand } from '@/types/brand'
import { ClassificationTypeEnum, StatusEnum } from '@/types/enum'
import { IOrderDetail } from '@/types/order'

import ProductOrderDetailLandscape from './ProductOrderLandScape'

interface OrderDetailItemsProps {
  orderDetails: IOrderDetail[]
  brand: IBrand | null
  recipientAvatar: string
  recipientName: string
}
const OrderDetailItems = ({ orderDetails, recipientAvatar, recipientName, brand }: OrderDetailItemsProps) => {
  const { t } = useTranslation()

  return (
    <div className='w-full'>
      <div className='w-full flex p-2 md:p-3 lg:p-4 bg-secondary/30 rounded-sm text-secondary-foreground'>
        <div className='w-[70%] md:w-[77%] sm:w-[80%] flex items-center justify-start text-xs sm:text-sm md:text-base text-center'>
          {t('orderDetail.products')} ({orderDetails?.length} {t('cart.products')})
        </div>
        <div className='w-[10%] md:w-[9%] sm:w-[8%] flex items-center justify-center text-xs sm:text-sm md:text-base text-center'>
          {t('orderDetail.quantity')}
        </div>
        <div className='w-[20%] md:w-[14%] sm:w-[12%] flex items-center justify-center text-xs sm:text-sm md:text-base text-center'>
          {t('orderDetail.subTotal')}
        </div>
      </div>
      <div className='bg-white rounded-md'>
        {orderDetails?.map((orderDetail) => (
          <ProductOrderDetailLandscape
            key={orderDetail?.id}
            productImage={
              (orderDetail?.productClassification?.type === ClassificationTypeEnum.DEFAULT
                ? (
                    orderDetail?.productClassification?.preOrderProduct ??
                    orderDetail?.productClassification?.productDiscount ??
                    orderDetail?.productClassification
                  )?.product?.images?.filter((img) => img?.status === StatusEnum.ACTIVE)[0]?.fileUrl
                : orderDetail?.productClassification?.images?.[0]?.fileUrl) ?? ''
            }
            productId={
              (
                orderDetail?.productClassification?.preOrderProduct ??
                orderDetail?.productClassification?.productDiscount ??
                orderDetail?.productClassification
              )?.product?.id ?? ''
            }
            productName={
              (
                orderDetail?.productClassification?.preOrderProduct ??
                orderDetail?.productClassification?.productDiscount ??
                orderDetail?.productClassification
              )?.product?.name ?? ''
            }
            eventType={orderDetail?.type ?? ''}
            unitPriceAfterDiscount={orderDetail?.unitPriceAfterDiscount}
            unitPriceBeforeDiscount={orderDetail?.unitPriceBeforeDiscount}
            subTotal={orderDetail?.subTotal}
            productQuantity={orderDetail?.productClassification?.quantity}
            productClassification={orderDetail?.productClassification}
            feedback={orderDetail?.feedback}
            brand={brand || null}
            recipientAvatar={recipientAvatar}
            recipientName={recipientName}
            orderDetailId={orderDetail?.id}
          />
        ))}
      </div>
    </div>
  )
}

export default OrderDetailItems
