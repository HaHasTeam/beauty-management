import { type ColumnDef, Row } from '@tanstack/react-table'
import {
  CalendarDays,
  CheckCircle2,
  CircleMinus,
  Clock,
  Ellipsis,
  Eye,
  Mail,
  Package,
  Phone,
  SettingsIcon
} from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { DataTableColumnHeader } from '@/components/ui/data-table/data-table-column-header'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { Routes, routesConfig } from '@/configs/routes'
import { formatDate } from '@/lib/utils'
import { GroupBuyingStatusEnum, TGroupBuying } from '@/types/group-buying'

// Import GroupProductStrategyCell
import { GroupProductStrategyCell } from '../../group-product/group-product-table-ui/GroupProductStrategyCell'

export interface DataTableRowAction<TData> {
  row: Row<TData>
  type: 'ban' | 'view' | 'publish'
}

export function getColumns(): ColumnDef<TGroupBuying>[] {
  return [
    {
      accessorKey: 'creator',
      header: ({ column }) => <DataTableColumnHeader column={column} title='Group Creator' />,
      cell: ({ row }) => {
        const account = row.original.creator
        if (!account) return null
        const displayName = [account.firstName, account.lastName].filter(Boolean).join(' ') || account.username
        const fallbackInitial = (account.firstName?.[0] ?? account.username?.[0] ?? '?').toUpperCase()
        const phone = account.phone || 'N/A'
        const email = account.email || 'N/A'

        return (
          <div className='flex items-start gap-2 py-1'>
            <Avatar className='rounded-full size-9'>
              <AvatarImage src={account.avatar} className='bg-transparent size-9' />
              <AvatarFallback className='bg-muted text-sm'>{fallbackInitial}</AvatarFallback>
            </Avatar>
            <div className='flex flex-col gap-0.5'>
              <span className='font-medium truncate max-w-[180px]'>{displayName}</span>
              <div className='flex items-center gap-1 text-muted-foreground'>
                <Phone className='h-3 w-3 flex-shrink-0' />
                <span className='text-xs truncate'>{phone}</span>
              </div>
              <div className='flex items-center gap-1 text-muted-foreground'>
                <Mail className='h-3 w-3 flex-shrink-0' />
                <span className='text-xs truncate'>{email}</span>
              </div>
            </div>
          </div>
        )
      },
      enableHiding: false,
      size: 250
    },
    {
      accessorKey: 'groupProduct',
      header: ({ column }) => <DataTableColumnHeader column={column} title='Group Product / Strategy' />,
      cell: ({ row }) => {
        const groupProduct = row.original.groupProduct
        if (!groupProduct) {
          return <span className='text-xs italic text-muted-foreground'>No linked product</span>
        }
        const name = groupProduct.name

        return (
          <div className='flex flex-col gap-1.5 py-1'>
            {/* Name Link */}

            {/* Strategy Cell Component */}
            <GroupProductStrategyCell
              groupProduct={groupProduct}
              preFix={
                <Link
                  to={routesConfig[Routes.GROUP_PRODUCT_DETAILS].getPath({ id: groupProduct.id })}
                  className='flex items-center gap-1.5 font-medium hover:underline hover:text-primary w-fit italic text-sm'
                  onClick={(e) => e.stopPropagation()}
                >
                  <Package className='h-3.5 w-3.5 flex-shrink-0 text-primary/80' />
                  <span className='truncate max-w-[350px]'>{name}</span>
                </Link>
              }
            />
          </div>
        )
      },
      enableHiding: false,
      size: 400
    },
    {
      id: 'scheduledTime',
      header: ({ column }) => <DataTableColumnHeader column={column} title='Scheduled Time' />,
      cell: ({ row }) => {
        const endDate = row.original.endTime ? new Date(row.original.endTime) : null

        const formattedDate = endDate?.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })

        const endTime = endDate
          ? endDate.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false })
          : ''

        return (
          <div className='flex flex-row items-center gap-2 py-1 text-sm'>
            <div className='flex items-center gap-1'>
              <span className='italic'>Ended at:</span>
              <CalendarDays className='h-3.5 w-3.5 text-muted-foreground flex-shrink-0' />
              <span className='font-medium'>{formattedDate}</span>
            </div>
            <div className='flex items-center gap-1 text-muted-foreground'>
              <Clock className='h-3.5 w-3.5 flex-shrink-0' />
              <span className='text-xs'>{endTime}</span>
            </div>
          </div>
        )
      },
      size: 200
    },
    {
      accessorKey: 'status',
      header: ({ column }) => <DataTableColumnHeader column={column} title='Status' />,
      cell: ({ row }) => {
        const status = row.original.status

        switch (status) {
          case GroupBuyingStatusEnum.ACTIVE:
            return (
              <Badge variant='outline' className='border-green-200 bg-green-50 text-green-700 gap-1'>
                <CheckCircle2 className='h-3.5 w-3.5' />
                <span>Active</span>
              </Badge>
            )
          case GroupBuyingStatusEnum.INACTIVE:
            return (
              <Badge variant='outline' className='border-gray-200 bg-gray-50 text-gray-700 gap-1'>
                <CircleMinus className='h-3.5 w-3.5' />
                <span>Inactive</span>
              </Badge>
            )

          default:
            return <Badge variant='outline'>{status}</Badge>
        }
      },
      filterFn: (row, id, value) => {
        return Array.isArray(value) && value.includes(row.getValue(id))
      },
      minSize: 30
    },
    {
      accessorKey: 'updatedAt',
      header: ({ column }) => <DataTableColumnHeader column={column} title='Updated At' />,
      cell: ({ cell }) =>
        formatDate(cell.getValue() as Date, {
          hour: 'numeric',
          minute: 'numeric',
          month: '2-digit'
        }),
      size: 250
    },
    {
      id: 'actions',
      header: () => <SettingsIcon className='-translate-x-1' />,
      cell: function Cell({ row }) {
        const navigate = useNavigate()
        const handleNavigate = () => {
          navigate(routesConfig[Routes.GROUP_BUYING_DETAILS].getPath({ id: row.original.id }))
        }

        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button aria-label='Open menu' variant='ghost' className='flex size-8 p-0 data-[state=open]:bg-muted'>
                <Ellipsis className='size-4' aria-hidden='true' />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align='end' className='w-40'>
              <DropdownMenuItem onClick={handleNavigate} className='bg-gray-200 text-gray-500'>
                <span className='w-full flex gap-2 items-center cursor-pointer'>
                  <Eye size={16} strokeWidth={3} />
                  <span className='font-semibold'>View</span>
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
