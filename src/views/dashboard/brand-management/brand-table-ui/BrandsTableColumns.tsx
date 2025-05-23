import { type ColumnDef, Row } from '@tanstack/react-table'
import {
  Ban,
  CalendarCheck,
  EyeIcon,
  FileText,
  Image,
  MoreVertical,
  Pen,
  Power,
  PowerOff,
  SettingsIcon,
  User,
  UserPlus
} from 'lucide-react'
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
import { cn, formatDate } from '@/lib/utils'
import { BrandStatusEnum, TBrand } from '@/types/brand'

import { getStatusInfo } from './helper'

export interface DataTableRowAction<TData> {
  row: Row<TData>
  type:
    | 'ban'
    | 'view'
    | 'unbanned'
    | 'update-status-active'
    | 'update-status-inactive'
    | 'deny'
    | 'update-status-pre-approved-for-meeting'
    | 'update-status-needs-additional-documents'
    | 'update-status-pending-review'
    | 'assign-operator'
}
interface GetColumnsProps {
  setRowAction: React.Dispatch<React.SetStateAction<DataTableRowAction<TBrand> | null>>
  isAdmin: boolean
}
export function getColumns({ setRowAction, isAdmin }: GetColumnsProps): ColumnDef<TBrand>[] {
  // Define base columns that are always shown
  const baseColumns: ColumnDef<TBrand>[] = [
    {
      id: 'name',
      header: ({ column }) => <DataTableColumnHeader column={column} title='Brand Name' />,
      cell: ({ row }) => {
        const displayName = row.original.name ?? 'brand'
        const image = row.original.logo
        return (
          <div className='flex gap-1 items-center'>
            <Avatar className='rounded-lg mr-2'>
              <AvatarImage src={image} className='bg-transparent  aspect-square' />
              <AvatarFallback className='bg-transparent'>
                <Image size={24} />
              </AvatarFallback>
            </Avatar>
            <span className='max-w-[31.25rem]  truncate'>{displayName}</span>
          </div>
        )
      },
      size: 100
    },
    {
      accessorKey: 'email',
      header: ({ column }) => <DataTableColumnHeader column={column} title='Email' />,
      cell: ({ cell }) => <div>{cell.row.original.email}</div>,
      size: 10,
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
      enableSorting: false,
      enableHiding: false,
      size: 450
    },
    {
      accessorKey: 'status',
      header: () => <span>Status</span>,
      cell: ({ row }) => {
        const status = row.original.status

        // Check if status is a valid BrandStatusEnum value
        if (!Object.values(BrandStatusEnum).includes(status)) {
          return null
        }

        const statusInfo = getStatusInfo(status)
        const Icon = statusInfo.icon

        return (
          <Badge
            variant='outline'
            className={cn('flex items-center gap-2 whitespace-nowrap w-fit', statusInfo.bgColor, statusInfo.textColor)}
          >
            <Icon className={cn('size-4', statusInfo.iconColor)} aria-hidden='true' />
            <span>{statusInfo.label}</span>
          </Badge>
        )
      },
      size: 50,
      filterFn: (row, id, value) => {
        return Array.isArray(value) && value.includes(row.getValue(id))
      }
    },
    {
      accessorKey: 'createdAt',
      header: () => <span>Created At</span>,
      cell: ({ cell }) => (
        <div>
          {formatDate(cell.getValue() as Date, {
            hour: 'numeric',
            minute: 'numeric',
            month: '2-digit'
          })}
        </div>
      ),
      size: 30
    },
    {
      id: 'actions',
      header: () => <SettingsIcon className='-translate-x-1' />,
      cell: function Cell({ row }) {
        const currentStatus = row.original.status

        const menuItems = [
          {
            label: 'View Details',
            icon: EyeIcon,
            action: () => setRowAction({ row: row, type: 'view' }),
            showAlways: true
          },
          {
            label: 'Update',
            icon: Pen,
            link: routesConfig[Routes.UPDATE_BRAND].getPath(row.original.id),
            showAlways: false
          },
          {
            label: 'Assign Operator',
            icon: UserPlus,
            action: () => setRowAction({ row: row, type: 'assign-operator' }),
            className: 'bg-blue-500 text-white hover:bg-blue-600',
            showAlways: isAdmin && !row.original.reviewer
          },
          {
            label: 'Ban',
            icon: Ban,
            action: () => setRowAction({ row: row, type: 'ban' }),
            className: 'bg-red-500 text-white hover:bg-red-600',
            show: currentStatus === BrandStatusEnum.ACTIVE
          },
          {
            label: 'Activate',
            icon: Power,
            action: () => setRowAction({ row: row, type: 'update-status-active' }),
            className: 'bg-green-500 text-white hover:bg-green-600',
            show:
              currentStatus === BrandStatusEnum.INACTIVE || currentStatus === BrandStatusEnum.PRE_APPROVED_FOR_MEETING
          },
          {
            label: 'Deny',
            icon: Power,
            action: () => setRowAction({ row: row, type: 'deny' }),
            className: 'bg-red-300 text-white hover:bg-red-300',
            show: currentStatus === BrandStatusEnum.PRE_APPROVED_FOR_MEETING
          },
          {
            label: 'Deactivate',
            icon: PowerOff,
            action: () => setRowAction({ row: row, type: 'update-status-inactive' }),
            className: 'bg-yellow-500 text-white hover:bg-yellow-600',
            show: currentStatus === BrandStatusEnum.ACTIVE
          },
          {
            label: 'Approve for Meeting',
            icon: CalendarCheck,
            action: () => setRowAction({ row: row, type: 'update-status-pre-approved-for-meeting' }),
            className: 'bg-blue-500 text-white hover:bg-blue-600',
            show: currentStatus === BrandStatusEnum.PENDING_REVIEW
          },
          {
            label: 'Request Documents',
            icon: FileText,
            action: () => setRowAction({ row: row, type: 'update-status-needs-additional-documents' }),
            className: 'bg-amber-500 text-white hover:bg-amber-600',
            show: currentStatus === BrandStatusEnum.PENDING_REVIEW
          }
          // {
          //   label: 'Set to Pending Review',
          //   icon: AlertCircle,
          //   action: () => setRowAction({ row: row, type: 'update-status-pending-review' }),
          //   className: 'bg-purple-500 text-white hover:bg-purple-600',
          //   show: currentStatus !== BrandStatusEnum.PENDING_REVIEW
          // }
        ]

        return (
          <DropdownMenu modal={false}>
            <DropdownMenuTrigger asChild>
              <Button aria-label='Open menu' variant='ghost' className='flex size-8 p-0 data-[state=open]:bg-muted'>
                <MoreVertical className='size-4' aria-hidden='true' />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align='end' className='w-56 space-y-1'>
              {menuItems.map((item, index) => {
                if (item.showAlways || item.show) {
                  return (
                    <DropdownMenuItem
                      key={index}
                      className={`px-3 py-2 text-sm ${item.className || ''}`}
                      onClick={item.action}
                    >
                      {item.link ? (
                        <Link to={item.link} className='w-full flex items-center gap-2'>
                          <item.icon className='size-4' />
                          {item.label}
                        </Link>
                      ) : (
                        <span className='w-full flex items-center gap-2'>
                          <item.icon className='size-4' />
                          {item.label}
                        </span>
                      )}
                    </DropdownMenuItem>
                  )
                }
                return index === 1 ? <DropdownMenuSeparator key={`separator-${index}`} className='my-1' /> : null
              })}
            </DropdownMenuContent>
          </DropdownMenu>
        )
      },
      size: 30,
      enableSorting: false,
      enableHiding: false
    }
  ]

  // Define the reviewer column
  const reviewerColumn: ColumnDef<TBrand> = {
    id: 'reviewer',
    header: ({ column }) => <DataTableColumnHeader column={column} title='Operator' />,
    cell: ({ row }) => {
      const reviewer = row.original.reviewer

      if (!reviewer) {
        return <div className='text-muted-foreground'>--</div>
      }

      return (
        <div className='flex items-center gap-2'>
          <Avatar className='h-8 w-8'>
            <AvatarFallback>
              <User className='h-4 w-4' />
            </AvatarFallback>
          </Avatar>
          <div className='flex flex-col'>
            <span className='font-medium'>{reviewer.username}</span>
            <span className='text-xs text-muted-foreground'>{reviewer.email}</span>
          </div>
        </div>
      )
    },
    size: 200,
    enableSorting: false,
    enableHiding: false
  }

  // If user is admin, insert the reviewer column after the address column (index 3)
  if (isAdmin) {
    baseColumns.splice(4, 0, reviewerColumn)
  }

  return baseColumns
}
