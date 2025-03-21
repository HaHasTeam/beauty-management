'use client'

import { Flag } from 'lucide-react'
import * as React from 'react'

import { DataTable } from '@/components/ui/data-table/data-table'
import { DataTableToolbar } from '@/components/ui/data-table/data-table-toolbar'
import { Dialog, DialogContent, DialogDescription, DialogTitle } from '@/components/ui/dialog'
import { useDataTable } from '@/hooks/useDataTable'
import { IReport } from '@/types/report'
import type { DataTableFilterField, DataTableQueryState } from '@/types/table'

import { AssignReportDialog } from './AssignReportDialog'
import { BanReportDialog } from './BanReportDialog'
import Modal from './Modal'
import { DataTableRowAction, getColumns } from './ReportTableColumns'
import { ReportTableFloatingBar } from './ReportTableFloatingBar'
import { ReportTableToolbarActions } from './ReportTableToolbarActions'
import { ResolveReportDialog } from './ResolveReportDialog'

interface ReportTableProps {
  data: IReport[]
  pageCount: number
  queryStates?: [DataTableQueryState<IReport>, React.Dispatch<React.SetStateAction<DataTableQueryState<IReport>>>]
}

export function ReportTable({ data, pageCount, queryStates }: ReportTableProps) {
  const [rowAction, setRowAction] = React.useState<DataTableRowAction<IReport> | null>(null)
  const columns = React.useMemo(
    () =>
      getColumns({
        setRowAction
      }),
    []
  )

  /**
   * This component can render either a faceted filter or a search filter based on the `options` prop.
   *
   * @prop options - An array of objects, each representing a filter option. If provided, a faceted filter is rendered. If not, a search filter is rendered.
   *
   * Each `option` object has the following properties:
   * @prop {string} label - The label for the filter option.
   * @prop {string} value - The value for the filter option.
   * @prop {React.ReactNode} [icon] - An optional icon to display next to the label.
   * @prop {boolean} [withCount] - An optional boolean to display the count of the filter option.
   */
  const filterFields: DataTableFilterField<IReport>[] = []

  /**
   * Advanced filter fields for the data table.
   * These fields provide more complex filtering options compared to the regular filterFields.
   *
   * Key differences from regular filterFields:
   * 1. More field types: Includes 'text', 'multi-select', 'date', and 'boolean'.
   * 2. Enhanced flexibility: Allows for more precise and varied filtering options.
   * 3. Used with DataTableAdvancedToolbar: Enables a more sophisticated filtering UI.
   * 4. Date and boolean types: Adds support for filtering by date ranges and boolean values.
   */

  const { table } = useDataTable({
    queryStates,
    data,
    columns,
    pageCount,
    filterFields,
    initialState: {
      sorting: [{ id: 'createdAt', desc: true }],
      columnPinning: { right: ['actions'] }
    },
    getRowId: (originalRow, index) => `${originalRow.id}-${index}`,
    shallow: false,
    clearOnDefault: true
  })

  return (
    <>
      <DataTable table={table} floatingBar={<ReportTableFloatingBar table={table} />}>
        <DataTableToolbar table={table} filterFields={filterFields}>
          <ReportTableToolbarActions table={table} />
        </DataTableToolbar>
      </DataTable>
      <BanReportDialog
        open={rowAction?.type === 'ban'}
        onOpenChange={() => setRowAction(null)}
        Report={rowAction?.row.original ? [rowAction?.row.original] : []}
        showTrigger={false}
        onSuccess={() => rowAction?.row.toggleSelected(false)}
      />
      <AssignReportDialog
        open={rowAction?.type === 'assign'}
        onOpenChange={() => setRowAction(null)}
        Report={rowAction?.row.original ? [rowAction?.row.original] : []}
        showTrigger={false}
        onSuccess={() => rowAction?.row.toggleSelected(false)}
      />
      <ResolveReportDialog
        open={rowAction?.type === 'resolve'}
        onOpenChange={() => setRowAction(null)}
        Report={rowAction?.row.original ? [rowAction?.row.original] : []}
        showTrigger={false}
        onSuccess={() => rowAction?.row.toggleSelected(false)}
      />
      <Dialog open={rowAction?.type === 'view'} onOpenChange={() => setRowAction(null)}>
        <DialogContent className='max-w-2xl overflow-auto! max-h-[70%]'>
          <DialogTitle className='flex items-center gap-2'>
            <Flag className='h-5 w-5' />
            View Report Details
          </DialogTitle>
          <DialogDescription>
            <div className='text-gray-600 text-sm'>See the details of the report and take necessary actions.</div>
          </DialogDescription>
          <Modal
            viewOnly
            setOpen={() => setRowAction(null)}
            open={rowAction?.type === 'resolve'}
            onOpenChange={() => setRowAction(null)}
            Report={rowAction?.row.original ? [rowAction?.row.original] : []}
            showTrigger={false}
            onSuccess={() => rowAction?.row.toggleSelected(false)}
          />
        </DialogContent>
      </Dialog>
    </>
  )
}
