import { type Table } from '@tanstack/react-table'
import { Download } from 'lucide-react'
import { IoIosAddCircleOutline } from 'react-icons/io'
import { useNavigate } from 'react-router-dom'

import { Button } from '@/components/ui/button'
import { Routes, routesConfig } from '@/configs/routes'
import { exportTableToCSV } from '@/lib/export'
import { TFlashSale } from '@/types/flash-sale'

import { BanFlashSalesDialog } from './BanFlashSalesDialog'

interface FlashSaleTableToolbarActionsProps {
  table: Table<TFlashSale>
}

export function FlashSaleTableToolbarActions({ table }: FlashSaleTableToolbarActionsProps) {
  const navigate = useNavigate()
  const handleAddFlashSale = () => {
    navigate(routesConfig[Routes.ADD_FLASH_SALE].getPath())
  }

  return (
    <div className='flex items-center gap-2'>
      {table.getFilteredSelectedRowModel().rows.length > 0 ? (
        <BanFlashSalesDialog
          FlashSales={table.getFilteredSelectedRowModel().rows.map((row) => row.original)}
          onSuccess={() => table.toggleAllRowsSelected(false)}
        />
      ) : null}
      <Button size={'sm'} onClick={handleAddFlashSale}>
        <IoIosAddCircleOutline />
        Add Flash Sale
      </Button>
      <Button
        variant='outline'
        size='sm'
        onClick={() =>
          exportTableToCSV(table, {
            filename: 'FlashSales' + Date.now(),
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
       * For example, import, view, etc.
       */}
    </div>
  )
}
