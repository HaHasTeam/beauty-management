import { CheckCircle2, CircleDashed, CircleMinus, CircleX } from 'lucide-react'

import { Badge } from '@/components/ui/badge'
import { PreOrderStatusEnum, TPreOrder } from '@/types/pre-order'

interface PreOrderStatusCellProps {
  preOrder: TPreOrder
}

export function PreOrderStatusCell({ preOrder }: PreOrderStatusCellProps) {
  const { status } = preOrder

  switch (status) {
    case PreOrderStatusEnum.ACTIVE:
      return (
        <Badge variant='outline' className='border-green-200 bg-green-50 text-green-700 gap-1'>
          <CheckCircle2 className='h-3.5 w-3.5' />
          <span className='whitespace-nowrap'>Active</span>
        </Badge>
      )

    case PreOrderStatusEnum.WAITING:
      return (
        <Badge variant='outline' className='border-amber-200 bg-amber-50 text-amber-700 gap-1'>
          <CircleDashed className='h-3.5 w-3.5' />
          <span className='whitespace-nowrap'>Waiting</span>
        </Badge>
      )

    case PreOrderStatusEnum.INACTIVE:
      return (
        <Badge variant='outline' className='border-gray-200 bg-gray-50 text-gray-700 gap-1'>
          <CircleMinus className='h-3.5 w-3.5' />
          <span className='whitespace-nowrap'>Inactive</span>
        </Badge>
      )

    case PreOrderStatusEnum.SOLD_OUT:
      return (
        <Badge variant='outline' className='border-purple-200 bg-purple-50 text-purple-700 gap-1'>
          <CircleX className='h-3.5 w-3.5' />
          <span className='whitespace-nowrap'>Sold Out</span>
        </Badge>
      )

    case PreOrderStatusEnum.CANCELLED:
      return (
        <Badge variant='outline' className='border-red-200 bg-red-50 text-red-700 gap-1'>
          <CircleX className='h-3.5 w-3.5' />
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
