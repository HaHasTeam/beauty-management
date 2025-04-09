import { useQuery } from '@tanstack/react-query'
import { useState } from 'react'

import { Card } from '@/components/ui/card'
import { DataTableSkeleton } from '@/components/ui/data-table/data-table-skeleton'
import { Shell } from '@/components/ui/shell'
import { filterVouchersApi } from '@/network/apis/voucher'
import { useStore } from '@/stores/store'
import { RoleEnum, VoucherApplyTypeEnum, VoucherStatusEnum, VoucherVisibilityEnum } from '@/types/enum'
import { DataTableQueryState } from '@/types/table'
import { TVoucher } from '@/types/voucher'

import { VouchersTable } from './VouchersTable'

export default function IndexPage() {
  const { user } = useStore()
  const isAdmin = [RoleEnum.ADMIN, RoleEnum.OPERATOR].includes(user?.role as RoleEnum)
  const isBrand = [RoleEnum.MANAGER, RoleEnum.STAFF].includes(user?.role as RoleEnum)

  const brandId = isAdmin ? '' : user?.brands?.[0].id
  const queryStates = useState<DataTableQueryState<TVoucher>>({} as DataTableQueryState<TVoucher>)
  const {
    data: voucherListData,
    isLoading: isVoucherListLoading,
    isRefetching
  } = useQuery({
    queryKey: [
      filterVouchersApi.queryKey,
      {
        page: queryStates[0].page,
        limit: queryStates[0].perPage,
        sortBy: queryStates[0].sort?.[0]?.id,
        order: queryStates[0].sort?.[0].desc && queryStates[0].sort?.[0].desc ? 'DESC' : 'ASC',
        statuses: queryStates[0].fieldFilters?.status as VoucherStatusEnum[],
        applyType: queryStates[0].fieldFilters?.applyType as VoucherApplyTypeEnum,
        visibility: queryStates[0].fieldFilters?.visibility as VoucherVisibilityEnum,
        brandId: brandId || (queryStates[0].fieldFilters?.brandId as string),
        startTime: queryStates[0].fieldFilters?.startTime as string,
        endTime: queryStates[0].fieldFilters?.endTime as string,
        applyProductIds: queryStates[0].fieldFilters?.applyProductIds as string[]
      }
    ],
    queryFn: filterVouchersApi.fn,
    enabled: isAdmin || isBrand
  })

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
              <VouchersTable
                data={voucherListData?.data.items ?? []}
                pageCount={Math.ceil((voucherListData?.data.total ?? 0) / (queryStates[0].perPage ?? 10))}
                queryStates={queryStates}
              />
            )}
          </Shell>
        </div>
      </div>
    </Card>
  )
}
