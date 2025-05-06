import { useQuery } from '@tanstack/react-query'
import { useState } from 'react'

import { Card } from '@/components/ui/card'
import { DataTableSkeleton } from '@/components/ui/data-table/data-table-skeleton'
import { Shell } from '@/components/ui/shell'
import { filterGroupBuyingsApi } from '@/network/apis/group-buying'
import { TGroupBuying } from '@/types/group-buying'
import { DataTableQueryState } from '@/types/table'

import { Table } from './Table'

export default function IndexPage() {
  const queryStates = useState<DataTableQueryState<TGroupBuying>>({} as DataTableQueryState<TGroupBuying>)
  const { data: groupBuyingData, isLoading: isLoading } = useQuery({
    queryKey: [
      filterGroupBuyingsApi.queryKey,
      {
        page: queryStates[0].page,
        limit: queryStates[0].perPage,
        sortBy: queryStates[0].sort?.[0]?.id,
        order: queryStates[0].sort?.[0]?.desc ? 'DESC' : 'ASC',
        statuses: (queryStates[0].fieldFilters?.status ?? []) as string[],
        groupProductId: queryStates[0].fieldFilters?.groupProductId as string
      }
    ],
    queryFn: filterGroupBuyingsApi.fn
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
              <Table
                data={groupBuyingData?.data?.items ?? []}
                pageCount={
                  groupBuyingData?.data?.total ? Math.ceil(groupBuyingData.data.total / queryStates[0].perPage) : 0
                }
                queryStates={queryStates}
              />
            )}
          </Shell>
        </div>
      </div>
    </Card>
  )
}
