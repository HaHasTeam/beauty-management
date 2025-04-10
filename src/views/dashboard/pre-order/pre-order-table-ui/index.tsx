import { useQuery } from '@tanstack/react-query'
import { useState } from 'react'

import { Card } from '@/components/ui/card'
import { DataTableSkeleton } from '@/components/ui/data-table/data-table-skeleton'
import { Shell } from '@/components/ui/shell'
import { getPreOrderFilterApi } from '@/network/apis/pre-order'
import { TPreOrder } from '@/types/pre-order'
import { DataTableQueryState } from '@/types/table'

import { PreOrderTable } from './PreOrderTable'

export default function IndexPage() {
  const queryStates = useState<DataTableQueryState<TPreOrder>>({} as DataTableQueryState<TPreOrder>)
  const customFilters = queryStates[0].fieldFilters as unknown as DataTableQueryState<TPreOrder>['fieldFilters']

  const { data: preOrderListData, isLoading: isPreOrderListLoading } = useQuery({
    queryKey: [
      getPreOrderFilterApi.queryKey,
      {
        page: queryStates[0].page,
        limit: queryStates[0].perPage,
        sortBy: queryStates[0].sort?.[0]?.id,
        order: queryStates[0].sort?.[0]?.desc ? 'DESC' : 'ASC',
        productIds: ((customFilters?.product ?? []) as string[]).join(','),
        statuses: ((customFilters?.status ?? []) as string[]).join(','),
        startTime: customFilters?.startTime as string,
        endTime: customFilters?.endTime as string
      }
    ],
    queryFn: getPreOrderFilterApi.fn
  })

  return (
    <Card className={'border-zinc-200 p-3 dark:border-zinc-800 w-full'}>
      <div className='flex w-full flex-row sm:flex-wrap lg:flex-nowrap 2xl:overflow-hidden'>
        <div className='w-full flex items-center gap-4'>
          <Shell className='gap-2'>
            {isPreOrderListLoading ? (
              <DataTableSkeleton
                columnCount={1}
                searchableColumnCount={1}
                filterableColumnCount={2}
                cellWidths={['10rem', '40rem', '12rem', '12rem', '8rem', '8rem']}
                shrinkZero
              />
            ) : (
              <PreOrderTable
                data={preOrderListData?.data?.items ?? []}
                pageCount={
                  preOrderListData?.data?.total ? Math.ceil(preOrderListData?.data?.total / queryStates[0].perPage) : 0
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
