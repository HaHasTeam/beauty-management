import { useMemo, useState } from 'react'
import { UseFormReturn } from 'react-hook-form'
import { z } from 'zod'

import { Card } from '@/components/ui/card'
import { DataTable } from '@/components/ui/data-table/data-table'
import { DataTableSkeleton } from '@/components/ui/data-table/data-table-skeleton'
import { Shell } from '@/components/ui/shell'
import { useDataTable } from '@/hooks/useDataTable'
import { voucherCreateSchema } from '@/schemas'
import { IProductTable, IResponseProduct } from '@/types/product'
import { DataTableQueryState } from '@/types/table'
import { convertToProductTable } from '@/utils'

import { getColumns } from './ProductsTableColumns'

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
      const currentSelected: Set<string> = new Set(form.getValues('selectedProducts') || [])
      if (currentSelected.has(productId)) {
        currentSelected.delete(productId)
      }
      form.setValue('selectedProducts', Array.from(currentSelected))
    }

    return getColumns({ onDelete: deleteProduct, handleProductSelect: handleProductSelect })
  }, [form, handleProductSelect])
  const queryStates = useState<DataTableQueryState<IProductTable>>({} as DataTableQueryState<IProductTable>)
  const { table } = useDataTable({
    queryStates,
    data: convertToProductTable(list) ?? [],
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
