'use client'

import * as React from 'react'
import { DataTableToolbar } from '@/components/ui/data-table/data-table-toolbar'
import { useDataTable } from '@/hooks/useDataTable'
import type { DataTableFilterField, DataTableQueryState } from '@/types/table'
import { BookingStatic, TGetDailyBookingStatisticsParams } from '@/network/apis/transaction/type'
import { useQuery } from '@tanstack/react-query'
import { CardWithFacetFilters } from '@/components/ui/CardWithFacetFilters'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { RoleEnum } from '@/types/enum'
import { useStore } from '@/stores/store'
import { getAllUserApi } from '@/network/apis/user'
import Static from './Static'

interface BookingStaticCardProps {
  data: BookingStatic
  queryStates?: [
    DataTableQueryState<TGetDailyBookingStatisticsParams>,
    React.Dispatch<React.SetStateAction<DataTableQueryState<TGetDailyBookingStatisticsParams>>>
  ]
  mode?: 'full' | 'mini'
  isAdminMini?: boolean
}

export function BookingStaticCard({ queryStates, data, mode = 'full', isAdminMini }: BookingStaticCardProps) {
  const { user } = useStore()
  const isAdmin = [RoleEnum.ADMIN, RoleEnum.OPERATOR].includes(user?.role as RoleEnum)

  // Fetch consultants data - Placeholder API call (commented out)
  const { data: consultantData } = useQuery({
    queryKey: [getAllUserApi.queryKey],
    queryFn: getAllUserApi.fn,
    enabled: isAdmin,
    select: (data) => data.data.filter((user) => user.role === RoleEnum.CONSULTANT)
  })

  const consultants = consultantData ?? []

  const filterFields: DataTableFilterField<TGetDailyBookingStatisticsParams>[] = React.useMemo(() => {
    const fields: DataTableFilterField<TGetDailyBookingStatisticsParams>[] = [
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

    if (mode === 'full') {
      if (isAdmin && consultants.length > 0) {
        fields.push({
          id: 'consultantId',
          label: 'Consultant',
          options: consultants
            .map((consultant) => ({
              // Using ID as placeholder label - CORRECT THIS LATER
              label: consultant.email,
              value: consultant.id ?? ''
            }))
            .filter((opt) => opt.value),
          isCustomFilter: true,
          isSingleChoice: true
        })
      }
    }

    return fields
  }, [isAdmin, consultants])

  // Update useDataTable generic type
  const { table } = useDataTable<TGetDailyBookingStatisticsParams>({
    data: [],
    columns: [],
    pageCount: 0,
    queryStates,
    filterFields,
    shallow: false,
    clearOnDefault: true
  })

  // Handle time range selection (remains the same logic, adjusted queryState type)
  const handleTimeRangeChange = (value: string) => {
    if (!queryStates) return
    const [, setQueryState] = queryStates

    let startDate: Date | undefined
    let endDate: Date | undefined
    const today = new Date()

    if (value === '90d') {
      startDate = new Date()
      startDate.setDate(today.getDate() - 90)
      endDate = today
    } else if (value === '30d') {
      startDate = new Date()
      startDate.setDate(today.getDate() - 30)
      endDate = today
    } else if (value === '7d') {
      startDate = new Date()
      startDate.setDate(today.getDate() - 7)
      endDate = today
    }
    // Handle 'custom' implicitly by filters, clear dates if needed
    const startDateString = startDate ? startDate.toISOString().split('T')[0] : undefined
    const endDateString = endDate ? endDate.toISOString().split('T')[0] : undefined

    setQueryState((prev: DataTableQueryState<TGetDailyBookingStatisticsParams>) => ({
      ...prev,
      fieldFilters: {
        ...prev.fieldFilters,
        startDate: startDateString,
        endDate: endDateString
      }
    }))
  }

  return (
    <div className='space-y-4 w-full overflow-auto'>
      <CardWithFacetFilters mainContent={<Static data={data} mode={mode} isAdminMini={isAdminMini} />}>
        <DataTableToolbar table={table} filterFields={filterFields} isTable={false}>
          {mode === 'full' && (
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
          )}
        </DataTableToolbar>
      </CardWithFacetFilters>
    </div>
  )
}
