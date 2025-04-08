import { CheckIcon, ClockIcon, RefreshCcwIcon, WalletIcon, XIcon } from 'lucide-react'

import { Badge } from '@/components/ui/badge'
import { TWithdrawalRequest, WithdrawalStatusEnum } from '@/types/withdrawal-request'

interface WithdrawalRequestStatusCellProps {
  withdrawalRequest: TWithdrawalRequest
}

export function WithdrawalRequestStatusCell({ withdrawalRequest }: WithdrawalRequestStatusCellProps) {
  const { status } = withdrawalRequest

  switch (status) {
    case WithdrawalStatusEnum.PENDING:
      return (
        <Badge variant='outline' className='border-amber-200 bg-amber-50 text-amber-700 gap-1'>
          <ClockIcon className='h-3.5 w-3.5' />
          <span>Pending</span>
        </Badge>
      )

    case WithdrawalStatusEnum.APPROVED:
      return (
        <Badge variant='outline' className='border-blue-200 bg-blue-50 text-blue-700 gap-1'>
          <WalletIcon className='h-3.5 w-3.5' />
          <span>In Progress</span>
        </Badge>
      )

    case WithdrawalStatusEnum.REJECTED:
      return (
        <Badge variant='outline' className='border-red-200 bg-red-50 text-red-700 gap-1'>
          <XIcon className='h-3.5 w-3.5' />
          <span>Rejected</span>
        </Badge>
      )

    case WithdrawalStatusEnum.COMPLETED:
      return (
        <Badge variant='outline' className='border-green-200 bg-green-50 text-green-700 gap-1'>
          <CheckIcon className='h-3.5 w-3.5' />
          <span>Completed</span>
        </Badge>
      )

    case WithdrawalStatusEnum.CANCELLED:
      return (
        <Badge variant='outline' className='border-gray-200 bg-gray-50 text-gray-700 gap-1'>
          <RefreshCcwIcon className='h-3.5 w-3.5' />
          <span>Cancelled</span>
        </Badge>
      )

    default:
      return (
        <Badge variant='outline' className='border-gray-200 bg-gray-50 text-gray-700 gap-1'>
          <span>Unknown</span>
        </Badge>
      )
  }
}
