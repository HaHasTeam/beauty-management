import { Calendar, Check } from 'lucide-react'
import { useTranslation } from 'react-i18next'

import { BookingStatusEnum } from '@/types/enum'
import { IStatusTracking } from '@/types/statusTracking'

// Status Tracking Timeline Detail
const BookingStatusTrackingDetail = ({ statusTrackingData }: { statusTrackingData: IStatusTracking[] }) => {
  const { t } = useTranslation()

  // Map booking statuses to display names
  const getStatusDisplayName = (status: string) => {
    const statusMap: Record<string, string> = {
      BOOKING_CREATED: t('booking.created'),
      [BookingStatusEnum.TO_PAY]: t('booking.status.toPay'),
      [BookingStatusEnum.WAIT_FOR_CONFIRMATION]: t('booking.status.waitForConfirmation'),
      [BookingStatusEnum.BOOKING_CONFIRMED]: t('booking.status.bookingConfirmed'),
      [BookingStatusEnum.SERVICE_BOOKING_FORM_SUBMITED]: t('booking.status.formSubmitted'),
      [BookingStatusEnum.SENDED_RESULT_SHEET]: t('booking.status.resultSent'),
      [BookingStatusEnum.COMPLETED]: t('booking.status.completed'),
      [BookingStatusEnum.REFUNDED]: t('booking.status.refunded'),
      [BookingStatusEnum.CANCELLED]: t('booking.status.cancelled')
    }

    return statusMap[status] || status
  }

  interface TimelineItem {
    status: string
    createdAt: string
    text: string
    icon: React.ReactNode
    reason?: string
    updatedBy?: string
  }

  const defaultTimeline: TimelineItem[] = [
    {
      status: 'BOOKING_CREATED',
      createdAt: statusTrackingData[0]?.createdAt || new Date().toISOString(),
      text: t('booking.created'),
      icon: <Calendar className='w-5 h-5' />
    }
  ]

  const timeline: TimelineItem[] = [
    ...defaultTimeline,
    ...statusTrackingData.map((tracking) => ({
      status: tracking.status,
      createdAt: tracking.createdAt,
      text: getStatusDisplayName(tracking.status),
      icon: <Calendar className='w-5 h-5' />,
      reason: tracking.reason || '',
      updatedBy: tracking.updatedBy?.username || t('booking.system')
    }))
  ]
  const currentStatus = statusTrackingData[statusTrackingData.length - 1]?.status
  const currentIndex = timeline.findIndex((step) => step.status === currentStatus)

  const isComplete = (step: TimelineItem, index: number) => {
    const status = step.status
    return (
      (status === BookingStatusEnum.COMPLETED && index === timeline.length - 1) ||
      status === BookingStatusEnum.CANCELLED
    )
  }

  return (
    <div className='mx-auto'>
      <div className=''>
        {timeline.map((step, index) => (
          <div key={index} className='flex items-start gap-4'>
            <div className='flex flex-col items-center justify-center'>
              {isComplete(step, index) ? (
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
              <div
                className={`text-sm min-w-fit ${currentIndex === index ? 'text-emerald-500' : 'text-muted-foreground'}`}
              >
                {t('date.toLocaleDateTimeString', { val: new Date(step?.createdAt) })}
              </div>
              <div className='flex flex-col'>
                <div
                  className={`text-sm font-medium ${currentIndex === index ? 'text-emerald-500' : 'text-muted-foreground'}`}
                >
                  {getStatusDisplayName(step.status)}
                </div>
                {step.status === BookingStatusEnum.CANCELLED && (
                  <div>
                    <div className='text-sm text-muted-foreground mt-1'>
                      <span className='font-medium'>{t('orderDetail.cancelBy')}: </span>
                      {step.updatedBy}
                    </div>

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
export default BookingStatusTrackingDetail
