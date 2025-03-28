import { type Table } from '@tanstack/react-table'
import { Download, ListPlusIcon } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

import { Button } from '@/components/ui/button'
import { Routes, routesConfig } from '@/configs/routes'
import { exportTableToCSV } from '@/lib/export'
import { ICategory } from '@/types/category'

interface CategoryTableToolbarActionsProps {
  table: Table<ICategory>
}

export function CategoryTableToolbarActions({ table }: CategoryTableToolbarActionsProps) {
  const navigate = useNavigate()
  const handleAddCategory = () => {
    navigate(routesConfig[Routes.ADD_CATEGORY].getPath())
  }

  return (
    <div className='flex items-center gap-2'>
      <Button size={'sm'} onClick={handleAddCategory}>
        <ListPlusIcon />
        Add Category
      </Button>
      <Button
        variant='outline'
        size='sm'
        onClick={() =>
          exportTableToCSV(table, {
            filename: 'Category' + Date.now(),
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
