'use client'

import { useQuery } from '@tanstack/react-query'
import * as React from 'react'

import { DataTable } from '@/components/ui/data-table/data-table'
import { DataTableToolbar } from '@/components/ui/data-table/data-table-toolbar'
import { useDataTable } from '@/hooks/useDataTable'
import { toSentenceCase } from '@/lib/utils'
import { getAllUserApi } from '@/network/apis/user'
import { IReport, ReportStatusEnum, ReportTypeEnum } from '@/types/report'
import type { DataTableFilterField, DataTableQueryState } from '@/types/table'

import { AssignReportDialog } from './AssignReportDialog'
import { DataTableRowAction, getColumns } from './ReportTableColumns'
import { ReportTableFloatingBar } from './ReportTableFloatingBar'
import { ReportTableToolbarActions } from './ReportTableToolbarActions'
import { ResolveReportDialog } from './ResolveReportDialog'
import { ViewReportModal } from './ViewReportModal'

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
  const { data: userList } = useQuery({
    queryKey: [getAllUserApi.queryKey],
    queryFn: getAllUserApi.fn
  })
  const users = userList?.data ?? []
  const filterFields: DataTableFilterField<IReport>[] = [
    {
      id: 'type',
      label: 'Type',
      options: Object.keys(ReportTypeEnum).map((type) => ({
        label: toSentenceCase(type),
        value: type
      }))
    },
    {
      id: 'status',
      label: 'Status',
      options: Object.keys(ReportStatusEnum).map((status) => ({
        label: toSentenceCase(status),
        value: status
      }))
    },
    {
      id: 'assigneeId',
      label: 'Assignee',
      options: users.map((user) => ({
        label: user.username ?? user.email ?? 'N/A',
        value: user.id
      })),
      isCustomFilter: true,
      isSingleChoice: true
    },
    {
      id: 'reason',
      label: 'Reason',
      placeholder: 'Search by reason',
      isCustomFilter: true
    }
  ]

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

      <ViewReportModal
        open={rowAction?.type === 'view'}
        onOpenChange={() => setRowAction(null)}
        report={rowAction?.row.original}
      />
    </>
  )
}
