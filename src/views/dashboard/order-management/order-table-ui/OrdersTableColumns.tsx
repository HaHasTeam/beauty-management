import type { ColumnDef, Row } from '@tanstack/react-table'
import i18next from 'i18next'
import { Ellipsis, EyeIcon, SettingsIcon } from 'lucide-react'
import { Link } from 'react-router-dom'

import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { DataTableColumnHeader } from '@/components/ui/data-table/data-table-column-header'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
import { Routes, routesConfig } from '@/configs/routes'
import { cn, formatDate } from '@/lib/utils'
import { ShippingStatusEnum } from '@/types/enum'
import { type IOrder } from '@/types/order'
import { getDisplayString } from '@/utils/string'

import { getStatusIcon } from './helper'

export interface DataTableRowAction<TData> {
  row: Row<TData>
  type: 'view' | 'cancel' | 'update-status'
}

interface GetColumnsProps {
  setRowAction: React.Dispatch<React.SetStateAction<DataTableRowAction<IOrder> | null>>
}

export function getColumns({ setRowAction }: GetColumnsProps): ColumnDef<IOrder>[] {
  return [
    {
      id: 'select',
      header: ({ table }) => (
        <Checkbox
          className='-translate-x-2'
          checked={table.getIsAllPageRowsSelected() || (table.getIsSomePageRowsSelected() && 'indeterminate')}
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label='Select all'
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label='Select row'
        />
      ),
      enableSorting: false,
      enableHiding: false,
      size: 1
    },
    {
      id: 'index',
      accessorKey: 'STT',
      cell: ({ row }) => {
        return <span className='text-center'>{row.index + 1}</span>
      },
      size: 1
    },
    {
      accessorKey: 'recipientName',
      header: ({ column }) => <DataTableColumnHeader column={column} title='Recipient' />,
      cell: ({ row }) => <div>{row.original.recipientName}</div>,
      enableSorting: true
    },
    {
      accessorKey: 'totalPrice',
      header: ({ column }) => <DataTableColumnHeader column={column} title='Total' />,
      cell: ({ row }) => <div>{i18next.t('order.totalPrice', { price: row.original.totalPrice })}</div>,
      enableSorting: true
    },
    {
      accessorKey: 'status',
      header: ({ column }) => <DataTableColumnHeader column={column} title='Status' />,
      cell: ({ row }) => {
        const statusValue = row.original.status
        const Icon = getStatusIcon(statusValue)

        return (
          <div className={cn('flex items-center font-medium px-2 py-1 rounded-3xl', Icon.textColor, Icon.bgColor)}>
            <Icon.icon className={cn('mr-2 size-4', Icon.iconColor)} aria-hidden='true' />
            <span className='capitalize'>{getDisplayString(statusValue)}</span>
          </div>
        )
      },
      filterFn: (row, id, value) => {
        return Array.isArray(value) && value.includes(row.getValue(id))
      }
    },
    {
      accessorKey: 'createdAt',
      header: ({ column }) => <DataTableColumnHeader column={column} title='Order Date' />,
      cell: ({ cell }) =>
        formatDate(cell.getValue() as Date, {
          hour: 'numeric',
          minute: 'numeric'
        })
    },
    {
      id: 'actions',
      header: () => <SettingsIcon className='-translate-x-1' />,
      cell: ({ row }) => (
        <DropdownMenu modal={false}>
          <DropdownMenuTrigger asChild>
            <Button variant='ghost' className='size-8 p-0'>
              <span className='sr-only'>Open menu</span>
              <Ellipsis className='size-4' aria-hidden='true' />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align='end'>
            <Link
              to={routesConfig[Routes.ORDER_DETAILS].getPath({
                id: row.original.id
              })}
            >
              <DropdownMenuItem>
                <EyeIcon className='mr-2 size-4' />
                View details
              </DropdownMenuItem>
            </Link>
            {/* <DropdownMenuItem asChild>
              <Link to={routesConfig[Routes.ORDER_INVOICE].getPath(row.original.id)}>
                <FileText className='mr-2 size-4' />
                View invoice
              </Link>
            </DropdownMenuItem> */}
            <DropdownMenuSeparator />
            <DropdownMenuItem onSelect={() => setRowAction({ row, type: 'update-status' })}>
              Update status
            </DropdownMenuItem>
            {row.original.status === ShippingStatusEnum.WAIT_FOR_CONFIRMATION && (
              <DropdownMenuItem onSelect={() => setRowAction({ row, type: 'cancel' })} className='text-red-600'>
                Cancel order
              </DropdownMenuItem>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      ),
      size: 40,
      enableSorting: false,
      enableHiding: false
    }
  ]
}
