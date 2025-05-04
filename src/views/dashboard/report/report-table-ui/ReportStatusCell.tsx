import { ActivityIcon, CheckIcon, ClockIcon, XIcon } from 'lucide-react'

import { Badge } from '@/components/ui/badge'
import { IReport, ReportStatusEnum } from '@/types/report'

interface ReportStatusCellProps {
  report: IReport
}

export function ReportStatusCell({ report }: ReportStatusCellProps) {
  const { status } = report

  switch (status) {
    case ReportStatusEnum.PENDING:
      return (
        <Badge variant='outline' className='border-amber-200 bg-amber-50 text-amber-700 gap-1'>
          <ClockIcon className='h-3.5 w-3.5' />
          <span>Pending</span>
        </Badge>
      )

    case ReportStatusEnum.IN_PROCESSING:
      return (
        <Badge variant='outline' className='border-blue-200 bg-blue-50 text-blue-700 gap-1'>
          <ActivityIcon className='h-3.5 w-3.5' />
          <span>In Processing</span>
        </Badge>
      )

    case ReportStatusEnum.APPROVED:
      return (
        <Badge variant='outline' className='border-green-200 bg-green-50 text-green-700 gap-1'>
          <CheckIcon className='h-3.5 w-3.5' />
          <span>Done</span>
        </Badge>
      )

    case ReportStatusEnum.CANCELLED:
      return (
        <Badge variant='outline' className='border-red-200 bg-red-50 text-red-700 gap-1'>
          <XIcon className='h-3.5 w-3.5' />
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
