import { type ColumnDef, Row } from '@tanstack/react-table'
import { Ellipsis, Eye, FilePenLine, Image, SettingsIcon } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { DataTableColumnHeader } from '@/components/ui/data-table/data-table-column-header'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { Routes, routesConfig } from '@/configs/routes'
import useGrant from '@/hooks/useGrant'
import { cn, formatDate } from '@/lib/utils'
import { ConsultantServiceStatusEnum, IConsultantService } from '@/types/consultant-service'
import { RoleEnum } from '@/types/enum'
import { formatCurrency, formatNumber } from '@/utils/number'
import { getDisplayString } from '@/utils/string'

import { getStatusIcon } from './helper'

export interface DataTableRowAction<TData> {
  row: Row<TData>
  type: 'ban' | 'view' | 'unbanned'
}
// interface GetColumnsProps {
//   setRowAction: React.Dispatch<React.SetStateAction<DataTableRowAction<IConsultantService> | null>>
// }
export const getColumns = (): ColumnDef<IConsultantService>[] => {
  return [
    {
      id: 'title',
      header: ({ column }) => <DataTableColumnHeader column={column} title='Service' />,
      cell: ({ row }) => {
        const displayName = row.original.serviceBookingForm?.title
        const imageUrl = row.original.images[0]?.fileUrl

        return (
          <div className='flex space-x-2 items-center'>
            <Avatar className='bg-transparent size-10 object-cover aspect-square p-0.5 rounded-lg border shadow-lg'>
              <AvatarImage src={imageUrl} />
              <AvatarFallback className='bg-transparent'>
                <Image className='size-6' />
              </AvatarFallback>
            </Avatar>
            <span className='max-w-[31.25rem] truncate'>{displayName}</span>
          </div>
        )
      },
      size: 400
    },
    {
      accessorKey: 'price',
      id: 'price',
      header: ({ column }) => <DataTableColumnHeader column={column} title='Price' />,
      cell: ({ row }) => {
        const price = row.original.price
        return <span>{formatCurrency(price)}</span>
      }
    },
    {
      id: 'amountOfQuestion',
      header: ({ column }) => <DataTableColumnHeader column={column} title='Amount Of Questions' />,
      cell: ({ row }) => {
        const amount = row.original.serviceBookingForm.questions.length
        return <span>{formatNumber(amount, ' Questions')}</span>
      },
      size: 200
    },
    {
      id: 'system-service',
      header: ({ column }) => <DataTableColumnHeader column={column} title='System Service' />,
      cell: ({ row }) => {
        const displayName = row.original.systemService?.name

        const imageUrl = row.original.systemService?.images?.[0]?.fileUrl
        return (
          <div className='flex space-x-2 items-center'>
            <Avatar className='bg-transparent size-10 object-cover aspect-square p-0.5 rounded-lg border shadow-lg'>
              <AvatarImage src={imageUrl} />
              <AvatarFallback className='bg-transparent'>
                <Image className='size-6' />
              </AvatarFallback>
            </Avatar>
            <span className='max-w-[31.25rem] truncate'>{displayName}</span>
          </div>
        )
      },
      size: 200
    },
    {
      accessorKey: 'status',
      header: ({ column }) => <DataTableColumnHeader column={column} title='Status' />,
      cell: ({ row }) => {
        const statusKey = Object.keys(ConsultantServiceStatusEnum).find((status) => {
          const value = ConsultantServiceStatusEnum[status as keyof typeof ConsultantServiceStatusEnum]
          return value === row.original.status
        })

        if (!statusKey) return null

        const statusValue = ConsultantServiceStatusEnum[statusKey as keyof typeof ConsultantServiceStatusEnum]
        const Icon = getStatusIcon(statusValue)

        return (
          <Badge
            variant='outline'
            className={cn('flex items-center gap-2 whitespace-nowrap w-fit', Icon.bgColor, Icon.textColor)}
          >
            <Icon.icon className={cn('size-4', Icon.iconColor)} aria-hidden='true' />
            <span className='capitalize'>{getDisplayString(statusValue)}</span>
          </Badge>
        )
      },
      size: 50,
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
        const navigate = useNavigate()
        const handleNavigate = () => {
          navigate(routesConfig[Routes.CONSULTANT_SERVICE_DETAILS].getPath({ id: row.original.id }))
        }
        const isGranted = useGrant([RoleEnum.CONSULTANT])
        return (
          <DropdownMenu modal={false}>
            <DropdownMenuTrigger asChild>
              <Button aria-label='Open menu' variant='ghost' className='flex size-8 p-0 data-[state=open]:bg-muted'>
                <Ellipsis className='size-4' aria-hidden='true' />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align='end' className='w-40'>
              <DropdownMenuItem
                onClick={handleNavigate}
                className={cn('text-blue-500', !isGranted ? 'text-gray-500' : '')}
              >
                {isGranted ? (
                  <span className='w-full flex gap-2 items-center cursor-pointer'>
                    <FilePenLine size={16} strokeWidth={3} />
                    <span className='font-semibold'>Edit</span>
                  </span>
                ) : (
                  <span className='w-full flex gap-2 items-center cursor-pointer'>
                    <Eye size={16} strokeWidth={3} />
                    <span className='font-semibold'>View</span>
                  </span>
                )}
              </DropdownMenuItem>
              {/* <DropdownMenuSeparator />
              {row.original.status !== FlashSaleStatusEnum.INACTIVE ? (
                <DropdownMenuItem
                  className='bg-red-500 text-white'
                  onClick={() => {
                    setRowAction({ row: row, type: 'ban' })
                  }}
                >
                  <span className='w-full flex gap-2 items-center cursor-pointer'>
                    <XIcon />
                    Unpublish PreOrder
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
                    Publish PreOrder
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
