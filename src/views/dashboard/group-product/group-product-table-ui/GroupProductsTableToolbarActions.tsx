import { type Table } from '@tanstack/react-table'
import { Download, ListPlusIcon } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

import { Button } from '@/components/ui/button'
import { Routes, routesConfig } from '@/configs/routes'
import { exportTableToCSV } from '@/lib/export'
import { TGroupProduct } from '@/types/group-product'

import { BanGroupProductsDialog } from './BanGroupProductsDialog'

interface GroupProductTableToolbarActionsProps {
  table: Table<TGroupProduct>
}

export function GroupProductTableToolbarActions({ table }: GroupProductTableToolbarActionsProps) {
  const navigate = useNavigate()
  const handleAddGroupProduct = () => {
    navigate(routesConfig[Routes.ADD_GROUP_PRODUCT].getPath())
  }

  return (
    <div className='flex items-center gap-2'>
      {table.getFilteredSelectedRowModel().rows.length > 0 ? (
        <BanGroupProductsDialog
          GroupProducts={table.getFilteredSelectedRowModel().rows.map((row) => row.original)}
          onSuccess={() => table.toggleAllRowsSelected(false)}
        />
      ) : null}
      <Button size={'sm'} onClick={handleAddGroupProduct}>
        <ListPlusIcon />
        Add Group Product
      </Button>
      <Button
        variant='outline'
        size='sm'
        onClick={() =>
          exportTableToCSV(table, {
            filename: 'GroupProducts' + Date.now(),
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
