import { Ban, CheckCircle2, CircleDashed, CircleMinus, CircleX } from 'lucide-react'

import { Badge } from '@/components/ui/badge'
import { GroupProductStatusEnum, TGroupProduct } from '@/types/group-product'

interface GroupProductStatusCellProps {
  groupProduct: TGroupProduct
}

export function GroupProductStatusCell({ groupProduct }: GroupProductStatusCellProps) {
  const { status } = groupProduct

  switch (status) {
    case GroupProductStatusEnum.ACTIVE:
      return (
        <Badge variant='outline' className='border-green-200 bg-green-50 text-green-700 gap-1'>
          <CheckCircle2 className='h-3.5 w-3.5' />
          <span className='whitespace-nowrap'>Active</span>
        </Badge>
      )

    case GroupProductStatusEnum.PENDING:
      return (
        <Badge variant='outline' className='border-amber-200 bg-amber-50 text-amber-700 gap-1'>
          <CircleDashed className='h-3.5 w-3.5' />
          <span className='whitespace-nowrap'>Pending</span>
        </Badge>
      )

    case GroupProductStatusEnum.INACTIVE:
      return (
        <Badge variant='outline' className='border-gray-200 bg-gray-50 text-gray-700 gap-1'>
          <CircleMinus className='h-3.5 w-3.5' />
          <span className='whitespace-nowrap'>Inactive</span>
        </Badge>
      )

    case GroupProductStatusEnum.BANNED:
      return (
        <Badge variant='outline' className='border-red-200 bg-red-50 text-red-700 gap-1'>
          <Ban className='h-3.5 w-3.5' />
          <span className='whitespace-nowrap'>Banned</span>
        </Badge>
      )

    case GroupProductStatusEnum.DENIED:
      return (
        <Badge variant='outline' className='border-red-200 bg-red-50 text-red-700 gap-1'>
          <CircleX className='h-3.5 w-3.5' />
          <span className='whitespace-nowrap'>Denied</span>
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
