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
import { UserRoleEnum } from '@/types/role'
import { TUser, UserStatusEnum } from '@/types/user'

import { getRoleIcon, getStatusIcon } from './helper'

export interface DataTableRowAction<TData> {
  row: Row<TData>
  type: 'ban' | 'view' | 'unbanned'
}
interface GetColumnsProps {
  setRowAction: React.Dispatch<React.SetStateAction<DataTableRowAction<TUser> | null>>
}
export function getColumns({ setRowAction }: GetColumnsProps): ColumnDef<TUser>[] {
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
      id: 'displayName',
      header: ({ column }) => <DataTableColumnHeader column={column} title='Display Name' />,
      cell: ({ row }) => {
        const displayName =
          row.original.firstName || row.original.lastName ? `${row.original.firstName} ${row.original.lastName}` : ''
        return (
          <div className='flex space-x-2 items-center'>
            <Avatar className='size-10 object-cover aspect-square p-0.5 rounded-lg border bg-accent shadow-lg'>
              <AvatarImage src={row.original.avatar} />
              <AvatarFallback>{row.original.username[0].toUpperCase()}</AvatarFallback>
            </Avatar>
            <span className='max-w-[31.25rem] truncate'>{displayName}</span>
          </div>
        )
      }
    },
    {
      accessorKey: 'username',
      header: ({ column }) => <DataTableColumnHeader column={column} title='Username' />,
      cell: ({ row }) => <div>{row.getValue('username')}</div>,
      enableHiding: false
    },
    {
      accessorKey: 'email',
      header: ({ column }) => <DataTableColumnHeader column={column} title='Email' />,
      cell: ({ row }) => {
        return (
          <div className='flex space-x-2'>
            <span className='max-w-[31.25rem] truncate'>{row.getValue('email')}</span>
          </div>
        )
      }
    },
    {
      accessorKey: 'phone',
      header: ({ column }) => <DataTableColumnHeader column={column} title='Phone' />,
      cell: ({ row }) => {
        return (
          <div className='flex space-x-2'>
            <span className='max-w-[31.25rem] truncate'>{row.getValue('phone')}</span>
          </div>
        )
      }
    },
    {
      accessorKey: 'dob',
      header: ({ column }) => <DataTableColumnHeader column={column} title='Date Of Birth' />,
      cell: ({ cell }) => <div>{formatDate(cell.getValue() as Date)}</div>,
      size: 200
    },
    {
      accessorKey: 'role',
      header: ({ column }) => <DataTableColumnHeader column={column} title='Coworker Role' />,
      cell: ({ row }) => {
        const roleKey = Object.keys(UserRoleEnum).find((role) => {
          const value = UserRoleEnum[role as keyof typeof UserRoleEnum]
          return value === row.original.role
        })

        if (!roleKey) return null

        const roleValue = UserRoleEnum[roleKey as keyof typeof UserRoleEnum]
        const Icon = getRoleIcon(roleValue)
        return (
          <div className='flex items-center'>
            <Icon.icon className='mr-2 size-4 text-muted-foreground' aria-hidden='true' />
            <span className='capitalize'>{roleValue}</span>
          </div>
        )
      },
      filterFn: (row, id, value) => {
        return Array.isArray(value) && value.includes(row.getValue(id))
      }
    },
    {
      accessorKey: 'status',
      header: ({ column }) => <DataTableColumnHeader column={column} title='Status' />,
      cell: ({ row }) => {
        const statusKey = Object.keys(UserStatusEnum).find((status) => {
          const value = UserStatusEnum[status as keyof typeof UserStatusEnum]
          return value === row.original.status
        })

        if (!statusKey) return null

        const statusValue = UserStatusEnum[statusKey as keyof typeof UserStatusEnum]

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
              {row.original.status !== UserStatusEnum.BANNED ? (
                <DropdownMenuItem
                  className='bg-red-500 text-white'
                  onClick={() => {
                    setRowAction({ row: row, type: 'ban' })
                  }}
                >
                  <span className='w-full flex gap-2 items-center cursor-pointer'>
                    <XIcon />
                    Ban User
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
                    Unbanned User
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
