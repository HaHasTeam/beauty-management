'use client'

import { useQuery } from '@tanstack/react-query'
import * as React from 'react'

import { DataTable } from '@/components/ui/data-table/data-table'
import { DataTableToolbar } from '@/components/ui/data-table/data-table-toolbar'
import { useDataTable } from '@/hooks/useDataTable'
import { toSentenceCase } from '@/lib/utils'
import { getAllUserApi } from '@/network/apis/user'
import { useStore } from '@/stores/store'
import { RoleEnum } from '@/types/enum'
import type { DataTableFilterField, DataTableQueryState } from '@/types/table'
import { TWithdrawalRequest, WithdrawalStatusEnum } from '@/types/withdrawal-request'

import { getStatusIcon } from './helper'
import { RejectWithdrawalRequestDialog } from './RejectWithdrawalRequestDialog'
import { DataTableRowAction, getColumns } from './WithdrawalRequestTableColumns'
import { WithdrawalRequestTableToolbarActions } from './WithdrawalRequestTableToolbarActions'

interface WithdrawalRequestTableProps {
  data: TWithdrawalRequest[]
  pageCount: number
  queryStates?: [
    DataTableQueryState<TWithdrawalRequest>,
    React.Dispatch<React.SetStateAction<DataTableQueryState<TWithdrawalRequest>>>
  ]
  specifiedAccountId?: string
}

export function WithdrawalRequestTable({
  data,
  pageCount,
  queryStates,
  specifiedAccountId
}: WithdrawalRequestTableProps) {
  const [rowAction, setRowAction] = React.useState<DataTableRowAction<TWithdrawalRequest> | null>(null)
  const { user } = useStore()
  const isAdmin = [RoleEnum.ADMIN, RoleEnum.OPERATOR].includes(user?.role as RoleEnum)
  const { data: accounts } = useQuery({
    queryKey: [getAllUserApi.queryKey],
    queryFn: getAllUserApi.fn
  })
  const userData = accounts?.data
  // Only show actions column for admin users
  const columns = React.useMemo(() => {
    const allColumns = getColumns()

    // If not admin, filter out the actions column
    if (!isAdmin) {
      return allColumns.filter((column) => column.id !== 'actions')
    }

    return allColumns
  }, [isAdmin])

  const filterFields: DataTableFilterField<TWithdrawalRequest>[] = React.useMemo(() => {
    const fields: DataTableFilterField<TWithdrawalRequest>[] = [
      {
        id: 'status',
        label: 'Status',
        options: Object.keys(WithdrawalStatusEnum).map((status) => {
          const value = WithdrawalStatusEnum[status as keyof typeof WithdrawalStatusEnum]
          return {
            label: toSentenceCase(value),
            value: value,
            icon: getStatusIcon(value).icon
          }
        })
      },
      {
        id: 'startDate',
        label: 'Start Date',
        isDate: true,
        isCustomFilter: true
      },
      {
        id: 'endDate',
        label: 'End Date',
        isDate: true,
        isCustomFilter: true
      }
    ]

    if (isAdmin && !specifiedAccountId) {
      fields.push({
        id: 'relatedAccountId',
        label: 'Related Account',
        options: userData?.map((user) => ({ label: user.email, value: user.id })) || [],
        isCustomFilter: true,
        isSingleChoice: true
      })
    }
    return fields
  }, [isAdmin, userData, specifiedAccountId])

  const { table } = useDataTable({
    queryStates,
    data,
    columns,
    pageCount,
    filterFields,
    initialState: {
      sorting: [{ id: 'createdAt', desc: true }],
      columnPinning: { right: isAdmin ? ['actions'] : [] }
    },
    getRowId: (originalRow, index) => `${originalRow.id}-${index}`,
    shallow: false,
    clearOnDefault: true
  })

  // Don't render any actions if not admin
  if (!isAdmin) {
    return (
      <DataTable table={table}>
        <DataTableToolbar table={table} filterFields={filterFields}>
          <WithdrawalRequestTableToolbarActions table={table} />
        </DataTableToolbar>
      </DataTable>
    )
  }

  return (
    <>
      <DataTable table={table}>
        <DataTableToolbar table={table} filterFields={filterFields}>
          <WithdrawalRequestTableToolbarActions table={table} />
        </DataTableToolbar>
      </DataTable>
      <RejectWithdrawalRequestDialog
        open={rowAction?.type === 'reject'}
        onOpenChange={() => setRowAction(null)}
        withdrawalRequests={rowAction?.row.original ? [rowAction?.row.original] : []}
        showTrigger={false}
        onSuccess={() => rowAction?.row.toggleSelected(false)}
      />
    </>
  )
}
