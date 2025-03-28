import { type ColumnDef, Row } from '@tanstack/react-table'
import { Ellipsis, Eye, FilePenLine, Image, SettingsIcon } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { DataTableColumnHeader } from '@/components/ui/data-table/data-table-column-header'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { Routes, routesConfig } from '@/configs/routes'
import { cn, formatDate } from '@/lib/utils'
import { PreOrderStatusEnum, TPreOrder } from '@/types/pre-order'

import { getStatusIcon } from './helper'

export interface DataTableRowAction<TData> {
  row: Row<TData>
  type: 'ban' | 'view' | 'publish'
}

interface GetColumnsProps {
  setRowAction: React.Dispatch<React.SetStateAction<DataTableRowAction<TPreOrder> | null>>
}

export function getColumns({ setRowAction }: GetColumnsProps): ColumnDef<TPreOrder>[] {
  return [
    // {
    //   id: 'select',
    //   header: ({ table }) => (
    //     <Checkbox
    //       className='-translate-x-2'
    //       checked={table.getIsAllPageRowsSelected() || (table.getIsSomePageRowsSelected() && 'indeterminate')}
    //       onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
    //       aria-label='Select all'
    //     />
    //   ),
    //   cell: ({ row }) => (
    //     <Checkbox
    //       checked={row.getIsSelected()}
    //       onCheckedChange={(value) => row.toggleSelected(!!value)}
    //       aria-label='Select row'
    //     />
    //   ),
    //   enableSorting: false,
    //   enableHiding: false,
    //   size: 20
    // },
    {
      id: 'product',
      header: ({ column }) => <DataTableColumnHeader column={column} title='Pre-Order Product' />,
      cell: ({ row }) => {
        const productName = row.original.product.name
        const image = row.original.product.images ? row.original.product.images[0].fileUrl : ''

        return (
          <div className='flex gap-1 items-center'>
            <Avatar className='rounded-lg'>
              <AvatarImage src={image} className='bg-transparent size-5' />
              <AvatarFallback className='bg-transparent'>
                <Image size={24} />
              </AvatarFallback>
            </Avatar>
            <span className='max-w-[31.25rem] truncate'>{productName}</span>
          </div>
        )
      },
      size: 600,
      enableHiding: false
    },
    {
      accessorKey: 'productClassifications',
      header: ({ column }) => <DataTableColumnHeader column={column} title='Classification | Quantity' />,
      cell: ({ row }) => {
        const classificationList = row.original.productClassifications
        return (
          <div className='flex items-center gap-1 flex-wrap capitalize font-normal'>
            {classificationList
              .map((classification) => `${classification.title} | ${classification.quantity}`)
              .join(', ')}
          </div>
        )
      },
      enableSorting: false,
      enableHiding: false,
      size: 300
    },
    {
      accessorKey: 'status',
      header: ({ column }) => <DataTableColumnHeader column={column} title='Status' />,
      cell: ({ row }) => {
        const statusKey = Object.keys(PreOrderStatusEnum).find((status) => {
          const value = PreOrderStatusEnum[status as keyof typeof PreOrderStatusEnum]
          return value === row.original.status
        })

        if (!statusKey) return null

        const statusValue = PreOrderStatusEnum[statusKey as keyof typeof PreOrderStatusEnum]

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
      size: 100,
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
          navigate(routesConfig[Routes.PRE_ORDER_DETAILS].getPath({ id: row.original.id }))
        }
        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button aria-label='Open menu' variant='ghost' className='flex size-8 p-0 data-[state=open]:bg-muted'>
                <Ellipsis className='size-4' aria-hidden='true' />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align='end' className='w-40'>
              <DropdownMenuItem
                onClick={() => setRowAction({ row, type: 'view' })}
                className='bg-blue-200 text-blue-500'
              >
                <span className='w-full flex gap-2 items-center cursor-pointer'>
                  <Eye size={16} strokeWidth={3} />
                  <span className='font-semibold'>View</span>
                </span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleNavigate} className='text-blue-500'>
                <span className='w-full flex gap-2 items-center cursor-pointer'>
                  <FilePenLine size={16} strokeWidth={3} />
                  <span className='font-semibold'>Edit</span>
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
