import { type ColumnDef, Row } from '@tanstack/react-table'
import { Ellipsis, EyeIcon, SettingsIcon, XIcon } from 'lucide-react'
import { GrRevert } from 'react-icons/gr'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
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
import { cn, formatDate } from '@/lib/utils'
import { FlashSaleStatusEnum, TFlashSale } from '@/types/flash-sale'

import { getStatusIcon } from './helper'

export interface DataTableRowAction<TData> {
  row: Row<TData>
  type: 'ban' | 'view' | 'unbanned'
}
interface GetColumnsProps {
  setRowAction: React.Dispatch<React.SetStateAction<DataTableRowAction<TFlashSale> | null>>
}
export function getColumns({ setRowAction }: GetColumnsProps): ColumnDef<TFlashSale>[] {
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
      size: 100
    },
    {
      id: 'product',
      header: ({ column }) => <DataTableColumnHeader column={column} title='Display Name' />,
      cell: ({ row }) => {
        const displayName = row.original.product.name
        const image =
          'https://d2v5dzhdg4zhx3.cloudfront.net/web-assets/images/storypages/primary/ProductShowcasesampleimages/JPEG/Product+Showcase-1.jpg'
        return (
          <div className='flex space-x-2 items-center'>
            <Avatar className='size-10 object-cover aspect-square p-0.5 rounded-lg border bg-accent shadow-lg'>
              <AvatarImage src={image} />
              <AvatarFallback>{displayName[0].toUpperCase()}</AvatarFallback>
            </Avatar>
            <span className='max-w-[31.25rem] truncate'>{displayName}</span>
          </div>
        )
      }
    },
    {
      accessorKey: 'startTime',
      header: ({ column }) => <DataTableColumnHeader column={column} title='Start Time' />,
      cell: ({ cell }) => (
        <div>
          {formatDate(cell.getValue() as Date, {
            hour: 'numeric',
            minute: 'numeric'
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
            minute: 'numeric'
          })}
        </div>
      ),
      size: 200
    },

    {
      accessorKey: 'status',
      header: ({ column }) => <DataTableColumnHeader column={column} title='Status' />,
      cell: ({ row }) => {
        const statusKey = Object.keys(FlashSaleStatusEnum).find((status) => {
          const value = FlashSaleStatusEnum[status as keyof typeof FlashSaleStatusEnum]
          return value === row.original.status
        })

        if (!statusKey) return null

        const statusValue = FlashSaleStatusEnum[statusKey as keyof typeof FlashSaleStatusEnum]

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
      accessorKey: 'createdAt',
      header: ({ column }) => <DataTableColumnHeader column={column} title='Created At' />,
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
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button aria-label='Open menu' variant='ghost' className='flex size-8 p-0 data-[state=open]:bg-muted'>
                <Ellipsis className='size-4' aria-hidden='true' />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align='end' className='w-40'>
              <DropdownMenuItem
                onClick={() => {
                  setRowAction({ row: row, type: 'view' })
                }}
              >
                <span className='w-full flex gap-2 items-center cursor-pointer'>
                  <EyeIcon />
                  View Details
                </span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              {row.original.status !== FlashSaleStatusEnum.BANNED ? (
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
}
