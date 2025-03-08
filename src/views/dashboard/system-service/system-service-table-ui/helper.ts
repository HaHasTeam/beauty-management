import { CheckCircle2, CircleDashed, CircleIcon } from 'lucide-react'

import { SystemServiceStatusEnum } from '@/types/system-service'

export function getStatusIcon(status: SystemServiceStatusEnum) {
  const statusIcons = {
    [SystemServiceStatusEnum.ACTIVE]: {
      icon: CheckCircle2,
      iconColor: 'text-green-500',
      textColor: 'text-green-500',
      bgColor: 'bg-green-100'
    },
    [SystemServiceStatusEnum.INACTIVE]: {
      icon: CircleDashed,
      iconColor: 'text-gray-500',
      textColor: 'text-gray-500',
      bgColor: 'bg-gray-100'
    }
  }
  return statusIcons[status] || CircleIcon
}
