import { type ColumnDef, Row } from '@tanstack/react-table'
import { ActivitySquareIcon, Ellipsis, Flag, SettingsIcon, SpeechIcon, View } from 'lucide-react'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { DataTableColumnHeader } from '@/components/ui/data-table/data-table-column-header'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { cn, formatDate } from '@/lib/utils'
import { IReport, ReportStatusEnum } from '@/types/report'
import { getDisplayString } from '@/utils/string'

import { getStatusIcon } from './helper'

export interface DataTableRowAction<TData> {
  row: Row<TData>
  type: 'ban' | 'view' | 'unbanned' | 'assign' | 'resolve'
}
interface GetColumnsProps {
  setRowAction: React.Dispatch<React.SetStateAction<DataTableRowAction<IReport> | null>>
}
export function getColumns({ setRowAction }: GetColumnsProps): ColumnDef<IReport>[] {
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
      id: 'Reason',
      header: ({ column }) => <DataTableColumnHeader column={column} title='Reason' />,
      cell: ({ row }) => {
        const reason = row.original.reason
        const imgURl = row.original.files?.[0]?.fileUrl

        return (
          <div className='flex space-x-2 items-center'>
            <Avatar className='bg-transparent size-10 object-cover aspect-square p-0.5 rounded-lg border shadow-lg'>
              <AvatarImage src={imgURl} />
              <AvatarFallback className='bg-transparent'>
                <Flag className='size-6' />
              </AvatarFallback>
            </Avatar>
            <span className='max-w-[31.25rem] truncate'>{reason}</span>
          </div>
        )
      },
      size: 650
    },
    {
      accessorKey: 'Type',
      id: 'price',
      header: ({ column }) => <DataTableColumnHeader column={column} title='Type' />,
      cell: ({ row }) => {
        const type = row.original.type
        return <div>{type.replace(/_/g, ' ')}</div>
      },
      size: 180
    },
    {
      id: 'Reporter',
      header: ({ column }) => <DataTableColumnHeader column={column} title='Reporter' />,
      cell: ({ row }) => {
        const name = row.original.reporter.username || row.original.reporter.email
        return <div>{name}</div>
      },
      size: 200
    },
    {
      id: 'Assignee',
      header: ({ column }) => <DataTableColumnHeader column={column} title='Assignee' />,
      cell: ({ row }) => {
        const name = row.original.assignee ? row.original.assignee.email : ''
        return <div>{name}</div>
      },
      size: 200
    },
    {
      id: 'resultNote',
      header: ({ column }) => <DataTableColumnHeader column={column} title='Result Note' />,
      cell: ({ row }) => {
        const note = row.original.resultNote
        return <div>{note}</div>
      },
      size: 400
    },
    {
      accessorKey: 'status',
      header: ({ column }) => <DataTableColumnHeader column={column} title='Status' />,
      cell: ({ row }) => {
        const statusKey = Object.keys(ReportStatusEnum).find((status) => {
          const value = ReportStatusEnum[status as keyof typeof ReportStatusEnum]
          return value === row.original.status
        })

        if (!statusKey) return null

        const statusValue = ReportStatusEnum[statusKey as keyof typeof ReportStatusEnum]

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
        const isAssigned = !!row.original.assignee?.id
        const isResolved = !!row.original.resultNote
        return (
          <DropdownMenu modal={false}>
            <DropdownMenuTrigger asChild>
              <Button aria-label='Open menu' variant='ghost' className='flex size-8 p-0 data-[state=open]:bg-muted'>
                <Ellipsis className='size-4' aria-hidden='true' />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align='end' className='w-40 space-y-1'>
              <DropdownMenuItem
                onClick={() => {
                  setRowAction({ row: row, type: 'view' })
                }}
                className='bg-blue-200 text-blue-500'
              >
                <span className='w-full flex gap-2 items-center cursor-pointer'>
                  <View size={16} strokeWidth={3} />
                  <span className='font-semibold'>View</span>
                </span>
              </DropdownMenuItem>
              {!isAssigned && (
                <DropdownMenuItem
                  onClick={() => {
                    setRowAction({ row: row, type: 'assign' })
                  }}
                  className='bg-gray-200 text-gray-500'
                >
                  <span className='w-full flex gap-2 items-center cursor-pointer'>
                    <SpeechIcon size={16} strokeWidth={3} />
                    <span className='font-semibold'>Assign</span>
                  </span>
                </DropdownMenuItem>
              )}
              {!isResolved && (
                <DropdownMenuItem
                  onClick={() => {
                    setRowAction({ row: row, type: 'resolve' })
                  }}
                  className='bg-green-200 text-green-500'
                >
                  <span className='w-full flex gap-2 items-center cursor-pointer'>
                    <ActivitySquareIcon size={16} strokeWidth={3} />
                    <span className='font-semibold'>Resolve</span>
                  </span>
                </DropdownMenuItem>
              )}
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
