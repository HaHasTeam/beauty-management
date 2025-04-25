import { type Table } from '@tanstack/react-table'
import { Download, ListPlusIcon } from 'lucide-react'
import { useState } from 'react'

import Button from '@/components/button'
import { exportTableToCSV } from '@/lib/export'
import { IReport } from '@/types/report'

import { BanReportDialog } from './BanReportDialog'
import { CreateReportDialog } from './CreateReportDialog'

interface ReportTableToolbarActionsProps {
  table: Table<IReport>
}

export function ReportTableToolbarActions({ table }: ReportTableToolbarActionsProps) {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)

  return (
    <div className='flex items-center gap-2'>
      {table.getFilteredSelectedRowModel().rows.length > 0 ? (
        <BanReportDialog
          Report={table.getFilteredSelectedRowModel().rows.map((row) => row.original)}
          onSuccess={() => table.toggleAllRowsSelected(false)}
        />
      ) : null}

      <Button size={'sm'} onClick={() => setIsCreateDialogOpen(true)}>
        <ListPlusIcon className='mr-2 h-4 w-4' />
        Add Report
      </Button>

      <CreateReportDialog
        open={isCreateDialogOpen}
        onOpenChange={setIsCreateDialogOpen}
        onSuccess={() => {
          // Reset row selection and potentially trigger a data refetch
          table.resetRowSelection()
          // If using React Query and you have a query client method to refetch data
          // queryClient.invalidateQueries(['reports'])
        }}
      />

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
