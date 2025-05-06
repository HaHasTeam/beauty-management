'use client'

import * as React from 'react'

import { DataTable } from '@/components/ui/data-table/data-table'
import { DataTableToolbar } from '@/components/ui/data-table/data-table-toolbar'
import { useDataTable } from '@/hooks/useDataTable'
import { toSentenceCase } from '@/lib/utils'
import { ILivestream, LiveStreamStatusEnum } from '@/types/live-stream'
import type { DataTableFilterField, DataTableQueryState } from '@/types/table'

import { getStatusIcon } from './helper'
import { getColumns } from './TableColumns'
import { TableToolbarActions } from './TableToolbarActions'

interface TableProps {
  data: ILivestream[]
  pageCount: number
  queryStates?: [
    DataTableQueryState<ILivestream>,
    React.Dispatch<React.SetStateAction<DataTableQueryState<ILivestream>>>
  ]
}

export function Table({ data, pageCount, queryStates }: TableProps) {
  const columns = React.useMemo(() => getColumns(), [])

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

  const filterFields: DataTableFilterField<ILivestream>[] = [
    {
      id: 'title',
      label: 'Livestream title',
      placeholder: 'Search by title',
      isCustomFilter: true
    },
    {
      id: 'status',
      label: 'Status',
      options: Object.keys(LiveStreamStatusEnum).map((status) => {
        const value = LiveStreamStatusEnum[status as keyof typeof LiveStreamStatusEnum]
        return {
          label: toSentenceCase(value),
          value: value,
          icon: getStatusIcon(value).icon
        }
      })
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
      <DataTable table={table}>
        <DataTableToolbar table={table} filterFields={filterFields}>
          <TableToolbarActions table={table} />
        </DataTableToolbar>
      </DataTable>
    </>
  )
}
