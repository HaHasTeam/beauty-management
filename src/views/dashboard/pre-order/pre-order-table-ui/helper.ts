import { CheckCircle2, CircleDashed, CircleIcon, CircleMinus, CircleX } from 'lucide-react'

import { PreOrderStatusEnum } from '@/types/pre-order'

export function getStatusIcon(status: PreOrderStatusEnum) {
  const statusIcons = {
    [PreOrderStatusEnum.ACTIVE]: {
      icon: CheckCircle2,
      iconColor: 'text-green-500',
      textColor: 'text-green-500',
      bgColor: 'bg-green-100'
    },
    [PreOrderStatusEnum.WAITING]: {
      icon: CircleDashed,
      iconColor: 'text-yellow-500',
      textColor: 'text-yellow-500',
      bgColor: 'bg-yellow-100'
    },
    [PreOrderStatusEnum.INACTIVE]: {
      icon: CircleMinus,
      iconColor: 'text-gray-500',
      textColor: 'text-gray-500',
      bgColor: 'bg-gray-100'
    },
    [PreOrderStatusEnum.SOLD_OUT]: {
      icon: CircleX,
      iconColor: 'text-purple-500',
      textColor: 'text-purple-500',
      bgColor: 'bg-purple-100'
    }
  }
  return statusIcons[status] || CircleIcon
}
