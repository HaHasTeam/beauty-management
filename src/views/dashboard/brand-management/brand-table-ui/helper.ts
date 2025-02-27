import { CheckCircle2, CircleDashed, CircleIcon, CircleX, WifiOff, X } from 'lucide-react'

import { BrandStatusEnum } from '@/types/brand'

export function getStatusIcon(status: BrandStatusEnum) {
  const statusIcons = {
    [BrandStatusEnum.ACTIVE]: {
      icon: CheckCircle2,
      iconColor: 'text-green-500',
      textColor: 'text-green-500',
      bgColor: 'bg-green-100'
    },
    [BrandStatusEnum.PENDING_REVIEW]: {
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
    },
    [BrandStatusEnum.DENIED]: {
      icon: X,
      iconColor: 'text-red-400',
      textColor: 'text-red-400',
      bgColor: 'bg-red-100'
    },
    [BrandStatusEnum.NEED_ADDITIONAL_DOCUMENTS]: {
      icon: X,
      iconColor: 'text-slate-400',
      textColor: 'text-slate-400',
      bgColor: 'bg-slate-100'
    },
    [BrandStatusEnum.PRE_APPROVED_FOR_MEETING]: {
      icon: X,
      iconColor: 'text-green-300',
      textColor: 'text-green-300',
      bgColor: 'bg-green-100'
    }
  }
  return statusIcons[status] || CircleIcon
}
