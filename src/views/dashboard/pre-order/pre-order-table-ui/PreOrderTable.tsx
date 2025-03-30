'use client'

import { useQuery } from '@tanstack/react-query'
import * as React from 'react'

import { DataTable } from '@/components/ui/data-table/data-table'
import { DataTableToolbar } from '@/components/ui/data-table/data-table-toolbar'
import { useDataTable } from '@/hooks/useDataTable'
import { toSentenceCase } from '@/lib/utils'
import { getAllProductApi } from '@/network/apis/product'
import { PreOrderStatusEnum, TPreOrder } from '@/types/pre-order'
import type { DataTableFilterField, DataTableQueryState } from '@/types/table'

import { getStatusIcon } from './helper'
import { getColumns } from './PreOrdersTableColumns'
import { PreOrdersTableFloatingBar } from './PreOrdersTableFloatingBar'
import { PreOrderTableToolbarActions } from './PreOrdersTableToolbarActions'

interface PreOrderTableProps {
  data: TPreOrder[]
  pageCount: number
  queryStates?: [DataTableQueryState<TPreOrder>, React.Dispatch<React.SetStateAction<DataTableQueryState<TPreOrder>>>]
}

export function PreOrderTable({ data, pageCount, queryStates }: PreOrderTableProps) {
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
  const filterFields: DataTableFilterField<TPreOrder>[] = [
    {
      id: 'product',
      label: 'Products',
      placeholder: 'Filter by products...',
      options: products.map((product) => {
        return {
          label: product.name,
          value: product.id
        }
      })
    },
    {
      id: 'status',
      label: 'Status',
      options: Object.keys(PreOrderStatusEnum).map((status) => {
        const value = PreOrderStatusEnum[status as keyof typeof PreOrderStatusEnum]
        return {
          label: toSentenceCase(value),
          value: value,
          icon: getStatusIcon(value).icon
        }
      })
    },
    {
      id: 'startTime',
      label: 'Start Date',
      isDate: true
    },
    {
      id: 'endTime',
      label: 'End Date',
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
      <DataTable table={table} floatingBar={<PreOrdersTableFloatingBar table={table} />}>
        <DataTableToolbar table={table} filterFields={filterFields}>
          <PreOrderTableToolbarActions table={table} />
        </DataTableToolbar>
      </DataTable>
    </>
  )
}
