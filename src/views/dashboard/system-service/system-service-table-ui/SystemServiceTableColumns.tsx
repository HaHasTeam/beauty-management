import { type ColumnDef, Row } from '@tanstack/react-table'
import { CheckCircle2, CircleDashed, Ellipsis, EyeIcon, FilePenLine, Image, SettingsIcon } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

import SystemServiceTypeTag from '@/components/system-service/SystemServiceTypeTag'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { DataTableColumnHeader } from '@/components/ui/data-table/data-table-column-header'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { Routes, routesConfig } from '@/configs/routes'
import { formatDate } from '@/lib/utils'
import { ISystemService, SystemServiceStatusEnum } from '@/types/system-service'

export interface DataTableRowAction<TData> {
  row: Row<TData>
  type: 'ban' | 'view' | 'unbanned'
}
// interface GetColumnsProps {
//   setRowAction: React.Dispatch<React.SetStateAction<DataTableRowAction<ISystemService> | null>>
// }
export function getColumns(): ColumnDef<ISystemService>[] {
  return [
    {
      id: 'title',
      header: ({ column }) => <DataTableColumnHeader column={column} title='Service' />,
      cell: ({ row }) => {
        const displayName = row.original.name
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
      accessorKey: 'type',
      header: ({ column }) => <DataTableColumnHeader column={column} title='Type' />,
      cell: ({ row }) => {
        const type = row.original.type
        return (
          <div className='w-full flex justify-center'>
            <SystemServiceTypeTag type={type} size='small' useBadgeStyle={true} />
          </div>
        )
      }
    },
    {
      id: 'category',
      header: ({ column }) => <DataTableColumnHeader column={column} title='Category' />,
      cell: ({ row }) => {
        const category = row.original.category
        return <div className='text-center'>{category.name}</div>
      },
      size: 200
    },
    {
      accessorKey: 'status',
      header: ({ column }) => <DataTableColumnHeader column={column} title='Status' />,
      cell: ({ row }) => {
        const statusValue = row.original.status

        // Map system service status to appropriate styling
        switch (statusValue) {
          case SystemServiceStatusEnum.ACTIVE:
            return (
              <Badge variant='outline' className='border-green-200 bg-green-50 text-green-700 gap-1'>
                <CheckCircle2 className='h-3.5 w-3.5' />
                <span className='whitespace-nowrap'>Active</span>
              </Badge>
            )
          case SystemServiceStatusEnum.INACTIVE:
            return (
              <Badge variant='outline' className='border-gray-200 bg-gray-50 text-gray-700 gap-1'>
                <CircleDashed className='h-3.5 w-3.5' />
                <span className='whitespace-nowrap'>Inactive</span>
              </Badge>
            )
          default:
            return (
              <Badge variant='outline' className='border-gray-200 bg-gray-50 text-gray-700 gap-1'>
                <span className='whitespace-nowrap'>Unknown</span>
              </Badge>
            )
        }
      },
      size: 150,
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
          navigate(routesConfig[Routes.UPDATE_SYSTEM_SERVICE].getPath({ id: row.original.id }))
        }
        const handleNavigateDetail = () => {
          navigate(routesConfig[Routes.SYSTEM_SERVICE_DETAILS].getPath({ id: row.original.id }))
        }
        return (
          <DropdownMenu modal={false}>
            <DropdownMenuTrigger asChild>
              <Button aria-label='Open menu' variant='ghost' className='flex size-8 p-0 data-[state=open]:bg-muted'>
                <Ellipsis className='size-4' aria-hidden='true' />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align='end' className='w-40'>
              <DropdownMenuItem onClick={handleNavigateDetail}>
                <EyeIcon className='mr-2 size-4' />
                View details
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleNavigate} className='bg-blue-200 text-blue-500'>
                <span className='w-full flex gap-2 items-center cursor-pointer'>
                  <FilePenLine size={16} strokeWidth={3} />
                  <span className='font-semibold'>Edit</span>
                </span>
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
