import { type ColumnDef, Row } from '@tanstack/react-table'
import {
  Ban,
  CalendarCheck,
  EyeIcon,
  FileText,
  MoreVertical,
  Pen,
  Power,
  PowerOff,
  SettingsIcon,
  UserPlus
} from 'lucide-react'
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
        const displayName = row.original.name ?? 'brand'
        const image = row.original.logo
        return (
          <div className='flex space-x-2 items-center'>
            <Avatar className='size-10 object-cover aspect-square p-0.5 rounded-lg border bg-accent shadow-lg'>
              <AvatarImage src={image} />
              <AvatarFallback>{displayName[0].toUpperCase()}</AvatarFallback>
            </Avatar>
            <span className='max-w-[30.25rem] truncate'>{displayName}</span>
          </div>
        )
      }
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
      size: 10,
      enableSorting: false,
      enableHiding: false
    },
    {
      accessorKey: 'status',
      header: ({ column }) => <DataTableColumnHeader column={column} title='Status' />,
      cell: ({ row }) => {
        const status = row.original.status

        // Check if status is a valid BrandStatusEnum value
        if (!Object.values(BrandStatusEnum).includes(status)) {
          return null
        }

        const statusInfo = getStatusInfo(status)
        const Icon = statusInfo.icon

        return (
          <div
            className={cn(
              'flex items-center font-medium px-2 py-1 rounded-3xl shadow-xl w',
              statusInfo.textColor,
              statusInfo.bgColor
            )}
          >
            <Icon
              className={cn('mr-2 size-7 p-0.5 rounded-full animate-pulse', statusInfo.iconColor)}
              aria-hidden='true'
            />
            <span>{statusInfo.label}</span>
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
            showAlways: true
          },
          {
            label: 'Assign Operator',
            icon: UserPlus,
            action: () => setRowAction({ row: row, type: 'assign-operator' }),
            className: 'bg-blue-500 text-white hover:bg-blue-600',
            showAlways: isAdmin
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
      size: 40,
      enableSorting: false,
      enableHiding: false
    }
  ]
}
