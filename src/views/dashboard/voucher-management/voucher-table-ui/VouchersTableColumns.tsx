import { type ColumnDef, Row } from '@tanstack/react-table'
import { Ellipsis, EyeIcon, FilePenLine, Infinity, Settings, SettingsIcon, Users, XIcon } from 'lucide-react'
import { GrRevert } from 'react-icons/gr'
import { Link } from 'react-router-dom'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { DataTableColumnHeader } from '@/components/ui/data-table/data-table-column-header'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
import { Routes, routesConfig } from '@/configs/routes'
import { formatDate } from '@/lib/utils'
import { DiscountTypeEnum, StatusEnum, VoucherVisibilityEnum } from '@/types/enum'
import { TVoucher } from '@/types/voucher'
import { formatCurrency, formatNumber } from '@/utils/number'

import { VoucherApplyProductsCell } from './VoucherApplyProductsCell'
import { VoucherStatusCell } from './VoucherStatusCell'

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
      accessorKey: 'name',
      header: ({ column }) => <DataTableColumnHeader column={column} title='Chương trình giảm giá' />,
      cell: ({ row }) => {
        const displayName = row.original.name
        return <div className='font-medium'>{displayName}</div>
      },
      size: 250,
      enableHiding: false
    },
    {
      accessorKey: 'code',
      header: ({ column }) => <DataTableColumnHeader column={column} title='Mã giảm giá' />,
      cell: ({ cell }) => <div>{cell.row.original.code}</div>,
      size: 120,
      enableSorting: false,
      enableHiding: false
    },
    {
      accessorKey: 'discountValue',
      header: ({ column }) => <DataTableColumnHeader column={column} title='Số tiền giảm' />,
      cell: ({ cell }) => {
        const voucher = cell.row.original
        const { discountValue, discountType } = voucher

        if (discountType === DiscountTypeEnum.AMOUNT) {
          return <div className='text-end font-bold'>{formatCurrency(discountValue, 'vi-VN')}</div>
        } else if (discountType === DiscountTypeEnum.PERCENTAGE) {
          // Multiply by 100 to get percentage and add % sign
          return <div className='text-end font-bold'>{formatNumber(discountValue * 100, '%')}</div>
        }

        return <div className='text-end font-bold'>{formatNumber(discountValue)}</div>
      },
      size: 120,
      enableSorting: false,
      enableHiding: false
    },
    {
      accessorKey: 'amount',
      header: ({ column }) => <DataTableColumnHeader column={column} title='Số lượng mã' />,
      cell: ({ cell }) => {
        const amount = cell.row.original.amount
        if (!amount) {
          return (
            <div className='text-end flex items-center justify-end gap-1 text-blue-500 font-medium'>
              <Infinity className='h-4 w-4' />
              <span>Không giới hạn</span>
            </div>
          )
        }
        return <div className='text-end font-bold'>{amount}</div>
      },
      size: 800,
      enableSorting: false,
      enableHiding: false
    },
    {
      accessorKey: 'visibility',
      header: ({ column }) => <DataTableColumnHeader column={column} title='Phạm vi' />,
      cell: ({ row }) => {
        const { visibility } = row.original

        switch (visibility) {
          case VoucherVisibilityEnum.PUBLIC:
            return (
              <Badge variant='outline' className='bg-green-50 text-green-700 border-green-200 gap-1'>
                <Users className='h-3 w-3' />
                <span>Public</span>
              </Badge>
            )
          case VoucherVisibilityEnum.WALLET:
            return (
              <Badge variant='outline' className='bg-purple-50 text-purple-700 border-purple-200 gap-1'>
                <Settings className='h-3 w-3' />
                <span>Wallet</span>
              </Badge>
            )
          case VoucherVisibilityEnum.GROUP:
            return (
              <Badge variant='outline' className='bg-indigo-50 text-indigo-700 border-indigo-200 gap-1'>
                <Users className='h-3 w-3' />
                <span>Group</span>
              </Badge>
            )
          default:
            return null
        }
      },
      size: 20,
      enableSorting: false,
      filterFn: (row, id, value) => {
        return Array.isArray(value) && value.includes(row.getValue(id))
      }
    },
    {
      accessorKey: 'applyProducts',
      header: ({ column }) => <DataTableColumnHeader column={column} title='Áp dụng cho' />,
      cell: ({ row }) => <VoucherApplyProductsCell voucher={row.original} />,
      size: 220,
      enableSorting: false,
      enableHiding: false
    },
    {
      accessorKey: 'startTime',
      header: ({ column }) => <DataTableColumnHeader column={column} title='Thời gian bắt đầu' />,
      cell: ({ cell }) =>
        formatDate(cell.getValue() as Date, {
          hour: 'numeric',
          minute: 'numeric',
          month: '2-digit'
        }),
      size: 150
    },
    {
      accessorKey: 'endTime',
      header: ({ column }) => <DataTableColumnHeader column={column} title='Thời gian kết thúc' />,
      cell: ({ cell }) =>
        formatDate(cell.getValue() as Date, {
          hour: 'numeric',
          minute: 'numeric',
          month: '2-digit'
        }),
      size: 150
    },
    {
      accessorKey: 'status',
      header: ({ column }) => <DataTableColumnHeader column={column} title='Status' />,
      cell: ({ row }) => <VoucherStatusCell voucher={row.original} />,
      size: 120,
      minSize: 100,
      filterFn: (row, id, value) => {
        return Array.isArray(value) && value.includes(row.getValue(id))
      }
    },
    {
      accessorKey: 'createdAt',
      header: ({ column }) => <DataTableColumnHeader column={column} title='Ngày tạo' />,
      cell: ({ cell }) =>
        formatDate(cell.getValue() as Date, {
          hour: 'numeric',
          minute: 'numeric',
          month: '2-digit'
        }),
      size: 150
    },
    {
      id: 'actions',
      header: () => <SettingsIcon className='-translate-x-1' />,
      cell: function Cell({ row }) {
        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button aria-label='Open menu' variant='ghost' className='flex size-8 p-0 data-[state=open]:bg-muted'>
                <Ellipsis className='size-4' aria-hidden='true' />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align='end' className='w-40'>
              <DropdownMenuItem className='bg-blue-200 text-blue-500'>
                <Link to={`/dashboard/voucher/${row.original.id}`} className='w-full'>
                  <span className='w-full flex gap-2 items-center cursor-pointer'>
                    <EyeIcon size={16} strokeWidth={3} />
                    <span className='font-semibold'>View Details</span>
                  </span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem className='bg-blue-200 text-blue-500 mt-1'>
                <Link to={routesConfig[Routes.UPDATE_VOUCHER].getPath(row.original.id)} className='w-full'>
                  <span className='w-full flex gap-2 items-center cursor-pointer'>
                    <FilePenLine size={16} strokeWidth={3} />
                    <span className='font-semibold'>Edit</span>
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
                    <XIcon size={16} strokeWidth={3} />
                    <span className='font-semibold'>Ban</span>
                  </span>
                </DropdownMenuItem>
              ) : (
                <DropdownMenuItem
                  className='bg-green-500 text-white mb-1'
                  onClick={() => {
                    setRowAction({ row: row, type: 'unbanned' })
                  }}
                >
                  <span className='w-full flex gap-2 items-center cursor-pointer'>
                    <GrRevert size={16} />
                    <span className='font-semibold'>Unban</span>
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
                  <GrRevert size={16} />
                  <span className='font-semibold'>Update Status</span>
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
