'use client'

import * as React from 'react'

import { DataTable } from '@/components/ui/data-table/data-table'
import { DataTableToolbar } from '@/components/ui/data-table/data-table-toolbar'
import { useDataTable } from '@/hooks/useDataTable'
import { ICategory } from '@/types/category'
import type { DataTableFilterField, DataTableQueryState } from '@/types/table'

import { BanCategoriesDialog } from './BanCategoryDialog'
import { DataTableRowAction, getColumns } from './CategoryTableColumns'
import { CategoryTableFloatingBar } from './CategoryTableFloatingBar'
import { CategoryTableToolbarActions } from './CategoryTableToolbarActions'
import { ViewDetailsCategorySheet } from './ViewDetailsCategorySheet'

interface CategoryTableProps {
  data: ICategory[]
  pageCount: number
  queryStates?: [DataTableQueryState<ICategory>, React.Dispatch<React.SetStateAction<DataTableQueryState<ICategory>>>]
}

export function CategoryTable({ data, pageCount, queryStates }: CategoryTableProps) {
  const [rowAction, setRowAction] = React.useState<DataTableRowAction<ICategory> | null>(null)
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
  const filterFields: DataTableFilterField<ICategory>[] = []

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
      <DataTable table={table} floatingBar={<CategoryTableFloatingBar table={table} />}>
        <DataTableToolbar table={table} filterFields={filterFields}>
          <CategoryTableToolbarActions table={table} />
        </DataTableToolbar>
      </DataTable>
      <BanCategoriesDialog
        open={rowAction?.type === 'ban'}
        onOpenChange={() => setRowAction(null)}
        Categories={rowAction?.row.original ? [rowAction?.row.original] : []}
        showTrigger={false}
        onSuccess={() => rowAction?.row.toggleSelected(false)}
      />
      <ViewDetailsCategorySheet
        Category={rowAction?.row.original}
        open={rowAction?.type === 'view'}
        onOpenChange={() => setRowAction(null)}
      />
    </>
  )
}
