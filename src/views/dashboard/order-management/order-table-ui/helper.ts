import { Ban, CheckCircle2, CircleAlert, CircleDashed, CircleIcon, CircleMinus, Zap } from 'lucide-react'

import { ProductStatusEnum } from '@/types/product'

export function getStatusIcon(status: ProductStatusEnum) {
  const statusIcons = {
    [ProductStatusEnum.OFFICIAL]: {
      icon: CheckCircle2,
      iconColor: 'text-green-500',
      textColor: 'text-green-500',
      bgColor: 'bg-green-100'
    },
    [ProductStatusEnum.PENDING]: {
      icon: CircleDashed,
      iconColor: 'text-yellow-500',
      textColor: 'text-yellow-500',
      bgColor: 'bg-yellow-100'
    },
    [ProductStatusEnum.INACTIVE]: {
      icon: CircleMinus,
      iconColor: 'text-gray-500',
      textColor: 'text-gray-500',
      bgColor: 'bg-gray-100'
    },
    [ProductStatusEnum.BANNED]: {
      icon: Ban,
      iconColor: 'text-red-500',
      textColor: 'text-red-500',
      bgColor: 'bg-red-100'
    },
    [ProductStatusEnum.OUT_OF_STOCK]: {
      icon: CircleAlert,
      iconColor: 'text-purple-500',
      textColor: 'text-purple-500',
      bgColor: 'bg-purple-100'
    },
    [ProductStatusEnum.FLASH_SALE]: {
      icon: Zap,
      iconColor: 'text-orange-500',
      textColor: 'text-orange-500',
      bgColor: 'bg-orange-100'
    }
  }
  return statusIcons[status] || CircleIcon
}
