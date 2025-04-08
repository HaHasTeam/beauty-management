import { ColumnDef } from '@tanstack/react-table'
import { format } from 'date-fns'
import { Ellipsis, EyeIcon, SettingsIcon } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'

import Button from '@/components/button'
import { DataTableColumnHeader } from '@/components/ui/data-table/data-table-column-header'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { Routes, routesConfig } from '@/configs/routes'
import { TOrderRequest } from '@/types/order-request'

import { OrderRequestItemsCell } from './OrderRequestItemsCell'
import { OrderRequestReasonMakerCell } from './OrderRequestReasonMakerCell'
import { OrderRequestResultCell } from './OrderRequestResultCell'
import { OrderRequestStatusCell } from './OrderRequestStatusCell'
import { OrderRequestTypeCell } from './OrderRequestTypeCell'

export function useOrderRequestTableColumns() {
  const { t } = useTranslation()

  const columns: ColumnDef<TOrderRequest>[] = [
    {
      id: 'reasonMaker',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title={t('order.request.reasonAndMaker', 'Reason & Maker')} />
      ),
      cell: ({ row }) => <OrderRequestReasonMakerCell request={row.original} />,
      size: 400
    },
    {
      accessorKey: 'items',
      header: ({ column }) => <DataTableColumnHeader column={column} title={t('order.request.items', 'Items')} />,
      cell: ({ row }) => <OrderRequestItemsCell request={row.original} />,
      size: 300
    },
    {
      accessorKey: 'type',
      header: ({ column }) => <DataTableColumnHeader column={column} title={t('order.request.type', 'Type')} />,
      cell: ({ row }) => <OrderRequestTypeCell request={row.original} />,
      size: 100
    },
    {
      accessorKey: 'status',
      header: ({ column }) => <DataTableColumnHeader column={column} title={t('order.request.status', 'Status')} />,
      cell: ({ row }) => <OrderRequestStatusCell request={row.original} />,
      size: 100
    },

    {
      accessorKey: 'result',
      header: ({ column }) => <DataTableColumnHeader column={column} title={t('order.request.result', 'Result')} />,
      cell: ({ row }) => <OrderRequestResultCell request={row.original} />,
      size: 400
    },
    {
      accessorKey: 'createdAt',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title={t('order.request.createdAt', 'Created At')} />
      ),
      cell: ({ row }) => (
        <div className='text-sm text-muted-foreground'>{format(new Date(row.original.createdAt), 'PPp')}</div>
      )
    },
    {
      id: 'actions',
      header: () => <SettingsIcon className='-translate-x-1' />,
      cell: function Cell({ row }) {
        const navigate = useNavigate()
        const handleNavigate = () => {
          navigate(routesConfig[Routes.ORDER_DETAILS].getPath({ id: row.original.order?.id }))
        }
        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button aria-label='Open menu' variant='ghost' className='flex size-8 p-0 data-[state=open]:bg-muted'>
                <Ellipsis className='size-4' aria-hidden='true' />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align='end' className='w-40'>
              <DropdownMenuItem onClick={handleNavigate} className=''>
                <span className='w-full flex gap-2 items-center cursor-pointer'>
                  <EyeIcon size={16} strokeWidth={3} />
                  <span className='font-semibold'>{t('order.request.View', 'View')}</span>
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

  return columns
}
