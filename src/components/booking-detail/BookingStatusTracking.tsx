import { Calendar, Clock, CreditCard, MessageSquare } from 'lucide-react'
import { useTranslation } from 'react-i18next'

import { Card } from '@/components/ui/card'
import { BookingStatusEnum } from '@/types/enum'
import { IStatusTracking } from '@/types/statusTracking'

const BookingStatusTracking = ({ statusTrackingData }: { statusTrackingData: IStatusTracking[] }) => {
  const { t } = useTranslation()

  // Map booking statuses to display names and icons
  const getStatusDisplayInfo = (status: string) => {
    const statusMap: Record<string, { text: string; icon: React.ReactNode }> = {
      [BookingStatusEnum.TO_PAY]: {
        text: t('booking.status.toPay'),
        icon: <CreditCard className='w-5 h-5' />
      },
      [BookingStatusEnum.WAIT_FOR_CONFIRMATION]: {
        text: t('booking.status.waitForConfirmation'),
        icon: <Clock className='w-5 h-5' />
      },
      [BookingStatusEnum.BOOKING_CONFIRMED]: {
        text: t('booking.status.bookingConfirmed'),
        icon: <Calendar className='w-5 h-5' />
      },
      [BookingStatusEnum.SERVICE_BOOKING_FORM_SUBMITED]: {
        text: t('booking.status.formSubmitted'),
        icon: <MessageSquare className='w-5 h-5' />
      },
      [BookingStatusEnum.SENDED_RESULT_SHEET]: {
        text: t('booking.status.sendedResultSheet'),
        icon: <MessageSquare className='w-5 h-5' />
      },
      [BookingStatusEnum.COMPLETED_CONSULTING_CALL]: {
        text: t('booking.status.completed'),
        icon: <MessageSquare className='w-5 h-5' />
      },
      [BookingStatusEnum.REFUNDED]: {
        text: t('booking.status.refunded'),
        icon: <CreditCard className='w-5 h-5' />
      },
      [BookingStatusEnum.CANCELLED]: {
        text: t('booking.cancelled'),
        icon: <Calendar className='w-5 h-5' />
      }
    }

    return statusMap[status] || { text: status, icon: <Calendar className='w-5 h-5' /> }
  }

  // Create timeline based on statusTrackingData
  const timeline = statusTrackingData.map((tracking) => ({
    status: tracking.status,
    text: getStatusDisplayInfo(tracking.status).text,
    icon: getStatusDisplayInfo(tracking.status).icon,
    createdAt: tracking.createdAt,
    isActive: true
  }))

  const currentStatus = statusTrackingData[statusTrackingData.length - 1]?.status
  const currentIndex = timeline.findIndex((step) => step.status === currentStatus)
  return (
    <Card className='w-full bg-white rounded-lg p-4 shadow-sm'>
      <div className='w-full relative'>
        {timeline.length > 1 && (
          <div
            className='absolute top-5 h-0.5 bg-muted'
            style={{
              left: `calc(${100 / (timeline.length * 2)}%)`,
              right: `calc(${100 / (timeline.length * 2)}%)`
            }}
          />
        )}
        <div className='w-full relative z-10 flex justify-between'>
          {timeline.map((step, index) => {
            const isCurrent = index === currentIndex
            const isCompleted = index < currentIndex

            return (
              <div
                key={index}
                className='timeline-item flex flex-col items-center gap-2 relative'
                style={{
                  flex: '1 0 0%',
                  maxWidth: `${100 / timeline.length}%`
                }}
              >
                <div
                  className={`timeline-icon w-10 h-10 rounded-full flex items-center justify-center relative
                 ${
                   step.status === BookingStatusEnum.CANCELLED
                     ? 'bg-red-500 text-white'
                     : isCurrent || isCompleted
                       ? 'bg-emerald-500 text-white'
                       : 'bg-muted text-muted-foreground'
                 }
               `}
                >
                  {step.icon}
                </div>

                <p
                  className={`text-sm text-center font-medium ${
                    step.status === BookingStatusEnum.CANCELLED
                      ? 'text-red-500'
                      : isCurrent || isCompleted
                        ? 'text-emerald-500'
                        : 'text-muted-foreground'
                  }`}
                >
                  {step.text}
                </p>
              </div>
            )
          })}
        </div>
      </div>
    </Card>
  )
}
export default BookingStatusTracking
