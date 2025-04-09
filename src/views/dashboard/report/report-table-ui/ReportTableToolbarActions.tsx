import { type Table } from '@tanstack/react-table'
import { Download, Flag, ListPlusIcon } from 'lucide-react'
import { useState } from 'react'

import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogDescription, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { exportTableToCSV } from '@/lib/export'
import { IReport } from '@/types/report'

import { BanReportDialog } from './BanReportDialog'
import Modal from './Modal'

interface ReportTableToolbarActionsProps {
  table: Table<IReport>
}

export function ReportTableToolbarActions({ table }: ReportTableToolbarActionsProps) {
  const handleAddReport = () => {}
  const [isOpened, setIsOpened] = useState(false)
  return (
    <div className='flex items-center gap-2'>
      {table.getFilteredSelectedRowModel().rows.length > 0 ? (
        <BanReportDialog
          Report={table.getFilteredSelectedRowModel().rows.map((row) => row.original)}
          onSuccess={() => table.toggleAllRowsSelected(false)}
        />
      ) : null}
      <Dialog open={isOpened} onOpenChange={setIsOpened}>
        <DialogTrigger>
          <Button size={'sm'} onClick={handleAddReport}>
            <ListPlusIcon />
            Add Report
          </Button>
        </DialogTrigger>
        <DialogContent className='max-w-2xl max-h-[70%] overflow-auto'>
          <DialogTitle className='flex items-center gap-2'>
            <Flag className='h-5 w-5' />
            New Report
          </DialogTitle>
          <DialogDescription>
            <div className='text-gray-600 text-sm'>Please fill in the form below to report a new issue.</div>
          </DialogDescription>
          <Modal
            Report={[]}
            setOpen={(open: boolean) => {
              setIsOpened(open)
            }}
          />
        </DialogContent>
      </Dialog>

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

      {/**
       * Other actions can be added here.
       * For example, import, view, etc.
       */}
    </div>
  )
}
