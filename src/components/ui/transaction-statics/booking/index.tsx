import { useQuery } from '@tanstack/react-query'
import { useState } from 'react'
import React from 'react'

import { Shell } from '@/components/ui/shell'
import { DataTableQueryState } from '@/types/table'
import { BookingStatic, TGetDailyBookingStatisticsParams } from '@/network/apis/transaction/type'
import { getDailyBookingStatistics } from '@/network/apis/transaction'
import { RoleEnum } from '@/types/enum'
import { useStore } from '@/stores/store'
import { BookingStaticCard } from './BookingStaticCard'
import { Skeleton } from '@/components/ui/skeleton'
import { Card } from '@/components/ui/card'

export default function IndexPage() {
  const queryStates = useState<DataTableQueryState<TGetDailyBookingStatisticsParams>>(
    {} as DataTableQueryState<TGetDailyBookingStatisticsParams>
  )
  const { user } = useStore()
  const isAdmin = [RoleEnum.ADMIN, RoleEnum.OPERATOR].includes(user?.role as RoleEnum)

  const queryParams: TGetDailyBookingStatisticsParams | undefined = React.useMemo(() => ({
    startDate: queryStates[0].fieldFilters?.startDate as string | undefined,
    endDate: queryStates[0].fieldFilters?.endDate as string | undefined,
    consultantId: isAdmin ? queryStates[0].fieldFilters?.consultantId as string | undefined : user?.id
  }), [queryStates[0].fieldFilters, isAdmin, user?.id])


  const { data: bookingStaticResponse, isLoading: isBookingStaticLoading } = useQuery({
    queryKey: [getDailyBookingStatistics.queryKey, queryParams],
    queryFn: getDailyBookingStatistics.fn,
  })

  const bookingStaticData = bookingStaticResponse?.data

  return (
    <div className='flex flex-col gap-4'>
      <h1 className='text-2xl font-bold'>Booking Statistics</h1>
      <Card className={'border-zinc-200 p-3 dark:border-zinc-800 w-full'}>
        <div className='flex w-full flex-row sm:flex-wrap lg:flex-nowrap 2xl:overflow-hidden'>
          <div className='w-full flex items-center gap-4'>
            <Shell className='gap-2'>
              {isBookingStaticLoading ? (
                <div className='w-full'>
                  <Skeleton className='w-full h-[300px] rounded-lg' />
                </div>
              ) : (
                <BookingStaticCard data={bookingStaticData as BookingStatic} queryStates={queryStates} />
              )}
            </Shell>
          </div>
        </div>
      </Card>
    </div>
  )
}
