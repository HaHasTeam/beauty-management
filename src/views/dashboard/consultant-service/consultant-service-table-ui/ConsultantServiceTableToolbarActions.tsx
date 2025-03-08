import { type Table } from '@tanstack/react-table'
import { Download, ListPlusIcon } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

import { Button } from '@/components/ui/button'
import { Routes, routesConfig } from '@/configs/routes'
import { exportTableToCSV } from '@/lib/export'
import { IConsultantService } from '@/types/consultant-service'

import { BanConsultantServicesDialog } from './BanConsultantServiceDialog'

interface ConsultantServiceTableToolbarActionsProps {
  table: Table<IConsultantService>
}

export function ConsultantServiceTableToolbarActions({ table }: ConsultantServiceTableToolbarActionsProps) {
  const navigate = useNavigate()
  const handleAddConsultantService = () => {
    navigate(routesConfig[Routes.ADD_CONSULTANT_SERVICE].getPath())
  }

  return (
    <div className='flex items-center gap-2'>
      {table.getFilteredSelectedRowModel().rows.length > 0 ? (
        <BanConsultantServicesDialog
          ConsultantServices={table.getFilteredSelectedRowModel().rows.map((row) => row.original)}
          onSuccess={() => table.toggleAllRowsSelected(false)}
        />
      ) : null}
      <Button size={'sm'} onClick={handleAddConsultantService}>
        <ListPlusIcon />
        Add Consultant Service
      </Button>
      <Button
        variant='outline'
        size='sm'
        onClick={() =>
          exportTableToCSV(table, {
            filename: 'ConsultantService' + Date.now(),
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
