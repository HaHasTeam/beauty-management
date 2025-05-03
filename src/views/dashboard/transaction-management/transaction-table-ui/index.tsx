import { useQuery } from '@tanstack/react-query'
import { useState } from 'react'

import { Card } from '@/components/ui/card'
import { DataTableSkeleton } from '@/components/ui/data-table/data-table-skeleton'
import { Shell } from '@/components/ui/shell'
import { filterTransactions } from '@/network/apis/transaction'
import { TFilterTransactionsParams } from '@/network/apis/transaction/type'
import { DataTableQueryState } from '@/types/table'
import { TransactionTypeEnum } from '@/types/transaction'

import { CustomFilterFields } from './helper'
import { TransactionTable } from './TransactionTable'

export default function IndexPage() {
  const queryStates = useState<DataTableQueryState<CustomFilterFields>>({} as DataTableQueryState<CustomFilterFields>)

  const { data: transactionListData, isLoading: isTransactionListLoading } = useQuery({
    queryKey: [
      filterTransactions.queryKey,
      {
        page: queryStates[0].page,
        limit: queryStates[0].perPage,
        sortBy: queryStates[0].sort?.[0]?.id,
        startDate: (queryStates[0].fieldFilters?.startDate as string) ?? '',
        endDate: (queryStates[0].fieldFilters?.endDate as string) ?? '',
        types: (queryStates[0].fieldFilters?.type as TransactionTypeEnum[]) ?? []
      } as TFilterTransactionsParams
    ],
    queryFn: filterTransactions.fn
  })

  return (
    <Card className={'border-zinc-200 p-3 dark:border-zinc-800 w-full'}>
      <div className='flex w-full flex-row sm:flex-wrap lg:flex-nowrap 2xl:overflow-hidden'>
        <div className='w-full flex items-center gap-4'>
          <Shell className='gap-2'>
            {isTransactionListLoading ? (
              <DataTableSkeleton
                columnCount={1}
                searchableColumnCount={1}
                filterableColumnCount={2}
                cellWidths={['10rem', '40rem', '12rem', '12rem', '8rem', '8rem']}
                shrinkZero
              />
            ) : (
              <TransactionTable
                data={transactionListData?.data?.items ?? []}
                pageCount={
                  transactionListData?.data?.total
                    ? Math.ceil(transactionListData.data.total / queryStates[0].perPage)
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
