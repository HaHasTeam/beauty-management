import { useQuery } from '@tanstack/react-query'
import { useState } from 'react'

import { Card } from '@/components/ui/card'
import { DataTableSkeleton } from '@/components/ui/data-table/data-table-skeleton'
import { Shell } from '@/components/ui/shell'
import { getFilteredBlogs } from '@/network/apis/blog'
import { IBlogDetails } from '@/types/blog'
import { DataTableQueryState } from '@/types/table'

import { BlogTable } from './ReportTable'

export default function IndexPage() {
  const { data: reportList, isLoading: isReportListLoading } = useQuery({
    queryKey: [getFilteredBlogs.queryKey, {}],
    queryFn: getFilteredBlogs.fn
  })

  const queryStates = useState<DataTableQueryState<IBlogDetails>>({} as DataTableQueryState<IBlogDetails>)
  return (
    <Card className={'border-zinc-200 p-3 dark:border-zinc-800 w-full'}>
      <div className='flex w-full flex-row sm:flex-wrap lg:flex-nowrap 2xl:overflow-hidden'>
        <div className='w-full flex items-center gap-4'>
          <Shell className='gap-2'>
            {isReportListLoading ? (
              <DataTableSkeleton
                columnCount={1}
                searchableColumnCount={1}
                filterableColumnCount={2}
                cellWidths={['10rem', '40rem', '12rem', '12rem', '8rem', '8rem']}
                shrinkZero
              />
            ) : (
              <BlogTable data={reportList?.data ?? []} pageCount={1} queryStates={queryStates} />
            )}
          </Shell>
        </div>
      </div>
    </Card>
  )
}
