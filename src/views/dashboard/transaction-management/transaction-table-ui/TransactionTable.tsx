'use client'

import { ColumnDef } from '@tanstack/react-table'
import { type Table } from '@tanstack/react-table'
import * as React from 'react'

import { DataTable } from '@/components/ui/data-table/data-table'
import { DataTableToolbar } from '@/components/ui/data-table/data-table-toolbar'
import { useDataTable } from '@/hooks/useDataTable'
import { toSentenceCase } from '@/lib/utils'
import type { DataTableFilterField, DataTableQueryState } from '@/types/table'
import { TransactionTypeEnum, TTransaction } from '@/types/transaction'

import { CustomFilterFields } from './helper'
import { getColumns } from './TransactionsTableColumns'
import { TransactionTableToolbarActions } from './TransactionTableToolbarActions'

interface TransactionTableProps {
  data: TTransaction[]
  pageCount: number
  queryStates?: [
    DataTableQueryState<CustomFilterFields>,
    React.Dispatch<React.SetStateAction<DataTableQueryState<CustomFilterFields>>>
  ]
}

export function TransactionTable({ data, pageCount, queryStates }: TransactionTableProps) {
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
  const filterFields: DataTableFilterField<CustomFilterFields>[] = [
    {
      id: 'type',
      label: 'Type',
      options: Object.keys(TransactionTypeEnum).map((type) => {
        return {
          label: toSentenceCase(type),
          value: type
        }
      })
    },
    {
      id: 'startDate',
      label: 'Start Date',
      isDate: true,
      isCustomFilter: true
    },
    {
      id: 'endDate',
      label: 'End Date',
      isDate: true,
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
    data: data as CustomFilterFields[],
    columns: columns as ColumnDef<CustomFilterFields>[],
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
          <TransactionTableToolbarActions table={table as unknown as Table<TTransaction>} />
        </DataTableToolbar>
      </DataTable>
    </>
  )
}
