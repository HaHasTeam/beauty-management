import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import { useShallow } from 'zustand/react/shallow'

import { Routes, routesConfig } from '@/configs/routes'
import { cn } from '@/lib/utils'
import { useStore } from '@/stores/store'
import { PaymentMethod, RoleEnum, ShippingStatusEnum } from '@/types/enum'
import { TGroupBuying } from '@/types/group-buying'
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
  orderStatus: ShippingStatusEnum
  groupBuying: TGroupBuying
  commissionFee: number
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
  orderParent,
  orderStatus,
  groupBuying,
  commissionFee
}: OrderSummaryProps) {
  const { t } = useTranslation()
  const { user } = useStore(
    useShallow((state) => ({
      user: state.user
    }))
  )
  const brandRecivedPrice = totalPayment + totalPlatformDiscount - commissionFee

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
              <span className='text-sm text-muted-foreground'>
                {t('cart.discountBrand')}
                {orderStatus === ShippingStatusEnum.JOIN_GROUP_BUYING ? ` (${t('cart.estimated')})` : ''}{' '}
              </span>
              {brandVoucher && brandVoucher?.id ? (
                <Link
                  to={routesConfig[Routes.VOUCHER].getPath() + '/' + brandVoucher.id}
                  className='text-sm font-medium text-muted-foreground text-blue-500 no-underline ml-1'
                >
                  #{brandVoucher.id.substring(0, 8).toUpperCase()}
                </Link>
              ) : (
                <></>
              )}
            </div>
            <span className='text-red-500 font-medium'>
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
                  className='text-sm font-medium text-muted-foreground text-blue-500 no-underline ml-1'
                >
                  #{platformVoucher.id.substring(0, 8).toUpperCase()}
                </Link>
              ) : (
                <></>
              )}
            </div>
            <span className={'font-medium text-red-500'}>
              {totalPlatformDiscount > 0 ? '-' : ''}
              {t('productCard.price', { price: totalPlatformDiscount })}
            </span>
          </div>

          <div className='flex flex-col'>
            <div className='flex justify-between items-center pt-3 border-t'>
              <span className='text-sm sm:text-base font-semibold'>
                {t('cart.totalPayment')}
                {orderStatus === ShippingStatusEnum.JOIN_GROUP_BUYING ? ` (${t('cart.estimated')})` : ''}{' '}
              </span>
              <span className='font-semibold text-lg'>{t('productCard.price', { price: totalPayment })}</span>
            </div>

            <div className='flex-col gap-3'>
              <p className='text-sm text-muted-foreground my-3 text-right'>{t('cart.checkoutDescription')}</p>
            </div>
            <div className='flex justify-between items-center pt-3 border-t'>
              <span className='text-sm sm:text-base'>{t('cart.commissionFee')}</span>
              <span
                className={cn(
                  'font-semibold text-lg',
                  user && (user.role === RoleEnum.ADMIN || user.role === RoleEnum.OPERATOR)
                    ? 'text-green-600'
                    : 'text-red-500'
                )}
              >
                {t('productCard.price', { price: commissionFee })}
              </span>
            </div>
            <div>
              <p className='text-sm text-muted-foreground my-3 text-right'>{t('cart.comissionFeeDescription')}</p>
            </div>
            <div className='flex justify-between items-center pt-3'>
              <span className='text-sm sm:text-base font-semibold'>
                {t('cart.netRevenue', {
                  brands:
                    user && (user.role === RoleEnum.ADMIN || user.role === RoleEnum.OPERATOR) ? t('cart.brands') : ''
                })}
              </span>
              <span
                className={cn(
                  'font-semibold text-lg',
                  user && (user.role === RoleEnum.ADMIN || user.role === RoleEnum.OPERATOR)
                    ? 'text-red-500'
                    : 'text-green-800'
                )}
              >
                {t('productCard.price', { price: brandRecivedPrice })}
              </span>
            </div>
            <div>
              <p className='text-sm text-muted-foreground my-3 text-right'>{t('cart.netRevenueDescription')}</p>
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
          {groupBuying && groupBuying?.id ? (
            <div className='flex justify-between items-center border-t pt-3'>
              <span className='text-sm sm:text-base'>{t('productTag.groupBuying')}</span>
              <Link
                to={routesConfig[Routes.GROUP_BUYING].getPath() + '/' + groupBuying.id}
                className='text-sm font-medium text-muted-foreground text-blue-500 no-underline'
              >
                #{groupBuying.id.substring(0, 8).toUpperCase()}
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
