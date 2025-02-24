'use client'

import * as React from 'react'

import { DataTable } from '@/components/ui/data-table/data-table'
import { DataTableToolbar } from '@/components/ui/data-table/data-table-toolbar'
import { useDataTable } from '@/hooks/useDataTable'
import { toSentenceCase } from '@/lib/utils'
import { ShippingStatusEnum } from '@/types/enum'
import { IOrder } from '@/types/order'
import type { DataTableFilterField, DataTableQueryState } from '@/types/table'

import { getStatusIcon } from './helper'
import { DataTableRowAction, getColumns } from './OrdersTableColumns'
import { OrdersTableFloatingBar } from './OrdersTableFloatingBar'
import { OrderTableToolbarActions } from './OrderTableToolbarActions'
import { ViewDetailsOrderSheet } from './ViewDetailsOrderSheet'

interface OrderTableProps {
  data: IOrder[]
  pageCount: number
  queryStates?: [DataTableQueryState<IOrder>, React.Dispatch<React.SetStateAction<DataTableQueryState<IOrder>>>]
}

export function OrderTable({ data, pageCount, queryStates }: OrderTableProps) {
  const [rowAction, setRowAction] = React.useState<DataTableRowAction<IOrder> | null>(null)
  const columns = React.useMemo(() => getColumns({ setRowAction }), [])

  const filterFields: DataTableFilterField<IOrder>[] = [
    {
      id: 'status',
      label: 'Status',
      options: Object.keys(ShippingStatusEnum).map((status) => {
        const value = ShippingStatusEnum[status as keyof typeof ShippingStatusEnum]
        return {
          label: toSentenceCase(value),
          value: value,
          icon: getStatusIcon(value).icon
        }
      })
    }
  ]

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
      <DataTable table={table} floatingBar={<OrdersTableFloatingBar table={table} />}>
        <DataTableToolbar table={table} filterFields={filterFields}>
          <OrderTableToolbarActions table={table} />
        </DataTableToolbar>
      </DataTable>
      <ViewDetailsOrderSheet
        order={rowAction?.row.original}
        open={rowAction?.type === 'view'}
        onOpenChange={() => setRowAction(null)}
      />
    </>
  )
}
