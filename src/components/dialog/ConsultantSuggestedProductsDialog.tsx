'use client'

import { useQuery } from '@tanstack/react-query'
import * as React from 'react'

import { DataTableSkeleton } from '@/components/ui/data-table/data-table-skeleton'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { getConsultantSuggestedProductsApi } from '@/network/apis/product'
import { TGetConsultantRecommendationParams } from '@/network/apis/user/type'
import { IResponseProduct } from '@/types/product'
import type { DataTableQueryState } from '@/types/table'
import { ProductTable } from '@/views/dashboard/product-list/product-table-ui/ProductTable'

import { Shell } from '../ui/shell'

type ConsultantSuggestedProductsDialogProps = {
  consultantId: string
  brandId: string
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function ConsultantSuggestedProductsDialog({
  consultantId,
  brandId,
  open,
  onOpenChange
}: ConsultantSuggestedProductsDialogProps) {
  const queryStates = React.useState<DataTableQueryState<TGetConsultantRecommendationParams>>(
    {} as DataTableQueryState<TGetConsultantRecommendationParams>
  )

  const { data: ProductListData, isLoading: isProductListLoading } = useQuery({
    queryKey: [
      getConsultantSuggestedProductsApi.queryKey,
      {
        page: queryStates[0].page,
        limit: queryStates[0].perPage,
        sortBy: 'CREATED_DESC',
        order: queryStates[0].sort?.[0].desc && queryStates[0].sort?.[0].desc ? 'DESC' : 'ASC',
        brandId: brandId,
        consultantId: consultantId
      }
    ],
    queryFn: getConsultantSuggestedProductsApi.fn,
    enabled: !!consultantId && !!brandId
  })

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='sm:max-w-[90%] max-h-[80%] overflow-auto'>
        <DialogHeader>
          <DialogTitle>Consultant Suggested Products</DialogTitle>
          <DialogDescription>Products suggested by the consultant for this brand.</DialogDescription>
        </DialogHeader>
        <div>
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
                  queryStates={
                    queryStates as unknown as [
                      DataTableQueryState<IResponseProduct>,
                      React.Dispatch<React.SetStateAction<DataTableQueryState<IResponseProduct>>>
                    ]
                  }
                  isDialog={true}
                />
              )}
            </Shell>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
