import type { ColumnDef, Row } from '@tanstack/react-table'
import { Ellipsis, EyeIcon, Mail, Phone, SettingsIcon, Ticket } from 'lucide-react'
import * as React from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { DataTableColumnHeader } from '@/components/ui/data-table/data-table-column-header'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { Routes, routesConfig } from '@/configs/routes'
import { formatDate } from '@/lib/utils'
import { OrderEnum, ShippingStatusEnum } from '@/types/enum'
import { type IOrder } from '@/types/order'
import { formatCurrency } from '@/utils/number'
import { getDisplayString } from '@/utils/string'

import { OrderItemsCell } from './OrderItemsCell'
import { OrderResultCell } from './OrderResultCell'
import { OrderTypeCell } from './OrderTypeCell'

// Custom filter functions for use with table
export const customFilterFunctions = {
  // This function will filter orders based on product search text
  // It searches across product names, SKUs, and categories
  productSearch: (row: IOrder, value: unknown) => {
    // If no search value, return all rows
    if (!value || typeof value !== 'string') return true

    const searchLower = value.toLowerCase()
    const orderDetails = row.orderDetails || []

    // Search across all products in the order
    return orderDetails.some((item) => {
      if (!item) return false

      // Check if search term appears in product name
      if (item.productName && item.productName.toLowerCase().includes(searchLower)) {
        return true
      }

      // Check if classification name contains the search term
      if (item.classificationName && item.classificationName.toLowerCase().includes(searchLower)) {
        return true
      }

      // Check if product classification data contains the search term
      const classification = item.productClassification
      if (classification) {
        // Search in classification properties if they exist
        if (classification.title && classification.title.toLowerCase().includes(searchLower)) {
          return true
        }

        // Check the SKU
        if (classification.sku && classification.sku.toLowerCase().includes(searchLower)) {
          return true
        }

        // Check product name
        if (
          classification.product &&
          classification.product.name &&
          classification.product.name.toLowerCase().includes(searchLower)
        ) {
          return true
        }
      }

      return false
    })
  }
}

export interface DataTableRowAction<TData> {
  row: Row<TData>
  type: 'view' | 'cancel' | 'update-status'
}

interface GetColumnsProps {
  setRowAction: React.Dispatch<React.SetStateAction<DataTableRowAction<IOrder> | null>>
}

const PaymentMethodCell = ({ row }: { row: { original: IOrder } }) => {
  const { t } = useTranslation()
  const isGroupBuying = row.original.type === OrderEnum.GROUP_BUYING
  const isJoinGroupBuying = row.original.status === ShippingStatusEnum.JOIN_GROUP_BUYING

  return (
    <div className='flex items-end gap-2 flex-col'>
      <div className='text-right font-bold'>{formatCurrency(row.original.totalPrice)}</div>
      {isGroupBuying && isJoinGroupBuying && (
        <div className='text-xs text-muted-foreground italic text-red-500'>
          *
          {t(
            'order.estimatedPriceNote',
            'This is the estimated price for the order. The final price will be determined after the order is confirmed.'
          )}
        </div>
      )}
      <div className='text-xs text-muted-foreground'>
        by <span className='capitalize'>{getDisplayString(row.original.paymentMethod.toLowerCase())}</span>
      </div>
    </div>
  )
}

const PlatformVoucherCell = ({ row }: { row: { original: IOrder } }) => {
  const voucherAmount = row.original.platformVoucherDiscount || 0

  if (!voucherAmount) {
    return <div className='text-xs text-muted-foreground'>No voucher applied</div>
  }

  return (
    <div className='flex items-center gap-1.5'>
      <Ticket className='h-3.5 w-3.5 text-indigo-500 flex-shrink-0' />
      <Badge
        variant='outline'
        className='px-1.5 py-0.5 h-5 border-indigo-200 bg-indigo-50 text-indigo-700 shadow-sm text-xs'
      >
        -{formatCurrency(voucherAmount)}
      </Badge>
    </div>
  )
}

export function getColumns({ setRowAction }: GetColumnsProps): ColumnDef<IOrder>[] {
  return [
    {
      accessorKey: 'recipientName',
      header: ({ column }) => <DataTableColumnHeader column={column} title='Recipient' />,
      cell: ({ row }) => {
        const name = row.original.recipientName || 'Unknown Recipient'
        const user = row.original.account
        const avatarUrl = user?.avatar || ''
        const phone = user?.phone || 'N/A'
        const email = user?.email || 'N/A'

        return (
          <div className='flex gap-2 items-start'>
            <Avatar className='rounded-full'>
              <AvatarImage src={avatarUrl} className='size-5' />
              <AvatarFallback className='text-xs'>{name.charAt(0).toUpperCase()}</AvatarFallback>
            </Avatar>
            <div className='flex flex-col'>
              <span className='font-medium truncate'>{name}</span>
              <div className='flex items-center gap-1 text-muted-foreground'>
                <Phone className='h-3 w-3' />
                <span className='text-xs truncate'>{phone}</span>
              </div>
              <div className='flex items-center gap-1 text-muted-foreground'>
                <Mail className='h-3 w-3' />
                <span className='text-xs truncate'>{email}</span>
              </div>
            </div>
          </div>
        )
      },
      enableSorting: true,
      size: 200
    },
    {
      accessorKey: 'paymentMethod',
      header: ({ column }) => <DataTableColumnHeader column={column} title='Total / Method' />,
      cell: ({ row }) => <PaymentMethodCell row={row} />,
      enableSorting: true,
      size: 100
    },
    {
      accessorKey: 'platformVoucherDiscount',
      header: ({ column }) => <DataTableColumnHeader column={column} title='Platform Voucher' />,
      cell: ({ row }) => <PlatformVoucherCell row={row} />,
      enableSorting: true,
      size: 140
    },
    {
      accessorKey: 'type',
      header: ({ column }) => <DataTableColumnHeader column={column} title='Type' />,
      cell: ({ row }) => (
        <div className='text-nowrap'>
          <OrderTypeCell order={row.original} />
        </div>
      ),
      filterFn: (row, id, value) => {
        return Array.isArray(value) && value.includes(row.getValue(id))
      },
      size: 340
    },
    // {
    //   accessorKey: 'status',
    //   header: ({ column }) => <DataTableColumnHeader column={column} title='Status' />,
    //   cell: ({ row }) => <OrderStatusCell order={row.original} />,
    //   filterFn: (row, id, value) => {
    //     return Array.isArray(value) && value.includes(row.getValue(id))
    //   },
    //   size: 150
    // },
    {
      id: 'orderDetails',
      header: ({ column }) => <DataTableColumnHeader column={column} title='Order Items' />,
      cell: ({ row }) => <OrderItemsCell order={row.original} />,
      enableSorting: false,
      enableHiding: false,
      size: 900
    },
    {
      id: 'Shipping',
      header: ({ column }) => <DataTableColumnHeader column={column} title='Shipping & Note' />,
      cell: ({ row }) => <OrderResultCell order={row.original} />,
      size: 80
    },

    {
      accessorKey: 'createdAt',
      header: ({ column }) => <DataTableColumnHeader column={column} title='Order Date' />,
      cell: ({ row }) => {
        return (
          <div className='text-sm text-muted-foreground'>
            {formatDate(new Date(row.original.createdAt), { hour: 'numeric', minute: 'numeric' })}
          </div>
        )
      },
      size: 180
    },
    {
      id: 'actions',
      header: () => <SettingsIcon className='-translate-x-1' />,
      cell: ({ row }) => {
        // eslint-disable-next-line react-hooks/rules-of-hooks
        const navigate = useNavigate()
        const handleNavigate = () => {
          //do nothing
          setRowAction({ row, type: 'view' })
          navigate(routesConfig[Routes.ORIGINAL_ORDER_DETAILS].getPath({ id: row.original.id }))
        }

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
                <DropdownMenuItem onClick={handleNavigate} className='text-blue-500'>
                  <span className='w-full flex gap-2 items-center cursor-pointer'>
                    <EyeIcon size={16} strokeWidth={3} />
                    <span className='font-semibold'>View</span>
                  </span>
                </DropdownMenuItem>
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
