import { type ColumnDef, Row } from '@tanstack/react-table'
import { Ellipsis, FilePenLine, Image, SettingsIcon } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { DataTableColumnHeader } from '@/components/ui/data-table/data-table-column-header'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { Routes, routesConfig } from '@/configs/routes'
import { formatDate } from '@/lib/utils'
import { TFlashSale } from '@/types/flash-sale'
import { formatNumber } from '@/utils/number'

import { FlashSaleClassificationsCell } from './FlashSaleClassificationsCell'
import { FlashSaleStatusCell } from './FlashSaleStatusCell'

export interface DataTableRowAction<TData> {
  row: Row<TData>
  type: 'ban' | 'view' | 'unbanned'
}

export function getColumns(): ColumnDef<TFlashSale>[] {
  return [
    {
      id: 'product',
      header: ({ column }) => <DataTableColumnHeader column={column} title='Flash Sale Product' />,
      cell: ({ row }) => {
        const productName = row.original.product.name
        const image = row.original.product.images ? row.original.product.images[0].fileUrl : ''

        return (
          <div className='flex gap-1 items-center'>
            <Avatar className='rounded-lg size-5 '>
              <AvatarImage src={image} className='bg-transparent size-5' />
              <AvatarFallback className='bg-transparent flex items-center justify-center'>
                <Image size={20} />
              </AvatarFallback>
            </Avatar>
            <span className='max-w-[31.25rem] truncate'>{productName}</span>
          </div>
        )
      },
      size: 220,
      enableHiding: false
    },
    {
      accessorKey: 'discount',
      header: ({ column }) => <DataTableColumnHeader column={column} title='Discount %' />,
      cell: ({ row }) => {
        return <div className='text-center font-bold'>{formatNumber(row.original.discount * 100, '%')}</div>
      }
    },
    {
      accessorKey: 'productClassifications',
      header: ({ column }) => <DataTableColumnHeader column={column} title='Classifications | Quantity' />,
      cell: ({ row }) => {
        return <FlashSaleClassificationsCell flashSale={row.original} />
      },
      enableSorting: false,
      enableHiding: false,
      size: 350
    },
    {
      accessorKey: 'status',
      header: ({ column }) => <DataTableColumnHeader column={column} title='Status' />,
      cell: ({ row }) => {
        return <FlashSaleStatusCell flashSale={row.original} />
      },
      size: 50,
      filterFn: (row, id, value) => {
        return Array.isArray(value) && value.includes(row.getValue(id))
      }
    },
    {
      accessorKey: 'startTime',
      header: ({ column }) => <DataTableColumnHeader column={column} title='Start Time' />,
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
      accessorKey: 'endTime',
      header: ({ column }) => <DataTableColumnHeader column={column} title='End Time' />,
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
        const navigate = useNavigate()
        const handleNavigate = () => {
          navigate(routesConfig[Routes.FLASH_SALE_DETAILS].getPath({ id: row.original.id }))
        }
        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button aria-label='Open menu' variant='ghost' className='flex size-8 p-0 data-[state=open]:bg-muted'>
                <Ellipsis className='size-4' aria-hidden='true' />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align='end' className='w-40'>
              <DropdownMenuItem onClick={handleNavigate} className='text-blue-500'>
                <span className='w-full flex gap-2 items-center cursor-pointer'>
                  <FilePenLine size={16} strokeWidth={3} />
                  <span className='font-semibold'>Edit</span>
                </span>
              </DropdownMenuItem>
              {/* <DropdownMenuSeparator />
              {row.original.status !== FlashSaleStatusEnum.INACTIVE ? (
                <DropdownMenuItem
                  className='bg-red-500 text-white'
                  onClick={() => {
                    setRowAction({ row: row, type: 'ban' })
                  }}
                >
                  <span className='w-full flex gap-2 items-center cursor-pointer'>
                    <XIcon />
                    Unpublish PreOrder
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
                    Publish PreOrder
                  </span>
                </DropdownMenuItem>
              )} */}
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
