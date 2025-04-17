import { useQuery } from '@tanstack/react-query'
import { useState } from 'react'

import { Card } from '@/components/ui/card'
import { DataTableSkeleton } from '@/components/ui/data-table/data-table-skeleton'
import { Shell } from '@/components/ui/shell'
import { filterBookingsApi } from '@/network/apis/booking'
import { TFilterBookingsParams } from '@/network/apis/booking/type'
import { TBooking } from '@/types/booking'
import { DataTableQueryState } from '@/types/table'

import BookingTable from './BookingTable'

export default function IndexPage() {
  const queryStates = useState<DataTableQueryState<TBooking, TFilterBookingsParams>>(
    {} as DataTableQueryState<TBooking, { search: string }>
  )

  // Tạo statuses từ mảng hoặc string
  const statuses = queryStates[0].fieldFilters?.status
  const statusesParam = Array.isArray(statuses) ? statuses.join(',') : statuses || ''

  const { data: bookingListData, isLoading: isBookingListLoading } = useQuery({
    queryKey: [
      filterBookingsApi.queryKey,
      {
        page: queryStates[0].page,
        limit: queryStates[0].perPage,
        sortBy: queryStates[0].sort?.[0]?.id,
        order: queryStates[0].sort?.[0]?.desc ? 'DESC' : 'ASC',
        statuses: statusesParam,
        search: queryStates[0].fieldFilters?.search as string,
        consultantAccountId: queryStates[0].fieldFilters?.consultantAccountId,
        consultantServiceId: queryStates[0].fieldFilters?.consultantServiceId,
        endDate: queryStates[0].fieldFilters?.endDate,
        startDate: queryStates[0].fieldFilters?.startDate,
        feedbackRating: queryStates[0].fieldFilters?.feedbackRating,
        maxTotalPrice: queryStates[0].fieldFilters?.maxTotalPrice,
        minTotalPrice: queryStates[0].fieldFilters?.minTotalPrice,
        systemServiceType: queryStates[0].fieldFilters?.systemServiceType
      }
    ],
    queryFn: filterBookingsApi.fn
  })
  return (
    <Card className={'border-zinc-200 p-3 dark:border-zinc-800 w-full'}>
      <div className='flex w-full flex-row sm:flex-wrap lg:flex-nowrap 2xl:overflow-hidden'>
        <div className='w-full flex items-center gap-4'>
          <Shell className='gap-2'>
            {isBookingListLoading ? (
              <DataTableSkeleton
                columnCount={1}
                searchableColumnCount={1}
                filterableColumnCount={2}
                cellWidths={['10rem', '40rem', '12rem', '12rem', '8rem', '8rem']}
                shrinkZero
              />
            ) : (
              <BookingTable
                data={bookingListData?.data.items ?? []}
                pageCount={Math.ceil((bookingListData?.data.total ?? 0) / (bookingListData?.data.limit ?? 10))}
                queryStates={
                  queryStates as unknown as [
                    DataTableQueryState<TBooking>,
                    React.Dispatch<React.SetStateAction<DataTableQueryState<TBooking>>>
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
