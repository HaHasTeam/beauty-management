import {
  CheckCircle,
  CircleIcon,
  Clock,
  CreditCard,
  Package,
  RefreshCcw,
  RotateCcw,
  ShoppingBag,
  Truck,
  Users,
  XCircle
} from 'lucide-react'

import { ShippingStatusEnum } from '@/types/enum'

export function getStatusIcon(status: ShippingStatusEnum) {
  const statusIcons = {
    [ShippingStatusEnum.JOIN_GROUP_BUYING]: {
      icon: Users,
      iconColor: 'text-blue-500',
      textColor: 'text-blue-500',
      bgColor: 'bg-blue-100'
    },
    [ShippingStatusEnum.TO_PAY]: {
      icon: CreditCard,
      iconColor: 'text-yellow-500',
      textColor: 'text-yellow-500',
      bgColor: 'bg-yellow-100'
    },
    [ShippingStatusEnum.WAIT_FOR_CONFIRMATION]: {
      icon: Clock,
      iconColor: 'text-orange-500',
      textColor: 'text-orange-500',
      bgColor: 'bg-orange-100'
    },
    [ShippingStatusEnum.PREPARING_ORDER]: {
      icon: Package,
      iconColor: 'text-indigo-500',
      textColor: 'text-indigo-500',
      bgColor: 'bg-indigo-100'
    },
    [ShippingStatusEnum.TO_SHIP]: {
      icon: Truck,
      iconColor: 'text-purple-500',
      textColor: 'text-purple-500',
      bgColor: 'bg-purple-100'
    },
    [ShippingStatusEnum.SHIPPING]: {
      icon: ShoppingBag,
      iconColor: 'text-cyan-500',
      textColor: 'text-cyan-500',
      bgColor: 'bg-cyan-100'
    },
    [ShippingStatusEnum.DELIVERED]: {
      icon: CheckCircle,
      iconColor: 'text-green-500',
      textColor: 'text-green-500',
      bgColor: 'bg-green-100'
    },
    [ShippingStatusEnum.COMPLETED]: {
      icon: CheckCircle,
      iconColor: 'text-emerald-500',
      textColor: 'text-emerald-500',
      bgColor: 'bg-emerald-100'
    },
    [ShippingStatusEnum.RETURNING]: {
      icon: RotateCcw,
      iconColor: 'text-amber-500',
      textColor: 'text-amber-500',
      bgColor: 'bg-amber-100'
    },
    [ShippingStatusEnum.REFUNDED]: {
      icon: RefreshCcw,
      iconColor: 'text-teal-500',
      textColor: 'text-teal-500',
      bgColor: 'bg-teal-100'
    },
    [ShippingStatusEnum.CANCELLED]: {
      icon: XCircle,
      iconColor: 'text-red-500',
      textColor: 'text-red-500',
      bgColor: 'bg-red-100'
    }
  }

  return (
    statusIcons[status] || {
      icon: CircleIcon,
      iconColor: 'text-gray-500',
      textColor: 'text-gray-500',
      bgColor: 'bg-gray-100'
    }
  )
}
