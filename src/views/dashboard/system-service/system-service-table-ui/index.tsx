import { useQuery } from '@tanstack/react-query'
import { useState } from 'react'

import { Card } from '@/components/ui/card'
import { DataTableSkeleton } from '@/components/ui/data-table/data-table-skeleton'
import { Shell } from '@/components/ui/shell'
import { getAllSystemServiceApi } from '@/network/apis/system-service'
import { ISystemService } from '@/types/system-service'
import { DataTableQueryState } from '@/types/table'

import { SystemServiceTable } from './SystemServiceTable'

export default function IndexPage() {
  const { data: SystemServiceListData, isLoading: isSystemServiceListLoading } = useQuery({
    queryKey: [getAllSystemServiceApi.queryKey],
    queryFn: getAllSystemServiceApi.fn
  })

  const queryStates = useState<DataTableQueryState<ISystemService>>({} as DataTableQueryState<ISystemService>)
  return (
    <Card className={'border-zinc-200 p-3 dark:border-zinc-800 w-full'}>
      <div className='flex w-full flex-row sm:flex-wrap lg:flex-nowrap 2xl:overflow-hidden'>
        <div className='w-full flex items-center gap-4'>
          <Shell className='gap-2'>
            {isSystemServiceListLoading ? (
              <DataTableSkeleton
                columnCount={1}
                searchableColumnCount={1}
                filterableColumnCount={2}
                cellWidths={['10rem', '40rem', '12rem', '12rem', '8rem', '8rem']}
                shrinkZero
              />
            ) : (
              <SystemServiceTable data={SystemServiceListData?.data ?? []} pageCount={1} queryStates={queryStates} />
            )}
          </Shell>
        </div>
      </div>
    </Card>
  )
}
