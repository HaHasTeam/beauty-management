'use client'

import * as React from 'react'

import { DataTable } from '@/components/ui/data-table/data-table'
import { DataTableToolbar } from '@/components/ui/data-table/data-table-toolbar'
import { useDataTable } from '@/hooks/useDataTable'
import { toSentenceCase } from '@/lib/utils'
import { UserRoleEnum } from '@/types/role'
import type { DataTableFilterField, DataTableQueryState } from '@/types/table'
import { TUser, UserStatusEnum } from '@/types/user'

import { DataTableRowAction, getColumns } from './AccountsTableColumns'
import { AccountsTableFloatingBar } from './AccountsTableFloatingBar'
import { AccountTableToolbarActions } from './AccountsTableToolbarActions'
import { BanAccountsDialog } from './BanAccountsDialog'
import { getRoleIcon, getStatusIcon } from './helper'
import { ViewDetailsAccountSheet } from './ViewDetailsAccountSheet'

interface AccountTableProps {
  data: TUser[]
  pageCount: number
  queryStates?: [DataTableQueryState<TUser>, React.Dispatch<React.SetStateAction<DataTableQueryState<TUser>>>]
}

export function AccountTable({ data, pageCount, queryStates }: AccountTableProps) {
  const [rowAction, setRowAction] = React.useState<DataTableRowAction<TUser> | null>(null)
  const columns = React.useMemo(
    () =>
      getColumns({
        setRowAction
      }),
    []
  )

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
  const filterFields: DataTableFilterField<TUser>[] = [
    {
      id: 'username',
      label: 'Username',
      placeholder: 'Filter usernames...'
    },
    {
      id: 'status',
      label: 'Status',
      options: Object.keys(UserStatusEnum).map((status) => {
        const value = UserStatusEnum[status as keyof typeof UserStatusEnum]
        return {
          label: toSentenceCase(value),
          value: value,
          icon: getStatusIcon(value).icon
        }
      })
    },
    {
      id: 'role',
      label: 'Coworker Role',
      options: Object.keys(UserRoleEnum).map((priority) => {
        const value = UserRoleEnum[priority as keyof typeof UserRoleEnum]
        return {
          label: toSentenceCase(value),
          value: value,
          icon: getRoleIcon(value).icon
        }
      })
    }
  ]

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
      <DataTable table={table} floatingBar={<AccountsTableFloatingBar table={table} />}>
        <DataTableToolbar table={table} filterFields={filterFields}>
          <AccountTableToolbarActions table={table} />
        </DataTableToolbar>
      </DataTable>
      <BanAccountsDialog
        open={rowAction?.type === 'ban'}
        onOpenChange={() => setRowAction(null)}
        accounts={rowAction?.row.original ? [rowAction?.row.original] : []}
        showTrigger={false}
        onSuccess={() => rowAction?.row.toggleSelected(false)}
      />
      <ViewDetailsAccountSheet
        account={rowAction?.row.original}
        open={rowAction?.type === 'view'}
        onOpenChange={() => setRowAction(null)}
      />
    </>
  )
}
