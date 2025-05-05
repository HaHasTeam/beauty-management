import { useQuery } from '@tanstack/react-query'
import { useState } from 'react'

import { Shell } from '@/components/ui/shell'
import { DataTableQueryState } from '@/types/table'
import { DailySystemStatistics, TGetDailySystemStatisticsParams } from '@/network/apis/transaction/type'
import { getDailySystemStatistics } from '@/network/apis/transaction'
import { RoleEnum } from '@/types/enum'
import { useStore } from '@/stores/store'
import { Card } from '../../card'
import { StaticCard } from './StaticCard'
import { Skeleton } from '@/components/ui/skeleton'

type Props = {
  header?: React.ReactNode
}

export default function IndexPage({ header }: Props) {
  const queryStates = useState<DataTableQueryState<TGetDailySystemStatisticsParams>>(
    {} as DataTableQueryState<TGetDailySystemStatisticsParams>
  )
  const { user } = useStore()
  const isAdmin = [RoleEnum.ADMIN, RoleEnum.OPERATOR].includes(user?.role as RoleEnum)

  const { data: userListData, isLoading: isUserListLoading } = useQuery({
    queryKey: [
      getDailySystemStatistics.queryKey,
      {
        startDate: queryStates[0].fieldFilters?.startDate as string,
        endDate: queryStates[0].fieldFilters?.endDate as string
      }
    ],
    queryFn: getDailySystemStatistics.fn,
    enabled: isAdmin
  })

  return (
    <div className='flex flex-col gap-4 w-full'>
      {header || <h1 className='text-2xl font-bold'>System Statistics</h1>}
      <Card className={'border-zinc-200 p-3 dark:border-zinc-800 w-full'}>
        <div className='flex w-full flex-row sm:flex-wrap lg:flex-nowrap 2xl:overflow-hidden'>
          <div className='w-full flex items-center gap-4'>
            <Shell className='gap-2'>
              {isUserListLoading ? (
                <div className='w-full'>
                  <Skeleton className='w-full h-[300px] rounded-lg' />
                </div>
              ) : (
                <StaticCard data={userListData?.data as DailySystemStatistics} queryStates={queryStates} />
              )}
            </Shell>
          </div>
        </div>
      </Card>
    </div>
  )
}
