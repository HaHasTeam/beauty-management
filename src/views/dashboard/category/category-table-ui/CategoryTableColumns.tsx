import { type ColumnDef, Row } from '@tanstack/react-table'
import { Ellipsis, FilePenLine, SettingsIcon } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

import { Button } from '@/components/ui/button'
import { DataTableColumnHeader } from '@/components/ui/data-table/data-table-column-header'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { Routes, routesConfig } from '@/configs/routes'
import { cn, formatDate } from '@/lib/utils'
import { CategoryStatusEnum, ICategory } from '@/types/category'
import { getDisplayString } from '@/utils/string'

import { getStatusIcon } from './helper'

export interface DataTableRowAction<TData> {
  row: Row<TData>
  type: 'ban' | 'view' | 'unbanned'
}

export function getColumns(): ColumnDef<ICategory>[] {
  return [
    {
      id: 'name',
      header: ({ column }) => <DataTableColumnHeader column={column} title='Category' />,
      cell: ({ row }) => {
        const displayName = row.original.name

        return (
          <div className='flex space-x-2 items-center'>
            <span className='max-w-[31.25rem] truncate'>{displayName}</span>
          </div>
        )
      },
      size: 800
    },
    {
      id: 'level',
      header: ({ column }) => <DataTableColumnHeader column={column} title='Level' />,
      cell: ({ row }) => {
        const level = row.original.level

        return (
          <div className='flex space-x-2 items-center justify-center'>
            <span className='max-w-[31.25rem] truncate'>{level}</span>
          </div>
        )
      },
      size: 100
    },
    {
      accessorKey: 'status',
      header: ({ column }) => <DataTableColumnHeader column={column} title='Status' />,
      cell: ({ row }) => {
        const statusKey = Object.keys(CategoryStatusEnum).find((status) => {
          const value = CategoryStatusEnum[status as keyof typeof CategoryStatusEnum]
          return value === row.original.status
        })

        if (!statusKey) return null

        const statusValue = CategoryStatusEnum[statusKey as keyof typeof CategoryStatusEnum]

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
      size: 100,
      filterFn: (row, id, value) => {
        return Array.isArray(value) && value.includes(row.getValue(id))
      }
    },
    {
      id: 'level',
      header: ({ column }) => <DataTableColumnHeader column={column} title='Level' />,
      cell: ({ row }) => {
        const level = row.original.level

        return (
          <div className='flex space-x-2 items-center justify-center'>
            <span className='max-w-[31.25rem] truncate'>{level}</span>
          </div>
        )
      },
      size: 100
    },
    {
      accessorKey: 'status',
      header: ({ column }) => <DataTableColumnHeader column={column} title='Status' />,
      cell: ({ row }) => {
        const statusKey = Object.keys(CategoryStatusEnum).find((status) => {
          const value = CategoryStatusEnum[status as keyof typeof CategoryStatusEnum]
          return value === row.original.status
        })

        if (!statusKey) return null

        const statusValue = CategoryStatusEnum[statusKey as keyof typeof CategoryStatusEnum]

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
      size: 100,
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
      )
    },
    {
      id: 'actions',
      header: () => <SettingsIcon className='-translate-x-1' />,
      cell: function Cell({ row }) {
        const navigate = useNavigate()
        const handleNavigate = () => {
          navigate(routesConfig[Routes.CATEGORY_DETAILS].getPath({ id: row.original.id }))
        }

        return (
          <DropdownMenu modal={false}>
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
