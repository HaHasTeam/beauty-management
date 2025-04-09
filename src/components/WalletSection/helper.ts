import { CheckCircle2, CircleIcon, CircleX } from 'lucide-react'

import { TransactionStatusEnum } from '@/types/transaction'

export function getStatusIcon(status: TransactionStatusEnum) {
  const statusIcons = {
    [TransactionStatusEnum.COMPLETED]: {
      icon: CheckCircle2,
      iconColor: 'text-green-500',
      textColor: 'text-green-500',
      bgColor: 'bg-green-100'
    },
    [TransactionStatusEnum.REFUNDED]: {
      icon: CircleIcon,
      iconColor: 'text-blue-500',
      textColor: 'text-blue-500',
      bgColor: 'bg-blue-100'
    },
    [TransactionStatusEnum.FAILED]: {
      icon: CircleX,
      iconColor: 'text-red-500',
      textColor: 'text-red-500',
      bgColor: 'bg-red-100'
    },
    [TransactionStatusEnum.PENDING]: {
      icon: CircleIcon,
      iconColor: 'text-yellow-500',
      textColor: 'text-yellow-500',
      bgColor: 'bg-yellow-100'
    },
    [TransactionStatusEnum.PROCESSING]: {
      icon: CircleIcon,
      iconColor: 'text-orange-500',
      textColor: 'text-orange-500',
      bgColor: 'bg-orange-100'
    }
  }
  return statusIcons[status] || CircleIcon
}
