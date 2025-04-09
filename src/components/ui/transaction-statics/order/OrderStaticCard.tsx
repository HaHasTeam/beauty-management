'use client'

import * as React from 'react'
import { DataTableToolbar } from '@/components/ui/data-table/data-table-toolbar'
import { useDataTable } from '@/hooks/useDataTable'
import type { DataTableFilterField, DataTableQueryState } from '@/types/table'
import { OrderStatic, TGetDailyOrderStatisticsParams } from '@/network/apis/transaction/type'
import { getAllProductApi } from '@/network/apis/product'
import { useQuery } from '@tanstack/react-query'
import { CardWithFacetFilters } from '../../CardWithFacetFilters'
import Static from './Static'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { getAllBrandsApi } from '@/network/apis/brand'
import { RoleEnum, OrderEnum } from '@/types/enum'
import { useStore } from '@/stores/store'
import { toSentenceCase } from '@/lib/utils'
import { getAllPreOrderListApi } from '@/network/apis/pre-order'
import { getAllFlashSaleApi } from '@/network/apis/flash-sale'
import { formatDate } from 'date-fns'
import { getAllGroupProductsListApi } from '@/network/apis/group-product'

interface OrderStaticCardProps {
  data: OrderStatic
  queryStates?: [
    DataTableQueryState<TGetDailyOrderStatisticsParams>,
    React.Dispatch<React.SetStateAction<DataTableQueryState<TGetDailyOrderStatisticsParams>>>
  ]
}

export function OrderStaticCard({ queryStates, data }: OrderStaticCardProps) {
  // Get currently selected date range and order type
  const [selectedOrderType, setSelectedOrderType] = React.useState<OrderEnum | null>(null)

  /**
   * This component can render either a faceted filter or a search filter based on the `options` prop.
   *
   * @prop options - An array of objects, each representing a filter option. If provided, a faceted filter is rendered. If not, a search filter is rendered.
   *
   * Each `option` object has the following properties:
   * @prop {string} label - The label for the filter option.
   * @prop {string} value - The value for the filter option.
   * @prop {React.ReactNode} [icon] - An optional icon to display next to the label.
   * @prop {boolean} [withCount] - An optional boolean to display the count of the filter option.
   */

  const { user } = useStore()
  const isAdmin = [RoleEnum.ADMIN, RoleEnum.OPERATOR].includes(user?.role as RoleEnum)
  const isBrand = [RoleEnum.MANAGER, RoleEnum.STAFF].includes(user?.role as RoleEnum)

  // Monitor field filters changes to detect order type selection
  React.useEffect(() => {
    if (queryStates) {
      const [queryState] = queryStates
      const orderTypeValue = queryState.fieldFilters?.orderType as OrderEnum | undefined

      if (orderTypeValue) {
        setSelectedOrderType(orderTypeValue)
      } else {
        setSelectedOrderType(null)
      }
    }
  }, [queryStates])

  const { data: productData } = useQuery({
    queryKey: [getAllProductApi.queryKey],
    queryFn: getAllProductApi.fn
  })

  const { data: brandData } = useQuery({
    queryKey: [getAllBrandsApi.queryKey],
    queryFn: getAllBrandsApi.fn
  })

  // Fetch pre-order products data
  const { data: preOrderData } = useQuery({
    queryKey: [getAllPreOrderListApi.queryKey],
    queryFn: getAllPreOrderListApi.fn,
    enabled: isAdmin || isBrand
  })

  // Fetch flash sale products data
  const { data: flashSaleData } = useQuery({
    queryKey: [getAllFlashSaleApi.queryKey],
    queryFn: getAllFlashSaleApi.fn,
    enabled: isAdmin || isBrand
  })

  // Fetch group buying products data
  const { data: groupProductData } = useQuery({
    queryKey: [getAllGroupProductsListApi.queryKey],
    queryFn: getAllGroupProductsListApi.fn,
    enabled: isAdmin || isBrand
  })

  const products = productData?.data ?? []
  const brands = brandData?.data ?? []
  const preOrders = preOrderData?.data ?? []
  const flashSales = flashSaleData?.data ?? []
  const groupProducts = groupProductData?.data ?? []

  const filterFields: DataTableFilterField<TGetDailyOrderStatisticsParams>[] = React.useMemo(() => {
    const fields: DataTableFilterField<TGetDailyOrderStatisticsParams>[] = [
      {
        id: 'startDate',
        label: 'Start Date',
        isCustomFilter: true,
        isDate: true,
        placeholder: 'Start Date'
      },
      {
        id: 'endDate',
        label: 'End Date',
        isCustomFilter: true,
        isDate: true,
        placeholder: 'End Date'
      },
      {
        id: 'orderType',
        label: 'Order Type',
        options: Object.values(OrderEnum).map((orderType) => ({
          label: toSentenceCase(orderType),
          value: orderType
        })),
        isCustomFilter: true,
        isSingleChoice: true
      }
    ]

    // Add product filter first (for all order types)
    if (isAdmin) {
      fields.push({
        id: 'brandId',
        label: 'Brand',
        options: brands.map((brand) => ({
          label: brand.name,
          value: brand.id
        })),
        isCustomFilter: true,
        isSingleChoice: true
      })

      const isSelectedBrand = queryStates?.[0]?.fieldFilters?.brandId
      if (isSelectedBrand) {
        fields.push({
          id: 'productIds',
          label: 'Product',
          options: products.map((product) => ({
            label: product.name,
            value: product.id
          })),
          isCustomFilter: true
        })
      }
    }

    if (isBrand) {
      fields.push({
        id: 'productIds',
        label: 'Product',
        options: products.map((product) => ({
          label: product.name,
          value: product.id
        })),
        isCustomFilter: true
      })
    }

    // Conditionally add filters based on selected order type
    if (selectedOrderType === OrderEnum.PRE_ORDER && preOrders.length > 0) {
      fields.push({
        id: 'preOrderProductIds',
        label: 'Pre Order Events',
        options: preOrders.map((preOrder) => ({
          label: `${formatDate(preOrder.startTime, 'dd/MM/yy')} - ${formatDate(preOrder.endTime, 'dd/MM/yy')} - ${preOrder.product.name}`,
          value: preOrder.id
        })),
        isCustomFilter: true
      })
    }

    if (selectedOrderType === OrderEnum.FLASH_SALE && flashSales.length > 0) {
      fields.push({
        id: 'flashSaleIds',
        label: 'Flash Sale Events',
        options: flashSales.map((flashSale) => ({
          label: `${formatDate(flashSale.startTime, 'dd/MM/yy')} - ${formatDate(flashSale.endTime, 'dd/MM/yy')} ${flashSale.product.name}`,
          value: flashSale.id
        })),
        isCustomFilter: true
      })
    }

    if (selectedOrderType === OrderEnum.GROUP_BUYING && groupProducts.length > 0) {
      fields.push({
        id: 'groupProductIds',
        label: 'Group Buying Events',
        options: groupProducts.map((groupProduct) => ({
          label: `${groupProduct.name}`,
          value: groupProduct.id
        })),
        isCustomFilter: true
      })
    }

    return fields
  }, [isAdmin, isBrand, products, brands, preOrders, flashSales, groupProducts, selectedOrderType, queryStates])

  /**
   * Advanced filter fields for the data table.
   * These fields provide more complex filtering options compared to the regular filterFields.
   *
   * Key differences from regular filterFields:
   * 1. More field types: Includes 'text', 'multi-select', 'date', and 'boolean'.
   * 2. Enhanced flexibility: Allows for more precise and varied filtering options.
   * 3. Used with DataTableAdvancedToolbar: Enables a more sophisticated filtering UI.
   * 4. Date and boolean types: Adds support for filtering by date ranges and boolean values.
   */

  const { table } = useDataTable({
    data: [],
    columns: [],
    pageCount: 0,
    queryStates,
    filterFields,
    shallow: false,
    clearOnDefault: true
  })

  // Handle time range selection
  const handleTimeRangeChange = (value: string) => {
    if (!queryStates) return
    const [, setQueryState] = queryStates

    if (value === '90d' || value === '30d' || value === '7d') {
      const today = new Date()
      const endDate = today.toISOString().split('T')[0]

      let startDate = new Date()
      if (value === '90d') {
        startDate.setDate(today.getDate() - 90)
      } else if (value === '30d') {
        startDate.setDate(today.getDate() - 30)
      } else if (value === '7d') {
        startDate.setDate(today.getDate() - 7)
      }

      setQueryState((prev) => ({
        ...prev,
        fieldFilters: {
          ...prev.fieldFilters,
          startDate: startDate.toISOString().split('T')[0],
          endDate
        }
      }))
    }
  }

  return (
    <div className='space-y-4 w-full overflow-auto'>
      <CardWithFacetFilters mainContent={<Static data={data} />}>
        <DataTableToolbar table={table} filterFields={filterFields} isTable={false}>
          <div className='flex items-center justify-end px-4 py-2'>
            <Select onValueChange={handleTimeRangeChange}>
              <SelectTrigger className='w-[160px] rounded-lg' aria-label='Select time range'>
                <SelectValue placeholder='Last 3 months' />
              </SelectTrigger>
              <SelectContent className='rounded-xl'>
                <SelectItem value='90d' className='rounded-lg'>
                  Last 3 months
                </SelectItem>
                <SelectItem value='30d' className='rounded-lg'>
                  Last 30 days
                </SelectItem>
                <SelectItem value='7d' className='rounded-lg'>
                  Last 7 days
                </SelectItem>
                <SelectItem value='custom' className='rounded-lg'>
                  Custom Range
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
        </DataTableToolbar>
      </CardWithFacetFilters>
    </div>
  )
}
