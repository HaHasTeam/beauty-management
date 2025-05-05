'use client'

import { Calendar, Check, Eye } from 'lucide-react'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'

import { Button } from '@/components/ui/button'
import type { IBooking } from '@/types/booking'
import { BookingStatusEnum } from '@/types/enum'
import type { IStatusTracking } from '@/types/statusTracking'

import BookingFormAnswersDialog from './BookingFormAnswersDialog'
import ConsultationResultInfoDialog from './ConsultationResultInfoDialog'

interface BookingStatusTrackingDetailProps {
  statusTrackingData: IStatusTracking[]
  booking: IBooking
}

// Status Tracking Timeline Detail
const BookingStatusTrackingDetail = ({ statusTrackingData, booking }: BookingStatusTrackingDetailProps) => {
  const { t } = useTranslation()
  const [isOpenConsultationResultInfoDialog, setIsOpenConsultationResultInfoDialog] = useState<boolean>(false)
  const [isOpenBookingFormDialog, setIsOpenBookingFormDialog] = useState<boolean>(false)
  const [selectedStatus, setSelectedStatus] = useState<string | null>(null)

  // Map booking statuses to display names
  const getStatusDisplayName = (status: string) => {
    const statusMap: Record<string, string> = {
      BOOKING_CREATED: t('booking.created'),
      [BookingStatusEnum.TO_PAY]: t('booking.status.toPay'),
      [BookingStatusEnum.WAIT_FOR_CONFIRMATION]: t('booking.status.waitForConfirmation'),
      [BookingStatusEnum.BOOKING_CONFIRMED]: t('booking.status.bookingConfirmed'),
      [BookingStatusEnum.SERVICE_BOOKING_FORM_SUBMITED]: t('booking.status.formSubmitted'),
      [BookingStatusEnum.COMPLETED_CONSULTING_CALL]: t('booking.status.completedConsultingCall'),

      [BookingStatusEnum.SENDED_RESULT_SHEET]: t('booking.status.sendedResultSheet'),
      [BookingStatusEnum.COMPLETED]: t('booking.status.completed'),
      [BookingStatusEnum.REFUNDED]: t('booking.status.refunded'),
      [BookingStatusEnum.CANCELLED]: t('booking.status.cancelled')
    }

    return statusMap[status] || status
  }

  // Handle click on info button
  const handleInfoButtonClick = (status: string) => {
    setSelectedStatus(status)

    if (status === BookingStatusEnum.SENDED_RESULT_SHEET) {
      setIsOpenConsultationResultInfoDialog(true)
    } else if (status === BookingStatusEnum.SERVICE_BOOKING_FORM_SUBMITED) {
      setIsOpenBookingFormDialog(true)
    }
  }

  // Check if a status should show info button
  const shouldShowInfoButton = (status: string) => {
    if (status === BookingStatusEnum.SENDED_RESULT_SHEET) {
      return !!booking.consultationResult
    } else if (status === BookingStatusEnum.SERVICE_BOOKING_FORM_SUBMITED) {
      return !!booking.bookingFormAnswer
    }
    return false
  }

  interface TimelineItem {
    status: string
    createdAt: string
    text: string
    icon: React.ReactNode
    reason?: string
    updatedBy?: string
    showInfoButton?: boolean
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
      updatedBy: tracking.updatedBy?.username || t('booking.system'),
      showInfoButton: shouldShowInfoButton(tracking.status)
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
            </div>
            <div className='flex gap-2 items-start'>
              <div
                className={`text-sm min-w-fit ${currentIndex === index ? 'text-emerald-500' : 'text-muted-foreground'}`}
              >
                {t('date.toLocaleDateTimeString', { val: new Date(step?.createdAt) })}
              </div>
              <div className='flex flex-col'>
                <div className='flex items-center gap-1'>
                  <div
                    className={`text-sm font-medium ${
                      currentIndex === index ? 'text-emerald-500' : 'text-muted-foreground'
                    }`}
                  >
                    {getStatusDisplayName(step.status)}
                  </div>

                  {/* Info button */}
                  {step.showInfoButton && (
                    <Button
                      size='icon'
                      variant='ghost'
                      className='h-5 w-5 p-0 hover:bg-gray-100 rounded-full flex items-center'
                      onClick={() => handleInfoButtonClick(step.status)}
                      title={t('booking.viewInformation')}
                    >
                      <Eye className='w-3.5 h-3.5 text-gray' />
                      <span className='sr-only'>{t('booking.viewInformation')}</span>
                    </Button>
                  )}
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

      {/* Consultation Result Dialog */}
      {selectedStatus === BookingStatusEnum.SENDED_RESULT_SHEET && (
        <ConsultationResultInfoDialog
          isOpen={isOpenConsultationResultInfoDialog}
          onClose={() => setIsOpenConsultationResultInfoDialog(false)}
          booking={booking}
        />
      )}

      {/* Booking Form Dialog */}
      {selectedStatus === BookingStatusEnum.SERVICE_BOOKING_FORM_SUBMITED && (
        <BookingFormAnswersDialog
          isOpen={isOpenBookingFormDialog}
          setOpen={() => setIsOpenBookingFormDialog(false)}
          booking={booking}
        />
      )}
    </div>
  )
}

export default BookingStatusTrackingDetail
