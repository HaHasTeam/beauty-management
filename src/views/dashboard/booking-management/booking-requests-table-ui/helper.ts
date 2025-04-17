import { CheckCircle2, CircleDashed, CircleIcon, CircleMinus } from 'lucide-react'

import { OrderRequestStatusEnum } from '@/types/order-request'

export function getStatusIcon(status: OrderRequestStatusEnum) {
  const statusIcons = {
    [OrderRequestStatusEnum.PENDING]: {
      icon: CircleDashed,
      iconColor: 'text-yellow-500',
      textColor: 'text-yellow-500',
      bgColor: 'bg-yellow-100'
    },
    [OrderRequestStatusEnum.APPROVED]: {
      icon: CheckCircle2,
      iconColor: 'text-blue-500',
      textColor: 'text-blue-500',
      bgColor: 'bg-blue-100'
    },
    [OrderRequestStatusEnum.REJECTED]: {
      icon: CircleMinus,
      iconColor: 'text-red-500',
      textColor: 'text-red-500',
      bgColor: 'bg-red-100'
    }
  }
  return statusIcons[status] || CircleIcon
}
