import { CalendarCheck, CheckCircle2, Circle, CircleDashed, CircleX, FileText, WifiOff, X } from 'lucide-react'

import { BrandStatusEnum } from '@/types/brand'

type StatusInfo = {
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>
  label: string
  iconColor: string
  textColor: string
  bgColor: string
}

/**
 * Get status display information including icon, label, and styling
 * @param status - The brand status enum value
 * @returns Object containing icon and styling information
 */
export function getStatusInfo(status: BrandStatusEnum): StatusInfo {
  const statusInfo: Record<BrandStatusEnum, StatusInfo> = {
    [BrandStatusEnum.ACTIVE]: {
      icon: CheckCircle2,
      label: 'Active',
      iconColor: 'text-green-500',
      textColor: 'text-green-500',
      bgColor: 'bg-green-100'
    },
    [BrandStatusEnum.DONE_MEETING]: {
      icon: CheckCircle2,
      label: 'Active',
      iconColor: 'text-green-700',
      textColor: 'text-green-700',
      bgColor: 'bg-green-300'
    },
    [BrandStatusEnum.PENDING_REVIEW]: {
      icon: CircleDashed,
      label: 'Pending Review',
      iconColor: 'text-yellow-500',
      textColor: 'text-yellow-500',
      bgColor: 'bg-yellow-100'
    },
    [BrandStatusEnum.INACTIVE]: {
      icon: WifiOff,
      label: 'Inactive',
      iconColor: 'text-gray-500',
      textColor: 'text-gray-500',
      bgColor: 'bg-gray-100'
    },
    [BrandStatusEnum.BANNED]: {
      icon: CircleX,
      label: 'Banned',
      iconColor: 'text-red-500',
      textColor: 'text-red-500',
      bgColor: 'bg-red-100'
    },
    [BrandStatusEnum.DENIED]: {
      icon: X,
      label: 'Denied',
      iconColor: 'text-red-400',
      textColor: 'text-red-400',
      bgColor: 'bg-red-100'
    },
    [BrandStatusEnum.NEED_ADDITIONAL_DOCUMENTS]: {
      icon: FileText,
      label: 'Additional Documents Needed',
      iconColor: 'text-amber-500',
      textColor: 'text-amber-500',
      bgColor: 'bg-amber-100'
    },
    [BrandStatusEnum.PRE_APPROVED_FOR_MEETING]: {
      icon: CalendarCheck,
      label: 'Pre-approved for Meeting',
      iconColor: 'text-blue-500',
      textColor: 'text-blue-500',
      bgColor: 'bg-blue-100'
    }
  }

  return (
    statusInfo[status] || {
      icon: Circle,
      label: 'Unknown Status',
      iconColor: 'text-gray-400',
      textColor: 'text-gray-400',
      bgColor: 'bg-gray-100'
    }
  )
}
