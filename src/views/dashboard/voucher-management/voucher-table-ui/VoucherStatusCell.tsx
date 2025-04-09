import { Ban, CheckCircle2, CircleDashed, CircleMinus, CircleX } from 'lucide-react'

import { Badge } from '@/components/ui/badge'
import { StatusEnum } from '@/types/enum'
import { TVoucher } from '@/types/voucher'

interface VoucherStatusCellProps {
  voucher: TVoucher
}

export function VoucherStatusCell({ voucher }: VoucherStatusCellProps) {
  const { status } = voucher

  switch (status) {
    case StatusEnum.ACTIVE:
      return (
        <Badge variant='outline' className='border-green-200 bg-green-50 text-green-700 gap-1'>
          <CheckCircle2 className='h-3.5 w-3.5' />
          <span className='whitespace-nowrap'>Active</span>
        </Badge>
      )

    case StatusEnum.PENDING:
      return (
        <Badge variant='outline' className='border-amber-200 bg-amber-50 text-amber-700 gap-1'>
          <CircleDashed className='h-3.5 w-3.5' />
          <span className='whitespace-nowrap'>Pending</span>
        </Badge>
      )

    case StatusEnum.INACTIVE:
      return (
        <Badge variant='outline' className='border-gray-200 bg-gray-50 text-gray-700 gap-1'>
          <CircleMinus className='h-3.5 w-3.5' />
          <span className='whitespace-nowrap'>Inactive</span>
        </Badge>
      )

    case StatusEnum.BANNED:
      return (
        <Badge variant='outline' className='border-red-200 bg-red-50 text-red-700 gap-1'>
          <Ban className='h-3.5 w-3.5' />
          <span className='whitespace-nowrap'>Banned</span>
        </Badge>
      )

    case StatusEnum.DENIED:
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
