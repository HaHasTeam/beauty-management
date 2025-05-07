import { type Table } from '@tanstack/react-table'
import { Download, ListPlusIcon } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

import { Button } from '@/components/ui/button'
import { Routes, routesConfig } from '@/configs/routes'
import useGrant from '@/hooks/useGrant'
import { exportTableToCSV } from '@/lib/export'
import { RoleEnum } from '@/types/enum'
import { ILivestream } from '@/types/live-stream'

interface TableToolbarActionsProps {
  table: Table<ILivestream>
}

export function TableToolbarActions({ table }: TableToolbarActionsProps) {
  const navigate = useNavigate()
  const handleAddGroupProduct = () => {
    navigate(routesConfig[Routes.ADD_LIVESTREAM].getPath())
  }
  const isGranted = useGrant([RoleEnum.MANAGER, RoleEnum.STAFF])

  return (
    <div className='flex items-center gap-2'>
      {isGranted && (
        <Button size={'sm'} onClick={handleAddGroupProduct}>
          <ListPlusIcon />
          Add Livestream
        </Button>
      )}

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
