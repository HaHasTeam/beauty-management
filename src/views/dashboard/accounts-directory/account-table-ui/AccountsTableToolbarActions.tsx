import { type Table } from '@tanstack/react-table'
import { Download } from 'lucide-react'

import { Button } from '@/components/ui/button'
import useGrant from '@/hooks/useGrant'
import { exportTableToCSV } from '@/lib/export'
import { RoleEnum } from '@/types/enum'
import { TUser, UserStatusEnum } from '@/types/user'

import InviteCoWorker from '../InviteCoWorker'
import { BanAccountsDialog } from './BanAccountsDialog'

interface AccountTableToolbarActionsProps {
  table: Table<TUser>
}

export function AccountTableToolbarActions({ table }: AccountTableToolbarActionsProps) {
  const isGrant = useGrant([RoleEnum.ADMIN, RoleEnum.MANAGER])
  return (
    <div className='flex items-center gap-2'>
      {table.getFilteredSelectedRowModel().rows.length > 0 ? (
        <BanAccountsDialog
          status={UserStatusEnum.BANNED}
          accounts={table.getFilteredSelectedRowModel().rows.map((row) => row.original)}
          onSuccess={() => table.toggleAllRowsSelected(false)}
        />
      ) : null}
      {isGrant ? <InviteCoWorker /> : null}
      <Button
        variant='outline'
        size='sm'
        onClick={() =>
          exportTableToCSV(table, {
            filename: 'accounts' + Date.now(),
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
