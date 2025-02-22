import { CalendarEvent } from '@/types/booking'
import { BookingStatusEnum } from '@/types/enum'

export const eventStyleGetter = (event: CalendarEvent) => {
  let backgroundColor = 'hsl(var(--primary))'
  let textColor = 'hsl(var(--primary-foreground))'

  switch (event.resource.status) {
    case BookingStatusEnum.WAIT_FOR_CONFIRMATION:
      backgroundColor = 'hsl(var(--warning))'
      textColor = 'hsl(var(--warning-foreground))'
      break
    case BookingStatusEnum.BOOKING_CONFIRMED:
      backgroundColor = 'hsl(var(--success))'
      textColor = 'hsl(var(--success-foreground))'
      break
    case BookingStatusEnum.CANCELLED:
      backgroundColor = 'hsl(var(--destructive))'
      textColor = 'hsl(var(--destructive-foreground))'
      break
  }

  return {
    style: {
      backgroundColor,
      color: textColor,
      borderRadius: 'var(--radius)',
      border: 'none',
      display: 'block'
    }
  }
}

export const getStatusClass = (status: string) => {
  switch (status) {
    case BookingStatusEnum.WAIT_FOR_CONFIRMATION:
      return 'bg-[hsl(var(--warning-light))] text-[hsl(var(--warning-dark))] border-[hsl(var(--warning-border))]'
    case BookingStatusEnum.BOOKING_CONFIRMED:
      return 'bg-[hsl(var(--success-light))] text-[hsl(var(--success-dark))] border-[hsl(var(--success-border))]'
    case BookingStatusEnum.CANCELLED:
      return 'bg-[hsl(var(--destructive-light))] text-[hsl(var(--destructive-dark))] border-[hsl(var(--destructive-border))]'
    default:
      return 'bg-[hsl(var(--neutral-light))] text-[hsl(var(--neutral-dark))] border-[hsl(var(--neutral-border))]'
  }
}
export const getStatusBookingText = (status: string) => {
  switch (status) {
    case BookingStatusEnum.WAIT_FOR_CONFIRMATION:
      return 'Wait For Confirmation'
    case BookingStatusEnum.BOOKING_CONFIRMED:
      return 'Confirmed'
    case BookingStatusEnum.CANCELLED:
      return 'Cancelled'
    default:
      return status
  }
}
