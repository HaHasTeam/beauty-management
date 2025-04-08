import { useQuery } from '@tanstack/react-query'
import { useState } from 'react'

import { Card } from '@/components/ui/card'
import { DataTableSkeleton } from '@/components/ui/data-table/data-table-skeleton'
import { Shell } from '@/components/ui/shell'
import { getAccountFilterApi } from '@/network/apis/user'
import { DataTableQueryState } from '@/types/table'
import { TUser } from '@/types/user'

import { AccountTable } from './AccountTable'

export default function IndexPage() {
  const queryStates = useState<DataTableQueryState<TUser>>({} as DataTableQueryState<TUser>)

  const { data: userListData, isLoading: isUserListLoading } = useQuery({
    queryKey: [
      getAccountFilterApi.queryKey,
      {
        page: queryStates[0].page,
        limit: queryStates[0].perPage,
        sortBy: queryStates[0].sort?.[0]?.id,
        order: queryStates[0].sort?.[0].desc && queryStates[0].sort?.[0].desc ? 'DESC' : 'ASC',
        role: (queryStates[0].fieldFilters?.role as string[])?.join(','),
        statuses: (queryStates[0].fieldFilters?.status as string[])?.join(','),
        username: queryStates[0].fieldFilters?.username as string,
        email: queryStates[0].fieldFilters?.email as string
      }
    ],
    queryFn: getAccountFilterApi.fn
  })

  return (
    <Card className={'border-zinc-200 p-3 dark:border-zinc-800 w-full'}>
      <div className='flex w-full flex-row sm:flex-wrap lg:flex-nowrap 2xl:overflow-hidden'>
        <div className='w-full flex items-center gap-4'>
          <Shell className='gap-2'>
            {isUserListLoading ? (
              <DataTableSkeleton
                columnCount={1}
                searchableColumnCount={1}
                filterableColumnCount={2}
                cellWidths={['10rem', '40rem', '12rem', '12rem', '8rem', '8rem']}
                shrinkZero
              />
            ) : (
              <AccountTable
                data={userListData?.data.items ?? []}
                pageCount={userListData?.data.total ? Math.ceil(userListData?.data.total / queryStates[0].perPage) : 0}
                queryStates={queryStates}
              />
            )}
          </Shell>
        </div>
      </div>
    </Card>
  )
}
