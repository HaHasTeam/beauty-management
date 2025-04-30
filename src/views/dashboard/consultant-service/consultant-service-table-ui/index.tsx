import { useQuery } from '@tanstack/react-query'
import { useState } from 'react'

// import { useShallow } from 'zustand/react/shallow'
import { Card } from '@/components/ui/card'
import { DataTableSkeleton } from '@/components/ui/data-table/data-table-skeleton'
import { Shell } from '@/components/ui/shell'
import { getConsultantServiceFilterApi } from '@/network/apis/consultant-service'
// import { useStore } from '@/stores/store'
import { IConsultantService } from '@/types/consultant-service'
import { DataTableQueryState } from '@/types/table'

import { ConsultantServiceTable } from './ConsultantServiceTable'

export default function IndexPage() {
  // const { userData } = useStore(
  //   useShallow((state) => {
  //     return {
  //       userData: state.user
  //     }
  //   })
  // )

  const queryStates = useState<DataTableQueryState<IConsultantService>>({} as DataTableQueryState<IConsultantService>)

  const { data: consultantServiceListData, isLoading: isConsultantServiceListLoading } = useQuery({
    queryKey: [
      getConsultantServiceFilterApi.queryKey,
      {
        page: queryStates[0].page,
        limit: queryStates[0].perPage,
        sortBy: queryStates[0].sort?.[0]?.id,
        order: queryStates[0].sort?.[0]?.desc ? 'DESC' : 'ASC',
        price: queryStates[0].fieldFilters?.price as string,
        statuses: ((queryStates[0].fieldFilters?.status ?? []) as string[]).join(','),
        systemService: queryStates[0].fieldFilters?.systemService as string
      }
    ],
    queryFn: getConsultantServiceFilterApi.fn
    // enabled: !!userData?.brands?.length
  })

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
                data={consultantServiceListData?.data?.items ?? []}
                pageCount={
                  consultantServiceListData?.data?.total
                    ? Math.ceil(consultantServiceListData?.data?.total / queryStates[0].perPage)
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
