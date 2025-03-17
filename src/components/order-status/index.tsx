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
  let bgColorClass = ''
  let tagText = ''
  const sizeClasses = {
    small: 'px-1 text-xs',
    medium: 'px-2 py-1 text-sm sm:text-xs',
    large: 'p-3 lg:text-base md:text-sm sm:text-xs'
  }

  // Define color based on tag
  switch (tag) {
    case ShippingStatusEnum.JOIN_GROUP_BUYING:
      tagColorClass = 'text-teal-400'
      bgColorClass = 'bg-teal-100'
      tagText = t('order.joinGroupBuying')
      break
    case ShippingStatusEnum.TO_PAY:
      tagColorClass = 'text-yellow-500'
      bgColorClass = 'bg-yellow-100'
      tagText = t('order.pending')
      break
    case ShippingStatusEnum.WAIT_FOR_CONFIRMATION:
      tagColorClass = 'text-lime-600'
      bgColorClass = 'bg-lime-100'
      tagText = t('order.waitConfirm')
      break
    case ShippingStatusEnum.TO_SHIP:
      tagColorClass = 'text-orange-600'
      bgColorClass = 'bg-orange-100'
      tagText = t('order.shipping')
      break
    case ShippingStatusEnum.PREPARING_ORDER:
      tagColorClass = 'text-purple-600'
      bgColorClass = 'bg-purple-100'
      tagText = t('order.preparingOrder')
      break
    case ShippingStatusEnum.SHIPPING:
      tagColorClass = 'text-cyan-600'
      bgColorClass = 'bg-cyan-100'
      tagText = t('order.delivering')
      break
    case ShippingStatusEnum.DELIVERED:
      tagColorClass = 'text-blue-600'
      bgColorClass = 'bg-blue-100'
      tagText = t('order.delivered')
      break
    case ShippingStatusEnum.COMPLETED:
      tagColorClass = 'text-green-600'
      bgColorClass = 'bg-green-100'
      tagText = t('order.completed')
      break
    case ShippingStatusEnum.CANCELLED:
      tagColorClass = 'text-red-600'
      bgColorClass = 'bg-red-100'
      tagText = t('order.cancelled')
      break
    case 'PENDING_CANCELLATION':
      tagColorClass = 'text-amber-600'
      bgColorClass = 'bg-amber-100'
      tagText = t('order.pendingCancellation')
      break
    case 'PENDING_RETURN_APPROVAL':
      tagColorClass = 'text-slate-600'
      bgColorClass = 'bg-slate-100'
      tagText = t('order.pendingReturnApproval')
      break
    case ShippingStatusEnum.RETURNING:
      tagColorClass = 'text-indigo-600'
      bgColorClass = 'bg-indigo-100'
      tagText = t('order.returning')
      break
    case ShippingStatusEnum.BRAND_RECEIVED:
      tagColorClass = 'text-emerald-600'
      bgColorClass = 'bg-emerald-100'
      tagText = t('order.brandReceived')
      break
    case ShippingStatusEnum.REFUNDED:
      tagColorClass = 'text-gray-600'
      bgColorClass = 'bg-gray-100'
      tagText = t('order.refunded')
      break

    default:
      tagColorClass = 'bg-gray-100 text-gray-800' // Default color
      tagText = tag // Default to the tag string if no match is found
      break
  }

  return (
    <span
      className={`${sizeClasses[size]} p-2 ${bgColorClass} rounded-full uppercase cursor-default font-bold ${tagColorClass}`}
    >
      {text ? text : tagText}
    </span>
  )
}
