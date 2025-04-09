import { type ColumnDef, Row } from '@tanstack/react-table'
import { Ellipsis, EyeIcon, Pen, SettingsIcon, XIcon } from 'lucide-react'
import { GrRevert } from 'react-icons/gr'
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
import { StatusEnum } from '@/types/enum'
import { TVoucher } from '@/types/voucher'
import { formatPriceVND } from '@/utils'

import { getStatusIcon } from './helper'

export interface DataTableRowAction<TData> {
  row: Row<TData>
  type: 'ban' | 'view' | 'unbanned' | 'update-status'
}
interface GetColumnsProps {
  setRowAction: React.Dispatch<React.SetStateAction<DataTableRowAction<TVoucher> | null>>
}
export function getColumns({ setRowAction }: GetColumnsProps): ColumnDef<TVoucher>[] {
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
      id: 'voucher',
      header: ({ column }) => <DataTableColumnHeader column={column} title='Chương trình giảm giá' />,
      cell: ({ row }) => {
        const displayName = row.original.name
        return (
          <div className='flex space-x-2 items-center'>
            <span className='max-w-[31.25rem] truncate'>{displayName}</span>
          </div>
        )
      }
    },
    {
      accessorKey: 'code',
      header: ({ column }) => <DataTableColumnHeader column={column} title='Mã giảm giá' />,
      cell: ({ cell }) => <div>{cell.row.original.code}</div>,
      size: 100,
      enableSorting: false,
      enableHiding: false
    },
    {
      accessorKey: 'discountValue',
      header: ({ column }) => <DataTableColumnHeader column={column} title='Số tiền giảm' />,
      cell: ({ cell }) => <div>{formatPriceVND(cell.row.original.discountValue)}</div>,
      size: 10,
      enableSorting: false,
      enableHiding: false
    },
    {
      accessorKey: 'amount',
      header: ({ column }) => <DataTableColumnHeader column={column} title='Số lượng mã' />,
      cell: ({ cell }) => <div>{cell.row.original.amount}</div>,
      size: 10,
      enableSorting: false,
      enableHiding: false
    },

    {
      accessorKey: 'status',
      header: ({ column }) => <DataTableColumnHeader column={column} title='Status' />,
      cell: ({ row }) => {
        const statusKey = Object.keys(StatusEnum).find((status) => {
          const value = StatusEnum[status as keyof typeof StatusEnum]
          return value === row.original.status
        })

        if (!statusKey) return null

        const statusValue = StatusEnum[statusKey as keyof typeof StatusEnum]

        const Icon = getStatusIcon(statusValue)

        return (
          <div
            className={cn(
              'flex items-center font-medium px-2 py-1 rounded-3xl shadow-xl',
              Icon.textColor,
              Icon.bgColor
            )}
          >
            <Icon.icon
              className={cn('mr-2 size-7 p-0.5 rounded-full animate-pulse', Icon.iconColor)}
              aria-hidden='true'
            />
            <span className='capitalize'>{statusValue.toLowerCase()}</span>
          </div>
        )
      },
      size: 50,
      filterFn: (row, id, value) => {
        return Array.isArray(value) && value.includes(row.getValue(id))
      }
    },
    {
      accessorKey: 'startTime',
      header: ({ column }) => <DataTableColumnHeader column={column} title='Thời gian bắt đầu' />,
      cell: ({ cell }) =>
        formatDate(cell.getValue() as Date, {
          hour: 'numeric',
          minute: 'numeric'
        })
    },

    {
      accessorKey: 'endTime',
      header: ({ column }) => <DataTableColumnHeader column={column} title='Thời gian kết thúc' />,
      cell: ({ cell }) =>
        formatDate(cell.getValue() as Date, {
          hour: 'numeric',
          minute: 'numeric'
        })
    },
    {
      accessorKey: 'createdAt',
      header: ({ column }) => <DataTableColumnHeader column={column} title='Ngày tạo' />,
      cell: ({ cell }) =>
        formatDate(cell.getValue() as Date, {
          hour: 'numeric',
          minute: 'numeric'
        })
    },
    {
      id: 'actions',
      header: () => <SettingsIcon className='-translate-x-1' />,
      cell: function Cell({ row }) {
        return (
          <DropdownMenu modal={false}>
            <DropdownMenuTrigger>
              <Button aria-label='Open menu' variant='ghost' className='flex size-8 p-0 data-[state=open]:bg-muted'>
                <Ellipsis className='size-4' aria-hidden='true' />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align='end' className='w-40'>
              <DropdownMenuItem
              // onClick={() => {
              //   setRowAction({ row: row, type: 'view' })
              // }}
              >
                <Link to={`/dashboard/voucher/${row.original.id}`}>
                  <span className='w-full flex gap-2 items-center cursor-pointer'>
                    <EyeIcon />
                    View Details
                  </span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Link to={routesConfig[Routes.UPDATE_VOUCHER].getPath(row.original.id)}>
                  <span className='w-full flex gap-2 items-center cursor-pointer'>
                    <Pen />
                    Update
                  </span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              {row.original.status !== StatusEnum.BANNED ? (
                <DropdownMenuItem
                  className='bg-red-500 text-white mb-1'
                  onClick={() => {
                    setRowAction({ row: row, type: 'ban' })
                  }}
                >
                  <span className='w-full flex gap-2 items-center cursor-pointer'>
                    <XIcon />
                    ban
                  </span>
                </DropdownMenuItem>
              ) : (
                <DropdownMenuItem
                  className='bg-green-500 text-white'
                  onClick={() => {
                    setRowAction({ row: row, type: 'unbanned' })
                  }}
                >
                  <span className='w-full flex gap-2 items-center cursor-pointer'>
                    <GrRevert />
                    unBan
                  </span>
                </DropdownMenuItem>
              )}
              <DropdownMenuItem
                className='bg-green-500 text-white'
                onClick={() => {
                  setRowAction({ row: row, type: 'update-status' })
                }}
              >
                <span className='w-full flex gap-2 items-center cursor-pointer'>
                  <GrRevert />
                  update status
                </span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )
      },
      size: 40,
      enableSorting: false,
      enableHiding: false
    }
  ]
}
