import { useMutation, useQueryClient } from '@tanstack/react-query'
import { Row } from '@tanstack/react-table'
import * as React from 'react'

import { DataTable } from '@/components/ui/data-table/data-table'
import { DataTableToolbar } from '@/components/ui/data-table/data-table-toolbar'
import { useDataTable } from '@/hooks/useDataTable'
import { toSentenceCase } from '@/lib/utils'
import { getAllVouchersApi, updateStatusVoucherByIdApi } from '@/network/apis/voucher'
import { BrandStatusEnum } from '@/types/brand'
import { StatusEnum } from '@/types/enum'
import type { DataTableFilterField, DataTableQueryState } from '@/types/table'
import { TVoucher } from '@/types/voucher'

import { BanVouchersDialog } from './BanVouchersDialog'
import { getStatusIcon } from './helper'
import { UpdateStatusBrandDialog } from './UpdateStatusBrandDialog'
import { ViewDetailsVouchersSheet } from './ViewDetailsVouchersSheet'
import { DataTableRowAction, getColumns } from './VouchersTableColumns'
import { VouchersTableFloatingBar } from './VouchersTableFloatingBar'
import { VouchersTableToolbarActions } from './VouchersTableToolbarActions'

interface VoucherTableProps {
  data: TVoucher[]
  pageCount: number
  queryStates?: [DataTableQueryState<TVoucher>, React.Dispatch<React.SetStateAction<DataTableQueryState<TVoucher>>>]
}

export function VouchersTable({ data, pageCount, queryStates }: VoucherTableProps) {
  const queryClient = useQueryClient()

  const [rowAction, setRowAction] = React.useState<DataTableRowAction<TVoucher> | null>(null)
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
  const filterFields: DataTableFilterField<TVoucher>[] = [
    {
      id: 'status',
      label: 'Status',
      options: Object.keys(StatusEnum).map((status) => {
        const value = StatusEnum[status as keyof typeof StatusEnum]
        return {
          label: toSentenceCase(value),
          value: value,
          icon: getStatusIcon(value).icon
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
  const { mutateAsync: updateStatusVoucherMutation } = useMutation({
    // mutationKey: [updateStatusBrandByIdApi.mutationKey],
    mutationFn: updateStatusVoucherByIdApi.fn
  })
  const deleteBrand = async (brand: Row<TVoucher>['original'][]) => {
    // Map over the brand array and call the mutation for each brand
    const updatePromises = brand.map((item) =>
      updateStatusVoucherMutation({ voucherId: item.id, status: StatusEnum.BANNED })
    )

    // Wait for all updates to complete
    await Promise.all(updatePromises)
    await queryClient.invalidateQueries({
      queryKey: [getAllVouchersApi.queryKey],
      exact: true
    })
  }
  const updateStatusBrand = async (brand: Row<TVoucher>['original'][]) => {
    // Map over the brand array and call the mutation for each brand
    const updatePromises = brand.map((item) =>
      updateStatusVoucherMutation({ voucherId: item.id, status: StatusEnum.ACTIVE })
    )

    // Wait for all updates to complete
    await Promise.all(updatePromises)
    await queryClient.invalidateQueries({ queryKey: [getAllVouchersApi.queryKey] })
  }

  return (
    <>
      <DataTable table={table} floatingBar={<VouchersTableFloatingBar table={table} />}>
        <DataTableToolbar table={table} filterFields={filterFields}>
          <VouchersTableToolbarActions table={table} />
        </DataTableToolbar>
      </DataTable>
      <BanVouchersDialog
        open={rowAction?.type === 'ban'}
        onOpenChange={() => setRowAction(null)}
        Vouchers={rowAction?.row.original ? [rowAction?.row.original] : []}
        showTrigger={false}
        onSuccess={(voucher) => {
          deleteBrand(voucher)
          rowAction?.row.toggleSelected(false)
        }}
      />
      <UpdateStatusBrandDialog
        status={BrandStatusEnum.ACTIVE}
        open={rowAction?.type === 'update-status'}
        onOpenChange={() => setRowAction(null)}
        Vouchers={rowAction?.row.original ? [rowAction?.row.original] : []}
        showTrigger={false}
        onSuccess={(voucher) => {
          updateStatusBrand(voucher)
          rowAction?.row.toggleSelected(false)
        }}
      />
      <ViewDetailsVouchersSheet
        Voucher={rowAction?.row.original}
        open={rowAction?.type === 'view'}
        onOpenChange={() => setRowAction(null)}
      />
    </>
  )
}
