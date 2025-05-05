'use client'

import * as React from 'react'
import { DataTableToolbar } from '@/components/ui/data-table/data-table-toolbar'
import { useDataTable } from '@/hooks/useDataTable'
import type { DataTableFilterField, DataTableQueryState } from '@/types/table'
import { DailySystemStatistics, TGetDailySystemStatisticsParams } from '@/network/apis/transaction/type'
import { CardWithFacetFilters } from '../../CardWithFacetFilters'
import Static from './Static'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../select'

interface StaticCardProps {
  data: DailySystemStatistics
  queryStates?: [
    DataTableQueryState<TGetDailySystemStatisticsParams>,
    React.Dispatch<React.SetStateAction<DataTableQueryState<TGetDailySystemStatisticsParams>>>
  ]
  mode?: 'full' | 'mini'
  showOnlyVoucher?: 'platform' | 'shop'
}

export function StaticCard({ queryStates, data }: StaticCardProps) {
  // Get currently selected date range and order type

  const filterFields: DataTableFilterField<TGetDailySystemStatisticsParams>[] = React.useMemo(() => {
    return [
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
      }
    ]
  }, [])

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
        {
          <DataTableToolbar table={table} filterFields={filterFields} isTable={false}>
            <div className='flex items-center justify-end px-4 py-2'>
              <Select onValueChange={handleTimeRangeChange}>
                <SelectTrigger className='w-[160px] rounded-lg' aria-label='Select time range'>
                  <SelectValue placeholder='Select Time Range' />
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
        }
      </CardWithFacetFilters>
    </div>
  )
}
