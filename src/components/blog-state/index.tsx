import { useTranslation } from 'react-i18next'

import { BlogEnum } from '@/types/enum'

interface BlogStateProps {
  state: string
  text?: string
  size?: 'small' | 'medium' | 'large'
}

export default function BlogState({ state, text, size = 'medium' }: BlogStateProps) {
  const { t } = useTranslation()

  let tagColorClass = ''
  const sizeClasses = {
    small: 'px-1 text-xs',
    medium: 'px-3 py-1 sm:text-sm text-xs',
    large: 'p-3 lg:text-base md:text-sm sm:text-xs'
  }

  // Define color based on tag
  switch (state) {
    case BlogEnum.PUBLISHED: // for default address
      tagColorClass = 'border-green-300 border bg-green-100 text-green-600'
      break
    case BlogEnum.INACTIVE:
      tagColorClass = 'border border-gray-300 bg-gray-100 text-gray-600'
      break
    case BlogEnum.UN_PUBLISHED:
      tagColorClass = 'text-purple-500 bg-purple-50 border border-purple-500'
      break
    default:
      tagColorClass = 'bg-gray-200 text-gray-800' // Default color
      break
  }

  return (
    <span className={`${sizeClasses[size]} cursor-default rounded-full font-medium ${tagColorClass}`}>
      {text ? text : t(`blogDetails.status.${state.toLowerCase()}`)}
    </span>
  )
}
