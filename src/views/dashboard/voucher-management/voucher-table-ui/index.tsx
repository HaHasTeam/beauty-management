import { useQuery } from '@tanstack/react-query'
import { useState } from 'react'

import { Card } from '@/components/ui/card'
import { DataTableSkeleton } from '@/components/ui/data-table/data-table-skeleton'
import { Shell } from '@/components/ui/shell'
import { getAllVouchersApi } from '@/network/apis/voucher'
import { DataTableQueryState } from '@/types/table'
import { TVoucher } from '@/types/voucher'

import { VouchersTable } from './VouchersTable'

export default function IndexPage() {
  const {
    data: voucherListData,
    isLoading: isVoucherListLoading,
    isRefetching
  } = useQuery({
    queryKey: [getAllVouchersApi.queryKey],
    queryFn: getAllVouchersApi.fn
  })
  const queryStates = useState<DataTableQueryState<TVoucher>>({} as DataTableQueryState<TVoucher>)
  return (
    <Card className={'border-zinc-200 p-3 dark:border-zinc-800 w-full'}>
      <div className='flex w-full flex-row sm:flex-wrap lg:flex-nowrap 2xl:overflow-hidden'>
        <div className='w-full flex items-center gap-4'>
          <Shell className='gap-2'>
            {isVoucherListLoading || isRefetching ? (
              <DataTableSkeleton
                columnCount={1}
                searchableColumnCount={1}
                filterableColumnCount={2}
                cellWidths={['10rem', '40rem', '12rem', '12rem', '8rem', '8rem']}
                shrinkZero
              />
            ) : (
              <VouchersTable data={voucherListData?.data ?? []} pageCount={1} queryStates={queryStates} />
            )}
          </Shell>
        </div>
      </div>
    </Card>
  )
}
