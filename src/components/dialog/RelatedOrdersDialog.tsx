'use client'

import { useQuery } from '@tanstack/react-query'
import { ListOrderedIcon, Package2 } from 'lucide-react'
import { useQueryState } from 'nuqs'
import * as React from 'react'

import { DataTableSkeleton } from '@/components/ui/data-table/data-table-skeleton'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Shell } from '@/components/ui/shell'
import { filterGroupBuyingsApi } from '@/network/apis/group-buying'
import { filterOrdersAndVoucherApi, filterOrdersApi } from '@/network/apis/order'
import { OrderEnum, ShippingStatusEnum } from '@/types/enum'
import { TGroupBuying } from '@/types/group-buying'
import { IOrder } from '@/types/order'
import { DataTableQueryState } from '@/types/table'
import { Table as GroupBuyingTable } from '@/views/dashboard/group-buying/table-ui/Table'
import { OrderTable } from '@/views/dashboard/order-management/order-table-ui/OrderTable' // Reusing the existing table
import { OrderTable as OrderParentTable } from '@/views/dashboard/order-management/parent-order-table-ui/OrderTable'

import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs'
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
  const [activeTab, setActiveTab] = useQueryState('tab', {
    defaultValue: 'orders'
  })

  // Handle tab change - clear other URL params
  const handleTabChange = (value: string) => {
    setActiveTab(value)
  }

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

  const queryStatesGroupBuying = React.useState<DataTableQueryState<TGroupBuying>>(
    {} as DataTableQueryState<TGroupBuying>
  )

  const { data: groupBuyingData, isLoading: isLoading } = useQuery({
    queryKey: [
      filterGroupBuyingsApi.queryKey,
      {
        page: queryStates[0].page,
        limit: queryStates[0].perPage,
        sortBy: queryStates[0].sort?.[0]?.id,
        order: queryStates[0].sort?.[0]?.desc ? 'DESC' : 'ASC',
        statuses: (queryStates[0].fieldFilters?.status ?? []) as string[],
        groupProductId: eventId
      }
    ],
    queryFn: filterGroupBuyingsApi.fn,
    enabled: !!eventId && type === OrderEnum.GROUP_PRODUCT
  })

  if (type === OrderEnum.GROUP_PRODUCT) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        {/* Increase max width for better table view */}
        <DialogContent className='sm:max-w-[80%]'>
          <DialogHeader>
            <DialogTitle>{activeTab === 'orders' ? 'Related Orders' : 'Related Group Buyings'}</DialogTitle>
            <DialogDescription>
              Showing {activeTab === 'orders' ? 'the orders' : 'the group buyings'} related to the selected criteria.
            </DialogDescription>
          </DialogHeader>
          {/* Reusing the structure from the order management index */}
          <div className='flex w-full flex-row sm:flex-wrap lg:flex-nowrap 2xl:overflow-hidden mt-4 max-h-[70vh] overflow-auto'>
            <Tabs value={activeTab} onValueChange={handleTabChange} className='w-full'>
              <TabsList className='w-fit grid-cols-2 mb-6'>
                <TabsTrigger value='orders' className='flex items-center gap-2'>
                  <ListOrderedIcon className='h-4 w-4' />
                  <span>Orders</span>
                </TabsTrigger>
                <TabsTrigger value='group-buying' className='flex items-center gap-2'>
                  <Package2 className='h-4 w-4' />
                  <span>Group Buying Events</span>
                </TabsTrigger>
              </TabsList>
              <TabsContent value='orders'>
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
              </TabsContent>
              <TabsContent value='group-buying'>
                <div className='flex w-full flex-row sm:flex-wrap lg:flex-nowrap 2xl:overflow-hidden'>
                  <div className='w-full flex items-center gap-4'>
                    <Shell className='gap-2'>
                      {isLoading ? (
                        <DataTableSkeleton
                          columnCount={1}
                          searchableColumnCount={1}
                          filterableColumnCount={2}
                          cellWidths={['10rem', '40rem', '12rem', '12rem', '8rem', '8rem']}
                          shrinkZero
                        />
                      ) : (
                        <GroupBuyingTable
                          showGroupBuyingName={false}
                          data={groupBuyingData?.data?.items ?? []}
                          pageCount={
                            groupBuyingData?.data?.total
                              ? Math.ceil(groupBuyingData.data.total / queryStatesGroupBuying[0].perPage)
                              : 0
                          }
                          queryStates={queryStatesGroupBuying}
                        />
                      )}
                    </Shell>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </DialogContent>
      </Dialog>
    )
  }

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
