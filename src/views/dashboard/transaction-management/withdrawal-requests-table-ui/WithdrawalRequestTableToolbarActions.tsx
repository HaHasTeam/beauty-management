import { type Table } from '@tanstack/react-table'
import { Download } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { exportTableToCSV } from '@/lib/export'
import { useStore } from '@/stores/store'
import { RoleEnum } from '@/types/enum'
import { TWithdrawalRequest } from '@/types/withdrawal-request'

interface WithdrawalRequestTableToolbarActionsProps {
  table: Table<TWithdrawalRequest>
}

export function WithdrawalRequestTableToolbarActions({ table }: WithdrawalRequestTableToolbarActionsProps) {
  const { user } = useStore()
  const isAdmin = [RoleEnum.ADMIN, RoleEnum.OPERATOR].includes(user?.role as RoleEnum)

  // If not admin, don't show any action buttons
  if (!isAdmin) {
    return null
  }

  return (
    <div className='flex items-center gap-2'>
      <Button
        variant='outline'
        size='sm'
        onClick={() =>
          exportTableToCSV(table, {
            filename: 'WithdrawalRequests' + Date.now(),
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
