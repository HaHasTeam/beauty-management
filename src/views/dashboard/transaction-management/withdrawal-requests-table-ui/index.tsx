import { useQuery } from '@tanstack/react-query'
import { useState } from 'react'

import { Card } from '@/components/ui/card'
import { DataTableSkeleton } from '@/components/ui/data-table/data-table-skeleton'
import { Shell } from '@/components/ui/shell'
import { filterWithdrawalRequests } from '@/network/apis/withdrawal-request'
import { TFilterWithdrawalRequestsParams } from '@/network/apis/withdrawal-request/type'
import { DataTableQueryState } from '@/types/table'
import { TWithdrawalRequest } from '@/types/withdrawal-request'

import { WithdrawalRequestTable } from './WithdrawalRequestTable'

type Props = {
  specifiedAccountId?: string
}

export default function WithdrawalRequestsTableUI({ specifiedAccountId }: Props) {
  const queryStates = useState<DataTableQueryState<TWithdrawalRequest>>({} as DataTableQueryState<TWithdrawalRequest>)

  const { data: withdrawalRequestsData, isLoading: isWithdrawalRequestsLoading } = useQuery({
    queryKey: [
      filterWithdrawalRequests.queryKey,
      {
        page: queryStates[0].page,
        limit: queryStates[0].perPage,
        sortBy: queryStates[0].sort?.[0]?.id,
        order: queryStates[0].sort?.[0]?.desc ? 'DESC' : 'ASC',
        statuses: (queryStates[0].fieldFilters?.status ?? []) as string[],
        startDate: queryStates[0].fieldFilters?.startDate as string,
        endDate: queryStates[0].fieldFilters?.endDate as string,
        relatedAccountId: specifiedAccountId ?? (queryStates[0].fieldFilters?.relatedAccountId as string)
      } as TFilterWithdrawalRequestsParams
    ],
    queryFn: filterWithdrawalRequests.fn,
    enabled: true
  })

  return (
    <Card className={'border-zinc-200 p-3 dark:border-zinc-800 w-full'}>
      <div className='flex w-full flex-row sm:flex-wrap lg:flex-nowrap 2xl:overflow-hidden'>
        <div className='w-full flex items-center gap-4'>
          <Shell className='gap-2'>
            {isWithdrawalRequestsLoading ? (
              <DataTableSkeleton
                columnCount={6}
                searchableColumnCount={1}
                filterableColumnCount={2}
                cellWidths={['4rem', '12rem', '12rem', '12rem', '10rem', '14rem']}
                shrinkZero
              />
            ) : (
              <WithdrawalRequestTable
                specifiedAccountId={specifiedAccountId}
                data={withdrawalRequestsData?.data?.items ?? []}
                pageCount={
                  withdrawalRequestsData?.data?.total
                    ? Math.ceil(withdrawalRequestsData.data.total / queryStates[0].perPage)
                    : 0
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
