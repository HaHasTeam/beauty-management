import { useQuery } from '@tanstack/react-query'
import { useState } from 'react'
import { useShallow } from 'zustand/react/shallow'

import { Card } from '@/components/ui/card'
import { DataTableSkeleton } from '@/components/ui/data-table/data-table-skeleton'
import { Shell } from '@/components/ui/shell'
import { getFlashSaleFilterApi } from '@/network/apis/flash-sale'
import { GetFlashSaleFilterRequestParams } from '@/network/apis/flash-sale/type'
import { useStore } from '@/stores/store'
import { TFlashSale } from '@/types/flash-sale'
import { DataTableQueryState } from '@/types/table'

import { FlashSaleTable } from './FlashSaleTable'

export default function IndexPage() {
  const { userData } = useStore(
    useShallow((state) => {
      return {
        userData: state.user
      }
    })
  )

  const queryStates = useState<DataTableQueryState<TFlashSale>>({} as DataTableQueryState<TFlashSale>)

  const { data: flashSaleListData, isLoading: isFlashSaleListLoading } = useQuery({
    queryKey: [
      getFlashSaleFilterApi.queryKey,
      {
        page: queryStates[0].page,
        limit: queryStates[0].perPage,
        sortBy: queryStates[0].sort?.[0]?.id,
        order: queryStates[0].sort?.[0]?.desc ? 'DESC' : 'ASC',
        startTime: queryStates[0].fieldFilters?.startTime as string,
        endTime: queryStates[0].fieldFilters?.endTime as string,
        productId: queryStates[0].fieldFilters?.product as string,
        brandId: queryStates[0].fieldFilters?.brand as string,
        statuses: ((queryStates[0].fieldFilters?.status ?? []) as string[]).join(',')
      } as GetFlashSaleFilterRequestParams
    ],
    queryFn: getFlashSaleFilterApi.fn,
    enabled: !!userData?.brands?.length
  })

  return (
    <Card className={'border-zinc-200 p-3 dark:border-zinc-800 w-full'}>
      <div className='flex w-full flex-row sm:flex-wrap lg:flex-nowrap 2xl:overflow-hidden'>
        <div className='w-full flex items-center gap-4'>
          <Shell className='gap-2'>
            {isFlashSaleListLoading ? (
              <DataTableSkeleton
                columnCount={1}
                searchableColumnCount={1}
                filterableColumnCount={2}
                cellWidths={['10rem', '40rem', '12rem', '12rem', '8rem', '8rem']}
                shrinkZero
              />
            ) : (
              <FlashSaleTable
                data={flashSaleListData?.data?.items ?? []}
                pageCount={
                  flashSaleListData?.data?.total ? Math.ceil(flashSaleListData.data.total / queryStates[0].perPage) : 0
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
