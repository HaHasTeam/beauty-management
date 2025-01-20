import { useTranslation } from 'react-i18next'

import { ShippingStatusEnum } from '@/types/enum'

interface OrderStatusProps {
  tag: string
  text?: string
  size?: 'small' | 'medium' | 'large'
}

export default function OrderStatus({ tag, text, size = 'medium' }: OrderStatusProps) {
  const { t } = useTranslation()

  let tagColorClass = ''
  let tagText = ''
  const sizeClasses = {
    small: 'px-1 text-xs',
    medium: 'px-2 py-1 text-sm sm:text-xs',
    large: 'p-3 lg:text-base md:text-sm sm:text-xs'
  }

  // Define color based on tag
  switch (tag) {
    case ShippingStatusEnum.TO_PAY:
      tagColorClass = 'text-yellow-400'
      tagText = t('order.pending')
      break
    case ShippingStatusEnum.WAIT_FOR_CONFIRMATION:
      tagColorClass = 'text-amber-500'
      tagText = t('order.waitConfirm')
      break
    case ShippingStatusEnum.TO_SHIP:
      tagColorClass = 'text-orange-600'
      tagText = t('order.shipping')
      break
    case ShippingStatusEnum.TO_RECEIVED:
      tagColorClass = 'text-blue-600'
      tagText = t('order.delivering')
      break
    case ShippingStatusEnum.COMPLETED:
      tagColorClass = 'text-green-600'
      tagText = t('order.completed')
      break
    case ShippingStatusEnum.CANCELLED:
      tagColorClass = 'text-red-600'
      tagText = t('order.cancelled')
      break
    case ShippingStatusEnum.RETURN_REFUND:
      tagColorClass = 'text-gray-600'
      tagText = t('order.return')
      break

    default:
      tagColorClass = 'bg-gray-200 text-gray-800' // Default color
      tagText = tag // Default to the tag string if no match is found
      break
  }

  return (
    <span className={`${sizeClasses[size]} uppercase cursor-default font-bold ${tagColorClass}`}>
      {text ? text : tagText}
    </span>
  )
}
