import { useQuery } from '@tanstack/react-query'
import { format } from 'date-fns'
import {
  Calendar,
  CheckCircle2,
  CircleDashed,
  CircleMinus,
  Clock,
  Link as LinkIcon,
  Package,
  PackageCheck,
  Video,
  XCircle
} from 'lucide-react'
import { ElementRef, forwardRef, useMemo } from 'react'
import { useTranslation } from 'react-i18next'

import { getAllBookingsApi } from '@/network/apis/booking'
import { TBooking } from '@/types/booking'
import { BookingStatusEnum, ServiceTypeEnum } from '@/types/enum'
import { minifyString, minifyStringId } from '@/utils/string'

import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar'
import { Badge } from '../ui/badge'
import { InputProps } from '../ui/input'
import { TOption } from '../ui/react-select'
import AsyncSelect from '../ui/react-select/AsyncSelect'

// Format status by removing underscores and capitalizing words
function formatStatus(status: string): string {
  return status
    .split('_')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ')
}

// Format service type
function formatServiceType(type: ServiceTypeEnum): string {
  return type === ServiceTypeEnum.PREMIUM ? 'Premium' : 'Standard'
}

// Get the styling properties for different status types
function getStatusProps(status: string) {
  let bgColor = 'bg-gray-100 text-gray-500'
  let icon = <CircleDashed className='h-3 w-3' />

  switch (status) {
    case BookingStatusEnum.COMPLETED:
      bgColor = 'bg-green-100 text-green-600'
      icon = <CheckCircle2 className='h-3 w-3' />
      break
    case BookingStatusEnum.COMPLETED_CONSULTING_CALL:
      bgColor = 'bg-green-100 text-green-600'
      icon = <Video className='h-3 w-3' />
      break
    case BookingStatusEnum.BOOKING_CONFIRMED:
      bgColor = 'bg-blue-100 text-blue-600'
      icon = <PackageCheck className='h-3 w-3' />
      break
    case BookingStatusEnum.WAIT_FOR_CONFIRMATION:
      bgColor = 'bg-amber-100 text-amber-600'
      icon = <Clock className='h-3 w-3' />
      break
    case BookingStatusEnum.CANCELLED:
      bgColor = 'bg-red-100 text-red-600'
      icon = <XCircle className='h-3 w-3' />
      break
    case BookingStatusEnum.REFUNDED:
      bgColor = 'bg-gray-100 text-gray-600'
      icon = <CircleMinus className='h-3 w-3' />
      break
    // Add any other statuses as needed
    default:
      break
  }

  return {
    bgColor,
    icon
  }
}

// Get service type style
function getServiceTypeProps(type: ServiceTypeEnum) {
  return type === ServiceTypeEnum.PREMIUM
    ? {
        bgColor: 'bg-purple-100 text-purple-600',
        icon: <Package className='h-3 w-3' />
      }
    : {
        bgColor: 'bg-blue-100 text-blue-600',
        icon: <Package className='h-3 w-3' />
      }
}

type Props = Omit<InputProps, 'value' | 'onChange'> & {
  onChange?: (value: TBooking | TBooking[] | null) => void
  value?: TBooking | TBooking[] | null
  multiple?: boolean
}

const SelectBooking = forwardRef<ElementRef<typeof AsyncSelect>, Props>((props, ref) => {
  const { t } = useTranslation()
  const { placeholder = 'Select a booking', className, onChange, value, multiple = false } = props

  const getItemDisplay = (booking: TBooking) => {
    // Get booking status for display
    const status = booking?.status || BookingStatusEnum.TO_PAY
    const displayStatus = formatStatus(status)
    const statusProps = getStatusProps(status)

    // Get service type from consultantService.systemService.type
    const serviceType = booking?.consultantService?.systemService?.type || ServiceTypeEnum.STANDARD
    const serviceTypeProps = getServiceTypeProps(serviceType)

    // Format dates
    const startTime = booking?.startTime ? format(new Date(booking.startTime), 'dd MMM yyyy HH:mm') : ''

    // Get service name from consultantService.systemService.name
    const serviceName = booking?.consultantService?.systemService?.name || ''

    return (
      <div className='flex items-center gap-2 py-1 w-full'>
        {/* Booking Icon with ID */}
        <div className='flex-shrink-0 w-6 h-6 rounded-full bg-blue-100/50 flex items-center justify-center text-blue-500'>
          <Calendar className='h-3.5 w-3.5' />
        </div>

        {/* Booking ID */}
        <div className='font-medium text-sm whitespace-nowrap'>{minifyStringId(booking?.id)}</div>

        {/* Status Badge */}
        <Badge variant='outline' className={`${statusProps.bgColor} gap-1 h-5 px-1.5 py-0`}>
          {statusProps.icon}
          <span className='whitespace-nowrap text-xs'>{displayStatus}</span>
        </Badge>

        {/* Service Type Badge */}
        <Badge variant='outline' className={`${serviceTypeProps.bgColor} gap-1 h-5 px-1.5 py-0`}>
          {serviceTypeProps.icon}
          <span className='whitespace-nowrap text-xs'>{formatServiceType(serviceType)}</span>
        </Badge>

        {/* Meet URL if available */}
        {booking.meetUrl && (
          <div className='flex items-center gap-1 text-blue-500 max-w-[100px] sm:max-w-[150px] md:max-w-[200px]'>
            <LinkIcon className='h-3 w-3 flex-shrink-0' />
            <span className='text-xs truncate' title={booking.meetUrl}>
              Meet URL
            </span>
          </div>
        )}

        {/* Spacer to push remaining items to right */}
        <div className='flex-grow'></div>

        {/* Service Information with Image */}
        <div className='flex items-center gap-2'>
          <Avatar className='w-5 h-5 border border-white'>
            <AvatarImage
              src={booking?.consultantService?.images?.[0]?.fileUrl}
              alt={serviceName}
              className='bg-transparent'
            />
            <AvatarFallback className='bg-gray-50 text-gray-500 p-0.5'>
              <Package size={12} />
            </AvatarFallback>
          </Avatar>
          <span className='max-w-[120px] truncate text-xs' title={serviceName}>
            {serviceName}
          </span>
        </div>

        {/* Date & Time */}
        <div className='flex items-center gap-1 text-xs font-semibold whitespace-nowrap'>
          <Clock className='h-3 w-3' />
          {startTime}
        </div>

        {/* Price formatted with translation */}
        <div className='text-xs font-semibold whitespace-nowrap ml-2'>
          {t('productCard.price', { price: booking.totalPrice })}
        </div>
      </div>
    )
  }

  const { data: bookingList, isFetching: isGettingBookingList } = useQuery({
    queryKey: [getAllBookingsApi.queryKey],
    queryFn: getAllBookingsApi.fn
  })

  const bookingOptions = useMemo(() => {
    if (!bookingList) return []
    return bookingList?.data
      .filter(() => true)
      .map((booking) => ({
        value: booking.id,
        label: minifyString(booking.id),
        display: getItemDisplay(booking)
      }))
  }, [bookingList, t])

  const selectedOptions = useMemo(() => {
    if (multiple) {
      if (!value) return []
      const selectedValues = Array.isArray(value) ? value : [value]
      return selectedValues
        .map((selectedValue) => {
          const booking = bookingList?.data.find((booking) => booking.id === (selectedValue as TBooking).id)
          if (!booking) return null
          return {
            value: booking.id,
            label: minifyString(booking.id),
            display: getItemDisplay(booking)
          }
        })
        .filter(Boolean)
    } else {
      if (!value) return null
      const selectedId = typeof value === 'string' ? value : (value as TBooking).id
      const booking = bookingList?.data.find((booking) => booking.id === selectedId)
      if (!booking) return null
      return {
        value: booking.id,
        label: minifyString(booking.id),
        display: getItemDisplay(booking)
      }
    }
  }, [value, bookingList?.data, multiple, t])

  return (
    <AsyncSelect
      ref={ref}
      defaultOptions={bookingOptions}
      isMulti={multiple}
      placeholder={placeholder}
      className={className}
      isLoading={isGettingBookingList}
      isClearable
      value={selectedOptions}
      filterOption={(option, inputValue) => {
        // Check if option's data matches our search criteria
        if (!inputValue) return true

        const searchTerms = inputValue.toLowerCase().trim().split(' ')
        const booking = bookingList?.data.find((b) => b.id === option.value)
        if (!booking) return false

        // Check each search term against the booking data
        return searchTerms.every((term) => {
          // Search in booking ID
          if (booking.id?.toLowerCase().includes(term)) return true

          // Search in status
          if (booking.status?.toLowerCase().includes(term)) return true

          // Search in date
          const formattedDate = booking.startTime
            ? format(new Date(booking.startTime), 'dd MMM yyyy').toLowerCase()
            : ''
          if (formattedDate.includes(term)) return true

          // Search in service name
          const serviceName = booking.consultantService?.systemService?.name || ''
          if (serviceName.toLowerCase().includes(term)) return true

          // Search in total amount
          const totalAmount = String(booking.totalPrice || '')
          if (totalAmount.includes(term)) return true

          return false
        })
      }}
      onChange={(options) => {
        if (multiple) {
          const optionValues = options as TOption[]
          if (onChange) {
            // Filter out bookings that don't exist
            const selectedBookings = optionValues
              .map((option) => {
                const booking = bookingList?.data.find((booking) => booking.id === option.value)
                return booking
              })
              .filter(Boolean) as TBooking[]
            onChange(selectedBookings.length > 0 ? selectedBookings : null)
          }
        } else {
          const optionValue = options as TOption | null
          if (onChange) {
            if (!optionValue) {
              onChange(null)
              return
            }
            const selectedBooking = bookingList?.data.find((booking) => booking.id === optionValue?.value)
            onChange(selectedBooking || null)
          }
        }
      }}
    />
  )
})

SelectBooking.displayName = 'SelectBooking'

export default SelectBooking
