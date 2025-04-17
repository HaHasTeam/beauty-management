import { useQuery } from '@tanstack/react-query'
import { useState } from 'react'

import { Card } from '@/components/ui/card'
import { DataTableSkeleton } from '@/components/ui/data-table/data-table-skeleton'
import { Shell } from '@/components/ui/shell'
import { filterOrderRequests } from '@/network/apis/order/order-request'
import { OrderRequestTypeEnum, RequestStatusEnum } from '@/types/enum'
import { TOrderRequest } from '@/types/order-request'
import { DataTableQueryState } from '@/types/table'

import { OrderRequestTable } from './OrderRequestTable'

export default function OrderRequestsTableUI() {
  const queryStates = useState<DataTableQueryState<TOrderRequest>>({} as DataTableQueryState<TOrderRequest>)

  const { data: orderRequestsData, isLoading: isOrderRequestsLoading } = useQuery({
    queryKey: [
      filterOrderRequests.queryKey,
      {
        page: queryStates[0].page,
        limit: queryStates[0].perPage,
        sortBy: queryStates[0].sort?.[0]?.id,
        order: queryStates[0].sort?.[0]?.desc ? 'DESC' : 'ASC',
        statuses: (queryStates[0].fieldFilters?.status ?? []) as RequestStatusEnum[],
        types: (queryStates[0].fieldFilters?.type ?? []) as OrderRequestTypeEnum[]
      }
    ],
    queryFn: filterOrderRequests.fn
  })

  return (
    <Card className={'border-zinc-200 p-3 dark:border-zinc-800 w-full'}>
      <div className='flex w-full flex-row sm:flex-wrap lg:flex-nowrap 2xl:overflow-hidden'>
        <div className='w-full flex items-center gap-4'>
          <Shell className='gap-2'>
            {isOrderRequestsLoading ? (
              <DataTableSkeleton
                columnCount={6}
                searchableColumnCount={1}
                filterableColumnCount={2}
                cellWidths={['4rem', '12rem', '12rem', '12rem', '10rem', '14rem']}
                shrinkZero
              />
            ) : (
              <OrderRequestTable
                data={orderRequestsData?.data?.items ?? []}
                pageCount={
                  orderRequestsData?.data?.total ? Math.ceil(orderRequestsData.data.total / queryStates[0].perPage) : 0
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
