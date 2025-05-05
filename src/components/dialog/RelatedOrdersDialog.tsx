'use client'

import { useQuery } from '@tanstack/react-query'
import * as React from 'react'

import { DataTableSkeleton } from '@/components/ui/data-table/data-table-skeleton'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Shell } from '@/components/ui/shell'
import { filterOrdersAndVoucherApi, filterOrdersApi } from '@/network/apis/order'
import { OrderEnum, ShippingStatusEnum } from '@/types/enum'
import { IOrder } from '@/types/order'
import { DataTableQueryState } from '@/types/table'
import { OrderTable } from '@/views/dashboard/order-management/order-table-ui/OrderTable' // Reusing the existing table
import { OrderTable as OrderParentTable } from '@/views/dashboard/order-management/parent-order-table-ui/OrderTable'
//
interface RelatedOrdersDialogProps {
  type?: OrderEnum
  eventId?: string
  open: boolean
  onOpenChange: (open: boolean) => void
  voucherId?: string
}

export function RelatedOrdersDialog({ type, eventId, open, onOpenChange, voucherId }: RelatedOrdersDialogProps) {
  const queryStates = React.useState<DataTableQueryState<IOrder, { search: string }>>(
    {} as DataTableQueryState<IOrder, { search: string }>
  )

  const { data: orderListData, isLoading: isOrderListLoading } = useQuery({
    queryKey: [
      !voucherId ? filterOrdersApi.queryKey : filterOrdersAndVoucherApi.queryKey,
      {
        page: queryStates[0].page,
        limit: queryStates[0].perPage,
        sortBy: queryStates[0].sort?.[0]?.id,
        order: queryStates[0].sort?.[0]?.desc ? 'DESC' : 'ASC',
        statuses: (queryStates[0].fieldFilters?.status ?? []) as ShippingStatusEnum[],
        types: (queryStates[0].fieldFilters?.type ?? []) as OrderEnum[],
        productIds: (queryStates[0].fieldFilters?.orderDetails ?? []) as string[],
        search: queryStates[0].fieldFilters?.search as string,
        type,
        eventId,
        voucherId
      }
    ],
    queryFn: !voucherId ? filterOrdersApi.fn : filterOrdersAndVoucherApi.fn
  })

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      {/* Increase max width for better table view */}
      <DialogContent className='sm:max-w-[80%]'>
        <DialogHeader>
          <DialogTitle>Orders that related to this event</DialogTitle>
          <DialogDescription>Showing orders related to the selected criteria.</DialogDescription>
        </DialogHeader>
        {/* Reusing the structure from the order management index */}
        <div className='flex w-full flex-row sm:flex-wrap lg:flex-nowrap 2xl:overflow-hidden mt-4 max-h-[70vh] overflow-auto'>
          <div className='flex w-full flex-row sm:flex-wrap lg:flex-nowrap 2xl:overflow-hidden'>
            <div className='w-full flex items-center gap-4'>
              <Shell className='gap-2'>
                {isOrderListLoading ? (
                  <DataTableSkeleton
                    columnCount={1}
                    searchableColumnCount={1}
                    filterableColumnCount={2}
                    cellWidths={['10rem', '40rem', '12rem', '12rem', '8rem', '8rem']}
                    shrinkZero
                  />
                ) : voucherId &&
                  (
                    orderListData?.data as {
                      isParent?: boolean
                    }
                  ).isParent ? (
                  <OrderParentTable
                    data={orderListData?.data.items ?? []}
                    pageCount={Math.ceil((orderListData?.data.total ?? 0) / (orderListData?.data.limit ?? 10))}
                    queryStates={
                      queryStates as unknown as [
                        DataTableQueryState<IOrder>,
                        React.Dispatch<React.SetStateAction<DataTableQueryState<IOrder>>>
                      ]
                    }
                  />
                ) : (
                  <OrderTable
                    data={orderListData?.data.items ?? []}
                    pageCount={Math.ceil((orderListData?.data.total ?? 0) / (orderListData?.data.limit ?? 10))}
                    queryStates={
                      queryStates as unknown as [
                        DataTableQueryState<IOrder>,
                        React.Dispatch<React.SetStateAction<DataTableQueryState<IOrder>>>
                      ]
                    }
                  />
                )}
              </Shell>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
