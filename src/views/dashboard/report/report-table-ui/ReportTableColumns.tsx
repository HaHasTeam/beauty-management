import { type ColumnDef, Row } from '@tanstack/react-table'
import { format } from 'date-fns'
import { ActivitySquareIcon, Ellipsis, SettingsIcon, SpeechIcon, View } from 'lucide-react'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { DataTableColumnHeader } from '@/components/ui/data-table/data-table-column-header'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { IReport } from '@/types/report'

import { ReportResultCell } from './ReportResultCell'
import { ReportStatusCell } from './ReportStatusCell'

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
      id: 'reporter',
      header: ({ column }) => <DataTableColumnHeader column={column} title='Reporter' />,
      cell: ({ row }) => {
        const user = row.original.reporter
        const name = user ? user.username || user.email : 'Unknown User'
        const role = user?.role || ''
        const avatarUrl = user?.avatar || ''

        return (
          <div className='flex gap-1 items-center'>
            <Avatar className='rounded-full'>
              <AvatarImage src={avatarUrl} className='size-5' />
              <AvatarFallback>{name.charAt(0).toUpperCase()}</AvatarFallback>
            </Avatar>
            <div className='flex flex-col'>
              <span className='max-w-[31.25rem] truncate text-sm'>{name}</span>
              {role && (
                <span className='text-xs text-muted-foreground capitalize'>
                  ({typeof role === 'string' ? role.toLowerCase() : role})
                </span>
              )}
            </div>
          </div>
        )
      },
      size: 200,
      enableHiding: false
    },
    {
      id: 'type',
      header: ({ column }) => <DataTableColumnHeader column={column} title='Type' />,
      cell: ({ row }) => {
        const type = row.original.type
        return <div className='text-xs font-medium text-end capitalize'>{type.replace(/_/g, ' ').toLowerCase()}</div>
      },
      size: 100
    },
    {
      id: 'status',
      header: ({ column }) => <DataTableColumnHeader column={column} title='Status' />,
      cell: ({ row }) => <ReportStatusCell report={row.original} />,
      filterFn: (row, id, value) => {
        return Array.isArray(value) && value.includes(row.getValue(id))
      },
      size: 60
    },
    {
      id: 'result',
      header: ({ column }) => <DataTableColumnHeader column={column} title='Result' />,
      cell: ({ row }) => <ReportResultCell report={row.original} />,
      size: 400
    },
    {
      id: 'createdAt',
      accessorKey: 'createdAt',
      header: ({ column }) => <DataTableColumnHeader column={column} title='Date Created' />,
      cell: ({ row }) => {
        return <div className='text-sm text-muted-foreground'>{format(new Date(row.original.createdAt), 'PPp')}</div>
      },
      size: 180
    },
    {
      id: 'actions',
      header: () => <SettingsIcon className='h-4 w-4' />,
      cell: function Cell({ row }) {
        const isAssigned = !!row.original.assignee?.id
        const isResolved = !!row.original.resultNote

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
                <DropdownMenuItem onClick={() => setRowAction({ row: row, type: 'view' })}>
                  <View className='mr-2 h-4 w-4' />
                  <span>View details</span>
                </DropdownMenuItem>

                {!isAssigned && (
                  <DropdownMenuItem onClick={() => setRowAction({ row: row, type: 'assign' })}>
                    <SpeechIcon className='mr-2 h-4 w-4' />
                    <span>Assign</span>
                  </DropdownMenuItem>
                )}

                {!isResolved && (
                  <DropdownMenuItem onClick={() => setRowAction({ row: row, type: 'resolve' })}>
                    <ActivitySquareIcon className='mr-2 h-4 w-4' />
                    <span>Resolve</span>
                  </DropdownMenuItem>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        )
      },
      size: 10,
      enableSorting: false,
      enableHiding: false
    }
  ]
}
