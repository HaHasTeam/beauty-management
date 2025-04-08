'use client'

import * as React from 'react'

import { DataTable } from '@/components/ui/data-table/data-table'
import { DataTableToolbar } from '@/components/ui/data-table/data-table-toolbar'
import { useDataTable } from '@/hooks/useDataTable'
import { toSentenceCase } from '@/lib/utils'
import { useStore } from '@/stores/store'
import { OrderRequestTypeEnum, RoleEnum } from '@/types/enum'
import { OrderRequestStatusEnum, TOrderRequest } from '@/types/order-request'
import type { DataTableFilterField, DataTableQueryState } from '@/types/table'

import { getStatusIcon } from './helper'
import { useOrderRequestTableColumns } from './OrderRequestTableColumns'
import { OrderRequestTableToolbarActions } from './OrderRequestTableToolbarActions'

interface OrderRequestTableProps {
  data: TOrderRequest[]
  pageCount: number
  queryStates?: [
    DataTableQueryState<TOrderRequest>,
    React.Dispatch<React.SetStateAction<DataTableQueryState<TOrderRequest>>>
  ]
}

export function OrderRequestTable({ data, pageCount, queryStates }: OrderRequestTableProps) {
  const columns = useOrderRequestTableColumns()

  const { user } = useStore()
  const filterFields: DataTableFilterField<TOrderRequest>[] = [
    {
      id: 'status',
      label: 'Status',
      options: Object.keys(OrderRequestStatusEnum).map((status) => {
        const value = OrderRequestStatusEnum[status as keyof typeof OrderRequestStatusEnum]
        return {
          label: toSentenceCase(value),
          value: value,
          icon: getStatusIcon(value).icon
        }
      })
    },
    {
      id: 'type',
      label: 'Type',
      options: Object.keys(OrderRequestTypeEnum)
        .filter((type) => {
          const value = OrderRequestTypeEnum[type as keyof typeof OrderRequestTypeEnum]
          if (user?.role === RoleEnum.ADMIN || user?.role === RoleEnum.OPERATOR) {
            return [OrderRequestTypeEnum.REJECT_REFUND, OrderRequestTypeEnum.COMPLAINT].includes(value)
          } else if (user?.role === RoleEnum.MANAGER || user?.role === RoleEnum.STAFF) {
            return [OrderRequestTypeEnum.CANCEL, OrderRequestTypeEnum.REFUND].includes(value)
          }
          return false
        })
        .map((type) => {
          const value = OrderRequestTypeEnum[type as keyof typeof OrderRequestTypeEnum]
          return {
            label: toSentenceCase(value),
            value: value
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
      <DataTable table={table}>
        <DataTableToolbar table={table} filterFields={filterFields}>
          <OrderRequestTableToolbarActions table={table} />
        </DataTableToolbar>
      </DataTable>
    </>
  )
}
