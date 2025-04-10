import { useQuery } from '@tanstack/react-query'
import { useState } from 'react'

import { Card } from '@/components/ui/card'
import { DataTableSkeleton } from '@/components/ui/data-table/data-table-skeleton'
import { Shell } from '@/components/ui/shell'
import { getFilteredBlogs } from '@/network/apis/blog'
import { IBlogDetails } from '@/types/blog'
import { DataTableQueryState } from '@/types/table'

import { BlogTable } from './BlogTable'

export default function IndexPage() {
  const queryStates = useState<DataTableQueryState<IBlogDetails>>({} as DataTableQueryState<IBlogDetails>)
  const { data: blogList, isLoading: isblogListLoading } = useQuery({
    queryKey: [
      getFilteredBlogs.queryKey,
      {
        page: queryStates[0].page,
        limit: queryStates[0].perPage,
        sortBy: queryStates[0].sort?.[0]?.id,
        order: queryStates[0].sort?.[0]?.desc ? 'DESC' : 'ASC'
      }
    ],
    queryFn: getFilteredBlogs.fn
  })
  return (
    <Card className={'border-zinc-200 p-3 dark:border-zinc-800 w-full'}>
      <div className='flex w-full flex-row sm:flex-wrap lg:flex-nowrap 2xl:overflow-hidden'>
        <div className='w-full flex items-center gap-4'>
          <Shell className='gap-2'>
            {isblogListLoading ? (
              <DataTableSkeleton
                columnCount={1}
                searchableColumnCount={1}
                filterableColumnCount={2}
                cellWidths={['10rem', '40rem', '12rem', '12rem', '8rem', '8rem']}
                shrinkZero
              />
            ) : (
              <BlogTable
                data={blogList?.data?.items ?? []}
                pageCount={Math.ceil((blogList?.data?.total ?? 0) / (queryStates[0].perPage ?? 10))}
                queryStates={queryStates}
              />
            )}
          </Shell>
        </div>
      </div>
    </Card>
  )
}
