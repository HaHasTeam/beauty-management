import { useQuery } from '@tanstack/react-query'
import { useState } from 'react'
import { useShallow } from 'zustand/react/shallow'

import { Card } from '@/components/ui/card'
import { DataTableSkeleton } from '@/components/ui/data-table/data-table-skeleton'
import { Shell } from '@/components/ui/shell'
import { getOnlyChildOrderListApi } from '@/network/apis/order'
import { useStore } from '@/stores/store'
import { IOrder } from '@/types/order'
import { DataTableQueryState } from '@/types/table'

import { OrderTable } from './OrderTable'

export default function IndexPage() {
  const { userData } = useStore(
    useShallow((state) => ({
      userData: state.user
    }))
  )

  const { data: orderListData, isLoading: isOrderListLoading } = useQuery({
    queryKey: [getOnlyChildOrderListApi.queryKey],
    queryFn: getOnlyChildOrderListApi.fn,
    enabled: !!userData?.id
  })
  const queryStates = useState<DataTableQueryState<IOrder>>({} as DataTableQueryState<IOrder>)
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
              <OrderTable data={orderListData?.data ?? []} pageCount={1} queryStates={queryStates} />
            )}
          </Shell>
        </div>
      </div>
    </Card>
  )
}
