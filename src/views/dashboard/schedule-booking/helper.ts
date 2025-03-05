import { CalendarEvent } from '@/types/booking'
import { BookingStatusEnum } from '@/types/enum'

import { getBookingStatusConfig } from './booking-status-config'

type StatusConfig = {
  borderColor: string
  bgColor: string
  bgTagColor: string
  alertVariant: string
  titleColor: string
  buttonBg: string
  alertTitle: string
  buttonText: string
  alertDescription: string
  nextStatus: BookingStatusEnum | null | string // Updated to allow null
}
export const eventStyleGetter = (event: CalendarEvent, t: (key: string) => string) => {
  const status = event.resource.status as BookingStatusEnum
  const statusConfig: Record<BookingStatusEnum, StatusConfig> = getBookingStatusConfig(t)
  const config = statusConfig[status]

  return {
    style: {
      backgroundColor: config.bgColor,
      color: config.titleColor,
      borderRadius: 'var(--radius)',
      border: 'none',
      display: 'block'
    }
  }
}
export const getStatusClass = (status: BookingStatusEnum, t: (key: string) => string) => {
  const statusConfig = getBookingStatusConfig(t)
  const config = statusConfig[status]

  return `${config.bgColor} ${config.titleColor} ${config.borderColor}`
}

export const getStatusBookingText = (status: BookingStatusEnum, t: (key: string) => string) => {
  const statusConfig = getBookingStatusConfig(t)
  return statusConfig[status]?.alertTitle || status
}

export const getBookingStatusInfo = (status: BookingStatusEnum, t: (key: string) => string) => {
  const statusConfig = getBookingStatusConfig(t)
  const config = statusConfig[status]

  return {
    ...config,
    text: config.alertTitle,
    description: config.alertDescription
  }
}
