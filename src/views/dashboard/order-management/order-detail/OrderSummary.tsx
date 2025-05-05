import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import { useShallow } from 'zustand/react/shallow'

import { Routes, routesConfig } from '@/configs/routes'
import { useStore } from '@/stores/store'
import { PaymentMethod, RoleEnum } from '@/types/enum'
import { ILivestream } from '@/types/livestream'
import { IOrder, IOrderItem } from '@/types/order'
import { TVoucher } from '@/types/voucher'

interface OrderSummaryProps {
  totalProductCost: number
  totalBrandDiscount: number
  totalPlatformDiscount: number
  totalPayment: number
  paymentMethod: PaymentMethod
  brandVoucher: TVoucher | null
  platformVoucher: TVoucher | null
  livestream: ILivestream | null
  orderParent: IOrder | null | IOrderItem
}
export default function OrderSummary({
  totalProductCost,
  totalBrandDiscount,
  totalPlatformDiscount,
  brandVoucher,
  platformVoucher,
  totalPayment,
  paymentMethod,
  livestream,
  orderParent
}: OrderSummaryProps) {
  const { t } = useTranslation()
  const { user } = useStore(
    useShallow((state) => ({
      user: state.user
    }))
  )

  return (
    <div className='w-full bg-white rounded-md shadow-sm p-4'>
      <div>
        <div className='space-y-3'>
          <div className='flex items-center justify-between'>
            <span className='text-sm text-muted-foreground'>{t('cart.totalCost')}</span>
            <span className='font-medium'>{t('productCard.price', { price: totalProductCost })}</span>
          </div>

          <div className='flex justify-between items-center'>
            <div>
              <span className='text-sm text-muted-foreground'>{t('cart.discountBrand')}</span>
              {brandVoucher && brandVoucher?.id ? (
                <Link
                  to={routesConfig[Routes.VOUCHER].getPath() + '/' + brandVoucher.id}
                  className='text-sm font-medium text-muted-foreground text-blue-500 no-underline ml-2'
                >
                  #{brandVoucher.id.substring(0, 8).toUpperCase()}
                </Link>
              ) : (
                <></>
              )}
            </div>
            <span className='text-green-700 font-medium'>
              {totalBrandDiscount > 0 ? '-' : ''}
              {t('productCard.price', { price: totalBrandDiscount })}
            </span>
          </div>

          <div className='flex justify-between items-center'>
            <div>
              <span className='text-sm text-muted-foreground'>{t('cart.discountPlatform')}</span>

              {user &&
              (user.role === RoleEnum.ADMIN || user.role === RoleEnum.OPERATOR) &&
              platformVoucher &&
              platformVoucher?.id ? (
                <Link
                  to={routesConfig[Routes.VOUCHER].getPath() + '/' + platformVoucher.id}
                  className='text-sm font-medium text-muted-foreground text-blue-500 no-underline ml-2'
                >
                  #{platformVoucher.id.substring(0, 8).toUpperCase()}
                </Link>
              ) : (
                <></>
              )}
            </div>
            <span className='text-green-700 font-medium'>
              {totalPlatformDiscount > 0 ? '-' : ''}
              {t('productCard.price', { price: totalPlatformDiscount })}
            </span>
          </div>

          <div className='flex flex-col'>
            <div className='flex justify-between items-center pt-3 border-t'>
              <span className='text-sm sm:text-base'>{t('cart.totalPayment')}</span>
              <span className='font-semibold text-red-500 text-lg'>
                {t('productCard.price', { price: totalPayment })}
              </span>
            </div>
            <div className='flex-col gap-3'>
              <p className='text-sm text-muted-foreground my-3 text-right'>{t('cart.checkoutDescription')}</p>
            </div>
          </div>
          <div className='flex justify-between items-center border-t pt-3'>
            <span className='text-sm sm:text-base'>{t('wallet.paymentMethod')}</span>
            <span className='font-semibold text-primary text-sm sm:text-base'>{t(`wallet.${paymentMethod}`)}</span>
          </div>
          {livestream && livestream?.id ? (
            <div className='flex justify-between items-center border-t pt-3'>
              <span className='text-sm sm:text-base'>{t('productTag.liveStream')}</span>
              <Link
                to={routesConfig[Routes.LIVESTREAM].getPath() + '/' + livestream.id}
                className='text-sm font-medium text-muted-foreground text-blue-500 no-underline'
              >
                #{livestream.id.substring(0, 8).toUpperCase()}
              </Link>
            </div>
          ) : (
            <></>
          )}
          {user &&
          (user.role === RoleEnum.ADMIN || user.role === RoleEnum.OPERATOR) &&
          orderParent &&
          orderParent?.id ? (
            <div className='flex justify-between items-center border-t pt-3'>
              <span className='text-sm sm:text-base'>{t('orderDetail.orderParent')}</span>
              <Link
                to={routesConfig[Routes.ORDER_PARENT_LIST].getPath() + '/' + orderParent.id}
                className='text-sm font-medium text-muted-foreground text-blue-500 no-underline'
              >
                #{orderParent.id.substring(0, 8).toUpperCase()}
              </Link>
            </div>
          ) : (
            <></>
          )}
        </div>
      </div>
    </div>
  )
}
