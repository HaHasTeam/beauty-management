import { type Table } from '@tanstack/react-table'
import { Download } from 'lucide-react'

// import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
// import { Routes, routesConfig } from '@/configs/routes'
import { exportTableToCSV } from '@/lib/export'
import { TBrand } from '@/types/brand'

import { BanBrandsDialog } from './BanBrandsDialog'

interface BrandsTableToolbarActionsProps {
  table: Table<TBrand>
}

export function BrandsTableToolbarActions({ table }: BrandsTableToolbarActionsProps) {
  // const navigate = useNavigate()
  // const handleAddBrand = () => {
  //   navigate(routesConfig[Routes.ADD_BRAND].getPath())
  // }

  return (
    <div className='flex items-center gap-2'>
      {table.getFilteredSelectedRowModel().rows.length > 0 ? (
        <BanBrandsDialog
          Brands={table.getFilteredSelectedRowModel().rows.map((row) => row.original)}
          onSuccess={() => table.toggleAllRowsSelected(false)}
        />
      ) : null}
      {/* <Button size={'sm'} onClick={handleAddBrand}>
        <ListPlusIcon />
        Add Brand
      </Button> */}
      <Button
        variant='outline'
        size='sm'
        onClick={() =>
          exportTableToCSV(table, {
            filename: 'PreOrders' + Date.now(),
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
