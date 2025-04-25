import { useQuery } from '@tanstack/react-query'
import { useState } from 'react'
import React from 'react'

import { Shell } from '@/components/ui/shell'
import { DataTableQueryState } from '@/types/table'
import { RoleEnum } from '@/types/enum'
import { useStore } from '@/stores/store'
import {  BrandRecommendCard } from './BrandRecomendCard'
import { Skeleton } from '@/components/ui/skeleton'
import { Card } from '@/components/ui/card'
  import { getConsultantRecommendationPercentageApi } from '@/network/apis/user'
import { TConsultantRecommendationData, TGetConsultantRecommendationParams } from '@/network/apis/user/type'

export default function IndexPage() {
  const queryStates = useState<DataTableQueryState<TGetConsultantRecommendationParams>>(
    {} as DataTableQueryState<TGetConsultantRecommendationParams>
  )
  const { user } = useStore()
  const isAdmin = [RoleEnum.ADMIN, RoleEnum.OPERATOR].includes(user?.role as RoleEnum)

  const queryParams: TGetConsultantRecommendationParams | undefined = React.useMemo(() => ({
    consultantId: (isAdmin ? (queryStates[0].fieldFilters?.consultantId as string)  : user?.id) as string
  }), [queryStates[0].fieldFilters, isAdmin, user?.id])

  const { data: bookingStaticResponse, isLoading: isBookingStaticLoading } = useQuery({
    queryKey: [getConsultantRecommendationPercentageApi.queryKey, queryParams],
    queryFn: getConsultantRecommendationPercentageApi.fn,
  })

  const bookingStaticData = bookingStaticResponse?.data

  return (
    <div className='flex flex-col gap-4'>
      <h1 className='text-2xl font-bold'>Brand Recommendation Statistics</h1>
      <Card className={'border-zinc-200 p-3 dark:border-zinc-800 w-full'}>
        <div className='flex w-full flex-row sm:flex-wrap lg:flex-nowrap 2xl:overflow-hidden'>
          <div className='w-full flex items-center gap-4'>
            <Shell className='gap-2'>
              {isBookingStaticLoading ? (
                <div className='w-full'>
                  <Skeleton className='w-full h-[300px] rounded-lg' />
                </div>
              ) : (
                <BrandRecommendCard data={bookingStaticData as TConsultantRecommendationData} queryStates={queryStates} />
              )}
            </Shell>
          </div>
        </div>
      </Card>
    </div>
  )
}
