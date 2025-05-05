import { type ColumnDef, Row } from '@tanstack/react-table'
import {
  Ban,
  CalendarDays,
  CheckCircle2,
  CircleDashed,
  CircleMinus,
  Clock,
  Ellipsis,
  Eye,
  Image,
  Mail,
  Phone,
  PlayCircle,
  SettingsIcon
} from 'lucide-react'
import { useNavigate } from 'react-router-dom'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { DataTableColumnHeader } from '@/components/ui/data-table/data-table-column-header'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { Routes, routesConfig } from '@/configs/routes'
import { formatDate } from '@/lib/utils'
import { ILivestream, LiveStreamStatusEnum } from '@/types/live-stream'

import { GroupProductProductsCell } from '../../group-product/group-product-table-ui/GroupProductProductsCell'

export interface DataTableRowAction<TData> {
  row: Row<TData>
  type: 'ban' | 'view' | 'publish'
}

export function getColumns(): ColumnDef<ILivestream>[] {
  return [
    {
      accessorKey: 'title',
      header: ({ column }) => <DataTableColumnHeader column={column} title='Livestream Name' />,
      cell: ({ row }) => {
        const title = row.original.title
        const thumbnailUrl = row.original.thumbnail
        const recordUrl = row.original.record

        return (
          <div className='flex items-center gap-2 py-1'>
            <Avatar className='rounded-lg size-9 flex-shrink-0 mt-0.5'>
              <AvatarImage src={thumbnailUrl} className='bg-transparent size-9' />
              <AvatarFallback className='bg-transparent rounded-lg flex items-center justify-center'>
                <Image size={24} />
              </AvatarFallback>
            </Avatar>
            <div className='flex flex-col gap-0'>
              <span className='max-w-[300px] truncate font-medium'>{title}</span>
              {recordUrl && (
                <a
                  href={recordUrl}
                  target='_blank'
                  rel='noopener noreferrer'
                  className='flex items-center gap-1 text-xs text-blue-500 hover:underline mt-0.5 w-fit'
                  onClick={(e) => e.stopPropagation()}
                >
                  <PlayCircle className='h-3.5 w-3.5 flex-shrink-0' />
                  View Record
                </a>
              )}
            </div>
          </div>
        )
      },
      size: 380,
      enableHiding: false
    },
    {
      accessorKey: 'account',
      header: ({ column }) => <DataTableColumnHeader column={column} title='Live Streamer' />,
      cell: ({ row }) => {
        const account = row.original.account
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
      id: 'scheduledTime',
      header: ({ column }) => <DataTableColumnHeader column={column} title='Scheduled Time' />,
      cell: ({ row }) => {
        const startDate = new Date(row.original.startTime)
        const endDate = new Date(row.original.endTime)

        const formattedDate = startDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
        const startTime = startDate.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false })
        const endTime = endDate.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false })

        return (
          <div className='flex flex-col gap-0.5 py-1'>
            <div className='flex items-center gap-1 font-medium'>
              <CalendarDays className='h-3.5 w-3.5 text-muted-foreground flex-shrink-0' />
              <span>{formattedDate}</span>
            </div>
            <div className='flex items-center gap-1 text-xs text-muted-foreground'>
              <Clock className='h-3 w-3 text-muted-foreground flex-shrink-0' />
              <span>
                {startTime} - {endTime}
              </span>
            </div>
          </div>
        )
      },
      size: 200
    },
    {
      accessorKey: 'products',
      header: ({ column }) => <DataTableColumnHeader column={column} title='Products' />,
      cell: ({ row }) => {
        return <GroupProductProductsCell products={row.original.products} />
      },
      enableHiding: false,
      size: 220
    },
    {
      accessorKey: 'status',
      header: ({ column }) => <DataTableColumnHeader column={column} title='Status' />,
      cell: ({ row }) => {
        const status = row.original.status

        switch (status) {
          case LiveStreamStatusEnum.LIVE:
            return (
              <Badge variant='outline' className='border-green-200 bg-green-50 text-green-700 gap-1'>
                <CheckCircle2 className='h-3.5 w-3.5' />
                <span>Live</span>
              </Badge>
            )
          case LiveStreamStatusEnum.SCHEDULED:
            return (
              <Badge variant='outline' className='border-yellow-200 bg-yellow-50 text-yellow-700 gap-1'>
                <CircleDashed className='h-3.5 w-3.5' />
                <span>Scheduled</span>
              </Badge>
            )
          case LiveStreamStatusEnum.ENDED:
            return (
              <Badge variant='outline' className='border-gray-200 bg-gray-50 text-gray-700 gap-1'>
                <CircleMinus className='h-3.5 w-3.5' />
                <span>Ended</span>
              </Badge>
            )
          case LiveStreamStatusEnum.CANCELLED:
            return (
              <Badge variant='outline' className='border-red-200 bg-red-50 text-red-700 gap-1'>
                <Ban className='h-3.5 w-3.5' />
                <span>Cancelled</span>
              </Badge>
            )
          default:
            return <Badge variant='outline'>{status}</Badge>
        }
      },
      filterFn: (row, id, value) => {
        return Array.isArray(value) && value.includes(row.getValue(id))
      },
      minSize: 70
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
          navigate(routesConfig[Routes.LIVESTREAM_DETAILS].getPath({ id: row.original.id }))
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
