import { type ColumnDef, Row } from '@tanstack/react-table'
import i18next, { t } from 'i18next'
import { Ellipsis, EyeIcon, Pen, SettingsIcon } from 'lucide-react'
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
import { IBlogDetails } from '@/types/blog'
import { getDisplayString } from '@/utils/string'

import { getStatusIcon } from './helper'

export interface DataTableRowAction<TData> {
  row: Row<TData>
  type: 'ban' | 'view' | 'unbanned' | 'assign' | 'resolve'
}
// interface GetColumnsProps {
//   setRowAction: React.Dispatch<React.SetStateAction<DataTableRowAction<IBlogDetails> | null>>
// }
export function getColumns(): ColumnDef<IBlogDetails>[] {
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
      header: ({ column }) => <DataTableColumnHeader column={column} title={i18next.t('createBlog.title')} />,
      cell: ({ row }) => {
        const title = row.original.title ?? ''
        return <div>{title}</div>
      },
      size: 200
    },
    {
      id: 'author',
      header: ({ column }) => <DataTableColumnHeader column={column} title={i18next.t('createBlog.author')} />,
      cell: ({ row }) => {
        const author = row.original.author.username ?? ''
        return <div>{author}</div>
      },
      size: 200
    },

    {
      accessorKey: 'status',
      header: ({ column }) => <DataTableColumnHeader column={column} title={t('createBlog.status')} />,
      cell: ({ row }) => {
        const statusValue = row.original.status

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
      size: 30,
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
        return (
          <DropdownMenu modal={false}>
            <DropdownMenuTrigger asChild>
              <Button aria-label='Open menu' variant='ghost' className='flex size-8 p-0 data-[state=open]:bg-muted'>
                <Ellipsis className='size-4' aria-hidden='true' />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align='end' className='w-40'>
              <DropdownMenuItem>
                <Link
                  to={routesConfig[Routes.BLOG_DETAILS].getPath({
                    id: row.original.id
                  })}
                >
                  <span className='w-full flex gap-2 items-center cursor-pointer'>
                    <EyeIcon />
                    {i18next.t('button.viewDetails')}
                  </span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Link
                  to={routesConfig[Routes.UPDATE_BLOG].getPath({
                    id: row.original.id
                  })}
                >
                  <span className='w-full flex gap-2 items-center cursor-pointer'>
                    <Pen />
                    {i18next.t('button.update')}
                  </span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />

              {/* {(row.original.status == ProductStatusEnum.OFFICIAL ||
                row.original.status == ProductStatusEnum.PENDING) && (
                <DropdownMenuItem
                  className='bg-red-500/30 text-white '
                  onClick={() => {
                    setRowAction({ row: row, type: 'update-status-inactive' })
                  }}
                >
                  <span className='w-full flex gap-2 items-center cursor-pointer'>
                    <GrRevert />
                    Inactive
                  </span>
                </DropdownMenuItem>
              )} */}

              {/* {row.original.status == StatusEnum.INACTIVE && (
                <DropdownMenuItem
                  className='bg-green-500/10 text-white mb-2'
                  onClick={() => {
                    setRowAction({ row: row, type: 'update-status-active' })
                  }}
                >
                  <span className='w-full flex gap-2 items-center cursor-pointer'>
                    <GrRevert />
                    Active
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
