import { useQuery } from '@tanstack/react-query'
import { useState } from 'react'


import { Shell } from '@/components/ui/shell'
import { DataTableQueryState } from '@/types/table'
import { OrderStatic, TGetDailyOrderStatisticsParams } from '@/network/apis/transaction/type'
import { getDailyOrderStatistics } from '@/network/apis/transaction'
import { OrderEnum, RoleEnum } from '@/types/enum'
import { useStore } from '@/stores/store'
import { OrderStaticCard } from './OrderStaticCard'
import { Skeleton } from '@/components/ui/skeleton'
import { Card } from '../../card'

export default function IndexPage() {
  const queryStates = useState<DataTableQueryState<TGetDailyOrderStatisticsParams>>(
    {} as DataTableQueryState<TGetDailyOrderStatisticsParams>
  )
  const { user } = useStore()
  const isAdmin = [RoleEnum.ADMIN, RoleEnum.OPERATOR].includes(user?.role as RoleEnum)
  const isBrand = [RoleEnum.MANAGER, RoleEnum.STAFF].includes(user?.role as RoleEnum)

  const brandId = isAdmin ? '' : user?.brands?.[0].id

  const { data: userListData, isLoading: isUserListLoading } = useQuery({
    queryKey: [
      getDailyOrderStatistics.queryKey,
      {
        brandId: brandId || (queryStates[0].fieldFilters?.brandId as string),
        startDate: queryStates[0].fieldFilters?.startDate as string,
        endDate: queryStates[0].fieldFilters?.endDate as string,
        orderType: queryStates[0].fieldFilters?.orderType as OrderEnum,
        productIds: queryStates[0].fieldFilters?.productIds as string[],
        eventIds: [...(queryStates[0].fieldFilters?.groupProductIds||[]), ...(queryStates[0].fieldFilters?.flashSaleIds||[])],
        groupProductIds: queryStates[0].fieldFilters?.groupProductIds as string[],
      }
    ],
    queryFn: getDailyOrderStatistics.fn,
    enabled: isAdmin || isBrand
  })

  return (
    <div className='flex flex-col gap-4'>
      <h1 className='text-2xl font-bold'>Order Statistics</h1>
      <Card className={'border-zinc-200 p-3 dark:border-zinc-800 w-full'}>
      <div className='flex w-full flex-row sm:flex-wrap lg:flex-nowrap 2xl:overflow-hidden'>
        <div className='w-full flex items-center gap-4'>
          <Shell className='gap-2'>
            {isUserListLoading ? (
              <div className='w-full'>
                <Skeleton className='w-full h-[300px] rounded-lg' />
              </div>
            ) : (
              <OrderStaticCard data={userListData?.data as OrderStatic} queryStates={queryStates} />
            )}
          </Shell>
        </div>
      </div>
    </Card>
    </div>
  )
}
