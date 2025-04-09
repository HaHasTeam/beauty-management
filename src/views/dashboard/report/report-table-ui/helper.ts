import { CheckCircle2, CircleDashed, CircleIcon, CircleX } from 'lucide-react'

import { ReportStatusEnum } from '@/types/report'

export function getStatusIcon(status: ReportStatusEnum) {
  const statusIcons = {
    [ReportStatusEnum.DONE]: {
      icon: CheckCircle2,
      iconColor: 'text-green-500',
      textColor: 'text-green-500',
      bgColor: 'bg-green-100'
    },
    [ReportStatusEnum.IN_PROCESSING]: {
      icon: CircleIcon,
      iconColor: 'text-blue-500',
      textColor: 'text-blue-500',
      bgColor: 'bg-blue-100'
    },
    [ReportStatusEnum.CANCELLED]: {
      icon: CircleX,
      iconColor: 'text-red-500',
      textColor: 'text-red-500',
      bgColor: 'bg-red-100'
    },
    [ReportStatusEnum.PENDING]: {
      icon: CircleDashed,
      iconColor: 'text-yellow-500',
      textColor: 'text-yellow-500',
      bgColor: 'bg-yellow-100'
    }
  }
  return statusIcons[status] || CircleIcon
}
