import { useTranslation } from 'react-i18next'

import { ProductEnum } from '@/types/enum'

interface ProductStateProps {
  state: string
  text?: string
  size?: 'small' | 'medium' | 'large'
}

export default function ProductState({ state, text, size = 'medium' }: ProductStateProps) {
  const { t } = useTranslation()

  let tagColorClass = ''
  const sizeClasses = {
    small: 'px-1 text-xs',
    medium: 'px-3 py-1 sm:text-sm text-xs',
    large: 'p-3 lg:text-base md:text-sm sm:text-xs'
  }

  // Define color based on tag
  switch (state) {
    case ProductEnum.OFFICIAL: // for default address
      tagColorClass = 'border-green-300 border bg-green-100 text-green-600'
      break
    case ProductEnum.INACTIVE:
      tagColorClass = 'border border-gray-300 bg-gray-100 text-gray-600'
      break
    case ProductEnum.OUT_OF_STOCK:
      tagColorClass = 'border border-red-300 bg-red-100 text-red-600'
      break
    case ProductEnum.PRE_ORDER:
      tagColorClass = 'text-yellow-500 bg-yellow-50 border border-yellow-500'
      break
    case ProductEnum.FLASH_SALE:
      tagColorClass = 'text-orange-500 bg-orange-50 border border-orange-500'
      break
    case ProductEnum.BANNED:
      tagColorClass = 'text-red-700 bg-red-200 border border-red-700'
      break
    case ProductEnum.UN_PUBLISHED:
      tagColorClass = 'text-purple-500 bg-purple-50 border border-purple-500'
      break
    default:
      tagColorClass = 'bg-gray-200 text-gray-800' // Default color
      break
  }

  return (
    <span className={`${sizeClasses[size]} cursor-default rounded-full font-medium ${tagColorClass}`}>
      {text ? text : t(`status.${state}`)}
    </span>
  )
}
