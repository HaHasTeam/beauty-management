import { AlertCircleIcon, CheckCircle2Icon, ClockIcon, XCircleIcon } from 'lucide-react'
import { useTranslation } from 'react-i18next'

import { TOrderRequest } from '@/types/order-request'

interface OrderRequestStatusCellProps {
  request: TOrderRequest
}

export function OrderRequestStatusCell({ request }: OrderRequestStatusCellProps) {
  const { t } = useTranslation()

  const getStatusIcon = (status: TOrderRequest['status']) => {
    switch (status) {
      case 'PENDING':
        return <ClockIcon className='h-3 w-3 mr-1' />
      case 'APPROVED':
        return <CheckCircle2Icon className='h-3 w-3 mr-1' />
      case 'REJECTED':
        return <XCircleIcon className='h-3 w-3 mr-1' />
      default:
        return <AlertCircleIcon className='h-3 w-3 mr-1' />
    }
  }

  const getStatusTextColor = (status: TOrderRequest['status']) => {
    switch (status) {
      case 'PENDING':
        return 'text-yellow-600'
      case 'APPROVED':
        return 'text-green-600'
      case 'REJECTED':
        return 'text-red-600'
      default:
        return 'text-gray-600'
    }
  }

  const getStatusBgColor = (status: TOrderRequest['status']) => {
    switch (status) {
      case 'PENDING':
        return 'bg-yellow-50'
      case 'APPROVED':
        return 'bg-green-50'
      case 'REJECTED':
        return 'bg-red-50'
      default:
        return 'bg-gray-50'
    }
  }

  return (
    <div className={`flex items-center gap-1 px-2 py-1 rounded-md ${getStatusBgColor(request.status)}`}>
      {getStatusIcon(request.status)}
      <span className={`text-sm font-medium ${getStatusTextColor(request.status)}`}>
        {t(`order.request.status.${request.status.toLowerCase()}`, {
          defaultValue: request.status,
          PENDING: 'Pending',
          APPROVED: 'Approved',
          REJECTED: 'Rejected'
        })}
      </span>
    </div>
  )
}
