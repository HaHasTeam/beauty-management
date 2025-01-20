import { Banknote, Check, Grab, Package, PackageCheck, Truck } from 'lucide-react'
import { useTranslation } from 'react-i18next'

import { ShippingStatusEnum } from '@/types/enum'

interface OrderStatusTrackingProps {
  currentStatus: string
}
const OrderStatusTracking = ({ currentStatus }: OrderStatusTrackingProps) => {
  const { t } = useTranslation()

  const timeline = [
    { status: 'ORDER_CREATED', text: t('order.created'), icon: <Package className='w-5 h-5' /> },
    { status: ShippingStatusEnum.TO_PAY, text: t('order.pending'), icon: <Banknote className='w-5 h-5' /> },
    {
      status: ShippingStatusEnum.WAIT_FOR_CONFIRMATION,
      text: t('order.waitConfirm'),
      icon: <PackageCheck className='w-5 h-5' />
    },
    { status: ShippingStatusEnum.TO_SHIP, text: t('order.shipping'), icon: <Grab className='w-5 h-5' /> },
    { status: ShippingStatusEnum.TO_RECEIVED, text: t('order.delivering'), icon: <Truck className='w-5 h-5' /> },
    { status: ShippingStatusEnum.COMPLETED, text: t('order.completed'), icon: <Check className='w-5 h-5' /> }
  ]

  const currentIndex = timeline.findIndex((step) => step.status === currentStatus)
  return (
    <div className='w-full relative'>
      <div className='absolute top-5 left-[7%] right-[7%] h-0.5 bg-muted' />
      <div className='w-full relative z-10 flex justify-between'>
        {timeline.map((step, index) => {
          const isCurrent = index === currentIndex
          const isCompleted = index < currentIndex

          return (
            <div key={index} className='flex flex-col items-center gap-2' style={{ flex: '1 0 0%' }}>
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  isCurrent || isCompleted ? 'bg-emerald-500 text-white' : 'bg-muted text-muted-foreground'
                }`}
              >
                {step.icon}
              </div>
              <p
                className={`text-xs text-center font-medium ${
                  isCurrent || isCompleted ? 'text-emerald-500' : 'text-muted-foreground'
                }`}
              >
                {step.text}
              </p>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default OrderStatusTracking
