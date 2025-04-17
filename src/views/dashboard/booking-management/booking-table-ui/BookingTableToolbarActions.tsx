import { type Table } from '@tanstack/react-table'
import { Download, FileText } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

import { Button } from '@/components/ui/button'
import { Routes, routesConfig } from '@/configs/routes'
import { exportTableToCSV } from '@/lib/export'
import { TBooking } from '@/types/booking'

interface BookingTableToolbarActionsProps {
  table: Table<TBooking>
}

export function BookingTableToolbarActions({ table }: BookingTableToolbarActionsProps) {
  const navigate = useNavigate()

  const handleViewBookingDetails = () => {
    const selectedBookings = table.getFilteredSelectedRowModel().rows
    if (selectedBookings.length === 1) {
      const bookingId = selectedBookings[0].original.id
      navigate(routesConfig[Routes.BOOKING_DETAILS].getPath(bookingId))
    }
  }

  return (
    <div className='flex items-center gap-2'>
      {table.getFilteredSelectedRowModel().rows.length === 1 && (
        <Button size={'sm'} onClick={handleViewBookingDetails}>
          <FileText className='mr-2 h-4 w-4' />
          View Details
        </Button>
      )}
      <Button
        variant='outline'
        size='sm'
        onClick={() =>
          exportTableToCSV(table, {
            filename: 'Orders_' + Date.now(),
            excludeColumns: ['select', 'actions']
          })
        }
        className='gap-2'
      >
        <Download className='size-4' aria-hidden='true' />
        Export
      </Button>

      {/**
       * Other actions can be added here.
       * For example, bulk update status, print invoices, etc.
       */}
    </div>
  )
}
