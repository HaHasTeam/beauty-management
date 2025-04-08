import { type Table } from '@tanstack/react-table'
import { Download } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { exportTableToCSV } from '@/lib/export'
import { TWithdrawalRequest } from '@/types/withdrawal-request'

interface WithdrawalRequestTableToolbarActionsProps {
  table: Table<TWithdrawalRequest>
}

export function WithdrawalRequestTableToolbarActions({ table }: WithdrawalRequestTableToolbarActionsProps) {
  return (
    <div className='flex items-center gap-2'>
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
