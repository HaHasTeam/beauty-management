'use client'

// Update the IndexPage component to handle product selection

import { useEffect, useMemo, useState } from 'react'
import type { UseFormReturn } from 'react-hook-form'
import type { z } from 'zod'

import { Card } from '@/components/ui/card'
import { DataTable } from '@/components/ui/data-table/data-table'
import { DataTableSkeleton } from '@/components/ui/data-table/data-table-skeleton'
import { Shell } from '@/components/ui/shell'
import { useDataTable } from '@/hooks/useDataTable'
import type { voucherCreateSchema } from '@/schemas'
// Update the type imports to match your actual types
import type { IProductTable, IResponseProduct } from '@/types/product'
import type { DataTableQueryState } from '@/types/table'
import { convertToProductTable2 } from '@/utils'

import { getColumns } from './ProductsTableColumns'

// Helper function to safely extract the array of product IDs
function getProductIdsArray(value: unknown): string[] {
  if (Array.isArray(value)) {
    return value
  }

  if (value && typeof value === 'object' && value !== null) {
    // Check if it has a selectedProducts property that is an array
    const objValue = value as Record<string, unknown>
    if ('selectedProducts' in objValue && Array.isArray(objValue.selectedProducts)) {
      return objValue.selectedProducts
    }
  }

  return []
}

export default function IndexPage({
  isLoading,
  list,
  form,
  isDialog,
  handleProductSelect
}: {
  isLoading: boolean
  list: IResponseProduct[]
  form: UseFormReturn<z.infer<typeof voucherCreateSchema>>
  isDialog: boolean
  handleProductSelect?: (productId: string) => void
}) {
  const columns = useMemo(() => {
    const deleteProduct = (productId: string) => {
      const rawValue = form.getValues('selectedProducts')
      const currentProductIds = getProductIdsArray(rawValue)
      const currentSelected = new Set(currentProductIds)

      if (currentSelected.has(productId)) {
        currentSelected.delete(productId)
      }
      form.setValue('selectedProducts', Array.from(currentSelected))
    }

    return getColumns({
      onDelete: deleteProduct,
      handleProductSelect: (productId: string) => {
        // Get current selected products
        const rawValue = form.getValues('selectedProducts')
        const currentProductIds = getProductIdsArray(rawValue)
        const currentSelected = new Set(currentProductIds)

        // Toggle selection
        if (currentSelected.has(productId)) {
          currentSelected.delete(productId)
        } else {
          currentSelected.add(productId)
        }

        // Update form value
        form.setValue('selectedProducts', Array.from(currentSelected))

        // Call external handler if provided
        if (handleProductSelect) {
          handleProductSelect(productId)
        }
      }
    })
  }, [form, handleProductSelect])

  const queryStates = useState<DataTableQueryState<IProductTable>>({} as DataTableQueryState<IProductTable>)
  // Update the data table initialization to handle the type correctly
  const { table } = useDataTable({
    queryStates,
    data: convertToProductTable2(list) ?? [],
    columns,
    pageCount: 1,
    initialState: {
      columnVisibility: {
        select: isDialog,
        actions: !isDialog,
        createdAt: false
      },
      sorting: [{ id: 'createdAt', desc: true }],
      columnPinning: { right: ['actions'] }
    },
    getRowId: (originalRow, index) => `${originalRow.id}-${index}`,
    shallow: false,
    clearOnDefault: true
  })

  // Set row selection based on form values
  useEffect(() => {
    const rawValue = form.getValues('selectedProducts')
    const selectedProducts = getProductIdsArray(rawValue)

    if (table && selectedProducts.length > 0) {
      table.getRowModel().rows.forEach((row) => {
        const isSelected = selectedProducts.includes(row.original.id || '')
        row.toggleSelected(isSelected)
      })
    }
  }, [form, table])

  return (
    <Card className={'border-zinc-200 p-3 dark:border-zinc-800 w-full'}>
      <div className='flex w-full flex-row sm:flex-wrap lg:flex-nowrap 2xl:overflow-hidden'>
        <div className='w-full flex items-center gap-4'>
          <Shell className='gap-2'>
            {isLoading ? (
              <DataTableSkeleton
                columnCount={1}
                searchableColumnCount={1}
                filterableColumnCount={2}
                cellWidths={['10rem', '40rem', '12rem', '12rem', '8rem', '8rem']}
                shrinkZero
              />
            ) : (
              <DataTable table={table}></DataTable>
            )}
          </Shell>
        </div>
      </div>
    </Card>
  )
}
