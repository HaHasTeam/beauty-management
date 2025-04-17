import type { ColumnDef, Row } from '@tanstack/react-table'
import { Ellipsis, EyeIcon, SettingsIcon } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { DataTableColumnHeader } from '@/components/ui/data-table/data-table-column-header'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { Routes, routesConfig } from '@/configs/routes'
import { formatDate } from '@/lib/utils'
import { TBooking } from '@/types/booking'
import { formatCurrency } from '@/utils/number'

import { BookingDetailsCell } from './BookingDetailsCell'
import { BookingStatusCell } from './BookingStatusCell'

export interface DataTableRowAction<TData> {
  row: Row<TData>
  type: 'view' | 'cancel' | 'update-status'
}

// Custom filter functions for use with table
export const customFilterFunctions = {
  // This function will filter bookings based on search text
  bookingSearch: (row: TBooking, value: unknown) => {
    // If no search value, return all rows
    if (!value || typeof value !== 'string') return true

    const searchLower = value.toLowerCase()

    // Search across booking properties
    return (
      (row.id && row.id.toLowerCase().includes(searchLower)) ||
      (row.account?.email && row.account.email.toLowerCase().includes(searchLower)) ||
      (row.account?.firstName && row.account.firstName.toLowerCase().includes(searchLower)) ||
      (row.account?.lastName && row.account.lastName.toLowerCase().includes(searchLower)) ||
      (row.account?.username && row.account.username.toLowerCase().includes(searchLower))
    )
  }
}

// PaymentMethodCell component to display total price and payment method
const PaymentMethodCell = ({ booking }: { booking: TBooking }) => {
  // Chuyển đổi BANK_TRANSFER thành Bank Transfer
  const formatPaymentMethod = (method: string) => {
    if (!method) return ''
    // Thay thế '_' bằng dấu cách và chuyển đổi thành dạng Capitalize
    return method
      .toLowerCase()
      .replace(/_/g, ' ')
      .split(' ')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ')
  }

  return (
    <div className='flex items-end gap-2 flex-col'>
      <div className='text-right font-bold'>{formatCurrency(booking.totalPrice)}</div>
      <div className='text-xs text-muted-foreground'>
        by <span className='capitalize'>{formatPaymentMethod(booking.paymentMethod)}</span>
      </div>
    </div>
  )
}

// ConsultantCell component to display consultant info
const ConsultantCell = ({ booking }: { booking: TBooking }) => {
  // Sử dụng account như là thông tin người dùng chính
  const user = booking.consultantService?.account
  if (!user) return null

  const userName = `${user.firstName || ''} ${user.lastName || ''}`.trim() || user.username || 'N/A'
  const avatarUrl = user.avatar || ''

  return (
    <div className='flex gap-2 items-center'>
      <Avatar className='h-8 w-8'>
        <AvatarImage src={avatarUrl} alt={userName} />
        <AvatarFallback>{userName.charAt(0).toUpperCase()}</AvatarFallback>
      </Avatar>
      <div className='flex flex-col'>
        <span className='font-medium line-clamp-1'>{userName}</span>
        <span className='text-xs text-muted-foreground line-clamp-1'>{user.email}</span>
      </div>
    </div>
  )
}

export function getColumns(): ColumnDef<TBooking>[] {
  return [
    {
      accessorKey: 'account',
      header: ({ column }) => <DataTableColumnHeader column={column} title='Customer' />,
      cell: ({ row }) => {
        const booking = row.original
        const customer = booking.account
        const customerName = customer
          ? `${customer.firstName || ''} ${customer.lastName || ''}`.trim() || customer.username || 'Unknown Customer'
          : 'Unknown Customer'
        const avatarUrl = customer?.avatar || ''

        return (
          <div className='flex gap-2 items-center'>
            <Avatar className='h-8 w-8'>
              <AvatarImage src={avatarUrl} alt={customerName} />
              <AvatarFallback>{customerName.charAt(0).toUpperCase()}</AvatarFallback>
            </Avatar>
            <div className='flex flex-col'>
              <span className='font-medium line-clamp-1'>{customerName}</span>
              {customer?.email && <span className='text-xs text-muted-foreground line-clamp-1'>{customer.email}</span>}
            </div>
          </div>
        )
      },
      enableSorting: true,
      size: 150
    },
    {
      accessorKey: 'totalPrice',
      header: ({ column }) => <DataTableColumnHeader column={column} title='Total / Method' />,
      cell: ({ row }) => <PaymentMethodCell booking={row.original} />,
      enableSorting: true,
      size: 100
    },
    {
      accessorKey: 'status',
      header: ({ column }) => <DataTableColumnHeader column={column} title='Status' />,
      cell: ({ row }) => <BookingStatusCell booking={row.original} />,
      filterFn: (row, id, value) => {
        return Array.isArray(value) && value.includes(row.getValue(id))
      },
      size: 50
    },
    {
      id: 'consultant',
      header: ({ column }) => <DataTableColumnHeader column={column} title='Consultant' />,
      cell: ({ row }) => <ConsultantCell booking={row.original} />,
      size: 50
    },
    {
      id: 'bookingDetails',
      header: ({ column }) => <DataTableColumnHeader column={column} title='Booking Details' />,
      cell: ({ row }) => <BookingDetailsCell booking={row.original} />,
      enableSorting: false,
      enableHiding: false,
      size: 800
    },
    {
      accessorKey: 'updatedAt',
      header: ({ column }) => <DataTableColumnHeader column={column} title='Last Updated' />,
      cell: ({ row }) => (
        <div className='text-sm text-muted-foreground'>
          {formatDate(new Date(row.original.updatedAt), { hour: 'numeric', minute: 'numeric' })}
        </div>
      ),
      size: 130
    },
    {
      id: 'actions',
      header: () => <SettingsIcon className='-translate-x-1' />,
      cell: ({ row }) => {
        // eslint-disable-next-line react-hooks/rules-of-hooks
        const navigate = useNavigate()
        const handleNavigate = () => {
          navigate(routesConfig[Routes.BOOKING_DETAILS].getPath({ id: row.original.id }))
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
                    <span className='font-semibold'>View & Edit</span>
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
