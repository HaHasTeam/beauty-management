import { useTranslation } from 'react-i18next'

import { OrderEnum, PaymentMethod, ProductCartStatusEnum } from '@/types/enum'
import { PreOrderProductEnum } from '@/types/pre-order'

interface ProductTagProps {
  tag: string
  text?: string
  size?: 'small' | 'medium' | 'large'
}

export default function ProductTag({ tag, text, size = 'medium' }: ProductTagProps) {
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
    case 'Best Seller':
      tagColorClass = 'bg-yellow-200 text-yellow-800'
      tagText = t('productTag.bestSeller')
      break
    case 'Limited Edition':
      tagColorClass = 'bg-purple-200 text-purple-800'
      tagText = t('productTag.limitedEdition')
      break
    case 'New Arrival':
      tagColorClass = 'bg-blue-200 text-blue-800'
      tagText = t('productTag.newArrival')
      break
    case 'Hot Deal':
      tagColorClass = 'bg-red-200 text-red-800'
      tagText = t('productTag.hotDeal')
      break
    case 'DealPercent':
      tagColorClass = 'bg-red-100 text-red-500'
      break
    case ProductCartStatusEnum.HIDDEN: // use for product in cart
      tagColorClass = 'bg-gray-200 text-gray-800'
      tagText = t('productTag.hidden')
      break
    case ProductCartStatusEnum.SOLD_OUT: // use for product in cart
      tagColorClass = 'bg-red-100 text-red-500'
      tagText = t('productTag.outOfStock')
      break
    case OrderEnum.FLASH_SALE:
      tagColorClass = 'bg-orange-200 text-orange-800'
      tagText = t('productTag.flashSale')
      break
    case 'LiveStream':
      tagColorClass = 'bg-white text-red-500 border border-red-500'
      tagText = t('productTag.liveStream')
      break
    case OrderEnum.GROUP_BUYING:
      tagColorClass = 'bg-white text-orange-500 border border-orange-500'
      tagText = t('productTag.groupBuying')
      break
    case OrderEnum.PRE_ORDER:
      tagColorClass = 'bg-white text-yellow-500 border border-yellow-500'
      tagText = t('productTag.preOrder')
      break
    case PreOrderProductEnum.WAITING:
      tagColorClass = 'bg-yellow-100 text-yellow-800 border border-yellow-300'
      tagText = t('productTag.waiting')
      break
    case PreOrderProductEnum.ACTIVE:
      tagColorClass = 'bg-green-100 text-green-800 border border-green-300'
      tagText = t('productTag.preOrder')
      break
    case PreOrderProductEnum.CANCELLED:
      tagColorClass = 'bg-red-100 text-red-800 border border-red-300'
      tagText = t('productTag.cancelled')
      break
    case PreOrderProductEnum.INACTIVE:
      tagColorClass = 'bg-gray-100 text-gray-800 border border-gray-300'
      tagText = t('productTag.inactive')
      break
    case PreOrderProductEnum.SOLD_OUT:
      tagColorClass = 'bg-blue-100 text-blue-800 border border-blue-300'
      tagText = t('productTag.soldOut')
      break
    // for payment methods
    case PaymentMethod.CARD:
      tagColorClass = 'bg-white text-yellow-500 border border-yellow-500'
      tagText = t('paymentMethod.tag.cash')
      break
    case PaymentMethod.CASH:
      tagColorClass = 'bg-white text-orange-500 border border-orange-500'
      tagText = t('paymentMethod.tag.card')
      break
    case PaymentMethod.WALLET:
      tagColorClass = 'bg-white text-purple-500 border border-purple-500'
      tagText = t('paymentMethod.tag.wallet')
      break
    default:
      tagColorClass = 'bg-gray-200 text-gray-800' // Default color
      tagText = tag // Default to the tag string if no match is found
      break
  }

  return (
    <span className={`${sizeClasses[size]} min-w-fit cursor-default rounded-md font-medium ${tagColorClass}`}>
      {text ? text : tagText}
    </span>
  )
}
