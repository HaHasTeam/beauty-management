import { Crown, Star } from 'lucide-react'
import { useTranslation } from 'react-i18next'

import { ServiceTypeEnum } from '@/types/enum'

interface SystemServiceTypeTagProps {
  type: string
  text?: string
  size?: 'small' | 'medium' | 'large'
}

export default function SystemServiceTypeTag({ type, text, size = 'medium' }: SystemServiceTypeTagProps) {
  const { t } = useTranslation()

  let tagColorClass = ''
  let icon
  const sizeClasses = {
    small: 'px-1 text-xs',
    medium: 'px-3 py-1 sm:text-sm text-xs',
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
