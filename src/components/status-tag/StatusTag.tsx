import { useTranslation } from 'react-i18next'

interface StatusTagProps {
  tag: string
  text?: string
  size?: 'small' | 'medium' | 'large'
}

export default function StatusTag({ tag, text, size = 'medium' }: StatusTagProps) {
  const { t } = useTranslation()

  let tagColorClass = ''
  let tagText = ''
  const sizeClasses = {
    small: 'px-1 text-xs',
    medium: 'px-2 py-1 text-sm sm:text-xs',
    large: 'p-3 lg:text-base md:text-sm sm:text-xs',
  }

  // Define color based on tag
  switch (tag) {
    case 'Default': // for default address
      tagColorClass = 'text-primary bg-white border border-primary rounded-xs'
      tagText = t('statusTag.default')
      break
    case 'BestVoucher':
      tagColorClass = 'text-white bg-green-500 rounded-full'
      tagText = t('voucher.bestChoice')
      break
    case 'numberCount':
      tagColorClass = 'text-white bg-orange-400 rounded-full'
      break
    default:
      tagColorClass = 'bg-gray-200 text-gray-800' // Default color
      tagText = tag // Default to the tag string if no match is found
      break
  }

  return (
    <span className={`${sizeClasses[size]} cursor-default rounded-md font-medium ${tagColorClass}`}>
      {text ? text : tagText}
    </span>
  )
}
