import { type Table } from '@tanstack/react-table'
import { Download, ListPlusIcon } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

import { Button } from '@/components/ui/button'
import { Routes, routesConfig } from '@/configs/routes'
import useGrant from '@/hooks/useGrant'
import { exportTableToCSV } from '@/lib/export'
import { RoleEnum } from '@/types/enum'
import { IResponseProduct } from '@/types/product'

import { BanProductsDialog } from './BanProductsDialog'

interface ProductTableToolbarActionsProps {
  table: Table<IResponseProduct>
}

export function ProductTableToolbarActions({ table }: ProductTableToolbarActionsProps) {
  const navigate = useNavigate()
  const handleAddProduct = () => {
    navigate(routesConfig[Routes.CREATE_PRODUCT].getPath())
  }
  const isGranted = useGrant([RoleEnum.MANAGER, RoleEnum.STAFF])
  return (
    <div className='flex items-center gap-2'>
      {table.getFilteredSelectedRowModel().rows.length > 0 ? (
        <BanProductsDialog
          Products={table.getFilteredSelectedRowModel().rows.map((row) => row.original)}
          onSuccess={() => table.toggleAllRowsSelected(false)}
        />
      ) : null}

      {isGranted && (
        <Button size={'sm'} onClick={handleAddProduct}>
          <ListPlusIcon />
          Add Product
        </Button>
      )}

      <Button
        variant='outline'
        size='sm'
        onClick={() =>
          exportTableToCSV(table, {
            filename: 'Products' + Date.now(),
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
