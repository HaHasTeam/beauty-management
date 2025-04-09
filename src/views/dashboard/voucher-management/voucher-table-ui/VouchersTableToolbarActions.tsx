import { type Table } from '@tanstack/react-table'
import { Download, ListPlusIcon } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

import { Button } from '@/components/ui/button'
import { Routes, routesConfig } from '@/configs/routes'
import { exportTableToCSV } from '@/lib/export'
import { StatusEnum } from '@/types/enum'
import { TVoucher } from '@/types/voucher'

import { UpdateStatusVoucherDialog } from './UpdateStatusVoucherDialog'

interface VouchersTableToolbarActionsProps {
  table: Table<TVoucher>
}

export function VouchersTableToolbarActions({ table }: VouchersTableToolbarActionsProps) {
  const navigate = useNavigate()
  const handleAddVoucher = () => {
    navigate(routesConfig[Routes.ADD_VOUCHER].getPath())
  }

  const selectedRows = table.getFilteredSelectedRowModel().rows
  const hasSelectedRows = selectedRows.length > 0

  return (
    <div className='flex items-center gap-2'>
      {hasSelectedRows ? (
        <>
          <UpdateStatusVoucherDialog
            status={StatusEnum.ACTIVE}
            Vouchers={selectedRows.map((row) => row.original)}
            onSuccess={() => table.toggleAllRowsSelected(false)}
          />
          <UpdateStatusVoucherDialog
            status={StatusEnum.INACTIVE}
            Vouchers={selectedRows.map((row) => row.original)}
            onSuccess={() => table.toggleAllRowsSelected(false)}
          />
        </>
      ) : null}
      <Button size={'sm'} onClick={handleAddVoucher} className='gap-2'>
        <ListPlusIcon className='size-4' />
        Add Voucher
      </Button>
      <Button
        variant='outline'
        size='sm'
        onClick={() =>
          exportTableToCSV(table, {
            filename: 'vouchers-' + Date.now(),
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
