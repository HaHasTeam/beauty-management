'use client'

import { useQuery } from '@tanstack/react-query'
import * as React from 'react'

import { DataTable } from '@/components/ui/data-table/data-table'
import { DataTableToolbar } from '@/components/ui/data-table/data-table-toolbar'
import { useDataTable } from '@/hooks/useDataTable'
import { toSentenceCase } from '@/lib/utils'
import { getAllProductApi } from '@/network/apis/product'
import { FlashSaleStatusEnum, TFlashSale } from '@/types/flash-sale'
import type { DataTableFilterField, DataTableQueryState } from '@/types/table'

import { BanFlashSalesDialog } from './BanFlashSalesDialog'
import { DataTableRowAction, getColumns } from './FlashSalesTableColumns'
import { FlashSalesTableFloatingBar } from './FlashSalesTableFloatingBar'
import { FlashSaleTableToolbarActions } from './FlashSalesTableToolbarActions'
import { getStatusIcon } from './helper'

interface FlashSaleTableProps {
  data: TFlashSale[]
  pageCount: number
  queryStates?: [DataTableQueryState<TFlashSale>, React.Dispatch<React.SetStateAction<DataTableQueryState<TFlashSale>>>]
}

export function FlashSaleTable({ data, pageCount, queryStates }: FlashSaleTableProps) {
  const [rowAction, setRowAction] = React.useState<DataTableRowAction<TFlashSale> | null>(null)
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
  const { data: productData } = useQuery({
    queryKey: [getAllProductApi.queryKey],
    queryFn: getAllProductApi.fn
  })
  const products = productData?.data ?? []

  const filterFields: DataTableFilterField<TFlashSale>[] = [
    {
      id: 'product',
      label: 'Product',
      placeholder: 'Search by product',
      options: products.map((product) => {
        return {
          label: product.name,
          value: product.id
        }
      }),
      isSingleChoice: true
    },
    {
      id: 'status',
      label: 'Status',
      options: Object.keys(FlashSaleStatusEnum).map((status) => {
        const value = FlashSaleStatusEnum[status as keyof typeof FlashSaleStatusEnum]
        return {
          label: toSentenceCase(value),
          value: value,
          icon: getStatusIcon(value).icon
        }
      })
    },
    {
      id: 'startTime',
      label: 'Start Time',
      isDate: true
    },
    {
      id: 'endTime',
      label: 'End Time',
      isDate: true
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
      <DataTable table={table} floatingBar={<FlashSalesTableFloatingBar table={table} />}>
        <DataTableToolbar table={table} filterFields={filterFields}>
          <FlashSaleTableToolbarActions table={table} />
        </DataTableToolbar>
      </DataTable>
      <BanFlashSalesDialog
        open={rowAction?.type === 'ban'}
        onOpenChange={() => setRowAction(null)}
        FlashSales={rowAction?.row.original ? [rowAction?.row.original] : []}
        showTrigger={false}
        onSuccess={() => rowAction?.row.toggleSelected(false)}
      />
    </>
  )
}
