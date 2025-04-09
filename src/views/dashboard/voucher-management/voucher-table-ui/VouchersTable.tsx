import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Row } from '@tanstack/react-table'
import * as React from 'react'

import { DataTable } from '@/components/ui/data-table/data-table'
import { DataTableToolbar } from '@/components/ui/data-table/data-table-toolbar'
import { useDataTable } from '@/hooks/useDataTable'
import { toSentenceCase } from '@/lib/utils'
import { getAllBrandsApi } from '@/network/apis/brand'
import { getAllProductApi } from '@/network/apis/product'
import { getAllVouchersApi, updateStatusVoucherByIdApi } from '@/network/apis/voucher'
import { useStore } from '@/stores/store'
import { BrandStatusEnum } from '@/types/brand'
import { RoleEnum, StatusEnum, VoucherApplyTypeEnum, VoucherStatusEnum, VoucherVisibilityEnum } from '@/types/enum'
import type { DataTableFilterField, DataTableQueryState } from '@/types/table'
import { TVoucher } from '@/types/voucher'

import { UpdateStatusVoucherDialog } from './UpdateStatusVoucherDialog'
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
  const { data: productData } = useQuery({
    queryKey: [getAllProductApi.queryKey],
    queryFn: getAllProductApi.fn
  })

  const { data: brandData } = useQuery({
    queryKey: [getAllBrandsApi.queryKey],
    queryFn: getAllBrandsApi.fn
  })

  const { user } = useStore()
  const isAdmin = [RoleEnum.ADMIN, RoleEnum.OPERATOR].includes(user?.role as RoleEnum)
  const brands = brandData?.data ?? []
  const products = productData?.data ?? []
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
      options: Object.keys(VoucherStatusEnum).map((status) => {
        const value = VoucherStatusEnum[status as keyof typeof VoucherStatusEnum]
        return {
          label: toSentenceCase(value),
          value: value
        }
      })
    },
    ...(isAdmin
      ? [
          {
            id: 'brandId',
            label: 'Brand',
            options: brands
              .filter((brand) => brand.status === BrandStatusEnum.ACTIVE)
              .map((brand) => ({
                label: brand.name,
                value: brand.id
              })),
            isCustomFilter: true,
            isSingleChoice: true
          }
        ]
      : []),
    {
      id: 'applyType',
      label: 'Apply Type',
      options: Object.keys(VoucherApplyTypeEnum).map((applyType) => {
        const value = VoucherApplyTypeEnum[applyType as keyof typeof VoucherApplyTypeEnum]
        return {
          label: toSentenceCase(value),
          value: value
        }
      }),
      isCustomFilter: true,
      isSingleChoice: true
    },
    {
      id: 'visibility',
      label: 'Visibility',
      options: Object.keys(VoucherVisibilityEnum).map((visibility) => {
        const value = VoucherVisibilityEnum[visibility as keyof typeof VoucherVisibilityEnum]
        return {
          label: toSentenceCase(value),
          value: value
        }
      }),
      isCustomFilter: true,
      isSingleChoice: true
    },
    {
      id: 'startTime',
      label: 'Start Date',
      isDate: true,
      isCustomFilter: true
    },
    {
      id: 'endTime',
      label: 'End Date',
      isDate: true,
      isCustomFilter: true
    },
    {
      id: 'applyProductIds',
      label: 'Products',
      options: products
        .filter((product) => product.status === StatusEnum.ACTIVE)
        .map((product) => ({
          label: product.name,
          value: product.id
        })),
      isCustomFilter: true,
      isSingleChoice: false
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
    mutationFn: updateStatusVoucherByIdApi.fn
  })

  const activateVoucher = async (vouchers: Row<TVoucher>['original'][]) => {
    // Map over the vouchers array and call the mutation for each voucher
    const updatePromises = vouchers.map((item) =>
      updateStatusVoucherMutation({ voucherId: item.id, status: StatusEnum.ACTIVE })
    )

    // Wait for all updates to complete
    await Promise.all(updatePromises)
    await queryClient.invalidateQueries({ queryKey: [getAllVouchersApi.queryKey] })
  }

  const deactivateVoucher = async (vouchers: Row<TVoucher>['original'][]) => {
    // Map over the vouchers array and call the mutation for each voucher
    const updatePromises = vouchers.map((item) =>
      updateStatusVoucherMutation({ voucherId: item.id, status: StatusEnum.INACTIVE })
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
      <UpdateStatusVoucherDialog
        status={StatusEnum.ACTIVE}
        open={rowAction?.type === 'activate'}
        onOpenChange={() => setRowAction(null)}
        Vouchers={rowAction?.row.original ? [rowAction?.row.original] : []}
        showTrigger={false}
        onSuccess={(voucher) => {
          activateVoucher(voucher)
          rowAction?.row.toggleSelected(false)
        }}
      />
      <UpdateStatusVoucherDialog
        status={StatusEnum.INACTIVE}
        open={rowAction?.type === 'deactivate'}
        onOpenChange={() => setRowAction(null)}
        Vouchers={rowAction?.row.original ? [rowAction?.row.original] : []}
        showTrigger={false}
        onSuccess={(voucher) => {
          deactivateVoucher(voucher)
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
