import { useQuery } from '@tanstack/react-query'
import { useState } from 'react'

import { Card } from '@/components/ui/card'
import { DataTableSkeleton } from '@/components/ui/data-table/data-table-skeleton'
import { Shell } from '@/components/ui/shell'
import { getProductFilterApi } from '@/network/apis/product'
import { useStore } from '@/stores/store'
import { RoleEnum } from '@/types/enum'
import { IResponseProduct } from '@/types/product'
import { DataTableQueryState } from '@/types/table'

import { ProductTable } from './ProductTable'

export default function IndexPage() {
  const queryStates = useState<DataTableQueryState<IResponseProduct>>({} as DataTableQueryState<IResponseProduct>)

  const { user } = useStore()
  const isAdmin = [RoleEnum.ADMIN, RoleEnum.OPERATOR].includes(user?.role as RoleEnum)
  const isBrand = [RoleEnum.MANAGER, RoleEnum.STAFF].includes(user?.role as RoleEnum)
  const brandId = isAdmin ? '' : user?.brands?.[0].id
  const { data: ProductListData, isLoading: isProductListLoading } = useQuery({
    queryKey: [
      getProductFilterApi.queryKey,
      {
        page: queryStates[0].page,
        limit: queryStates[0].perPage,
        sortBy: 'CREATED_DESC',
        order: queryStates[0].sort?.[0].desc && queryStates[0].sort?.[0].desc ? 'DESC' : 'ASC',
        brandId: brandId || (queryStates[0].fieldFilters?.brandId as string),
        categoryId: queryStates[0].fieldFilters?.categoryId as string,
        statuses: ((queryStates[0].fieldFilters?.status ?? []) as string[]).join(','),
        minPrice: queryStates[0].fieldFilters?.minPrice as string,
        maxPrice: queryStates[0].fieldFilters?.maxPrice as string,
        search: queryStates[0].fieldFilters?.search as string
      }
    ],
    queryFn: getProductFilterApi.fn,
    enabled: isAdmin || isBrand
  })

  return (
    <Card className={'border-zinc-200 p-3 dark:border-zinc-800 w-full'}>
      <div className='flex w-full flex-row sm:flex-wrap lg:flex-nowrap 2xl:overflow-hidden'>
        <div className='w-full flex items-center gap-4'>
          <Shell className='gap-2'>
            {isProductListLoading ? (
              <DataTableSkeleton
                columnCount={1}
                searchableColumnCount={1}
                filterableColumnCount={2}
                cellWidths={['10rem', '40rem', '12rem', '12rem', '8rem', '8rem']}
                shrinkZero
              />
            ) : (
              <ProductTable
                data={ProductListData?.data?.items ?? []}
                pageCount={
                  ProductListData?.data.total
                    ? Math.ceil(Number(ProductListData?.data.total) / queryStates[0].perPage)
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
