import { type ColumnDef } from '@tanstack/react-table'
import { Ellipsis, FilePenLine, Image, SettingsIcon } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { DataTableColumnHeader } from '@/components/ui/data-table/data-table-column-header'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { Routes, routesConfig } from '@/configs/routes'
import useGrant from '@/hooks/useGrant'
import { formatDate } from '@/lib/utils'
import { RoleEnum } from '@/types/enum'
import { TPreOrder } from '@/types/pre-order'

import { PreOrderClassificationsCell } from './PreOrderClassificationsCell'
import { PreOrderStatusCell } from './PreOrderStatusCell'

export function getColumns(): ColumnDef<TPreOrder>[] {
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
          <div className='flex items-center gap-2'>
            <Avatar className='rounded-lg size-8'>
              <AvatarImage src={image} className='bg-transparent' />
              <AvatarFallback className='bg-transparent'>
                <Image size={20} />
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
        return <PreOrderClassificationsCell preOrder={row.original} />
      },
      enableSorting: false,
      enableHiding: false,
      size: 350
    },
    {
      accessorKey: 'status',
      header: ({ column }) => <DataTableColumnHeader column={column} title='Status' />,
      cell: ({ row }) => {
        return <PreOrderStatusCell preOrder={row.original} />
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
        const isGranted = useGrant([RoleEnum.MANAGER, RoleEnum.STAFF])

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
                  <span className='font-semibold'>{isGranted ? 'Edit' : 'View'}</span>
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
