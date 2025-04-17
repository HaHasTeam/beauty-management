import { CheckCircle, CircleIcon, Clock, CreditCard, FileText, MailCheck, RefreshCcw, XCircle } from 'lucide-react'

import { BookingStatusEnum } from '@/types/enum'

export function getStatusIcon(status: BookingStatusEnum) {
  const statusIcons = {
    [BookingStatusEnum.TO_PAY]: {
      icon: CreditCard,
      iconColor: 'text-yellow-500',
      textColor: 'text-yellow-500',
      bgColor: 'bg-yellow-100'
    },
    [BookingStatusEnum.WAIT_FOR_CONFIRMATION]: {
      icon: Clock,
      iconColor: 'text-orange-500',
      textColor: 'text-orange-500',
      bgColor: 'bg-orange-100'
    },
    [BookingStatusEnum.BOOKING_CONFIRMED]: {
      icon: CheckCircle,
      iconColor: 'text-green-500',
      textColor: 'text-green-500',
      bgColor: 'bg-green-100'
    },
    [BookingStatusEnum.SERVICE_BOOKING_FORM_SUBMITED]: {
      icon: FileText,
      iconColor: 'text-blue-500',
      textColor: 'text-blue-500',
      bgColor: 'bg-blue-100'
    },
    [BookingStatusEnum.SENDED_RESULT_SHEET]: {
      icon: MailCheck,
      iconColor: 'text-purple-500',
      textColor: 'text-purple-500',
      bgColor: 'bg-purple-100'
    },
    [BookingStatusEnum.COMPLETED]: {
      icon: CheckCircle,
      iconColor: 'text-emerald-500',
      textColor: 'text-emerald-500',
      bgColor: 'bg-emerald-100'
    },
    [BookingStatusEnum.REFUNDED]: {
      icon: RefreshCcw,
      iconColor: 'text-teal-500',
      textColor: 'text-teal-500',
      bgColor: 'bg-teal-100'
    },
    [BookingStatusEnum.CANCELLED]: {
      icon: XCircle,
      iconColor: 'text-red-500',
      textColor: 'text-red-500',
      bgColor: 'bg-red-100'
    },
    [BookingStatusEnum.COMPLETED_CONSULTING_CALL]: {
      icon: CheckCircle,
      iconColor: 'text-emerald-500',
      textColor: 'text-emerald-500',
      bgColor: 'bg-emerald-100'
    }
  }

  return (
    statusIcons[status] || {
      icon: CircleIcon,
      iconColor: 'text-gray-500',
      textColor: 'text-gray-500',
      bgColor: 'bg-gray-100'
    }
  )
}
