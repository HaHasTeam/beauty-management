import { useQuery } from '@tanstack/react-query'
import { useState } from 'react'

import { Card } from '@/components/ui/card'
import { DataTableSkeleton } from '@/components/ui/data-table/data-table-skeleton'
import { Shell } from '@/components/ui/shell'
import { filterOrdersApi } from '@/network/apis/order'
import { OrderEnum, ShippingStatusEnum } from '@/types/enum'
import { IOrder } from '@/types/order'
import { DataTableQueryState } from '@/types/table'

import { OrderTable } from './OrderTable'

export default function IndexPage() {
  const queryStates = useState<DataTableQueryState<IOrder, { search: string }>>(
    {} as DataTableQueryState<IOrder, { search: string }>
  )

  const { data: orderListData, isLoading: isOrderListLoading } = useQuery({
    queryKey: [
      filterOrdersApi.queryKey,
      {
        page: queryStates[0].page,
        limit: queryStates[0].perPage,
        sortBy: queryStates[0].sort?.[0]?.id,
        order: queryStates[0].sort?.[0]?.desc ? 'DESC' : 'ASC',
        statuses: (queryStates[0].fieldFilters?.status ?? []) as ShippingStatusEnum[],
        types: (queryStates[0].fieldFilters?.type ?? []) as OrderEnum[],
        productIds: (queryStates[0].fieldFilters?.orderDetails ?? []) as string[],
        search: queryStates[0].fieldFilters?.search as string
      }
    ],
    queryFn: filterOrdersApi.fn
  })
  return (
    <Card className={'border-zinc-200 p-3 dark:border-zinc-800 w-full'}>
      <div className='flex w-full flex-row sm:flex-wrap lg:flex-nowrap 2xl:overflow-hidden'>
        <div className='w-full flex items-center gap-4'>
          <Shell className='gap-2'>
            {isOrderListLoading ? (
              <DataTableSkeleton
                columnCount={1}
                searchableColumnCount={1}
                filterableColumnCount={2}
                cellWidths={['10rem', '40rem', '12rem', '12rem', '8rem', '8rem']}
                shrinkZero
              />
            ) : (
              <OrderTable
                data={orderListData?.data.items ?? []}
                pageCount={Math.ceil((orderListData?.data.total ?? 0) / (orderListData?.data.limit ?? 10))}
                queryStates={
                  queryStates as unknown as [
                    DataTableQueryState<IOrder>,
                    React.Dispatch<React.SetStateAction<DataTableQueryState<IOrder>>>
                  ]
                }
              />
            )}
          </Shell>
        </div>
      </div>
    </Card>
  )
}
