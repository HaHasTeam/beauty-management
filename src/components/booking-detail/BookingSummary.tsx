import { useTranslation } from 'react-i18next'

import { Card } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'

const BookingSummary = ({
  totalPrice,
  voucherDiscount = 0,
  paymentMethod
}: {
  totalPrice: number
  voucherDiscount?: number
  paymentMethod: string
}) => {
  const { t } = useTranslation()

  const getPaymentMethodTranslation = (method: string) => {
    return t(`payment.${method.toLowerCase()}`, String(method).replace('_', ' '))
  }

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

        <div className='flex justify-between pt-2'>
          <span className='text-muted-foreground'>{t('booking.paymentMethod')}</span>
          <span className='font-medium'>{getPaymentMethodTranslation(paymentMethod)}</span>
        </div>
      </div>
    </Card>
  )
}

export default BookingSummary
