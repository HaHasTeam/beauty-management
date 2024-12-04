import { CheckCircle2, CircleDashed, CircleIcon, CircleX, WifiOff } from 'lucide-react'

import { BrandStatusEnum } from '@/types/brand'

export function getStatusIcon(status: BrandStatusEnum) {
  const statusIcons = {
    [BrandStatusEnum.ACTIVE]: {
      icon: CheckCircle2,
      iconColor: 'text-green-500',
      textColor: 'text-green-500',
      bgColor: 'bg-green-100'
    },
    [BrandStatusEnum.PENDING]: {
      icon: CircleDashed,
      iconColor: 'text-yellow-500',
      textColor: 'text-yellow-500',
      bgColor: 'bg-yellow-100'
    },
    [BrandStatusEnum.INACTIVE]: {
      icon: WifiOff,
      iconColor: 'text-gray-500',
      textColor: 'text-gray-500',
      bgColor: 'bg-gray-100'
    },
    [BrandStatusEnum.BANNED]: {
      icon: CircleX,
      iconColor: 'text-red-500',
      textColor: 'text-red-500',
      bgColor: 'bg-red-100'
    }
  }
  return statusIcons[status] || CircleIcon
}
