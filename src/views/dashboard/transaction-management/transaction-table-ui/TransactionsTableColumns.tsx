import { type ColumnDef, Row } from '@tanstack/react-table'
import { format } from 'date-fns'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { DataTableColumnHeader } from '@/components/ui/data-table/data-table-column-header'
import { TTransaction } from '@/types/transaction'
import { formatCurrency } from '@/utils/number'
import { getDisplayString } from '@/utils/string'

import { TransactionReferenceCell } from './TransactionReferenceCell'

export interface DataTableRowAction<TData> {
  row: Row<TData>
  type: 'view' | 'process' | 'approve' | 'reject'
}

export function getColumns(): ColumnDef<TTransaction>[] {
  return [
    {
      accessorKey: 'buyer',
      header: ({ column }) => <DataTableColumnHeader column={column} title='Spender' />,
      cell: ({ row }) => {
        const user = row.original.buyer
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
          <div className='flex gap-2 items-center'>
            <Avatar className='rounded-full'>
              <AvatarImage src={avatarUrl} className='size-full' />
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
      header: ({ column }) => <DataTableColumnHeader column={column} title='Spending/ Method' />,
      cell: ({ row }) => {
        return (
          <div className='flex items-end gap-2 flex-col'>
            <div className='text-right font-bold'>{formatCurrency(row.original.amount)}</div>
            <div className='text-xs text-muted-foreground'>
              {' '}
              by <span className='capitalize'>{getDisplayString(row.original.paymentMethod.toLowerCase())}</span>
            </div>
          </div>
        )
      },
      size: 20
    },
    {
      accessorKey: 'balanceAfterTransaction',
      header: ({ column }) => <DataTableColumnHeader column={column} title='Remaining' />,
      cell: ({ row }) => {
        return (
          <div className='text-xs text-muted-foreground text-end'>
            {formatCurrency(row.original.balanceAfterTransaction)}
          </div>
        )
      },
      size: 50
    },
    {
      accessorKey: 'type',
      header: ({ column }) => <DataTableColumnHeader column={column} title='Type' />,
      cell: ({ row }) => {
        return (
          <div className='text-xs text-muted-foreground capitalize text-nowrap text-end font-bold'>
            {getDisplayString(row.original.type.toLowerCase())}
          </div>
        )
      },
      size: 130
    },
    // {
    //   id: 'type',
    //   header: ({ column }) => <DataTableColumnHeader column={column} title='Type' />,
    //   cell: ({ row }) => {
    //     return <WithdrawalRequestStatusCell withdrawalRequest={row.original} />
    //   },
    //   size: 130,
    //   filterFn: (row, id, value) => {
    //     return value.includes(row.getValue(id))
    //   }
    // },
    {
      id: 'reference',
      header: ({ column }) => <DataTableColumnHeader column={column} title='Reference Order/ Booking' />,
      cell: ({ row }) => {
        return <TransactionReferenceCell transaction={row.original} />
      },
      size: 400
    },
    {
      id: 'createdAt',
      accessorKey: 'createdAt',
      header: ({ column }) => <DataTableColumnHeader column={column} title='Date Created' />,
      cell: ({ row }) => {
        return <div className='text-sm text-muted-foreground'>{format(new Date(row.original.createdAt), 'PPpp')}</div>
      },
      size: 200
    }
  ]
}
