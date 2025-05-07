import { type ColumnDef, Row } from '@tanstack/react-table'
import { format } from 'date-fns'
import {
  Calendar,
  CalendarDays,
  CheckCircle,
  ChevronDown,
  ChevronUp,
  Ellipsis,
  FileSearch,
  FileSpreadsheet,
  Info,
  Package,
  Receipt,
  SettingsIcon,
  UserPlus
} from 'lucide-react'
import { ReactNode, useState } from 'react'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { DataTableColumnHeader } from '@/components/ui/data-table/data-table-column-header'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
import useGrant from '@/hooks/useGrant'
import { useStore } from '@/stores/store'
import { RoleEnum } from '@/types/enum'
import { IReport, ReportTypeEnum } from '@/types/report'
import { formatCurrency } from '@/utils/number'
import { getDisplayString } from '@/utils/string'

import { ReportResultCell } from './ReportResultCell'
import { ReportStatusCell } from './ReportStatusCell'

export interface DataTableRowAction<TData> {
  row: Row<TData>
  type: 'ban' | 'view' | 'unbanned' | 'assign' | 'resolve'
}

interface GetColumnsProps {
  setRowAction: React.Dispatch<React.SetStateAction<DataTableRowAction<IReport> | null>>
}

const ReportReferenceCell = ({ report }: { report: IReport }) => {
  const [expanded, setExpanded] = useState(false)

  const toggleExpanded = () => setExpanded(!expanded)

  // Early return if no reference data exists for any type
  if (!report.order && !report.booking && !report.transaction) {
    return (
      <div className='flex items-center text-sm text-muted-foreground p-1.5'>
        <Info className='h-4 w-4 mr-1.5 text-slate-400' />
        <span className='italic'>No reference data</span>
      </div>
    )
  }

  // Determine reference type and associated icon
  let icon: ReactNode = <FileSearch className='h-3.5 w-3.5' />
  let typeLabel = 'Reference'
  let bgColor = 'bg-blue-50'
  let textColor = 'text-blue-600'

  if (report.type === ReportTypeEnum.ORDER) {
    icon = <Package className='h-3.5 w-3.5' />
    typeLabel = 'Order'
    bgColor = 'bg-emerald-50'
    textColor = 'text-emerald-600'
  } else if (report.type === ReportTypeEnum.BOOKING) {
    icon = <CalendarDays className='h-3.5 w-3.5' />
    typeLabel = 'Booking'
    bgColor = 'bg-purple-50'
    textColor = 'text-purple-600'
  } else if (report.type === ReportTypeEnum.TRANSACTION) {
    icon = <Receipt className='h-3.5 w-3.5' />
    typeLabel = 'Transaction'
    bgColor = 'bg-amber-50'
    textColor = 'text-amber-600'
  }

  // Get relevant reference data
  let referenceContent: ReactNode = null
  let referenceId: string = ''

  if (report.type === ReportTypeEnum.ORDER && report.order) {
    const order = report.order
    referenceId = order.id || ''

    referenceContent = (
      <div className='space-y-1.5'>
        <div className='flex items-center space-x-2 p-1.5 bg-slate-50 rounded-md'>
          <div className='h-9 w-9 rounded-md bg-white border border-slate-200 flex items-center justify-center overflow-hidden'>
            <Package className='h-5 w-5 text-emerald-400' />
          </div>
          <div className='flex-1 min-w-0'>
            <div className='text-xs font-medium truncate'>{order.recipientName || 'Order Recipient'}</div>
            <div className='flex justify-between text-xs text-slate-500'>
              <span className='truncate max-w-[200px]'>{order.shippingAddress || 'No address'}</span>
              <span className='font-medium'>{formatCurrency(order.totalPrice || 0)}</span>
            </div>
          </div>
        </div>
      </div>
    )
  } else if (report.type === ReportTypeEnum.BOOKING && report.booking) {
    const booking = report.booking
    referenceId = booking.id || ''

    referenceContent = (
      <div className='space-y-1.5'>
        <div className='flex items-center space-x-2 p-1.5 bg-slate-50 rounded-md'>
          <div className='h-9 w-9 rounded-md bg-white border border-slate-200 flex items-center justify-center overflow-hidden'>
            <CalendarDays className='h-5 w-5 text-purple-400' />
          </div>
          <div className='flex-1 min-w-0'>
            <div className='text-xs font-medium truncate'>
              {booking.consultantService?.systemService?.name || 'Booking Service'}
            </div>
            <div className='flex justify-between text-xs text-slate-500'>
              <span className='truncate max-w-[200px]'>
                <Calendar className='inline h-3 w-3 mr-1' />
                {booking.startTime ? new Date(booking.startTime).toLocaleString() : 'No time'}
              </span>
              <span className='font-medium'>{formatCurrency(booking.totalPrice || 0)}</span>
            </div>
          </div>
        </div>
      </div>
    )
  } else if (report.type === ReportTypeEnum.TRANSACTION && report.transaction) {
    const transaction = report.transaction
    referenceId = transaction.id || ''
    const transactionType = transaction.type?.toLowerCase() || ''

    referenceContent = (
      <div className='space-y-1.5'>
        <div className='flex items-center space-x-2 p-1.5 bg-slate-50 rounded-md'>
          <div className='h-9 w-9 rounded-md bg-white border border-slate-200 flex items-center justify-center overflow-hidden'>
            <Receipt className='h-5 w-5 text-amber-400' />
          </div>
          <div className='flex-1 min-w-0'>
            <div className='text-xs font-medium truncate'>{getDisplayString(transactionType)}</div>
            <div className='flex justify-between text-xs text-slate-500'>
              <span className='truncate max-w-[200px]'>{transaction.paymentMethod || 'No method'}</span>
              <span className='font-medium'>{formatCurrency(transaction.amount || 0)}</span>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className='w-full rounded-md overflow-hidden'>
      <div className='p-2'>
        <div className='flex items-center space-x-2'>
          <div className={`flex-shrink-0 flex items-center justify-center w-6 h-6 ${bgColor} ${textColor} rounded-md`}>
            {icon}
          </div>
          <div className='flex-1 flex items-center justify-between'>
            <div className='text-sm'>
              {typeLabel} <span className='font-bold'>#{referenceId.substring(0, 6)}</span>
            </div>

            <Button variant='ghost' size='sm' className='h-7 px-2 flex-shrink-0' onClick={toggleExpanded}>
              {expanded ? <ChevronUp className='h-4 w-4' /> : <ChevronDown className='h-4 w-4' />}
            </Button>
          </div>
        </div>

        {expanded && <div className='mt-2 space-y-2 pl-8'>{referenceContent}</div>}
      </div>
    </div>
  )
}

export function getColumns({ setRowAction }: GetColumnsProps): ColumnDef<IReport>[] {
  return [
    {
      id: 'reporter',
      header: ({ column }) => <DataTableColumnHeader column={column} title='Reporter' />,
      cell: ({ row }) => {
        const user = row.original.reporter
        const name = user ? user.username || user.email : 'Unknown User'
        const role = user?.role || ''
        const avatarUrl = user?.avatar || ''

        return (
          <div className='flex gap-1 items-center'>
            <Avatar className='rounded-full'>
              <AvatarImage src={avatarUrl} className='size-5' />
              <AvatarFallback>{name.charAt(0).toUpperCase()}</AvatarFallback>
            </Avatar>
            <div className='flex flex-col'>
              <span className='max-w-[31.25rem] truncate text-sm'>{name}</span>
              {role && (
                <span className='text-xs text-muted-foreground capitalize'>
                  ({typeof role === 'string' ? role.toLowerCase() : role})
                </span>
              )}
            </div>
          </div>
        )
      },
      size: 200,
      enableHiding: false
    },
    {
      id: 'type',
      header: ({ column }) => <DataTableColumnHeader column={column} title='Type' />,
      cell: ({ row }) => {
        const type = row.original.type
        return <div className='text-xs font-medium text-end capitalize'>{type.replace(/_/g, ' ').toLowerCase()}</div>
      },
      size: 100
    },
    {
      id: 'status',
      header: ({ column }) => <DataTableColumnHeader column={column} title='Status' />,
      cell: ({ row }) => <ReportStatusCell report={row.original} />,
      filterFn: (row, id, value) => {
        return Array.isArray(value) && value.includes(row.getValue(id))
      },
      size: 60
    },
    {
      id: 'reference',
      header: ({ column }) => <DataTableColumnHeader column={column} title='Reference' />,
      cell: ({ row }) => <ReportReferenceCell report={row.original} />,
      size: 220
    },
    {
      id: 'result',
      header: ({ column }) => <DataTableColumnHeader column={column} title='Result' />,
      cell: ({ row }) => <ReportResultCell report={row.original} />,
      size: 400
    },
    {
      id: 'createdAt',
      accessorKey: 'createdAt',
      header: ({ column }) => <DataTableColumnHeader column={column} title='Date Created' />,
      cell: ({ row }) => {
        return <div className='text-sm text-muted-foreground'>{format(new Date(row.original.createdAt), 'PPp')}</div>
      },
      size: 180
    },
    {
      id: 'actions',
      header: () => <SettingsIcon className='h-4 w-4' />,
      cell: function Cell({ row }) {
        const isAssigned = !!row.original.assignee?.id
        const isResolved = !!row.original.resultNote
        const isGrant = useGrant([RoleEnum.ADMIN, RoleEnum.OPERATOR])
        const { user } = useStore()
        const isAssignedToMe = row.original.assignee?.id === user?.id
        return (
          <div className='flex justify-end'>
            <DropdownMenu modal={false}>
              <DropdownMenuTrigger asChild>
                <Button variant='ghost' className='h-8 w-8 p-0'>
                  <span className='sr-only'>Open menu</span>
                  <Ellipsis className='h-4 w-4' />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align='end'>
                <DropdownMenuItem onClick={() => setRowAction({ row: row, type: 'view' })}>
                  <span className='w-full flex gap-2 items-center cursor-pointer'>
                    <FileSpreadsheet className='h-4 w-4' />
                    <span>View report details</span>
                  </span>
                </DropdownMenuItem>
                {isGrant && (
                  <>
                    {!isAssigned && (
                      <>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          className='text-blue-500'
                          onClick={() => setRowAction({ row: row, type: 'assign' })}
                        >
                          <span className='w-full flex gap-2 items-center cursor-pointer'>
                            <UserPlus className='h-4 w-4' />
                            <span className='font-semibold'>Assign to staff</span>
                          </span>
                        </DropdownMenuItem>
                      </>
                    )}

                    {isAssigned && !isResolved && isAssignedToMe && (
                      <>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          className='text-green-500'
                          onClick={() => setRowAction({ row: row, type: 'resolve' })}
                        >
                          <span className='w-full flex gap-2 items-center cursor-pointer'>
                            <CheckCircle className='h-4 w-4' />
                            <span className='font-semibold'>Mark as resolved</span>
                          </span>
                        </DropdownMenuItem>
                      </>
                    )}
                  </>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        )
      },
      size: 10,
      enableSorting: false,
      enableHiding: false
    }
  ]
}
