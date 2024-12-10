import { useQuery, useQueryClient } from '@tanstack/react-query'
import { useState } from 'react'

import { Card } from '@/components/ui/card'
import { DataTableSkeleton } from '@/components/ui/data-table/data-table-skeleton'
import { Shell } from '@/components/ui/shell'
import { getAllBrandsApi } from '@/network/apis/brand'
import { TBrand } from '@/types/brand'
import { DataTableQueryState } from '@/types/table'

import { BrandsTable } from './BrandsTable'

export default function IndexPage() {
  const queryClient = useQueryClient()
  const { data: brandListData, isLoading: isBrandListLoading } = useQuery({
    queryKey: [getAllBrandsApi.queryKey],
    queryFn: getAllBrandsApi.fn,
    refetchOnWindowFocus: false
  })
  const queryStates = useState<DataTableQueryState<TBrand>>({} as DataTableQueryState<TBrand>)
  return (
    <Card className={'border-zinc-200 p-3 dark:border-zinc-800 w-full'}>
      <div className='flex w-full flex-row sm:flex-wrap lg:flex-nowrap 2xl:overflow-hidden'>
        <div className='w-full flex items-center gap-4'>
          <Shell className='gap-2'>
            {isBrandListLoading ? (
              <DataTableSkeleton
                columnCount={1}
                searchableColumnCount={1}
                filterableColumnCount={2}
                cellWidths={['10rem', '40rem', '12rem', '12rem', '8rem', '8rem']}
                shrinkZero
              />
            ) : (
              <BrandsTable data={brandListData?.data ?? []} pageCount={1} queryStates={queryStates} />
            )}
          </Shell>
        </div>
      </div>
      <button
        onClick={() => {
          queryClient.invalidateQueries({
            queryKey: [getAllBrandsApi.queryKey]
          })
        }}
      >
        Test
      </button>
    </Card>
  )
}
