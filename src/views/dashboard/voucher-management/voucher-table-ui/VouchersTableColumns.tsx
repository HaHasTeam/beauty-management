import { type ColumnDef, Row } from '@tanstack/react-table'
import {
  Calendar,
  CheckCircle2,
  Ellipsis,
  EyeIcon,
  FilePenLine,
  Settings,
  SettingsIcon,
  Users,
  XCircle
} from 'lucide-react'
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
import useGrant from '@/hooks/useGrant'
import { formatDate } from '@/lib/utils'
import { DiscountTypeEnum, RoleEnum, StatusEnum, VoucherVisibilityEnum } from '@/types/enum'
import { TVoucher } from '@/types/voucher'
import { formatCurrency, formatNumber } from '@/utils/number'

import { VoucherApplyProductsCell } from './VoucherApplyProductsCell'
import { VoucherStatusCell } from './VoucherStatusCell'

export interface DataTableRowAction<TData> {
  row: Row<TData>
  type: 'activate' | 'deactivate' | 'view'
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
          return <div className='text-end text-blue-500 font-medium'>Không giới hạn</div>
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
      cell: ({ cell }) => {
        const value = cell.getValue()
        if (!value) {
          return (
            <div className='flex items-center text-muted-foreground'>
              <Calendar className='h-4 w-4 mr-1' />
              <span>N/A</span>
            </div>
          )
        }
        return formatDate(value as Date, {
          hour: 'numeric',
          minute: 'numeric',
          month: '2-digit'
        })
      },
      size: 150
    },
    {
      accessorKey: 'endTime',
      header: ({ column }) => <DataTableColumnHeader column={column} title='Thời gian kết thúc' />,
      cell: ({ cell }) => {
        const value = cell.getValue()
        if (!value) {
          return (
            <div className='flex items-center text-muted-foreground'>
              <Calendar className='h-4 w-4 mr-1' />
              <span>N/A</span>
            </div>
          )
        }
        return formatDate(value as Date, {
          hour: 'numeric',
          minute: 'numeric',
          month: '2-digit'
        })
      },
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
        const voucher = row.original
        const isGrant = useGrant([RoleEnum.ADMIN, RoleEnum.OPERATOR, RoleEnum.MANAGER, RoleEnum.STAFF])
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
                <DropdownMenuItem>
                  <Link to={`/dashboard/voucher/${voucher.id}`} className='w-full'>
                    <span className='w-full flex gap-2 items-center cursor-pointer'>
                      <EyeIcon className='mr-2 h-4 w-4' aria-hidden='true' />
                      <span>View Details</span>
                    </span>
                  </Link>
                </DropdownMenuItem>
                {isGrant && (
                  <DropdownMenuItem>
                    <Link to={routesConfig[Routes.UPDATE_VOUCHER].getPath(voucher.id)} className='w-full'>
                      <span className='w-full flex gap-2 items-center cursor-pointer'>
                        <FilePenLine className='mr-2 h-4 w-4' aria-hidden='true' />
                        <span>Edit</span>
                      </span>
                    </Link>
                  </DropdownMenuItem>
                )}
                <DropdownMenuSeparator />
                {isGrant && (
                  <>
                    {voucher.status === StatusEnum.ACTIVE ? (
                      <DropdownMenuItem
                        className='text-amber-500'
                        onClick={() => {
                          setRowAction({ row: row, type: 'deactivate' })
                        }}
                      >
                        <span className='w-full flex gap-2 items-center cursor-pointer'>
                          <XCircle className='h-4 w-4' />
                          <span className='font-semibold'>Deactivate Voucher</span>
                        </span>
                      </DropdownMenuItem>
                    ) : (
                      <DropdownMenuItem
                        className='text-green-500'
                        onClick={() => {
                          setRowAction({ row: row, type: 'activate' })
                        }}
                      >
                        <span className='w-full flex gap-2 items-center cursor-pointer'>
                          <CheckCircle2 className='h-4 w-4' />
                          <span className='font-semibold'>Activate Voucher</span>
                        </span>
                      </DropdownMenuItem>
                    )}
                  </>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        )
      },
      size: 40,
      enableSorting: false,
      enableHiding: false
    }
  ]
}
