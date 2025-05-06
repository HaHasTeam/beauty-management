import { useQuery } from '@tanstack/react-query'
import { useState } from 'react'

import { Shell } from '@/components/ui/shell'
import { DataTableQueryState } from '@/types/table'
import { TGetBrandRevenueStatisticsResponse, TGetDailyOrderStatisticsParams } from '@/network/apis/transaction/type'
import { getBrandRevenueStatistics } from '@/network/apis/transaction'
import { RoleEnum } from '@/types/enum'
import { useStore } from '@/stores/store'
import { StaticCard } from './StaticCard'
import { Skeleton } from '@/components/ui/skeleton'
import { Card } from '../../card'
import WalletOverView from '@/views/dashboard/profile-settings/wallet/WalletOverView'
export default function IndexPage({
  showWalletOverview = true,
  header
}: {
  showWalletOverview?: boolean
  header?: string
}) {
  const queryStates = useState<DataTableQueryState<TGetDailyOrderStatisticsParams>>(
    {} as DataTableQueryState<TGetDailyOrderStatisticsParams>
  )
  const { user } = useStore()
  const isAdmin = [RoleEnum.ADMIN, RoleEnum.OPERATOR].includes(user?.role as RoleEnum)
  const isBrand = [RoleEnum.MANAGER, RoleEnum.STAFF].includes(user?.role as RoleEnum)

  const brandId = isAdmin ? '' : user?.brands?.[0]?.id
  const isConsultant = [RoleEnum.CONSULTANT].includes(user?.role as RoleEnum)
  const { data: userListData, isLoading: isUserListLoading } = useQuery({
    queryKey: [
      getBrandRevenueStatistics.queryKey,
      {
        brandId: brandId || (queryStates[0].fieldFilters?.brandId as string),
        startDate: queryStates[0].fieldFilters?.startDate as string,
        endDate: queryStates[0].fieldFilters?.endDate as string
      }
    ],
    queryFn: getBrandRevenueStatistics.fn,
    enabled: isAdmin || isBrand
  })

  if (isConsultant) return <WalletOverView specifiedAccountId={user?.id} />

  return (
    <div className='flex flex-col gap-4'>
      <h1 className='text-2xl font-bold'>{header || 'Revenue Statistics'}</h1>
      <WalletOverView showWalletOverview={showWalletOverview} />
      <Card className={'border-zinc-200 p-3 dark:border-zinc-800 w-full'}>
        <div className='flex w-full flex-row sm:flex-wrap lg:flex-nowrap 2xl:overflow-hidden'>
          <div className='w-full flex items-center gap-4'>
            <Shell className='gap-2'>
              {isUserListLoading ? (
                <div className='w-full'>
                  <Skeleton className='w-full h-[300px] rounded-lg' />
                </div>
              ) : (
                <StaticCard data={userListData?.data as TGetBrandRevenueStatisticsResponse} queryStates={queryStates} />
              )}
            </Shell>
          </div>
        </div>
      </Card>
    </div>
  )
}
