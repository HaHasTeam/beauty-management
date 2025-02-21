import { useQuery } from '@tanstack/react-query'
import { useState } from 'react'
import { useShallow } from 'zustand/react/shallow'

import { Card } from '@/components/ui/card'
import { DataTableSkeleton } from '@/components/ui/data-table/data-table-skeleton'
import { Shell } from '@/components/ui/shell'
import { getAllProductApi } from '@/network/apis/product'
import { useStore } from '@/stores/store'
import { TProduct } from '@/types/product'
import { DataTableQueryState } from '@/types/table'

import { ProductTable } from './ProductTable'

export default function IndexPage() {
  const { userData } = useStore(
    useShallow((state) => {
      return {
        userData: state.user
      }
    })
  )

  const { data: ProductListData, isLoading: isProductListLoading } = useQuery({
    queryKey: [
      getAllProductApi.queryKey
      // {
      //   brandId: userData?.brands?.length ? userData?.brands[0].id : ''
      // }
    ],
    queryFn: getAllProductApi.fn,
    enabled: !!userData?.brands?.length
  })

  const queryStates = useState<DataTableQueryState<TProduct>>({} as DataTableQueryState<TProduct>)
  return (
    <Card className={'border-zinc-200 p-3 dark:border-zinc-800 w-full'}>
      <div className='flex w-full flex-row sm:flex-wrap lg:flex-nowrap 2xl:overflow-hidden'>
        <div className='w-full flex items-center gap-4'>
          <Shell className='gap-2'>
            {isProductListLoading ? (
              <DataTableSkeleton
                columnCount={1}
                searchableColumnCount={1}
                filterableColumnCount={2}
                cellWidths={['10rem', '40rem', '12rem', '12rem', '8rem', '8rem']}
                shrinkZero
              />
            ) : (
              <ProductTable data={ProductListData?.data ?? []} pageCount={1} queryStates={queryStates} />
            )}
          </Shell>
        </div>
      </div>
    </Card>
  )
}
