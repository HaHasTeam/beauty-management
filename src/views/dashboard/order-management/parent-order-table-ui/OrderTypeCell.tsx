import { Clock, ShoppingBag, ShoppingBasket, Sparkles, Users } from 'lucide-react'

import { Badge } from '@/components/ui/badge'
import { OrderEnum } from '@/types/enum'
import { IOrder } from '@/types/order'

interface OrderTypeCellProps {
  order: IOrder
}

export function OrderTypeCell({ order }: OrderTypeCellProps) {
  const { type } = order

  switch (type) {
    case OrderEnum.NORMAL:
      return (
        <Badge variant='outline' className='border-blue-200 bg-blue-50 text-blue-700 gap-1'>
          <ShoppingBag className='h-3.5 w-3.5' />
          <span className='text-nowrap'>Normal</span>
        </Badge>
      )

    case OrderEnum.PRE_ORDER:
      return (
        <Badge variant='outline' className='border-purple-200 bg-purple-50 text-purple-700 gap-1'>
          <Clock className='h-3.5 w-3.5' />
          <span className='text-nowrap'>Pre Order</span>
        </Badge>
      )

    case OrderEnum.GROUP_BUYING:
      return (
        <Badge variant='outline' className='border-teal-200 bg-teal-50 text-teal-700 gap-1'>
          <Users className='h-3.5 w-3.5' />
          <span className='text-nowrap'>Group Buying</span>
        </Badge>
      )

    case OrderEnum.FLASH_SALE:
      return (
        <Badge variant='outline' className='border-orange-200 bg-orange-50 text-orange-700 gap-1'>
          <Sparkles className='h-3.5 w-3.5' />
          <span className='text-nowrap'>Flash Sale</span>
        </Badge>
      )

    default:
      return (
        <Badge variant='outline' className='border-gray-200 bg-gray-50 text-gray-700 gap-1'>
          <ShoppingBasket className='h-3.5 w-3.5' />
          <span className='text-nowrap'>Unknown</span>
        </Badge>
      )
  }
}
