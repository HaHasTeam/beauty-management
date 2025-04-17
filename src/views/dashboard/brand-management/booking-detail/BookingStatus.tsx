import { useTranslation } from 'react-i18next'

import { BookingStatusEnum } from '@/types/enum'

interface BookingStatusProps {
  status: BookingStatusEnum
  size?: 'small' | 'medium' | 'large'
}

export default function BookingStatus({ status, size = 'medium' }: BookingStatusProps) {
  const { t } = useTranslation()

  let tagColorClass = ''
  let bgColorClass = ''
  let tagText = ''
  const sizeClasses = {
    small: 'px-1 text-xs',
    medium: 'px-2 py-1 text-sm sm:text-xs',
    large: 'p-3 lg:text-base md:text-sm sm:text-xs',
  }

  // Define color based on status
  switch (status) {
    case BookingStatusEnum.TO_PAY:
      tagColorClass = 'text-yellow-500'
      bgColorClass = 'bg-yellow-100'
      tagText = t('bookingStatus.toPay')
      break
    case BookingStatusEnum.WAIT_FOR_CONFIRMATION:
      tagColorClass = 'text-orange-600'
      bgColorClass = 'bg-orange-100'
      tagText = t('bookingStatus.waitForConfirmation')
      break
    case BookingStatusEnum.BOOKING_CONFIRMED:
      tagColorClass = 'text-blue-600'
      bgColorClass = 'bg-blue-100'
      tagText = t('bookingStatus.bookingConfirmed')
      break
    case BookingStatusEnum.SERVICE_BOOKING_FORM_SUBMITED:
      tagColorClass = 'text-cyan-600'
      bgColorClass = 'bg-cyan-100'
      tagText = t('bookingStatus.formSubmitted')
      break
    case BookingStatusEnum.SENDED_RESULT_SHEET:
      tagColorClass = 'text-indigo-600'
      bgColorClass = 'bg-indigo-100'
      tagText = t('bookingStatus.resultSent')
      break
    case BookingStatusEnum.COMPLETED:
      tagColorClass = 'text-green-600'
      bgColorClass = 'bg-green-100'
      tagText = t('bookingStatus.completed')
      break
    case BookingStatusEnum.REFUNDED:
      tagColorClass = 'text-purple-600'
      bgColorClass = 'bg-purple-100'
      tagText = t('bookingStatus.refunded')
      break
    case BookingStatusEnum.CANCELLED:
      tagColorClass = 'text-red-600'
      bgColorClass = 'bg-red-100'
      tagText = t('bookingStatus.cancelled')
      break
    default:
      tagColorClass = 'bg-gray-100 text-gray-800'
      tagText = t('bookingStatus.unknown')
      break
  }

  return (
    <span
      className={`${sizeClasses[size]} p-2 ${bgColorClass} rounded-full uppercase cursor-default font-bold ${tagColorClass}`}
    >
      {tagText}
    </span>
  )
}
