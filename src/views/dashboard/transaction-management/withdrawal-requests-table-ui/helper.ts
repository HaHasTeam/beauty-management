import { CheckCircle2, CircleDashed, CircleIcon, CircleMinus, Crown } from 'lucide-react'

import { WithdrawalStatusEnum } from '@/types/withdrawal-request'

export function getStatusIcon(status: WithdrawalStatusEnum) {
  const statusIcons = {
    [WithdrawalStatusEnum.PENDING]: {
      icon: CircleDashed,
      iconColor: 'text-yellow-500',
      textColor: 'text-yellow-500',
      bgColor: 'bg-yellow-100'
    },
    [WithdrawalStatusEnum.APPROVED]: {
      icon: CheckCircle2,
      iconColor: 'text-blue-500',
      textColor: 'text-blue-500',
      bgColor: 'bg-blue-100'
    },
    [WithdrawalStatusEnum.COMPLETED]: {
      icon: CheckCircle2,
      iconColor: 'text-green-500',
      textColor: 'text-green-500',
      bgColor: 'bg-green-100'
    },
    [WithdrawalStatusEnum.REJECTED]: {
      icon: CircleMinus,
      iconColor: 'text-red-500',
      textColor: 'text-red-500',
      bgColor: 'bg-red-100'
    },
    [WithdrawalStatusEnum.CANCELLED]: {
      icon: Crown,
      iconColor: 'text-gray-500',
      textColor: 'text-gray-500',
      bgColor: 'bg-gray-100'
    }
  }
  return statusIcons[status] || CircleIcon
}
