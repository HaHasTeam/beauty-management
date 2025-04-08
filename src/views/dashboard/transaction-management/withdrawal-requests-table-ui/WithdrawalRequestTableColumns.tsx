import { type ColumnDef, Row } from '@tanstack/react-table'
import { format } from 'date-fns'
import { Check, CheckCircle, Ellipsis, SettingsIcon, X } from 'lucide-react'
import { useState } from 'react'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { DataTableColumnHeader } from '@/components/ui/data-table/data-table-column-header'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { TWithdrawalRequest, WithdrawalStatusEnum } from '@/types/withdrawal-request'
import { formatCurrency } from '@/utils/number'

import { ApproveWithdrawalRequestDialog } from './ApproveWithdrawalRequestDialog'
import { CompletedWithdrawalRequestDialog } from './CompletedWithdrawalRequestDialog'
import { RejectWithdrawalRequestDialog } from './RejectWithdrawalRequestDialog'
import { WithdrawalRequestResultCell } from './WithdrawalRequestResultCell'
import { WithdrawalRequestStatusCell } from './WithdrawalRequestStatusCell'

export interface DataTableRowAction<TData> {
  row: Row<TData>
  type: 'view' | 'process' | 'approve' | 'reject'
}

// Action cell component
function WithdrawalActionCell({
  withdrawalRequest,
  onRefreshTable
}: {
  withdrawalRequest: TWithdrawalRequest
  onRefreshTable?: () => void
}) {
  const [approveDialogOpen, setApproveDialogOpen] = useState(false)
  const [rejectDialogOpen, setRejectDialogOpen] = useState(false)
  const [completeDialogOpen, setCompleteDialogOpen] = useState(false)

  const status = withdrawalRequest.status

  return (
    <div className='flex justify-end'>
      {status === WithdrawalStatusEnum.PENDING && (
        <ApproveWithdrawalRequestDialog
          withdrawalRequests={[withdrawalRequest]}
          open={approveDialogOpen}
          onOpenChange={setApproveDialogOpen}
          onSuccess={onRefreshTable}
          showTrigger={false}
        />
      )}

      {(status === WithdrawalStatusEnum.PENDING || status === WithdrawalStatusEnum.APPROVED) && (
        <RejectWithdrawalRequestDialog
          withdrawalRequests={[withdrawalRequest]}
          open={rejectDialogOpen}
          onOpenChange={setRejectDialogOpen}
          onSuccess={onRefreshTable}
          showTrigger={false}
        />
      )}

      {status === WithdrawalStatusEnum.APPROVED && (
        <CompletedWithdrawalRequestDialog
          withdrawalRequests={[withdrawalRequest]}
          open={completeDialogOpen}
          onOpenChange={setCompleteDialogOpen}
          onSuccess={onRefreshTable}
          showTrigger={false}
        />
      )}

      {status !== WithdrawalStatusEnum.COMPLETED &&
        status !== WithdrawalStatusEnum.REJECTED &&
        status !== WithdrawalStatusEnum.CANCELLED && (
          <DropdownMenu modal={false}>
            <DropdownMenuTrigger asChild>
              <Button variant='ghost' className='h-8 w-8 p-0'>
                <span className='sr-only'>Open menu</span>
                <Ellipsis className='h-4 w-4' />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align='end'>
              {/* Status-based action buttons */}
              {status === WithdrawalStatusEnum.PENDING && (
                <DropdownMenuItem onClick={() => setApproveDialogOpen(true)} className='text-blue-700'>
                  <CheckCircle className='mr-2 h-4 w-4' />
                  <span>Approve</span>
                </DropdownMenuItem>
              )}

              {status === WithdrawalStatusEnum.APPROVED && (
                <DropdownMenuItem onClick={() => setCompleteDialogOpen(true)} className='text-green-700'>
                  <Check className='mr-2 h-4 w-4' />
                  <span>Complete</span>
                </DropdownMenuItem>
              )}

              {(status === WithdrawalStatusEnum.PENDING || status === WithdrawalStatusEnum.APPROVED) && (
                <DropdownMenuItem onClick={() => setRejectDialogOpen(true)} className='text-red-700'>
                  <X className='mr-2 h-4 w-4' />
                  <span>Reject</span>
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        )}
    </div>
  )
}

export function getColumns(onRefreshTable?: () => void): ColumnDef<TWithdrawalRequest>[] {
  return [
    {
      accessorKey: 'account',
      header: ({ column }) => <DataTableColumnHeader column={column} title='User' />,
      cell: ({ row }) => {
        const user = row.original.account
        let name = 'Unknown User'

        if (user) {
          if (user.username) {
            name = user.username
          } else if (user.firstName || user.lastName) {
            name = `${user.firstName || ''} ${user.lastName || ''}`.trim()
          } else if (user.email) {
            name = user.email
          }
        }

        const initial = name ? name.charAt(0).toUpperCase() : '?'
        const avatarUrl = user?.avatar || ''

        return (
          <div className='flex gap-1 items-center'>
            <Avatar className='rounded-full'>
              <AvatarImage src={avatarUrl} className='size-5' />
              <AvatarFallback>{initial}</AvatarFallback>
            </Avatar>
            <span className='max-w-[31.25rem] truncate'>{name}</span>
          </div>
        )
      },
      size: 200,
      enableHiding: false
    },
    {
      accessorKey: 'amount',
      header: ({ column }) => <DataTableColumnHeader column={column} title='Amount' />,
      cell: ({ row }) => {
        return <div className='text-right font-bold'>{formatCurrency(row.original.amount)}</div>
      },
      size: 100
    },
    {
      accessorKey: 'bankInfo',
      header: ({ column }) => <DataTableColumnHeader column={column} title='Bank Information' />,
      cell: ({ row }) => {
        return (
          <div className='flex flex-col'>
            <span className='font-semibold'>{row.original.bankName}</span>
            <span className='text-sm text-muted-foreground'>
              {row.original.accountNumber} ({row.original.accountName})
            </span>
          </div>
        )
      },
      enableSorting: false,
      size: 350
    },
    {
      id: 'status',
      header: ({ column }) => <DataTableColumnHeader column={column} title='Status' />,
      cell: ({ row }) => {
        return <WithdrawalRequestStatusCell withdrawalRequest={row.original} />
      },
      size: 130,
      filterFn: (row, id, value) => {
        return value.includes(row.getValue(id))
      }
    },
    {
      id: 'result',
      header: ({ column }) => <DataTableColumnHeader column={column} title='Result' />,
      cell: ({ row }) => {
        return <WithdrawalRequestResultCell withdrawalRequest={row.original} />
      },
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
      header: () => <SettingsIcon className='-translate-x-1' />,
      cell: ({ row }) => <WithdrawalActionCell withdrawalRequest={row.original} onRefreshTable={onRefreshTable} />,
      size: 10
    }
  ]
}
