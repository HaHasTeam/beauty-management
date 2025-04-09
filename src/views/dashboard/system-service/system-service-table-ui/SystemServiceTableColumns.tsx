import { type ColumnDef, Row } from '@tanstack/react-table'
import { Ellipsis, EyeIcon, FilePenLine, Image, SettingsIcon } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

import SystemServiceTypeTag from '@/components/system-service/SystemServiceTypeTag'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { DataTableColumnHeader } from '@/components/ui/data-table/data-table-column-header'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { Routes, routesConfig } from '@/configs/routes'
import { cn, formatDate } from '@/lib/utils'
import { ISystemService, SystemServiceStatusEnum } from '@/types/system-service'
import { getDisplayString } from '@/utils/string'

import { getStatusIcon } from './helper'

export interface DataTableRowAction<TData> {
  row: Row<TData>
  type: 'ban' | 'view' | 'unbanned'
}
// interface GetColumnsProps {
//   setRowAction: React.Dispatch<React.SetStateAction<DataTableRowAction<ISystemService> | null>>
// }
export function getColumns(): ColumnDef<ISystemService>[] {
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
      size: 40
    },
    {
      id: 'title',
      header: ({ column }) => <DataTableColumnHeader column={column} title='Service' />,
      cell: ({ row }) => {
        const displayName = row.original.name
        const imageUrl = row.original.images[0]?.fileUrl

        return (
          <div className='flex space-x-2 items-center'>
            <Avatar className='bg-transparent size-10 object-cover aspect-square p-0.5 rounded-lg border shadow-lg'>
              <AvatarImage src={imageUrl} />
              <AvatarFallback className='bg-transparent'>
                <Image className='size-6' />
              </AvatarFallback>
            </Avatar>
            <span className='max-w-[31.25rem] truncate'>{displayName}</span>
          </div>
        )
      },
      size: 400
    },
    {
      accessorKey: 'type',
      header: ({ column }) => <DataTableColumnHeader column={column} title='Type' />,
      cell: ({ row }) => {
        const type = row.original.type
        return (
          <div className='w-full text-center'>
            <SystemServiceTypeTag type={type} size='small' />
          </div>
        )
      }
    },
    {
      id: 'category',
      header: ({ column }) => <DataTableColumnHeader column={column} title='Category' />,
      cell: ({ row }) => {
        const category = row.original.category
        return <div className='text-center'>{category.name}</div>
      },
      size: 200
    },
    {
      accessorKey: 'status',
      header: ({ column }) => <DataTableColumnHeader column={column} title='Status' />,
      cell: ({ row }) => {
        const statusKey = Object.keys(SystemServiceStatusEnum).find((status) => {
          const value = SystemServiceStatusEnum[status as keyof typeof SystemServiceStatusEnum]
          return value === row.original.status
        })

        if (!statusKey) return null

        const statusValue = SystemServiceStatusEnum[statusKey as keyof typeof SystemServiceStatusEnum]

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
            <span className='capitalize text-nowrap'>{getDisplayString(statusValue)}</span>
          </div>
        )
      },
      size: 150,
      filterFn: (row, id, value) => {
        return Array.isArray(value) && value.includes(row.getValue(id))
      }
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
        const navigate = useNavigate()
        const handleNavigate = () => {
          navigate(routesConfig[Routes.UPDATE_SYSTEM_SERVICE].getPath({ id: row.original.id }))
        }
        const handleNavigateDetail = () => {
          navigate(routesConfig[Routes.SYSTEM_SERVICE_DETAILS].getPath({ id: row.original.id }))
        }
        return (
          <DropdownMenu modal={false}>
            <DropdownMenuTrigger asChild>
              <Button aria-label='Open menu' variant='ghost' className='flex size-8 p-0 data-[state=open]:bg-muted'>
                <Ellipsis className='size-4' aria-hidden='true' />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align='end' className='w-40'>
              <DropdownMenuItem onClick={handleNavigateDetail}>
                <EyeIcon className='mr-2 size-4' />
                View details
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleNavigate} className='bg-blue-200 text-blue-500'>
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
