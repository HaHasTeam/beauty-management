import { CheckCircle2, CircleEllipsis, Clock, CreditCard, FileCheck, MailCheck, RefreshCcw, X } from 'lucide-react'

import { Badge } from '@/components/ui/badge'
import { TBooking } from '@/types/booking'
import { BookingStatusEnum } from '@/types/enum'

interface BookingStatusCellProps {
  booking: TBooking
}

export function BookingStatusCell({ booking }: BookingStatusCellProps) {
  const { status } = booking

  // Hàm định dạng trạng thái: Xóa dấu gạch dưới, chuyển về lowercase và chỉ viết hoa chữ cái đầu mỗi từ
  const formatStatus = (status: string) => {
    if (!status) return 'Unknown'

    return status
      .toLowerCase()
      .replace(/_/g, ' ')
      .split(' ')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ')
  }

  switch (status) {
    case BookingStatusEnum.TO_PAY:
      return (
        <Badge variant='outline' className='border-yellow-200 bg-yellow-50 text-yellow-700 gap-1'>
          <CreditCard className='h-3.5 w-3.5' />
          <span className='whitespace-nowrap'>To Pay</span>
        </Badge>
      )

    case BookingStatusEnum.WAIT_FOR_CONFIRMATION:
      return (
        <Badge variant='outline' className='border-blue-200 bg-blue-50 text-blue-700 gap-1'>
          <CircleEllipsis className='h-3.5 w-3.5' />
          <span className='whitespace-nowrap'>Waiting Confirmation</span>
        </Badge>
      )

    case BookingStatusEnum.BOOKING_CONFIRMED:
      return (
        <Badge variant='outline' className='border-green-200 bg-green-50 text-green-700 gap-1'>
          <Clock className='h-3.5 w-3.5' />
          <span className='whitespace-nowrap'>Confirmed</span>
        </Badge>
      )

    case BookingStatusEnum.SERVICE_BOOKING_FORM_SUBMITED:
      return (
        <Badge variant='outline' className='border-purple-200 bg-purple-50 text-purple-700 gap-1'>
          <FileCheck className='h-3.5 w-3.5' />
          <span className='whitespace-nowrap'>Form Submitted</span>
        </Badge>
      )

    case BookingStatusEnum.SENDED_RESULT_SHEET:
      return (
        <Badge variant='outline' className='border-indigo-200 bg-indigo-50 text-indigo-700 gap-1'>
          <MailCheck className='h-3.5 w-3.5' />
          <span className='whitespace-nowrap'>Result Sent</span>
        </Badge>
      )

    case BookingStatusEnum.COMPLETED:
      return (
        <Badge variant='outline' className='border-emerald-200 bg-emerald-50 text-emerald-700 gap-1'>
          <CheckCircle2 className='h-3.5 w-3.5' />
          <span className='whitespace-nowrap'>Completed</span>
        </Badge>
      )

    case BookingStatusEnum.REFUNDED:
      return (
        <Badge variant='outline' className='border-teal-200 bg-teal-50 text-teal-700 gap-1'>
          <RefreshCcw className='h-3.5 w-3.5' />
          <span className='whitespace-nowrap'>Refunded</span>
        </Badge>
      )

    case BookingStatusEnum.CANCELLED:
      return (
        <Badge variant='outline' className='border-red-200 bg-red-50 text-red-700 gap-1'>
          <X className='h-3.5 w-3.5' />
          <span className='whitespace-nowrap'>Cancelled</span>
        </Badge>
      )

    default:
      return (
        <Badge variant='outline' className='border-gray-200 bg-gray-50 text-gray-700 gap-1'>
          <CircleEllipsis className='h-3.5 w-3.5' />
          <span className='whitespace-nowrap'>{formatStatus(status)}</span>
        </Badge>
      )
  }
}
