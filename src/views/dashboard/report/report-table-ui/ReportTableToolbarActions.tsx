import { type Table } from '@tanstack/react-table'
import { Download } from 'lucide-react'

import Button from '@/components/button'
import { exportTableToCSV } from '@/lib/export'
import { IReport } from '@/types/report'

import { BanReportDialog } from './BanReportDialog'

interface ReportTableToolbarActionsProps {
  table: Table<IReport>
}

export function ReportTableToolbarActions({ table }: ReportTableToolbarActionsProps) {
  return (
    <div className='flex items-center gap-2'>
      {table.getFilteredSelectedRowModel().rows.length > 0 ? (
        <BanReportDialog
          Report={table.getFilteredSelectedRowModel().rows.map((row) => row.original)}
          onSuccess={() => table.toggleAllRowsSelected(false)}
        />
      ) : null}

      {/* Use the CreateReportDialog with its built-in trigger button */}
      {/* <CreateReportDialog
        showTrigger={true}
        onSuccess={() => {
          table.resetRowSelection()
        }}
      /> */}

      <Button
        variant='outline'
        size='sm'
        onClick={() =>
          exportTableToCSV(table, {
            filename: 'Report' + Date.now(),
            excludeColumns: ['select', 'actions']
          })
        }
        className='gap-2'
      >
        <Download className='size-4' aria-hidden='true' />
        Export
      </Button>
    </div>
  )
}
