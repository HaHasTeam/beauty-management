import { type ColumnDef, Row } from '@tanstack/react-table'
import i18next from 'i18next'
import {
  CheckCircle2,
  CircleDashed,
  CircleMinus,
  Crown,
  Ellipsis,
  EyeIcon,
  FilePenLine,
  Image,
  SettingsIcon
} from 'lucide-react'
import { GrRevert } from 'react-icons/gr'
import { Link } from 'react-router-dom'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
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
import { StatusEnum } from '@/types/enum'
import { IResponseProduct, ProductStatusEnum } from '@/types/product'
import { formatNumber } from '@/utils/number'

import { ProductCategoryCell } from './ProductCategoryCell'
import { ProductClassificationsCell } from './ProductClassificationsCell'

export interface DataTableRowAction<TData> {
  row: Row<TData>
  type: 'ban' | 'view' | 'unbanned' | 'update-status-active' | 'update-status-inactive' | 'deny'
}
interface GetColumnsProps {
  setRowAction: React.Dispatch<React.SetStateAction<DataTableRowAction<IResponseProduct> | null>>
  showCount?: boolean
}
export function getColumns({ setRowAction, showCount = false }: GetColumnsProps): ColumnDef<IResponseProduct>[] {
  const columns: ColumnDef<IResponseProduct>[] = [
    {
      id: 'product',
      header: ({ column }) => <DataTableColumnHeader column={column} title='Product' />,
      cell: ({ row }) => {
        const productName = row.original.name
        const image = row.original.images?.[0]?.fileUrl || ''

        return (
          <div className='flex items-center gap-2'>
            <div className='w-8 h-8 flex-shrink-0'>
              <Avatar className='rounded-lg w-full h-full'>
                <AvatarImage src={image} alt={productName} className='bg-transparent object-cover' />
                <AvatarFallback className='bg-transparent'>
                  <Image size={24} />
                </AvatarFallback>
              </Avatar>
            </div>
            <span className='max-w-[250px] truncate'>{productName}</span>
          </div>
        )
      },
      size: 220,
      enableHiding: false
    },
    {
      accessorKey: 'sku',
      header: ({ column }) => <DataTableColumnHeader column={column} title='SKU' />,
      cell: ({ cell }) => <div className='text-end'>{cell.row.original.sku}</div>,
      enableSorting: false,
      enableHiding: false,
      size: 150
    },
    {
      accessorKey: 'category',
      header: ({ column }) => <DataTableColumnHeader column={column} title='Category' />,
      cell: ({ row }) => {
        return <ProductCategoryCell product={row.original} />
      },
      enableSorting: false,
      enableHiding: false,
      size: 220
    },
    {
      accessorKey: 'productClassifications',
      header: ({ column }) => <DataTableColumnHeader column={column} title='Classifications | Quantity' />,
      cell: ({ row }) => {
        return <ProductClassificationsCell product={row.original} />
      },
      enableSorting: false,
      enableHiding: false,
      size: 350
    },
    {
      accessorKey: 'status',
      header: ({ column }) => <DataTableColumnHeader column={column} title='Status' />,
      cell: ({ row }) => {
        const status = row.original.status

        switch (status) {
          case ProductStatusEnum.OFFICIAL:
            return (
              <Badge variant='outline' className='border-green-200 bg-green-50 text-green-700 gap-1'>
                <CheckCircle2 className='h-3.5 w-3.5' />
                <span className='whitespace-nowrap'>{i18next.t(`status.${status}`)}</span>
              </Badge>
            )
          case 'PRE_ORDER':
          case 'FLASH_SALE':
            return (
              <Badge variant='outline' className='border-amber-200 bg-amber-50 text-amber-700 gap-1'>
                <CircleDashed className='h-3.5 w-3.5' />
                <span className='whitespace-nowrap'>{i18next.t(`status.${status}`)}</span>
              </Badge>
            )
          case ProductStatusEnum.INACTIVE:
          case ProductStatusEnum.UN_PUBLISHED:
          case ProductStatusEnum.BANNED:
            return (
              <Badge variant='outline' className='border-gray-200 bg-gray-50 text-gray-700 gap-1'>
                <CircleMinus className='h-3.5 w-3.5' />
                <span className='whitespace-nowrap'>{i18next.t(`status.${status}`)}</span>
              </Badge>
            )
          case ProductStatusEnum.OUT_OF_STOCK:
            return (
              <Badge variant='outline' className='border-purple-200 bg-purple-50 text-purple-700 gap-1'>
                <Crown className='h-3.5 w-3.5' />
                <span className='whitespace-nowrap'>{i18next.t(`status.${status}`)}</span>
              </Badge>
            )
          default:
            return (
              <Badge variant='outline' className='border-gray-200 bg-gray-50 text-gray-700 gap-1'>
                <span className='whitespace-nowrap'>{i18next.t(`status.${status}`)}</span>
              </Badge>
            )
        }
      },
      size: 150,
      filterFn: (row, id, value) => {
        return Array.isArray(value) && value.includes(row.getValue(id))
      }
    },
    {
      accessorKey: 'createdAt',
      header: ({ column }) => <DataTableColumnHeader column={column} title='Created At' />,
      cell: ({ cell }) => (
        <div>
          {formatDate(cell.getValue() as Date, {
            hour: 'numeric',
            minute: 'numeric',
            month: '2-digit'
          })}
        </div>
      ),
      size: 200
    },
    {
      accessorKey: 'updatedAt',
      header: ({ column }) => <DataTableColumnHeader column={column} title='Updated At' />,
      cell: ({ cell }) => (
        <div>
          {formatDate(cell.getValue() as Date, {
            hour: 'numeric',
            minute: 'numeric',
            month: '2-digit'
          })}
        </div>
      ),
      size: 200
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
              <DropdownMenuItem className='text-blue-500'>
                <Link
                  to={routesConfig[Routes.PRODUCT_DETAILS].getPath({
                    id: row.original.id
                  })}
                  className='w-full flex gap-2 items-center'
                >
                  <EyeIcon size={16} strokeWidth={3} />
                  <span className='font-semibold'>View</span>
                </Link>
              </DropdownMenuItem>

              <DropdownMenuItem className='text-blue-500'>
                <Link
                  to={routesConfig[Routes.UPDATE_PRODUCT].getPath({
                    id: row.original.id
                  })}
                  className='w-full flex gap-2 items-center'
                >
                  <FilePenLine size={16} strokeWidth={3} />
                  <span className='font-semibold'>Edit</span>
                </Link>
              </DropdownMenuItem>

              <DropdownMenuSeparator />

              {(row.original.status === ProductStatusEnum.OFFICIAL ||
                row.original.status === ProductStatusEnum.PENDING) && (
                <DropdownMenuItem
                  className='text-red-500'
                  onClick={() => {
                    setRowAction({ row, type: 'update-status-inactive' })
                  }}
                >
                  <span className='w-full flex gap-2 items-center cursor-pointer'>
                    <GrRevert size={16} />
                    <span className='font-semibold'>Inactive</span>
                  </span>
                </DropdownMenuItem>
              )}

              {row.original.status === StatusEnum.INACTIVE && (
                <DropdownMenuItem
                  className='text-green-500'
                  onClick={() => {
                    setRowAction({ row, type: 'update-status-active' })
                  }}
                >
                  <span className='w-full flex gap-2 items-center cursor-pointer'>
                    <GrRevert size={16} />
                    <span className='font-semibold'>Active</span>
                  </span>
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        )
      },
      size: 40,
      enableSorting: false,
      enableHiding: false
    }
  ]
  if (showCount) {
    columns.splice(2, 0, {
      id: 'Suggestion Count',
      header: ({ column }) => <DataTableColumnHeader column={column} title='Number of Suggestions' />,
      cell: ({ cell }) => {
        const count = cell.row.original.productClassifications.length
          ? cell.row.original.productClassifications[0].count || 0
          : 0

        return <div className='text-center font-semibold'>{formatNumber(count)}</div>
      },
      enableSorting: false,
      enableHiding: false,
      size: 150
    })
  }
  return columns
}
