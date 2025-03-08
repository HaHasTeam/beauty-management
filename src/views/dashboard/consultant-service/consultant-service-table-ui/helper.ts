import { CheckCircle2, CircleDashed, CircleIcon, CircleX } from 'lucide-react'

import { ConsultantServiceStatusEnum } from '@/types/consultant-service'

export function getStatusIcon(status: ConsultantServiceStatusEnum) {
  const statusIcons = {
    [ConsultantServiceStatusEnum.ACTIVE]: {
      icon: CheckCircle2,
      iconColor: 'text-green-500',
      textColor: 'text-green-500',
      bgColor: 'bg-green-100'
    },
    [ConsultantServiceStatusEnum.INACTIVE]: {
      icon: CircleDashed,
      iconColor: 'text-gray-500',
      textColor: 'text-gray-500',
      bgColor: 'bg-gray-100'
    },
    [ConsultantServiceStatusEnum.BANNED]: {
      icon: CircleX,
      iconColor: 'text-red-500',
      textColor: 'text-red-500',
      bgColor: 'bg-red-100'
    }
  }
  return statusIcons[status] || CircleIcon
}
