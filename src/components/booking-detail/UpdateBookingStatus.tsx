'use client'

import { useMutation, useQueryClient } from '@tanstack/react-query'
import { Calendar, CircleChevronRight, Clock, Eye, FileText, Siren, VideoIcon } from 'lucide-react'
import { type Dispatch, type SetStateAction, useState } from 'react'
import { useTranslation } from 'react-i18next'

import useHandleServerError from '@/hooks/useHandleServerError'
import { useToast } from '@/hooks/useToast'
import { getBookingByIdApi, updateBookingStatusApi } from '@/network/apis/booking/details'
import type { IBooking } from '@/types/booking'
import { BookingStatusEnum, ServiceTypeEnum } from '@/types/enum'
import type { IStatusTracking } from '@/types/statusTracking'
import { handleRoomIdGenerate } from '@/utils/meetUrl'

import Button from '../button'
import { AlertDescription } from '../ui/alert'
import BookingFormAnswersDialog from './BookingFormAnswersDialog'
import CompleteConsultingCallDialog from './CompleteConsultingCallDialog'
import ConsultationResultDialog from './ConsultationResultDialog'
import ConsultationResultInfoDialog from './ConsultationResultInfoDialog'
import ServiceBookingFormDialog from './ServiceBookingFormDialog'

interface UpdateBookingStatusProps {
  booking: IBooking
  setOpenCancelBookingDialog: Dispatch<SetStateAction<boolean>>
  statusTracking: IStatusTracking[]
  isConsultant: boolean
  isCustomer: boolean
}

export default function UpdateBookingStatus({
  booking,
  setOpenCancelBookingDialog,
  isConsultant,
  isCustomer
}: UpdateBookingStatusProps) {
  const { t } = useTranslation()
  const { successToast } = useToast()
  const handleServerError = useHandleServerError()
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [isOpenBookingFormDialog, setIsOpenBookingFormDialog] = useState<boolean>(false)
  const [isOpenConsultationResultDialog, setIsOpenConsultationResultDialog] = useState<boolean>(false)
  const [isOpenCompleteConsultingCallDialog, setIsOpenCompleteConsultingCallDialog] = useState<boolean>(false)
  const [isViewBookingFormDialog, setIsViewBookingFormDialog] = useState<boolean>(false)
  const [isViewConsultationResultDialog, setIsViewConsultationResultDialog] = useState<boolean>(false)
  const queryClient = useQueryClient()

  const { mutateAsync: updateBookingStatusFn } = useMutation({
    mutationKey: [updateBookingStatusApi.mutationKey],
    mutationFn: updateBookingStatusApi.fn,
    onSuccess: async () => {
      successToast({
        message: t('booking.updateBookingStatusSuccess')
      })
      await Promise.all([queryClient.invalidateQueries({ queryKey: [getBookingByIdApi.queryKey] })])
    }
  })

  async function handleUpdateStatus(status: BookingStatusEnum) {
    try {
      if (status == BookingStatusEnum.BOOKING_CONFIRMED) {
        const meetUrl = handleRoomIdGenerate()
        setIsLoading(true)
        await updateBookingStatusFn({ id: booking?.id, status, meetUrl })
      } else {
        setIsLoading(true)
        await updateBookingStatusFn({ id: booking?.id, status })
      }
      setIsLoading(false)
    } catch (error) {
      setIsLoading(false)
      handleServerError({ error })
    }
  }

  if (!booking) return null

  const statusConfig = {
    [BookingStatusEnum.TO_PAY]: {
      borderColor: 'border-yellow-300',
      bgColor: 'bg-yellow-100',
      bgTagColor: 'bg-yellow-200',
      titleColor: 'text-yellow-500',
      alertVariant: 'bg-yellow-50 rounded-lg p-3 border',
      buttonBg: '',
      alertTitle: t('booking.status.toPay'),
      buttonText: '',
      icon: Clock,
      alertDescription: t('booking.statusDescription.toPay'),
      nextStatus: ''
    },
    [BookingStatusEnum.WAIT_FOR_CONFIRMATION]: {
      borderColor: 'border-lime-300',
      bgColor: 'bg-lime-100',
      bgTagColor: 'bg-lime-200',
      alertVariant: 'bg-lime-100 rounded-lg p-3 border',
      titleColor: 'text-lime-600',
      buttonBg: 'bg-purple-600 hover:bg-purple-800',
      alertTitle: t('booking.status.waitForConfirmation'),
      buttonText: t('booking.status.confirmBooking'),
      icon: Calendar,
      alertDescription: t('booking.statusDescription.waitForConfirmation'),
      nextStatus: BookingStatusEnum.BOOKING_CONFIRMED
    },
    [BookingStatusEnum.BOOKING_CONFIRMED]: {
      borderColor: 'border-purple-300',
      bgColor: 'bg-purple-100',
      bgTagColor: 'bg-purple-200',
      titleColor: 'text-purple-600',
      alertVariant: 'bg-purple-100 rounded-lg p-3 border',
      buttonBg: '',
      alertTitle: t('booking.status.bookingConfirmed'),
      buttonText: t('booking.status.submitBookingForm'),
      icon: FileText,
      alertDescription: t('booking.statusDescription.bookingConfirmed'),
      nextStatus: ''
    },
    [BookingStatusEnum.SERVICE_BOOKING_FORM_SUBMITED]: {
      borderColor: 'border-cyan-300',
      bgColor: 'bg-cyan-100',
      bgTagColor: 'bg-cyan-300',
      titleColor: 'text-cyan-600',
      alertVariant: 'bg-cyan-100 rounded-lg p-3 border',
      buttonBg: 'bg-blue-600 hover:bg-blue-800',
      alertTitle: t('booking.status.bookingFormSubmitted'),
      buttonText: t('booking.status.completeConsultingCall'),
      icon: VideoIcon,
      alertDescription: t('booking.statusDescription.serviceBookingFormSubmitted'),
      nextStatus:
        booking.consultantService.systemService.type === ServiceTypeEnum.PREMIUM
          ? BookingStatusEnum.COMPLETED_CONSULTING_CALL
          : ''
    },
    [BookingStatusEnum.COMPLETED_CONSULTING_CALL]: {
      borderColor: 'border-blue-300',
      bgColor: 'bg-blue-100',
      bgTagColor: 'bg-blue-300',
      titleColor: 'text-blue-600',
      alertVariant: 'bg-blue-100 rounded-lg p-3 border',
      buttonBg: 'bg-green-600 hover:bg-green-800',
      alertTitle: t('booking.status.completedConsultingCall'),
      buttonText: t('booking.status.sendResultSheet'),
      icon: FileText,
      alertDescription: t('booking.statusDescription.completedConsultingCall'),
      nextStatus: BookingStatusEnum.SENDED_RESULT_SHEET
    },

    [BookingStatusEnum.SENDED_RESULT_SHEET]: {
      borderColor: 'border-green-300',
      bgColor: 'bg-green-100',
      bgTagColor: 'bg-green-300',
      titleColor: 'text-green-600',
      alertVariant: 'bg-green-100 rounded-lg p-3 border',
      buttonBg: '',
      alertTitle: t('booking.status.sendedResultSheet'),
      buttonText: '',
      icon: FileText,
      alertDescription: t('booking.statusDescription.sendedResultSheet'),
      nextStatus: ''
    },
    [BookingStatusEnum.COMPLETED]: {
      borderColor: 'border-green-500',
      bgColor: 'bg-green-100',
      bgTagColor: 'bg-green-400',
      titleColor: 'text-green-700',
      alertVariant: 'bg-green-100 rounded-lg p-3 border',
      buttonBg: '',
      alertTitle: t('booking.completed'),
      buttonText: '',
      icon: FileText,
      alertDescription: t('booking.statusDescription.completed'),
      nextStatus: ''
    },

    [BookingStatusEnum.CANCELLED]: {
      borderColor: 'border-red-300',
      bgColor: 'bg-red-100',
      bgTagColor: 'bg-red-200',
      titleColor: 'text-red-600',
      alertVariant: 'bg-red-100 rounded-lg p-3 border',
      buttonBg: '',
      alertTitle: t('booking.cancelled'),
      buttonText: '',
      icon: Siren,
      alertDescription: t('booking.statusDescription.cancelled'),
      nextStatus: ''
    },
    [BookingStatusEnum.REFUNDED]: {
      borderColor: 'border-gray-400',
      bgColor: 'bg-gray-200',
      bgTagColor: 'bg-gray-300',
      titleColor: 'text-gray-600',
      alertVariant: 'bg-gray-200 rounded-lg p-3 border',
      buttonBg: '',
      alertTitle: t('booking.refunded'),
      buttonText: '',
      icon: Siren,
      alertDescription: t('booking.statusDescription.refunded'),
      nextStatus: ''
    }
  }

  const config = statusConfig[booking.status]
  if (!config) return null

  const IconComponent = config.icon || Siren

  return (
    <div className={`${config.alertVariant} ${config.borderColor}`}>
      <div className='flex md:items-center gap-2 md:justify-between md:flex-row flex-col justify-start items-start'>
        <div className='flex items-center gap-2'>
          <div className='flex gap-2 items-center'>
            <div className='p-2 bg-white/70 rounded-full'>
              <IconComponent className={`${config.titleColor} size-6`} />
            </div>
            <div className='flex flex-col gap-1'>
              <div className='flex items-center'>
                <span
                  className={`px-2 py-1 sm:text-sm text-xs rounded-full uppercase cursor-default font-bold ${config.titleColor} ${config.bgTagColor}`}
                >
                  {config.alertTitle}
                </span>

                {/* Add eye button for viewing details */}
                {(booking.status === BookingStatusEnum.SERVICE_BOOKING_FORM_SUBMITED ||
                  booking.status === BookingStatusEnum.SENDED_RESULT_SHEET ||
                  booking.status === BookingStatusEnum.COMPLETED) && (
                  <button
                    onClick={() => {
                      if (booking.status === BookingStatusEnum.SERVICE_BOOKING_FORM_SUBMITED) {
                        setIsViewBookingFormDialog(true)
                      } else if (
                        booking.status === BookingStatusEnum.SENDED_RESULT_SHEET ||
                        booking.status === BookingStatusEnum.COMPLETED
                      ) {
                        setIsViewConsultationResultDialog(true)
                      }
                    }}
                    className='ml-2 p-1 rounded-full hover:bg-primary/10 transition-colors'
                    title={t('booking.viewDetails')}
                  >
                    <Eye className='h-4 w-4 text-primary' />
                  </button>
                )}
              </div>
              <AlertDescription>{config.alertDescription}</AlertDescription>
            </div>
          </div>
        </div>
        <div className='flex gap-2 items-center md:m-0 ml-3'>
          {/* Consultant actions */}
          {isConsultant && (
            <>
              {booking.status === BookingStatusEnum.WAIT_FOR_CONFIRMATION && (
                <Button
                  onClick={() => handleUpdateStatus(BookingStatusEnum.BOOKING_CONFIRMED)}
                  loading={isLoading}
                  className={`${config.buttonBg} flex gap-2`}
                >
                  {config.buttonText}
                  <CircleChevronRight />
                </Button>
              )}

              {booking.status === BookingStatusEnum.COMPLETED_CONSULTING_CALL && (
                <Button
                  onClick={() => setIsOpenConsultationResultDialog(true)}
                  loading={isLoading}
                  className={`${config.buttonBg} flex gap-2`}
                >
                  {config.buttonText}
                  <CircleChevronRight />
                </Button>
              )}

              {booking.status === BookingStatusEnum.WAIT_FOR_CONFIRMATION && (
                <Button
                  variant='outline'
                  className='w-full border border-primary text-primary hover:text-primary hover:bg-primary/10'
                  onClick={() => setOpenCancelBookingDialog(true)}
                >
                  {t('booking.cancelBooking')}
                </Button>
              )}
            </>
          )}

          {booking.status === BookingStatusEnum.SERVICE_BOOKING_FORM_SUBMITED && (
            <Button
              onClick={() => {
                window.location.href = booking.meetUrl
              }}
              loading={isLoading}
              className='bg-primary hover:bg-primary/80 flex gap-2'
            >
              {t('button.joinMeeting')}
              <CircleChevronRight />
            </Button>
          )}

          {/* description for this status for customer: is when if consultant not join, customer can send evidence and notes to report consultant or any problems.
         description for this status for consultant: after finish, consultant must submit evidence. if customer not join, they can include notes.
         */}

          {booking.consultantService.systemService.type === ServiceTypeEnum.PREMIUM &&
            booking.status === BookingStatusEnum.SERVICE_BOOKING_FORM_SUBMITED && (
              <Button
                onClick={() => setIsOpenCompleteConsultingCallDialog(true)}
                loading={isLoading}
                className={`${config.buttonBg} flex gap-2`}
              >
                {config.buttonText}
                <CircleChevronRight />
              </Button>
            )}

          {/* Customer actions */}
          {isCustomer && (
            <>
              {booking.status === BookingStatusEnum.BOOKING_CONFIRMED && (
                <Button
                  onClick={() => setIsOpenBookingFormDialog(true)}
                  loading={isLoading}
                  className='bg-purple-600 hover:bg-purple-800 flex gap-2'
                >
                  {config.buttonText}
                  <CircleChevronRight />
                </Button>
              )}

              {booking.status === BookingStatusEnum.SENDED_RESULT_SHEET && (
                <Button
                  onClick={() => handleUpdateStatus(BookingStatusEnum.COMPLETED)}
                  loading={isLoading}
                  className='bg-green-600 hover:bg-green-800 flex gap-2'
                >
                  {t('booking.markAsCompleted')}
                  <CircleChevronRight />
                </Button>
              )}

              {(booking.status === BookingStatusEnum.TO_PAY ||
                booking.status === BookingStatusEnum.WAIT_FOR_CONFIRMATION) && (
                <Button
                  variant='outline'
                  className='w-full border border-primary text-primary hover:text-primary hover:bg-primary/10'
                  onClick={() => setOpenCancelBookingDialog(true)}
                >
                  {t('booking.cancelBooking')}
                </Button>
              )}
            </>
          )}
        </div>
      </div>

      {/* Dialogs */}
      {isCustomer && booking.status === BookingStatusEnum.BOOKING_CONFIRMED && (
        <ServiceBookingFormDialog
          isOpen={isOpenBookingFormDialog}
          setOpen={() => setIsOpenBookingFormDialog(false)}
          booking={booking}
        />
      )}

      {booking.consultantService.systemService.type === ServiceTypeEnum.PREMIUM &&
        booking.status === BookingStatusEnum.SERVICE_BOOKING_FORM_SUBMITED && (
          <CompleteConsultingCallDialog
            isOpen={isOpenCompleteConsultingCallDialog}
            onClose={() => setIsOpenCompleteConsultingCallDialog(false)}
            booking={booking}
          />
        )}

      {isConsultant && booking.status === BookingStatusEnum.COMPLETED_CONSULTING_CALL && (
        <ConsultationResultDialog
          isOpen={isOpenConsultationResultDialog}
          onClose={() => setIsOpenConsultationResultDialog(false)}
          booking={booking}
        />
      )}

      {/* View Dialogs */}
      {booking.status === BookingStatusEnum.SERVICE_BOOKING_FORM_SUBMITED && (
        <BookingFormAnswersDialog
          isOpen={isViewBookingFormDialog}
          setOpen={() => setIsViewBookingFormDialog(false)}
          booking={booking}
        />
      )}

      {(booking.status === BookingStatusEnum.SENDED_RESULT_SHEET || booking.status === BookingStatusEnum.COMPLETED) && (
        <ConsultationResultInfoDialog
          isOpen={isViewConsultationResultDialog}
          onClose={() => setIsViewConsultationResultDialog(false)}
          booking={booking}
        />
      )}
    </div>
  )
}
