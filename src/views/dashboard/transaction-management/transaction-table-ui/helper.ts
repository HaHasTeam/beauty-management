import {
  ArrowDown,
  ArrowRightLeft,
  ArrowUp,
  CheckCircle2,
  CircleDashed,
  CircleIcon,
  CircleMinus,
  Crown,
  LucideIcon,
  RotateCcw,
  ShoppingCart
} from 'lucide-react'
import { GiProcessor } from 'react-icons/gi'

import { TransactionStatusEnum, TransactionTypeEnum, TTransaction } from '@/types/transaction'

export function getStatusIcon(status: TransactionStatusEnum) {
  const statusIcons = {
    [TransactionStatusEnum.COMPLETED]: {
      icon: CheckCircle2,
      iconColor: 'text-green-500',
      textColor: 'text-green-500',
      bgColor: 'bg-green-100'
    },
    [TransactionStatusEnum.PENDING]: {
      icon: CircleDashed,
      iconColor: 'text-yellow-500',
      textColor: 'text-yellow-500',
      bgColor: 'bg-yellow-100'
    },
    [TransactionStatusEnum.PROCESSING]: {
      icon: GiProcessor,
      iconColor: 'text-blue-500',
      textColor: 'text-blue-500',
      bgColor: 'bg-blue-100'
    },
    [TransactionStatusEnum.REFUNDED]: {
      icon: Crown,
      iconColor: 'text-purple-500',
      textColor: 'text-purple-500',
      bgColor: 'bg-purple-100'
    },
    [TransactionStatusEnum.FAILED]: {
      icon: CircleMinus,
      iconColor: 'text-red-500',
      textColor: 'text-red-500',
      bgColor: 'bg-red-100'
    }
  }
  return statusIcons[status] || CircleIcon
}

export type CustomFilterFields = TTransaction & {
  startTime: string
  startDate: string
  endDate: string
  statuses: string[]
}

type IconConfig = {
  icon: LucideIcon
  iconColor: string
  textColor: string
  bgColor: string
}

export function getTransactionTypeIcon(type: TransactionTypeEnum) {
  const statusIcons: Record<TransactionTypeEnum, IconConfig> = {
    [TransactionTypeEnum.BOOKING_PURCHASE]: {
      icon: CheckCircle2,
      iconColor: 'text-indigo-500',
      textColor: 'text-indigo-500',
      bgColor: 'bg-indigo-100'
    },
    [TransactionTypeEnum.ORDER_PURCHASE]: {
      icon: ShoppingCart,
      iconColor: 'text-blue-500',
      textColor: 'text-blue-500',
      bgColor: 'bg-blue-100'
    },
    [TransactionTypeEnum.DEPOSIT]: {
      icon: ArrowUp,
      iconColor: 'text-green-500',
      textColor: 'text-green-500',
      bgColor: 'bg-green-100'
    },
    [TransactionTypeEnum.WITHDRAW]: {
      icon: ArrowDown,
      iconColor: 'text-amber-500',
      textColor: 'text-amber-500',
      bgColor: 'bg-amber-100'
    },
    [TransactionTypeEnum.ORDER_REFUND]: {
      icon: RotateCcw,
      iconColor: 'text-purple-500',
      textColor: 'text-purple-500',
      bgColor: 'bg-purple-100'
    },
    [TransactionTypeEnum.BOOKING_REFUND]: {
      icon: RotateCcw,
      iconColor: 'text-purple-500',
      textColor: 'text-purple-500',
      bgColor: 'bg-purple-100'
    },
    [TransactionTypeEnum.ORDER_CANCEL]: {
      icon: CircleMinus,
      iconColor: 'text-red-500',
      textColor: 'text-red-500',
      bgColor: 'bg-red-100'
    },
    [TransactionTypeEnum.BOOKING_CANCEL]: {
      icon: CircleMinus,
      iconColor: 'text-red-500',
      textColor: 'text-red-500',
      bgColor: 'bg-red-100'
    },
    [TransactionTypeEnum.TRANSFER_TO_WALLET]: {
      icon: ArrowRightLeft,
      iconColor: 'text-cyan-500',
      textColor: 'text-cyan-500',
      bgColor: 'bg-cyan-100'
    }
  }
  return statusIcons[type] || CircleIcon
}
