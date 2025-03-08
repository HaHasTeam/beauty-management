import { useQuery } from '@tanstack/react-query'
import { useState } from 'react'
import { useShallow } from 'zustand/react/shallow'

import { Card } from '@/components/ui/card'
import { DataTableSkeleton } from '@/components/ui/data-table/data-table-skeleton'
import { Shell } from '@/components/ui/shell'
import { getAllConsultantServiceApi } from '@/network/apis/consultant-service'
import { useStore } from '@/stores/store'
import { IConsultantService } from '@/types/consultant-service'
import { DataTableQueryState } from '@/types/table'

import { ConsultantServiceTable } from './ConsultantServiceTable'

export default function IndexPage() {
  const { userData } = useStore(
    useShallow((state) => {
      return {
        userData: state.user
      }
    })
  )

  const { data: ConsultantServiceListData, isLoading: isConsultantServiceListLoading } = useQuery({
    queryKey: [getAllConsultantServiceApi.queryKey],
    queryFn: getAllConsultantServiceApi.fn,
    enabled: !!userData?.brands?.length
  })

  const queryStates = useState<DataTableQueryState<IConsultantService>>({} as DataTableQueryState<IConsultantService>)
  return (
    <Card className={'border-zinc-200 p-3 dark:border-zinc-800 w-full'}>
      <div className='flex w-full flex-row sm:flex-wrap lg:flex-nowrap 2xl:overflow-hidden'>
        <div className='w-full flex items-center gap-4'>
          <Shell className='gap-2'>
            {isConsultantServiceListLoading ? (
              <DataTableSkeleton
                columnCount={1}
                searchableColumnCount={1}
                filterableColumnCount={2}
                cellWidths={['10rem', '40rem', '12rem', '12rem', '8rem', '8rem']}
                shrinkZero
              />
            ) : (
              <ConsultantServiceTable
                data={ConsultantServiceListData?.data ?? []}
                pageCount={1}
                queryStates={queryStates}
              />
            )}
          </Shell>
        </div>
      </div>
    </Card>
  )
}
