import { useQuery } from '@tanstack/react-query'
import { useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { useShallow } from 'zustand/react/shallow'

import { Card } from '@/components/ui/card'
import { DataTableSkeleton } from '@/components/ui/data-table/data-table-skeleton'
import { Shell } from '@/components/ui/shell'
import { getProductFilterApi } from '@/network/apis/product'
import { useStore } from '@/stores/store'
import { IResponseProduct } from '@/types/product'
import { DataTableQueryState } from '@/types/table'

import { ProductTable } from './ProductTable'

export default function IndexPage() {
  const [searchParams] = useSearchParams()
  const queryName = searchParams.get('name')
  const { userData } = useStore(
    useShallow((state) => {
      return {
        userData: state.user
      }
    })
  )

  const { data: ProductListData, isLoading: isProductListLoading } = useQuery({
    queryKey: [
      getProductFilterApi.queryKey,
      {
        search: queryName || '',
        brandId: userData?.brands?.length ? userData?.brands[0].id : ''
      }
    ],
    queryFn: getProductFilterApi.fn,
    enabled: !!userData?.brands?.length,
    select(data) {
      return data
    }
  })

  const queryStates = useState<DataTableQueryState<IResponseProduct>>({} as DataTableQueryState<IResponseProduct>)
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
              <ProductTable data={ProductListData?.data?.items ?? []} pageCount={1} queryStates={queryStates} />
            )}
          </Shell>
        </div>
      </div>
    </Card>
  )
}
