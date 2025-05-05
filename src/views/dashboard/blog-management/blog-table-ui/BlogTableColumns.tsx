'use client'

import { type ColumnDef, Row } from '@tanstack/react-table'
import i18next, { t } from 'i18next'
import { Ellipsis, EyeIcon, Pen, SettingsIcon } from 'lucide-react'
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
import { IBlogDetails } from '@/types/blog'
import { BlogTypeEnum } from '@/types/enum'

import { BlogStatusCell } from './BlogStatusCell'

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
      id: 'title',
      header: ({ column }) => <DataTableColumnHeader column={column} title={i18next.t('createBlog.title')} />,
      cell: ({ row }) => {
        const title = row.original.title ?? ''
        return <div className='line-clamp-1 overflow-ellipsis'>{title}</div>
      },
      size: 500
    },
    {
      id: 'author',
      header: ({ column }) => <DataTableColumnHeader column={column} title={i18next.t('createBlog.author')} />,
      cell: ({ row }) => {
        const author = row.original.author
        let name = 'Unknown User'
        const email = author?.email || 'No Email'

        if (author) {
          if (author.username) {
            name = author.username
          } else if (author.firstName || author.lastName) {
            name = `${author.firstName || ''} ${author.lastName || ''}`.trim()
          } else if (author.email) {
            name = author.email
          }
        }

        const initial = name ? name.charAt(0).toUpperCase() : '?'
        const avatarUrl = author?.avatar || ''

        return (
          <div className='flex gap-2 items-center'>
            <Avatar className='rounded-full'>
              <AvatarImage src={avatarUrl} className='size-5' />
              <AvatarFallback>{initial}</AvatarFallback>
            </Avatar>
            <div className='flex flex-col'>
              <span className='max-w-[31.25rem] truncate font-medium'>{name}</span>
              {author?.email && author.email !== name && (
                <span className='text-xs text-muted-foreground truncate max-w-[31.25rem]'>{email}</span>
              )}
            </div>
          </div>
        )
      },
      size: 280
    },

    {
      accessorKey: 'status',
      header: ({ column }) => <DataTableColumnHeader column={column} title={t('createBlog.status')} />,
      cell: ({ row }) => <BlogStatusCell status={row.original.status} />,
      size: 150,
      filterFn: (row, id, value) => {
        return Array.isArray(value) && value.includes(row.getValue(id))
      }
    },
    {
      id: 'tag',
      header: ({ column }) => <DataTableColumnHeader column={column} title={i18next.t('createBlog.tag')} />,
      cell: ({ row }) => {
        const tag = row.original.tag ?? ''
        return <div className='line-clamp-1 overflow-ellipsis'>{tag}</div>
      },
      size: 200
    },
    {
      id: 'type',
      header: ({ column }) => <DataTableColumnHeader column={column} title={i18next.t('createBlog.type')} />,
      cell: ({ row }) => {
        const type = row.original.type ?? ''
        return (
          <Badge variant={type === BlogTypeEnum.BLOG ? 'default' : 'secondary'} className='shrink-0'>
            {type === BlogTypeEnum.BLOG ? t('createBlog.blog') : t('createBlog.condition')}
          </Badge>
        )
      },
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
