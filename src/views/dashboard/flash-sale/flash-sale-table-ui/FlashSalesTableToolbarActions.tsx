import { type Table } from '@tanstack/react-table'
import { Download, ListPlusIcon } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

import { Button } from '@/components/ui/button'
import { Routes, routesConfig } from '@/configs/routes'
import useGrant from '@/hooks/useGrant'
import { exportTableToCSV } from '@/lib/export'
import { RoleEnum } from '@/types/enum'
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
  const isGranted = useGrant([RoleEnum.MANAGER, RoleEnum.STAFF])

  return (
    <div className='flex items-center gap-2'>
      {table.getFilteredSelectedRowModel().rows.length > 0 ? (
        <BanFlashSalesDialog
          FlashSales={table.getFilteredSelectedRowModel().rows.map((row) => row.original)}
          onSuccess={() => table.toggleAllRowsSelected(false)}
        />
      ) : null}
      {isGranted && (
        <Button size={'sm'} onClick={handleAddFlashSale}>
          <ListPlusIcon />
          Add Flash Sale
        </Button>
      )}

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
