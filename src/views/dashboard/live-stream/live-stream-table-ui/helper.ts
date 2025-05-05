import { Ban, CheckCircle2, CircleDashed, CircleIcon, CircleMinus } from 'lucide-react'

import { LiveStreamStatusEnum } from '@/types/live-stream'

export function getStatusIcon(status: LiveStreamStatusEnum) {
  const statusIcons = {
    [LiveStreamStatusEnum.LIVE]: {
      icon: CheckCircle2,
      iconColor: 'text-green-500',
      textColor: 'text-green-500',
      bgColor: 'bg-green-100'
    },
    [LiveStreamStatusEnum.SCHEDULED]: {
      icon: CircleDashed,
      iconColor: 'text-yellow-500',
      textColor: 'text-yellow-500',
      bgColor: 'bg-yellow-100'
    },
    [LiveStreamStatusEnum.ENDED]: {
      icon: CircleMinus,
      iconColor: 'text-gray-500',
      textColor: 'text-gray-500',
      bgColor: 'bg-gray-100'
    },
    [LiveStreamStatusEnum.CANCELLED]: {
      icon: Ban,
      iconColor: 'text-red-500',
      textColor: 'text-red-500',
      bgColor: 'bg-red-100'
    }
  }
  return statusIcons[status] || CircleIcon
}
