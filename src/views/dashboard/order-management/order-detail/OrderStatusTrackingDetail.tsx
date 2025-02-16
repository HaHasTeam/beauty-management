import { Check, Package } from 'lucide-react'
import { useTranslation } from 'react-i18next'

import { StatusTrackingIcon, StatusTrackingText } from '@/components/status-tracking-order/StatusTrackingOrder'
import { CancelOrderRequestStatusEnum, RoleEnum, ShippingStatusEnum } from '@/types/enum'
import { IStatusTracking } from '@/types/status-tracking'

interface OrderStatusTrackingDetailProps {
  statusTrackingData: IStatusTracking[]
}
const OrderStatusTrackingDetail = ({ statusTrackingData }: OrderStatusTrackingDetailProps) => {
  const { t } = useTranslation()

  const defaultTimeline = [
    {
      status: 'ORDER_CREATED',
      createdAt: statusTrackingData[0]?.createdAt,
      text: t('order.created'),
      icon: <Package className='w-5 h-5' />,
      reason: '',
      updatedBy: ''
    }
  ]

  const databaseTimeline = statusTrackingData.map((tracking) => ({
    status: tracking.status,
    createdAt: tracking.createdAt,
    text: StatusTrackingText(tracking.status),
    icon: StatusTrackingIcon(tracking.status),
    reason: tracking.reason,
    updatedBy: t(
      `role.${tracking.updatedBy.role === RoleEnum.MANAGER || tracking.updatedBy.role === RoleEnum.STAFF ? 'BRAND' : tracking.updatedBy.role}`
    )
  }))

  const timeline = [...defaultTimeline, ...databaseTimeline]
  const currentStatus = statusTrackingData[statusTrackingData.length - 1]?.status
  const currentIndex = timeline.findIndex((step) => step.status === currentStatus)
  return (
    <div className='mx-auto'>
      <div className=''>
        {timeline.map((step, index) => (
          <div key={index} className='flex items-start gap-4'>
            <div className='flex flex-col items-center justify-center'>
              {step.status === ShippingStatusEnum.COMPLETED ? (
                <div className={`w-4 h-4 flex items-center justify-center bg-emerald-500 rounded-full`}>
                  <Check className='w-3 h-3 text-white' />
                </div>
              ) : (
                <div className={`w-4 h-4 ${currentIndex === index ? 'bg-emerald-500' : 'bg-muted'} rounded-full`} />
              )}
              {index !== timeline.length - 1 && <div className='w-0.5 h-8 bg-muted' />}
              {/* {index === timeline.length - 1 && <div className="w-3 h-3 bg-muted rounded-full" />} */}
            </div>
            <div className='flex gap-2 items-start'>
              <div className={`text-sm ${currentIndex === index ? 'text-emerald-500' : 'text-muted-foreground'}`}>
                {t('date.toLocaleDateTimeString', { val: new Date(step?.createdAt) })}
              </div>
              <div className='flex flex-col'>
                <div
                  className={`text-sm font-medium ${currentIndex === index ? 'text-emerald-500' : 'text-muted-foreground'}`}
                >
                  {step.status === CancelOrderRequestStatusEnum.APPROVED
                    ? t('order.approvedCancelRequest')
                    : step.status === CancelOrderRequestStatusEnum.REJECTED
                      ? t('order.approvedCancelRequest')
                      : StatusTrackingText(step.status)}
                </div>
                {(step.status === ShippingStatusEnum.CANCELLED || step.status === ShippingStatusEnum.REFUNDED) && (
                  <div>
                    {step.status === ShippingStatusEnum.CANCELLED && (
                      <div className='text-sm text-muted-foreground mt-1'>
                        <span className='font-medium'>{t('orderDetail.cancelBy')}: </span>
                        {step.updatedBy}
                      </div>
                    )}
                    <div className='text-sm text-muted-foreground mt-1'>
                      <span className='font-medium'>{t('order.cancelOrderReason.reason')}: </span>
                      {step.reason}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default OrderStatusTrackingDetail
