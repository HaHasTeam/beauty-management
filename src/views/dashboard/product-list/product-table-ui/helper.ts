import { Ban, CheckCircle2, CircleAlert, CircleDashed, CircleIcon, CircleMinus, EyeClosed, Zap } from 'lucide-react'

import { ProductStatusEnum } from '@/types/product'

export function getStatusIcon(status: ProductStatusEnum) {
  const statusIcons = {
    [ProductStatusEnum.OFFICIAL]: {
      icon: CheckCircle2,
      iconColor: 'text-green-600',
      textColor: 'text-green-600',
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
      iconColor: 'text-gray-600',
      textColor: 'text-gray-600',
      bgColor: 'bg-gray-100'
    },
    [ProductStatusEnum.BANNED]: {
      icon: Ban,
      iconColor: 'text-red-700',
      textColor: 'text-red-700',
      bgColor: 'bg-red-200'
    },
    [ProductStatusEnum.OUT_OF_STOCK]: {
      icon: CircleAlert,
      iconColor: 'text-red-600',
      textColor: 'text-red-600',
      bgColor: 'bg-red-100'
    },
    [ProductStatusEnum.UN_PUBLISHED]: {
      icon: EyeClosed,
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
