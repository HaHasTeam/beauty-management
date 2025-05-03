import { CheckCircle2, CircleDashed, CircleMinus, Crown } from 'lucide-react'

import { Badge } from '@/components/ui/badge'
import { FlashSaleStatusEnum, TFlashSale } from '@/types/flash-sale'

interface FlashSaleStatusCellProps {
  flashSale: TFlashSale
}

export function FlashSaleStatusCell({ flashSale }: FlashSaleStatusCellProps) {
  const { status } = flashSale

  switch (status) {
    case FlashSaleStatusEnum.ACTIVE:
      return (
        <Badge variant='outline' className='border-green-200 bg-green-50 text-green-700 gap-1'>
          <CheckCircle2 className='h-3.5 w-3.5' />
          <span className='whitespace-nowrap'>Active</span>
        </Badge>
      )

    case FlashSaleStatusEnum.WAITING:
      return (
        <Badge variant='outline' className='border-amber-200 bg-amber-50 text-amber-700 gap-1'>
          <CircleDashed className='h-3.5 w-3.5' />
          <span className='whitespace-nowrap'>Waiting</span>
        </Badge>
      )

    case FlashSaleStatusEnum.INACTIVE:
      return (
        <Badge variant='outline' className='border-gray-200 bg-gray-50 text-gray-700 gap-1'>
          <CircleMinus className='h-3.5 w-3.5' />
          <span className='whitespace-nowrap'>Inactive</span>
        </Badge>
      )

    case FlashSaleStatusEnum.SOLD_OUT:
      return (
        <Badge variant='outline' className='border-purple-200 bg-purple-50 text-purple-700 gap-1'>
          <Crown className='h-3.5 w-3.5' />
          <span className='whitespace-nowrap'>Sold Out</span>
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
