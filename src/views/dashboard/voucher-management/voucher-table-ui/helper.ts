import { CheckCircle2, CircleDashed, CircleIcon, CircleX, WifiOff } from 'lucide-react'

import { StatusEnum } from '@/types/enum'

export function getStatusIcon(status: StatusEnum) {
  const statusIcons = {
    [StatusEnum.ACTIVE]: {
      icon: CheckCircle2,
      iconColor: 'text-green-500',
      textColor: 'text-green-500',
      bgColor: 'bg-green-100'
    },
    [StatusEnum.PENDING]: {
      icon: CircleDashed,
      iconColor: 'text-yellow-500',
      textColor: 'text-yellow-500',
      bgColor: 'bg-yellow-100'
    },
    [StatusEnum.INACTIVE]: {
      icon: WifiOff,
      iconColor: 'text-gray-500',
      textColor: 'text-gray-500',
      bgColor: 'bg-gray-100'
    },
    [StatusEnum.BANNED]: {
      icon: CircleX,
      iconColor: 'text-red-500',
      textColor: 'text-red-500',
      bgColor: 'bg-red-100'
    },
    [StatusEnum.DENIED]: {
      icon: CircleX,
      iconColor: 'text-red-500',
      textColor: 'text-red-500',
      bgColor: 'bg-red-100'
    }
  }
  return statusIcons[status] || CircleIcon
}
