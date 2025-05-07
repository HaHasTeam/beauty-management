import { type ColumnDef, Row } from '@tanstack/react-table'
import { Ellipsis, SettingsIcon, ShieldCheck, ShieldX, User, UserCheck } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

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
import useGrant from '@/hooks/useGrant'
import { cn, formatDate } from '@/lib/utils'
import { RoleEnum } from '@/types/enum'
import { UserRoleEnum } from '@/types/role'
import { TUser, UserStatusEnum } from '@/types/user'

import { getRoleIcon, getStatusIcon } from './helper'

export interface DataTableRowAction<TData> {
  row: Row<TData>
  type: 'ban' | 'view' | 'unbanned' | 'update-status-active'
}
interface GetColumnsProps {
  setRowAction: React.Dispatch<React.SetStateAction<DataTableRowAction<TUser> | null>>
}
export function getColumns({ setRowAction }: GetColumnsProps): ColumnDef<TUser>[] {
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
    //   size: 100
    // },
    {
      id: 'displayName',
      header: ({ column }) => <DataTableColumnHeader column={column} title='Display Name' />,
      cell: ({ row }) => {
        let displayName = 'Unknown User'

        if (row.original) {
          if (row.original.firstName || row.original.lastName) {
            displayName = `${row.original.firstName || ''} ${row.original.lastName || ''}`.trim()
          } else if (row.original.username) {
            displayName = row.original.username
          } else if (row.original.email) {
            displayName = row.original.email
          }
        }

        const initial = row.original.username ? row.original.username[0].toUpperCase() : '?'

        return (
          <div className='flex space-x-2 items-center'>
            <Avatar>
              <AvatarImage src={row.original.avatar} className='rounded-full border shadow-lg' />
              <AvatarFallback>{initial}</AvatarFallback>
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
    // {
    //   accessorKey: 'dob',
    //   header: ({ column }) => <DataTableColumnHeader column={column} title='Date Of Birth' />,
    //   cell: ({ cell }) => (
    //     <div>
    //       {' '}
    //       {formatDate(cell.getValue() as Date, {
    //         month: '2-digit'
    //       })}
    //     </div>
    //   ),
    //   size: 200
    // },
    {
      accessorKey: 'role',
      header: ({ column }) => <DataTableColumnHeader column={column} title='Member Role' />,
      cell: ({ row }) => {
        const roleKey = Object.keys(UserRoleEnum).find((role) => {
          const value = UserRoleEnum[role as keyof typeof UserRoleEnum]
          return value === row.original.role
        })

        if (!roleKey) return null

        const roleValue = UserRoleEnum[roleKey as keyof typeof UserRoleEnum]
        const Icon = getRoleIcon(roleValue)

        return (
          <Badge
            variant='outline'
            className={cn('flex items-center w-fit gap-1 px-2 py-1 border', Icon.bgColor, Icon.textColor)}
          >
            <Icon.icon className={cn('size-3.5', Icon.iconColor)} aria-hidden='true' />
            <span className='capitalize whitespace-nowrap'>{roleValue.toLowerCase()}</span>
          </Badge>
        )
      },
      size: 100
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
          <Badge
            variant='outline'
            className={cn('flex items-center w-fit gap-1 px-2 py-1 border', Icon.bgColor, Icon.textColor)}
          >
            <Icon.icon className={cn('size-3.5', Icon.iconColor)} aria-hidden='true' />
            <span className='capitalize whitespace-nowrap'>{statusValue.toLowerCase()}</span>
          </Badge>
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
      cell: ({ cell }) =>
        formatDate(cell.getValue() as Date, {
          hour: 'numeric',
          minute: 'numeric',
          month: '2-digit'
        })
    },
    {
      id: 'actions',
      header: () => <SettingsIcon className='-translate-x-1' />,
      cell: function Cell({ row }) {
        const user = row.original
        const navigate = useNavigate()
        const handleViewDetails = () => {
          const path = routesConfig[Routes.ACCOUNT_DETAILS].getPath({ id: user.id })
          navigate(path)
        }

        const isGrant = useGrant([RoleEnum.ADMIN, RoleEnum.OPERATOR, RoleEnum.MANAGER])

        return (
          <div className='flex justify-end'>
            <DropdownMenu modal={false}>
              <DropdownMenuTrigger asChild>
                <Button variant='ghost' className='h-8 w-8 p-0'>
                  <span className='sr-only'>Open menu</span>
                  <Ellipsis className='h-4 w-4' />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align='end'>
                <DropdownMenuItem onClick={handleViewDetails}>
                  <User className='mr-2 h-4 w-4' aria-hidden='true' />
                  Explore Account
                </DropdownMenuItem>

                {(user.status === UserStatusEnum.INACTIVE || user.status === UserStatusEnum.PENDING) && isGrant && (
                  <>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      className='text-green-500'
                      onClick={() => {
                        setRowAction({ row: row, type: 'update-status-active' })
                      }}
                    >
                      <span className='w-full flex gap-2 items-center cursor-pointer'>
                        <UserCheck className='h-4 w-4' />
                        <span className='font-semibold'>Activate Account</span>
                      </span>
                    </DropdownMenuItem>
                  </>
                )}

                <DropdownMenuSeparator />

                {user.status !== UserStatusEnum.BANNED
                  ? isGrant && (
                      <DropdownMenuItem
                        className='text-red-500'
                        onClick={() => {
                          setRowAction({ row: row, type: 'ban' })
                        }}
                      >
                        <span className='w-full flex gap-2 items-center cursor-pointer'>
                          <ShieldX className='h-4 w-4' />
                          <span className='font-semibold'>Ban Account</span>
                        </span>
                      </DropdownMenuItem>
                    )
                  : isGrant && (
                      <DropdownMenuItem
                        className='text-green-500'
                        onClick={() => {
                          setRowAction({ row: row, type: 'unbanned' })
                        }}
                      >
                        <span className='w-full flex gap-2 items-center cursor-pointer'>
                          <ShieldCheck className='h-4 w-4' />
                          <span className='font-semibold'>Unban Account</span>
                        </span>
                      </DropdownMenuItem>
                    )}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        )
      },
      size: 40,
      enableSorting: false,
      enableHiding: false
    }
  ]
}
