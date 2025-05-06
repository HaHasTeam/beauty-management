'use client'

import { QueryFunction, QueryKey, useQuery } from '@tanstack/react-query'
import * as React from 'react'
import { useMemo } from 'react'

import { DataTable } from '@/components/ui/data-table/data-table'
import { DataTableToolbar } from '@/components/ui/data-table/data-table-toolbar'
import { useDataTable } from '@/hooks/useDataTable'
import { toSentenceCase } from '@/lib/utils'
import { getAllProductApi } from '@/network/apis/product'
import { OrderEnum, PaymentMethod, ShippingStatusEnum } from '@/types/enum'
import { IOrder } from '@/types/order'
import type { DataTableFilterField, DataTableQueryState } from '@/types/table'

import { getStatusIcon } from './helper'
import { customFilterFunctions, DataTableRowAction, getColumns } from './OrdersTableColumns'
import { OrdersTableFloatingBar } from './OrdersTableFloatingBar'
import { OrderTableToolbarActions } from './OrderTableToolbarActions'
import { ViewDetailsOrderSheet } from './ViewDetailsOrderSheet'

interface OrderTableProps {
  data: IOrder[]
  pageCount: number
  queryStates?: [DataTableQueryState<IOrder>, React.Dispatch<React.SetStateAction<DataTableQueryState<IOrder>>>]
}

// Product interface with minimum required fields
interface ProductLike {
  id: string
  name: string
  [key: string]: unknown
}

// Generic response type
interface ResponseLike<T> {
  data: T
  [key: string]: unknown
}

export function OrderTable({ data, pageCount, queryStates }: OrderTableProps) {
  const [rowAction, setRowAction] = React.useState<DataTableRowAction<IOrder> | null>(null)

  // Type casting the query function to make TypeScript happy
  const { data: productListData } = useQuery({
    queryKey: [getAllProductApi.queryKey],
    queryFn: getAllProductApi.fn as unknown as QueryFunction<ResponseLike<ProductLike[]>, QueryKey>
  })

  // Safely handle the product list data with defensive coding
  const productList = React.useMemo(() => {
    const responseData = (productListData as ResponseLike<ProductLike[]> | undefined)?.data
    if (!responseData || !Array.isArray(responseData)) {
      return []
    }

    return responseData.map((product) => ({
      id: product.id || '',
      name: product.name || 'Unknown Product'
    }))
  }, [productListData])

  // Define filterFields before using it in columns
  const filterFields: DataTableFilterField<IOrder>[] = useMemo(() => {
    return [
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
      },
      {
        id: 'type',
        label: 'Type',
        options: Object.keys(OrderEnum)
          // .filter((type) => [OrderEnum.NORMAL, OrderEnum.GROUP_BUYING].includes(type as OrderEnum))
          .map((type) => {
            const value = OrderEnum[type as keyof typeof OrderEnum]
            return {
              label: toSentenceCase(value),
              value: value
            }
          })
      },
      {
        id: 'paymentMethod',
        label: 'Payment Method',
        options: Object.keys(PaymentMethod).map((paymentMethod) => {
          const value = PaymentMethod[paymentMethod as keyof typeof PaymentMethod]
          return {
            label: toSentenceCase(value),
            value: value
          }
        })
      },
      {
        id: 'orderDetails',
        label: 'Products',
        placeholder: 'Search by products',
        options: productList.map((product) => {
          return {
            label: product.name,
            value: product.id
          }
        })
      },
      {
        id: 'search',
        label: 'Search',
        placeholder: 'Search across id, brand name, product name, recipient name...',
        isCustomFilter: true
      }
    ]
  }, [productList])

  const columns = React.useMemo(() => {
    // Add custom filter handlers to columns configuration
    const cols = getColumns({ setRowAction })

    // For each custom filter in filterFields, create a pseudo-column
    // that can handle the filter but won't be rendered
    const customFilters = filterFields.filter((field) => field.isCustomFilter)

    customFilters.forEach((filter) => {
      // Check if we have a filter function for this filter
      const filterFn = customFilterFunctions[filter.id as keyof typeof customFilterFunctions]
      if (filterFn) {
        // Add a hidden column that handles this filter
        cols.push({
          id: filter.id,
          accessorFn: (row) => row, // Return the whole row for custom filtering
          enableHiding: true,
          meta: { isCustomFilter: true },
          // Use proper typing for the filter function
          filterFn: (row, filterValue) => {
            // Ensure filterValue is treated as string
            const stringValue = typeof filterValue === 'string' ? filterValue : String(filterValue || '')
            return filterFn(row.original, stringValue)
          },
          size: 0 // Zero size as it won't be displayed
        })
      }
    })

    return cols
  }, [setRowAction, filterFields])

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
