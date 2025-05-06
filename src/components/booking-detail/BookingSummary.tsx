import { useTranslation } from 'react-i18next'
import { useShallow } from 'zustand/react/shallow'

import { Card } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { cn } from '@/lib/utils'
import { useStore } from '@/stores/store'
import { RoleEnum } from '@/types/enum'

const BookingSummary = ({
  totalPrice,
  voucherDiscount = 0,
  paymentMethod,
  commissionFee
}: {
  totalPrice: number
  voucherDiscount?: number
  paymentMethod: string
  commissionFee: number
}) => {
  const { t } = useTranslation()
  const { user } = useStore(
    useShallow((state) => ({
      user: state.user
    }))
  )

  const getPaymentMethodTranslation = (method: string) => {
    return t(`payment.${method.toLowerCase()}`, String(method).replace('_', ' '))
  }
  const recivedPrice = totalPrice - commissionFee

  return (
    <Card className='w-full bg-white rounded-lg p-4 shadow-sm mt-4'>
      <h3 className='font-medium text-lg border-b border-border pb-3 mb-3'>{t('booking.paymentSummary')}</h3>
      <div className='space-y-3'>
        <div className='flex justify-between'>
          <span className='text-muted-foreground'>{t('booking.serviceFee')}</span>
          <span>{t('productCard.price', { price: totalPrice + voucherDiscount })}</span>
        </div>

        {voucherDiscount > 0 && (
          <div className='flex justify-between'>
            <span className='text-muted-foreground'>{t('booking.voucherDiscount')}</span>
            <span className='text-destructive'>-{t('productCard.price', { price: voucherDiscount })}</span>
          </div>
        )}

        <Separator className='my-2' />

        <div className='flex justify-between font-medium'>
          <span>{t('booking.totalPayment')}</span>
          <span className='text-primary text-lg'>{t('productCard.price', { price: totalPrice })}</span>
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
          <p className='text-sm text-muted-foreground my-3 text-right'>{t('consultant.comissionFeeDescription')}</p>
        </div>
        <div className='flex justify-between items-center pt-3'>
          <span className='text-sm sm:text-base font-semibold'>
            {t('consultant.netRevenue', {
              consultant:
                user && (user.role === RoleEnum.ADMIN || user.role === RoleEnum.OPERATOR)
                  ? t('consultant.consultant')
                  : ''
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
            {t('productCard.price', { price: recivedPrice })}
          </span>
        </div>
        <div>
          <p className='text-sm text-muted-foreground my-3 text-right'>{t('consultant.netRevenueDescription')}</p>
        </div>

        <div className='flex justify-between pt-2'>
          <span className='text-muted-foreground'>{t('booking.paymentMethod')}</span>
          <span className='font-medium'>{getPaymentMethodTranslation(paymentMethod)}</span>
        </div>
      </div>
    </Card>
  )
}

export default BookingSummary
