import {
  ArrowLeftRightIcon,
  CheckIcon,
  ClockIcon,
  PackageIcon,
  RefreshCcwIcon,
  ShoppingBagIcon,
  ShoppingCartIcon,
  TruckIcon,
  UsersIcon,
  WalletIcon,
  XIcon
} from 'lucide-react'

import { Badge } from '@/components/ui/badge'
import { ShippingStatusEnum } from '@/types/enum'
import { IOrder } from '@/types/order'

interface OrderStatusCellProps {
  order: IOrder
}

export function OrderStatusCell({ order }: OrderStatusCellProps) {
  const { status } = order

  switch (status) {
    case ShippingStatusEnum.JOIN_GROUP_BUYING:
      return (
        <Badge variant='outline' className='border-teal-200 bg-teal-50 text-teal-700 gap-1'>
          <UsersIcon className='h-3.5 w-3.5' />
          <span className='whitespace-nowrap'>Join Group Buying</span>
        </Badge>
      )

    case ShippingStatusEnum.TO_PAY:
      return (
        <Badge variant='outline' className='border-yellow-200 bg-yellow-50 text-yellow-700 gap-1'>
          <WalletIcon className='h-3.5 w-3.5' />
          <span className='whitespace-nowrap'>To Pay</span>
        </Badge>
      )

    case ShippingStatusEnum.WAIT_FOR_CONFIRMATION:
      return (
        <Badge variant='outline' className='border-amber-200 bg-amber-50 text-amber-700 gap-1'>
          <ClockIcon className='h-3.5 w-3.5' />
          <span className='whitespace-nowrap'>Waiting Confirmation</span>
        </Badge>
      )

    case ShippingStatusEnum.PREPARING_ORDER:
      return (
        <Badge variant='outline' className='border-purple-200 bg-purple-50 text-purple-700 gap-1'>
          <ShoppingBagIcon className='h-3.5 w-3.5' />
          <span className='whitespace-nowrap'>Preparing Order</span>
        </Badge>
      )

    case ShippingStatusEnum.TO_SHIP:
      return (
        <Badge variant='outline' className='border-orange-200 bg-orange-50 text-orange-700 gap-1'>
          <PackageIcon className='h-3.5 w-3.5' />
          <span className='whitespace-nowrap'>To Ship</span>
        </Badge>
      )

    case ShippingStatusEnum.SHIPPING:
      return (
        <Badge variant='outline' className='border-cyan-200 bg-cyan-50 text-cyan-700 gap-1'>
          <TruckIcon className='h-3.5 w-3.5' />
          <span className='whitespace-nowrap'>Shipping</span>
        </Badge>
      )

    case ShippingStatusEnum.DELIVERED:
      return (
        <Badge variant='outline' className='border-blue-200 bg-blue-50 text-blue-700 gap-1'>
          <ShoppingCartIcon className='h-3.5 w-3.5' />
          <span className='whitespace-nowrap'>Delivered</span>
        </Badge>
      )

    case ShippingStatusEnum.COMPLETED:
      return (
        <Badge variant='outline' className='border-green-200 bg-green-50 text-green-700 gap-1'>
          <CheckIcon className='h-3.5 w-3.5' />
          <span className='whitespace-nowrap'>Completed</span>
        </Badge>
      )

    case ShippingStatusEnum.RETURNING:
      return (
        <Badge variant='outline' className='border-yellow-200 bg-yellow-50 text-yellow-700 gap-1'>
          <ArrowLeftRightIcon className='h-3.5 w-3.5' />
          <span className='whitespace-nowrap'>Returning</span>
        </Badge>
      )

    case ShippingStatusEnum.BRAND_RECEIVED:
      return (
        <Badge variant='outline' className='border-indigo-200 bg-indigo-50 text-indigo-700 gap-1'>
          <PackageIcon className='h-3.5 w-3.5' />
          <span className='whitespace-nowrap'>Brand Received</span>
        </Badge>
      )

    case ShippingStatusEnum.REFUNDED:
      return (
        <Badge variant='outline' className='border-emerald-200 bg-emerald-50 text-emerald-700 gap-1'>
          <RefreshCcwIcon className='h-3.5 w-3.5' />
          <span className='whitespace-nowrap'>Refunded</span>
        </Badge>
      )

    case ShippingStatusEnum.RETURNED_FAIL:
      return (
        <Badge variant='outline' className='border-rose-200 bg-rose-50 text-rose-700 gap-1'>
          <XIcon className='h-3.5 w-3.5' />
          <span className='whitespace-nowrap'>Return Failed</span>
        </Badge>
      )

    case ShippingStatusEnum.CANCELLED:
      return (
        <Badge variant='outline' className='border-red-200 bg-red-50 text-red-700 gap-1'>
          <XIcon className='h-3.5 w-3.5' />
          <span className='whitespace-nowrap'>Cancelled</span>
        </Badge>
      )

    default:
      return (
        <Badge variant='outline' className='border-gray-200 bg-gray-50 text-gray-700 gap-1'>
          <span className='whitespace-nowrap'>Unknown</span>
        </Badge>
      )
  }
}
