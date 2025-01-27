import { CheckCircle2, CircleDashed, CircleIcon, CircleX, WifiOff } from 'lucide-react'

import { FlashSaleStatusEnum } from '@/types/flash-sale'

export function getStatusIcon(status: FlashSaleStatusEnum) {
  const statusIcons = {
    [FlashSaleStatusEnum.ACTIVE]: {
      icon: CheckCircle2,
      iconColor: 'text-green-500',
      textColor: 'text-green-500',
      bgColor: 'bg-green-100'
    },
    [FlashSaleStatusEnum.WAITING]: {
      icon: CircleDashed,
      iconColor: 'text-yellow-500',
      textColor: 'text-yellow-500',
      bgColor: 'bg-yellow-100'
    },
    [FlashSaleStatusEnum.INACTIVE]: {
      icon: WifiOff,
      iconColor: 'text-gray-500',
      textColor: 'text-gray-500',
      bgColor: 'bg-gray-100'
    },
    [FlashSaleStatusEnum.SOLD_OUT]: {
      icon: CircleX,
      iconColor: 'text-purple-500',
      textColor: 'text-purple-500',
      bgColor: 'bg-purple-100'
    }
  }
  return statusIcons[status] || CircleIcon
}
