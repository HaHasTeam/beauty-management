'use client'

import * as React from 'react'
import { DataTableToolbar } from '@/components/ui/data-table/data-table-toolbar'
import { useDataTable } from '@/hooks/useDataTable'
import type { DataTableFilterField, DataTableQueryState } from '@/types/table'
import {  TGetBrandRevenueStatisticsParams, TGetBrandRevenueStatisticsResponse } from '@/network/apis/transaction/type'
import { useQuery } from '@tanstack/react-query'
import { CardWithFacetFilters } from '../../CardWithFacetFilters'
import Static from './Static'
import { getAllBrandsApi } from '@/network/apis/brand'
import { RoleEnum } from '@/types/enum'
import { useStore } from '@/stores/store'

interface StaticCardProps {
  data: TGetBrandRevenueStatisticsResponse
  queryStates?: [
    DataTableQueryState<TGetBrandRevenueStatisticsParams>,
    React.Dispatch<React.SetStateAction<DataTableQueryState<TGetBrandRevenueStatisticsParams>>>
  ]
}

export function StaticCard({ queryStates, data }: StaticCardProps) {
  // Get currently selected date range and order type

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

  const { data: brandData } = useQuery({
    queryKey: [getAllBrandsApi.queryKey],
    queryFn: getAllBrandsApi.fn
  })
  
  const brands = brandData?.data ?? []

  
  const filterFields: DataTableFilterField<TGetBrandRevenueStatisticsParams>[] = React.useMemo(() => {
    const fields: DataTableFilterField<TGetBrandRevenueStatisticsParams>[] = [
      // {
      //   id: 'startDate',
      //   label: 'Start Date',
      //   isCustomFilter: true,
      //   isDate: true,
      //   placeholder: 'Start Date'
      // },
      // {
      //   id: 'endDate',
      //   label: 'End Date',
      //   isCustomFilter: true,
      //   isDate: true,
      //   placeholder: 'End Date'
      // },
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
        isCustomFilter: true
      })
      
  
    }
    
    return fields;
  }, [isAdmin, isBrand, brands, queryStates])

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
  // const handleTimeRangeChange = (value: string) => {
  //   if (!queryStates) return
  //   const [, setQueryState] = queryStates

  //   if (value === '90d' || value === '30d' || value === '7d') {
  //     const today = new Date()
  //     const endDate = today.toISOString().split('T')[0]

  //     let startDate = new Date()
  //     if (value === '90d') {
  //       startDate.setDate(today.getDate() - 90)
  //     } else if (value === '30d') {
  //       startDate.setDate(today.getDate() - 30)
  //     } else if (value === '7d') {
  //       startDate.setDate(today.getDate() - 7)
  //     }

  //     setQueryState((prev) => ({
  //       ...prev,
  //       fieldFilters: {
  //         ...prev.fieldFilters,
  //         startDate: startDate.toISOString().split('T')[0],
  //         endDate
  //       }
  //     }))
  //   }
  // }

  return (
    <div className='space-y-4 w-full overflow-auto'>
      <CardWithFacetFilters mainContent={
        <Static 
          data={data} 
        />
      }>
          <DataTableToolbar table={table} filterFields={filterFields} isTable={false}>
          </DataTableToolbar>
      </CardWithFacetFilters>
    </div>
  )
}

