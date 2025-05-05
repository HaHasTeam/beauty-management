import { CheckCircle2, CircleIcon, CircleMinus } from 'lucide-react'

import { GroupBuyingStatusEnum } from '@/types/group-buying'

export function getStatusIcon(status: GroupBuyingStatusEnum) {
  const statusIcons = {
    [GroupBuyingStatusEnum.ACTIVE]: {
      icon: CheckCircle2,
      iconColor: 'text-green-500',
      textColor: 'text-green-500',
      bgColor: 'bg-green-100'
    },
    [GroupBuyingStatusEnum.INACTIVE]: {
      icon: CircleMinus,
      iconColor: 'text-gray-500',
      textColor: 'text-gray-500',
      bgColor: 'bg-gray-100'
    }
  }
  return statusIcons[status] || CircleIcon
}
