import {
  BadgeCheck,
  Ban,
  Banknote,
  CarFront,
  Check,
  CircleOff,
  Grab,
  Package,
  PackageCheck,
  PackageOpen,
  RotateCcw,
  Truck,
  UsersRound
} from 'lucide-react'
import { useTranslation } from 'react-i18next'

import { RequestStatusEnum, ShippingStatusEnum } from '@/types/enum'

export const StatusTrackingIcon = (status: string) => {
  switch (status) {
    case ShippingStatusEnum.JOIN_GROUP_BUYING:
      return <UsersRound className='w-5 h-5' />
    case ShippingStatusEnum.TO_PAY:
      return <Banknote className='w-5 h-5' />
    case ShippingStatusEnum.WAIT_FOR_CONFIRMATION:
      return <PackageCheck className='w-5 h-5' />
    case ShippingStatusEnum.PREPARING_ORDER:
      return <PackageOpen className='w-5 h-5' />
    case ShippingStatusEnum.TO_SHIP:
      return <Grab className='w-5 h-5' />
    case ShippingStatusEnum.SHIPPING:
      return <Truck className='w-5 h-5' />
    case ShippingStatusEnum.DELIVERED:
      return <BadgeCheck className='w-5 h-5' />
    case ShippingStatusEnum.COMPLETED:
      return <Check className='w-5 h-5' />
    case ShippingStatusEnum.RETURNING:
      return <CarFront className='w-5 h-5' />
    case ShippingStatusEnum.REFUNDED:
      return <RotateCcw className='w-5 h-5' />
    case ShippingStatusEnum.CANCELLED:
      return <Ban className='w-5 h-5' />
    case RequestStatusEnum.APPROVED:
      return <Ban className='w-5 h-5' />
    case RequestStatusEnum.REJECTED:
      return <CircleOff className='w-5 h-5' />
    default:
      return <Package className='w-5 h-5' />
  }
}

export const StatusTrackingText = (status: string) => {
  const { t } = useTranslation()

  switch (status) {
    case ShippingStatusEnum.JOIN_GROUP_BUYING:
      return t('order.joinGroupBuying')
    case ShippingStatusEnum.TO_PAY:
      return t('order.pending')
    case ShippingStatusEnum.WAIT_FOR_CONFIRMATION:
      return t('order.waitConfirm')
    case ShippingStatusEnum.PREPARING_ORDER:
      return t('order.preparingOrder')
    case ShippingStatusEnum.TO_SHIP:
      return t('order.shipping')
    case ShippingStatusEnum.SHIPPING:
      return t('order.delivering')
    case ShippingStatusEnum.DELIVERED:
      return t('order.delivered')
    case ShippingStatusEnum.COMPLETED:
      return t('order.completed')
    case ShippingStatusEnum.RETURNING:
      return t('order.returning')
    case ShippingStatusEnum.REFUNDED:
      return t('order.refunded')
    case ShippingStatusEnum.CANCELLED:
      return t('order.cancelled')
    case RequestStatusEnum.APPROVED:
      return t('order.cancelled')
    case RequestStatusEnum.REJECTED:
      return t('order.rejectedCancelRequestTitle')
    default:
      return t('order.created')
  }
}
