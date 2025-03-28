import { useQuery } from '@tanstack/react-query'
import { useState } from 'react'
import { useShallow } from 'zustand/react/shallow'

import { Card } from '@/components/ui/card'
import { DataTableSkeleton } from '@/components/ui/data-table/data-table-skeleton'
import { Shell } from '@/components/ui/shell'
import { getCategoryFilterApi } from '@/network/apis/category'
import { useStore } from '@/stores/store'
import { ICategory } from '@/types/category'
import { DataTableQueryState } from '@/types/table'

import { CategoryTable } from './CategoryTable'

export default function IndexPage() {
  const { userData } = useStore(
    useShallow((state) => {
      return {
        userData: state.user
      }
    })
  )

  const queryStates = useState<DataTableQueryState<ICategory>>({} as DataTableQueryState<ICategory>)

  const { data: categoryListData, isLoading: isCategoryListLoading } = useQuery({
    queryKey: [
      getCategoryFilterApi.queryKey,
      {
        page: queryStates[0].page,
        limit: queryStates[0].perPage,
        sortBy: queryStates[0].sort?.[0]?.id,
        order: queryStates[0].sort?.[0]?.desc ? 'DESC' : 'ASC',
        name: queryStates[0].fieldFilters?.name as string,
        statuses: ((queryStates[0].fieldFilters?.status ?? []) as string[]).join(',')
      }
    ],
    queryFn: getCategoryFilterApi.fn,
    enabled: !!userData?.brands?.length
  })

  return (
    <Card className={'border-zinc-200 p-3 dark:border-zinc-800 w-full'}>
      <div className='flex w-full flex-row sm:flex-wrap lg:flex-nowrap 2xl:overflow-hidden'>
        <div className='w-full flex items-center gap-4'>
          <Shell className='gap-2'>
            {isCategoryListLoading ? (
              <DataTableSkeleton
                columnCount={1}
                searchableColumnCount={1}
                filterableColumnCount={2}
                cellWidths={['10rem', '40rem', '12rem', '12rem', '8rem', '8rem']}
                shrinkZero
              />
            ) : (
              <CategoryTable
                data={categoryListData?.data?.items ?? []}
                pageCount={
                  categoryListData?.data?.total ? Math.ceil(categoryListData?.data?.total / queryStates[0].perPage) : 0
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
