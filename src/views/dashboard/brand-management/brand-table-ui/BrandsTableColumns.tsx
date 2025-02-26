import { type ColumnDef, Row } from '@tanstack/react-table'
import { Ellipsis, EyeIcon, Pen, SettingsIcon, X, XIcon } from 'lucide-react'
import { GrRevert } from 'react-icons/gr'
import { Link } from 'react-router-dom'

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
import { Routes, routesConfig } from '@/configs/routes'
import { cn, formatDate } from '@/lib/utils'
import { BrandStatusEnum, TBrand } from '@/types/brand'

import { getStatusIcon } from './helper'

export interface DataTableRowAction<TData> {
  row: Row<TData>
  type: 'ban' | 'view' | 'unbanned' | 'update-status-active' | 'update-status-inactive' | 'deny'
}
interface GetColumnsProps {
  setRowAction: React.Dispatch<React.SetStateAction<DataTableRowAction<TBrand> | null>>
}
export function getColumns({ setRowAction }: GetColumnsProps): ColumnDef<TBrand>[] {
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
      size: 1
    },
    {
      id: 'index',
      accessorKey: 'STT',
      cell: ({ row }) => {
        return <span className='text-center'>{row.index + 1}</span>
      },
      size: 1
    },
    {
      id: 'brand',
      header: ({ column }) => <DataTableColumnHeader column={column} title='Brand Name' />,
      cell: ({ row }) => {
        const displayName = row.original.name
        const image = row.original.logo
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
      accessorKey: 'email',
      header: ({ column }) => <DataTableColumnHeader column={column} title='Email' />,
      cell: ({ cell }) => <div>{cell.row.original.email}</div>,
      size: 100,
      enableSorting: false,
      enableHiding: false
    },
    {
      accessorKey: 'phone',
      header: ({ column }) => <DataTableColumnHeader column={column} title='Phone' />,
      cell: ({ cell }) => <div>{cell.row.original.phone}</div>,
      size: 10,
      enableSorting: false,
      enableHiding: false
    },
    {
      accessorKey: 'address',
      header: ({ column }) => <DataTableColumnHeader column={column} title='Address' />,
      cell: ({ cell }) => <div>{cell.row.original.address}</div>,
      size: 10,
      enableSorting: false,
      enableHiding: false
    },
    {
      accessorKey: 'status',
      header: ({ column }) => <DataTableColumnHeader column={column} title='Status' />,
      cell: ({ row }) => {
        const statusKey = Object.keys(BrandStatusEnum).find((status) => {
          const value = BrandStatusEnum[status as keyof typeof BrandStatusEnum]
          return value === row.original.status
        })

        if (!statusKey) return null

        const statusValue = BrandStatusEnum[statusKey as keyof typeof BrandStatusEnum]

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
        }),
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
              <DropdownMenuItem>
                <Link to={routesConfig[Routes.UPDATE_BRAND].getPath(row.original.id)}>
                  <span className='w-full flex gap-2 items-center cursor-pointer'>
                    <Pen />
                    Update
                  </span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              {row.original.status !== BrandStatusEnum.BANNED && row.original.status !== BrandStatusEnum.PENDING && (
                <DropdownMenuItem
                  className='bg-red-500 text-white mb-2'
                  onClick={() => {
                    setRowAction({ row: row, type: 'ban' })
                  }}
                >
                  <span className='w-full flex gap-2 items-center cursor-pointer'>
                    <XIcon />
                    ban
                  </span>
                </DropdownMenuItem>
              )}

              {row.original.status == BrandStatusEnum.PENDING && (
                <>
                  <DropdownMenuItem
                    className='bg-green-500 text-white mb-2'
                    onClick={() => {
                      setRowAction({ row: row, type: 'update-status-active' })
                    }}
                  >
                    <span className='w-full flex gap-2 items-center cursor-pointer'>
                      <GrRevert />
                      Approve
                    </span>
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    className='bg-red-500/30 text-red-500/90 '
                    onClick={() => {
                      setRowAction({ row: row, type: 'deny' })
                    }}
                  >
                    <span className='w-full flex gap-2 items-center cursor-pointer'>
                      <X />
                      Deny
                    </span>
                  </DropdownMenuItem>
                </>
              )}

              {row.original.status == BrandStatusEnum.ACTIVE && (
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
              )}

              {row.original.status == BrandStatusEnum.INACTIVE && (
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
