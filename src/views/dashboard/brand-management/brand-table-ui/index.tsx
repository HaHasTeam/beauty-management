import { useQuery } from '@tanstack/react-query'
import { useState } from 'react'

import { Card } from '@/components/ui/card'
import { DataTableSkeleton } from '@/components/ui/data-table/data-table-skeleton'
import { Shell } from '@/components/ui/shell'
import { filterBrandsApi } from '@/network/apis/brand'
import { BrandStatusEnum, TBrand } from '@/types/brand'
import { DataTableQueryState } from '@/types/table'

import { BrandsTable } from './BrandsTable'

export default function IndexPage() {
  const queryStates = useState<DataTableQueryState<TBrand>>({} as DataTableQueryState<TBrand>)
  const { data: brandListData, isLoading: isBrandListLoading } = useQuery({
    queryKey: [
      filterBrandsApi.queryKey,
      {
        page: queryStates[0].page,
        limit: queryStates[0].perPage,
        sortBy: queryStates[0].sort?.[0]?.id,
        order: queryStates[0].sort?.[0]?.desc ? 'DESC' : 'ASC',
        statuses: (queryStates[0].fieldFilters?.status ?? []) as BrandStatusEnum[],
        name: queryStates[0].fieldFilters?.name as string
      }
    ],
    queryFn: filterBrandsApi.fn
  })
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
              <BrandsTable
                data={brandListData?.data?.items ?? []}
                pageCount={Math.ceil((brandListData?.data?.total ?? 0) / (queryStates[0].perPage ?? 10))}
                queryStates={queryStates}
              />
            )}
          </Shell>
        </div>
      </div>
    </Card>
  )
}
