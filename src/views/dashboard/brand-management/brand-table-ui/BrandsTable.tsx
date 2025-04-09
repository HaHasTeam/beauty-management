import { useMutation } from '@tanstack/react-query'
import * as React from 'react'
import { useShallow } from 'zustand/react/shallow'

import { DataTable } from '@/components/ui/data-table/data-table'
import { DataTableToolbar } from '@/components/ui/data-table/data-table-toolbar'
import { useDataTable } from '@/hooks/useDataTable'
import { toSentenceCase } from '@/lib/utils'
import { assignOperateToBrandApi } from '@/network/apis/brand'
import { useStore } from '@/stores/store'
import { BrandStatusEnum, TBrand } from '@/types/brand'
import { RoleEnum } from '@/types/enum'
import type { DataTableFilterField, DataTableQueryState } from '@/types/table'

import { AssignOperatorDialog } from './AssignOperatorDialog'
// import { BanBrandsDialog } from './BanBrandsDialog'
import { DataTableRowAction, getColumns } from './BrandsTableColumns'
import { BrandsTableFloatingBar } from './BrandsTableFloatingBar'
import { BrandsTableToolbarActions } from './BrandsTableToolbarActions'
import { UpdateStatusBrandDialog } from './UpdateStatusBrandDialog'
import { ViewDetailsBrandsSheet } from './ViewDetailsBrandsSheet'

interface BrandTableProps {
  data: TBrand[]
  pageCount: number
  queryStates?: [DataTableQueryState<TBrand>, React.Dispatch<React.SetStateAction<DataTableQueryState<TBrand>>>]
}

export function BrandsTable({ data, pageCount, queryStates }: BrandTableProps) {
  const { user } = useStore(
    useShallow((state) => {
      return {
        user: state.user
      }
    })
  )
  const isAdmin = user?.role === RoleEnum.ADMIN
  const [rowAction, setRowAction] = React.useState<DataTableRowAction<TBrand> | null>(null)
  const columns = React.useMemo(
    () =>
      getColumns({
        setRowAction,
        isAdmin
      }),
    [isAdmin]
  )
  const { mutateAsync: assignOperatorToBrand } = useMutation({
    mutationFn: assignOperateToBrandApi.fn,
    mutationKey: [assignOperateToBrandApi.mutationKey]
  })
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
  const filterFields: DataTableFilterField<TBrand>[] = [
    {
      id: 'name',
      placeholder: 'Search by name...',
      label: 'Name'
    },
    {
      id: 'status',
      label: 'Status',
      options: Object.keys(BrandStatusEnum).map((status) => {
        const value = BrandStatusEnum[status as keyof typeof BrandStatusEnum]
        return {
          label: toSentenceCase(value),
          value: value,
          // Just use a string for the icon
          icon: '●'
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
  // const { mutateAsync: updateStatusBrandMutation } = useMutation({
  //   mutationKey: [updateStatusBrandByIdApi.mutationKey],
  //   mutationFn: updateStatusBrandByIdApi.fn,
  //   onSettled: async () => {
  //     return await queryClient.invalidateQueries({ queryKey: [getAllBrandsApi.queryKey] })
  //   }
  // })
  // const deleteBrand = async (brand: Row<TBrand>['original'][]) => {
  //   // Map over the brand array and call the mutation for each brand
  //   const updatePromises = brand.map((item) =>
  //     updateStatusBrandMutation({ brandId: item.id, status: BrandStatusEnum.BANNED, reason: 'ban' })
  //   )

  //   // Wait for all updates to complete
  //   await Promise.all(updatePromises)
  //   // await queryClient.invalidateQueries({
  //   //   queryKey: ['getAllBrands', 'updateStatusBrandById']
  //   //   // exact: true
  //   // })
  // }

  const handleAssignOperator = async (operatorId: string, brandId: string) => {
    if (!brandId) return

    // Implement your API call here
    await assignOperatorToBrand({
      brandId: brandId,
      operatorId: operatorId
    })
    // Reset states after successful assignment
    setRowAction(null)
  }
  const statusDialogs = [
    { type: 'ban', status: BrandStatusEnum.BANNED },
    { type: 'update-status-pre-approved-for-meeting', status: BrandStatusEnum.PRE_APPROVED_FOR_MEETING },
    { type: 'update-status-needs-additional-documents', status: BrandStatusEnum.NEED_ADDITIONAL_DOCUMENTS },
    { type: 'update-status-active', status: BrandStatusEnum.ACTIVE },
    { type: 'update-status-inactive', status: BrandStatusEnum.INACTIVE },
    { type: 'update-status-pending-review', status: BrandStatusEnum.PENDING_REVIEW },
    { type: 'deny', status: BrandStatusEnum.DENIED }
  ]

  return (
    <>
      <DataTable table={table} floatingBar={<BrandsTableFloatingBar table={table} />}>
        <DataTableToolbar table={table} filterFields={filterFields}>
          <BrandsTableToolbarActions table={table} />
        </DataTableToolbar>
      </DataTable>
      {/* <BanBrandsDialog
        open={rowAction?.type === 'ban'}
        onOpenChange={() => setRowAction(null)}
        Brands={rowAction?.row.original ? [rowAction?.row.original] : []}
        showTrigger={false}
        onSuccess={(brand) => {
          deleteBrand(brand)
          rowAction?.row.toggleSelected(false)
        }}
      /> */}
      {statusDialogs.map(({ type, status }) => (
        <UpdateStatusBrandDialog
          key={type}
          status={status}
          open={rowAction?.type === type}
          onOpenChange={() => setRowAction(null)}
          Brands={rowAction?.row.original ? [rowAction.row.original] : []}
          showTrigger={false}
        />
      ))}

      <ViewDetailsBrandsSheet
        brandId={rowAction?.row.original.id}
        open={rowAction?.type === 'view'}
        onOpenChange={() => setRowAction(null)}
        onUpdateStatusChange={(type) => {
          if (rowAction?.row) {
            setRowAction({ row: rowAction.row, type: type })
          }
        }}
      />
      <AssignOperatorDialog
        open={rowAction?.type === 'assign-operator'}
        onOpenChange={(open) => {
          if (!open) {
            setRowAction(null)
          }
        }}
        row={rowAction?.row}
        brandId={rowAction?.row.original.id || ''}
        onAssign={handleAssignOperator}
      />
    </>
  )
}
