import { useQuery } from '@tanstack/react-query'
import { useState } from 'react'

import { Card } from '@/components/ui/card'
import { DataTableSkeleton } from '@/components/ui/data-table/data-table-skeleton'
import { Shell } from '@/components/ui/shell'
import { getFilteredReports } from '@/network/apis/report'
import { IReport } from '@/types/report'
import { DataTableQueryState } from '@/types/table'

import { ReportTable } from './ReportTable'

export default function IndexPage() {
  const { data: reportList, isLoading: isReportListLoading } = useQuery({
    queryKey: [getFilteredReports.queryKey, {}],
    queryFn: getFilteredReports.fn
  })

  const queryStates = useState<DataTableQueryState<IReport>>({} as DataTableQueryState<IReport>)
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
              <ReportTable data={reportList?.data ?? []} pageCount={1} queryStates={queryStates} />
            )}
          </Shell>
        </div>
      </div>
    </Card>
  )
}
