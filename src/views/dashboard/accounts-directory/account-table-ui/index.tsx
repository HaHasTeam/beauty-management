import { useQuery } from '@tanstack/react-query'
import { useState } from 'react'

import { Card } from '@/components/ui/card'
import { DataTableSkeleton } from '@/components/ui/data-table/data-table-skeleton'
import { Shell } from '@/components/ui/shell'
import { getAllUserApi } from '@/network/apis/user'
import { DataTableQueryState } from '@/types/table'
import { TUser } from '@/types/user'

import { AccountTable } from './AccountTable'

export default function IndexPage() {
  const { data: userListData, isLoading: isUserListLoading } = useQuery({
    queryKey: [getAllUserApi.queryKey],
    queryFn: getAllUserApi.fn
  })
  const queryStates = useState<DataTableQueryState<TUser>>({} as DataTableQueryState<TUser>)
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
              <AccountTable data={userListData?.data ?? []} pageCount={1} queryStates={queryStates} />
            )}
          </Shell>
        </div>
      </div>
    </Card>
  )
}
