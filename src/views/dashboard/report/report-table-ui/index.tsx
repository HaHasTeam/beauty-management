import { useQuery } from '@tanstack/react-query'
import { useState } from 'react'

import { Card } from '@/components/ui/card'
import { DataTableSkeleton } from '@/components/ui/data-table/data-table-skeleton'
import { Shell } from '@/components/ui/shell'
import { filterReports } from '@/network/apis/report'
import { IReport, ReportStatusEnum, ReportTypeEnum } from '@/types/report'
import { DataTableQueryState } from '@/types/table'

import { ReportTable } from './ReportTable'

export default function IndexPage() {
  const queryStates = useState<DataTableQueryState<IReport>>({} as DataTableQueryState<IReport>)
  const { data: reportList, isLoading: isReportListLoading } = useQuery({
    queryKey: [
      filterReports.queryKey,
      {
        page: queryStates[0].page,
        limit: queryStates[0].perPage,
        sortBy: 'CREATED_DESC',
        order: queryStates[0].sort?.[0].desc && queryStates[0].sort?.[0].desc ? 'DESC' : 'ASC',
        assigneeId: queryStates[0].fieldFilters?.assignee as string,
        statuses: (queryStates[0].fieldFilters?.status ?? []) as ReportStatusEnum[],
        types: (queryStates[0].fieldFilters?.type ?? []) as ReportTypeEnum[],
        reason: queryStates[0].fieldFilters?.reason as string
      }
    ],
    queryFn: filterReports.fn
  })

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
              <ReportTable
                data={reportList?.data?.items ?? []}
                pageCount={Math.ceil((reportList?.data?.total ?? 0) / (queryStates[0].perPage ?? 10))}
                queryStates={queryStates}
              />
            )}
          </Shell>
        </div>
      </div>
    </Card>
  )
}
