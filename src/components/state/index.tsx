import { useTranslation } from 'react-i18next'

import { StatusEnum } from '@/types/enum'

interface StateProps {
  state: string
  text?: string
  size?: 'small' | 'medium' | 'large'
}

export default function State({ state, text, size = 'medium' }: StateProps) {
  const { t } = useTranslation()

  let tagColorClass = ''
  const sizeClasses = {
    small: 'px-1 text-xs',
    medium: 'px-3 py-1 sm:text-sm text-xs',
    large: 'p-3 lg:text-base md:text-sm sm:text-xs'
  }

  // Define color based on tag
  switch (state) {
    case StatusEnum.ACTIVE: // for default address
      tagColorClass = 'border-green-300 border bg-green-100 text-green-600'
      break
    case StatusEnum.INACTIVE:
      tagColorClass = 'border border-gray-300 bg-gray-100 text-gray-600'
      break
    case StatusEnum.BANNED:
      tagColorClass = 'border border-red-300 bg-red-100 text-red-600'
      break
    case StatusEnum.DENIED:
      tagColorClass = 'border border-purple-300 bg-purple-100 text-purple-600'
      break
    case StatusEnum.PENDING:
      tagColorClass = 'text-yellow-500 bg-yellow-50 border border-yellow-500'
      break
    default:
      tagColorClass = 'bg-gray-200 text-gray-800' // Default color
      break
  }

  return (
    <span
      className={`${sizeClasses[size]} cursor-default rounded-full font-medium line-clamp-1 overflow-ellipsis ${tagColorClass}`}
    >
      {text ? text : t(`status.${state}`)}
    </span>
  )
}
