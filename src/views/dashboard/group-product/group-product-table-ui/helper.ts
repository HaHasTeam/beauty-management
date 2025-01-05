import { Ban, CheckCircle2, CircleDashed, CircleIcon, CircleMinus, CircleX } from 'lucide-react'

import { GroupProductStatusEnum } from '@/types/group-product'

export function getStatusIcon(status: GroupProductStatusEnum) {
  const statusIcons = {
    [GroupProductStatusEnum.ACTIVE]: {
      icon: CheckCircle2,
      iconColor: 'text-green-500',
      textColor: 'text-green-500',
      bgColor: 'bg-green-100'
    },
    [GroupProductStatusEnum.PENDING]: {
      icon: CircleDashed,
      iconColor: 'text-yellow-500',
      textColor: 'text-yellow-500',
      bgColor: 'bg-yellow-100'
    },
    [GroupProductStatusEnum.INACTIVE]: {
      icon: CircleMinus,
      iconColor: 'text-gray-500',
      textColor: 'text-gray-500',
      bgColor: 'bg-gray-100'
    },
    [GroupProductStatusEnum.BANNED]: {
      icon: Ban,
      iconColor: 'text-red-500',
      textColor: 'text-red-500',
      bgColor: 'bg-red-100'
    },
    [GroupProductStatusEnum.DENIED]: {
      icon: CircleX,
      iconColor: 'text-red-500',
      textColor: 'text-red-500',
      bgColor: 'bg-red-100'
    }
  }
  return statusIcons[status] || CircleIcon
}
