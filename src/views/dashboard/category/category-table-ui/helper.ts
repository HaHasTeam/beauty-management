import { CheckCircle2, CircleMinus } from 'lucide-react'

import { CategoryStatusEnum } from '@/types/category'

export function getStatusIcon(status: CategoryStatusEnum) {
  const statusIcons = {
    [CategoryStatusEnum.ACTIVE]: {
      icon: CheckCircle2,
      iconColor: 'text-green-500',
      textColor: 'text-green-500',
      bgColor: 'bg-green-100'
    },

    [CategoryStatusEnum.INACTIVE]: {
      icon: CircleMinus,
      iconColor: 'text-gray-500',
      textColor: 'text-gray-500',
      bgColor: 'bg-gray-100'
    }
  }
  return statusIcons[status] || CheckCircle2
}
