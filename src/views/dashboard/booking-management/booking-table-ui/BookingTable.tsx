'use client'

import { useQuery } from '@tanstack/react-query'
import * as React from 'react'
import { useMemo } from 'react'

import { DataTable } from '@/components/ui/data-table/data-table'
import { DataTableToolbar } from '@/components/ui/data-table/data-table-toolbar'
import { useDataTable } from '@/hooks/useDataTable'
import { toSentenceCase } from '@/lib/utils'
import { getAllConsultantServiceApi } from '@/network/apis/consultant-service'
import { getAllUserApi } from '@/network/apis/user'
import { TBooking } from '@/types/booking'
import { BookingStatusEnum, ServiceTypeEnum } from '@/types/enum'
import { UserRoleEnum } from '@/types/role'
import type { DataTableFilterField, DataTableQueryState } from '@/types/table'

import { getColumns } from './BookingsTableColumns'
import { BookingTableToolbarActions } from './BookingTableToolbarActions'
import { getStatusIcon } from './helper'

interface BookingTableProps {
  data: TBooking[]
  pageCount: number
  queryStates?: [DataTableQueryState<TBooking>, React.Dispatch<React.SetStateAction<DataTableQueryState<TBooking>>>]
  mode?: 'full' | 'mini'
}

// Service interface with minimum required field

export default function BookingTable({ data, pageCount, queryStates, mode = 'full' }: BookingTableProps) {
  // Type casting the query function to make TypeScript happy
  const columns = useMemo(() => getColumns({ mode }), [mode])
  const { data: serviceListData } = useQuery({
    queryKey: [getAllConsultantServiceApi.queryKey],
    queryFn: getAllConsultantServiceApi.fn
  })
  const { data: consultantAccount } = useQuery({
    queryKey: [getAllUserApi.queryKey],
    queryFn: getAllUserApi.fn
  })
  const consultantAccountData = consultantAccount?.data.filter((account) => account.role === UserRoleEnum.CONSULTANT)
  // Safely handle the service list data with defensive coding
  const serviceData = serviceListData?.data

  // Define filterFields before using it in columns
  const filterFields: DataTableFilterField<TBooking>[] = useMemo(() => {
    if (mode === 'mini') {
      return [
        {
          id: 'search',
          label: 'Search',
          placeholder: 'Search by id or name,... ',
          isCustomFilter: true
        },
        {
          id: 'status',
          label: 'Status',
          options: Object.keys(BookingStatusEnum).map((status) => {
            const value = BookingStatusEnum[status as keyof typeof BookingStatusEnum]
            return {
              label: toSentenceCase(value),
              value: value,
              icon: getStatusIcon(value).icon
            }
          })
        },
        {
          id: 'systemServiceType',
          label: 'System Service Type',
          options: Object.keys(ServiceTypeEnum).map((type) => ({
            label: toSentenceCase(type),
            value: type
          })),
          isCustomFilter: true,
          isSingleChoice: true
        }
      ]
    }
    return [
      {
        id: 'search',
        label: 'Search',
        placeholder: 'Search by id or name,... ',
        isCustomFilter: true
      },
      {
        id: 'status',
        label: 'Status',
        options: Object.keys(BookingStatusEnum).map((status) => {
          const value = BookingStatusEnum[status as keyof typeof BookingStatusEnum]
          return {
            label: toSentenceCase(value),
            value: value,
            icon: getStatusIcon(value).icon
          }
        })
      },
      {
        id: 'consultantServiceId',
        label: 'Consultant Service',
        options: serviceData?.map((service) => ({
          label: `[${service?.account?.username ?? service?.account?.email ?? 'N/A'}]${service.systemService.name}`,
          value: service.id
        })),
        isCustomFilter: true,
        isSingleChoice: true
      },
      {
        id: 'consultantAccountId',
        label: 'Consultant',
        options: consultantAccountData?.map((account) => ({
          label: (account.firstName && account.lastName
            ? `${account.firstName} ${account.lastName}`
            : account.username
          ).toLocaleUpperCase(),
          value: account.id
        })),
        isCustomFilter: true,
        isSingleChoice: true
      },
      {
        id: 'systemServiceType',
        label: 'System Service Type',
        options: Object.keys(ServiceTypeEnum).map((type) => ({
          label: toSentenceCase(type),
          value: type
        })),
        isCustomFilter: true,
        isSingleChoice: true
      }
    ]
  }, [serviceData, consultantAccountData, mode])

  const { table } = useDataTable({
    queryStates,
    data,
    columns,
    pageCount,
    filterFields,
    initialState: {
      sorting: [{ id: 'createdAt', desc: true }],
      columnPinning: { right: ['actions'] }
    },
    getRowId: (originalRow, index) => `${originalRow.id}-${index}`,
    shallow: false,
    clearOnDefault: true
  })

  return (
    <>
      <DataTable table={table}>
        <DataTableToolbar table={table} filterFields={filterFields}>
          <BookingTableToolbarActions table={table} />
        </DataTableToolbar>
      </DataTable>
    </>
  )
}
