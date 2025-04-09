import { CheckCircle2, CircleIcon, CircleMinus, EyeClosed } from 'lucide-react'

import { BlogEnum } from '@/types/enum'

export function getStatusIcon(status: BlogEnum) {
  const statusIcons = {
    [BlogEnum.PUBLISHED]: {
      icon: CheckCircle2,
      iconColor: 'text-green-500',
      textColor: 'text-green-500',
      bgColor: 'bg-green-100'
    },
    [BlogEnum.UN_PUBLISHED]: {
      icon: EyeClosed,
      iconColor: 'text-purple-500',
      textColor: 'text-purple-500',
      bgColor: 'bg-purple-100'
    },
    [BlogEnum.INACTIVE]: {
      icon: CircleMinus,
      iconColor: 'text-gray-600',
      textColor: 'text-gray-600',
      bgColor: 'bg-gray-100'
    }
  }
  return statusIcons[status] || CircleIcon
}
