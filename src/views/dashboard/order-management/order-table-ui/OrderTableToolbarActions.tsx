import { type Table } from '@tanstack/react-table'
import { Download, FileText } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

import { Button } from '@/components/ui/button'
import { Routes, routesConfig } from '@/configs/routes'
import { exportTableToCSV } from '@/lib/export'
import { IOrder } from '@/types/order'

interface OrderTableToolbarActionsProps {
  table: Table<IOrder>
}

export function OrderTableToolbarActions({ table }: OrderTableToolbarActionsProps) {
  const navigate = useNavigate()

  const handleViewOrderDetails = () => {
    const selectedOrders = table.getFilteredSelectedRowModel().rows
    if (selectedOrders.length === 1) {
      const orderId = selectedOrders[0].original.id
      navigate(routesConfig[Routes.ORDER_DETAILS].getPath(orderId))
    }
  }

  return (
    <div className='flex items-center gap-2'>
      {table.getFilteredSelectedRowModel().rows.length === 1 && (
        <Button size={'sm'} onClick={handleViewOrderDetails}>
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
