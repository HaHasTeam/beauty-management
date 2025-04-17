import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'

import { Routes, routesConfig } from '@/configs/routes'
import { PaymentMethod } from '@/types/enum'

interface OrderSummaryProps {
  totalProductCost: number
  totalBrandDiscount: number
  totalPlatformDiscount: number
  totalPayment: number
  paymentMethod: PaymentMethod
  brandVoucherId: string
  platformVoucherId: string
  livestreamId: string
}
export default function OrderSummary({
  totalProductCost,
  totalBrandDiscount,
  totalPlatformDiscount,
  brandVoucherId,
  platformVoucherId,
  totalPayment,
  paymentMethod,
  livestreamId
}: OrderSummaryProps) {
  const { t } = useTranslation()

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
              {brandVoucherId && (
                <Link
                  to={routesConfig[Routes.VOUCHER] + '/' + brandVoucherId}
                  className='text-sm text-muted-foreground text-blue-500 no-underline'
                >
                  {brandVoucherId.substring(0, 8).toUpperCase()}
                </Link>
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
              {platformVoucherId && (
                <Link
                  to={routesConfig[Routes.VOUCHER] + '/' + platformVoucherId}
                  className='text-sm text-muted-foreground text-blue-500 no-underline'
                >
                  {platformVoucherId.substring(0, 8).toUpperCase()}
                </Link>
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
          {livestreamId && (
            <div className='flex justify-between items-center border-t pt-3'>
              <span className='text-sm sm:text-base'>{t('productTag.liveStream')}</span>
              <Link
                to={routesConfig[Routes.LIVESTREAM] + '/' + livestreamId}
                className='text-sm text-muted-foreground text-blue-500 no-underline'
              >
                {livestreamId.substring(0, 8).toUpperCase()}
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
