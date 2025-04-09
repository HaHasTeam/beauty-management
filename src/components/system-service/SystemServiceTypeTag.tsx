import { Crown, Star } from 'lucide-react'
import { useTranslation } from 'react-i18next'

import { Badge } from '@/components/ui/badge'
import { ServiceTypeEnum } from '@/types/enum'

interface SystemServiceTypeTagProps {
  type: string
  text?: string
  size?: 'small' | 'medium' | 'large'
  useBadgeStyle?: boolean
}

export default function SystemServiceTypeTag({
  type,
  text,
  size = 'medium',
  useBadgeStyle = false
}: SystemServiceTypeTagProps) {
  const { t } = useTranslation()

  // If using Badge style
  if (useBadgeStyle) {
    switch (type) {
      case ServiceTypeEnum.PREMIUM:
        return (
          <Badge variant='outline' className='border-purple-200 bg-purple-50 text-purple-700 gap-1'>
            <Crown className='h-3.5 w-3.5' />
            <span className='whitespace-nowrap'>{text || t(`systemServiceType.${type}`)}</span>
          </Badge>
        )
      case ServiceTypeEnum.STANDARD:
        return (
          <Badge variant='outline' className='border-yellow-200 bg-yellow-50 text-yellow-700 gap-1'>
            <Star className='h-3.5 w-3.5' />
            <span className='whitespace-nowrap'>{text || t(`systemServiceType.${type}`)}</span>
          </Badge>
        )
      default:
        return (
          <Badge variant='outline' className='border-gray-200 bg-gray-50 text-gray-700 gap-1'>
            <span className='whitespace-nowrap'>{text || t(`systemServiceType.${type}`) || 'Unknown'}</span>
          </Badge>
        )
    }
  }

  // Original styling
  let tagColorClass = ''
  let icon
  const sizeClasses = {
    small: 'px-1 py-1 text-xs',
    medium: 'px-3 py-1 sm:text-xs text-xs',
    large: 'p-3 lg:text-base md:text-sm sm:text-xs'
  }

  // Define color based on tag
  switch (type) {
    case ServiceTypeEnum.PREMIUM: // for default address
      tagColorClass = 'border-purple-300 border bg-purple-100 text-purple-600'
      icon = <Crown size={16} />
      break
    case ServiceTypeEnum.STANDARD:
      tagColorClass = 'border border-yellow-300 bg-yellow-100 text-yellow-600'
      icon = <Star size={16} />
      break
    default:
      tagColorClass = 'bg-gray-200 text-gray-800' // Default color
      break
  }

  return (
    <span
      className={`${sizeClasses[size]} flex gap-1 items-center cursor-default rounded-full font-medium ${tagColorClass}`}
    >
      {icon}
      {text ? text : t(`systemServiceType.${type}`)}
    </span>
  )
}
