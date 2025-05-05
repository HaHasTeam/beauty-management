'use client'

import { useQuery } from '@tanstack/react-query'
import * as React from 'react'
import { useTranslation } from 'react-i18next'

import { DataTable } from '@/components/ui/data-table/data-table'
import { DataTableToolbar } from '@/components/ui/data-table/data-table-toolbar'
import { useDataTable } from '@/hooks/useDataTable'
import { getAllBrandsApi } from '@/network/apis/brand'
import { flattenCategoryApi } from '@/network/apis/category'
import { useStore } from '@/stores/store'
import { RoleEnum } from '@/types/enum'
import { IResponseProduct, ProductStatusEnum } from '@/types/product'
import type { DataTableFilterField, DataTableQueryState } from '@/types/table'

import { BanProductsDialog } from './BanProductsDialog'
import { DataTableRowAction, getColumns } from './ProductsTableColumns'
import { ProductsTableFloatingBar } from './ProductsTableFloatingBar'
import { ProductTableToolbarActions } from './ProductsTableToolbarActions'
import { ViewDetailsProductSheet } from './ViewDetailsProductSheet'

interface ProductTableProps {
  data: IResponseProduct[]
  pageCount: number
  queryStates?: [
    DataTableQueryState<IResponseProduct>,
    React.Dispatch<React.SetStateAction<DataTableQueryState<IResponseProduct>>>
  ]
  isDialog?: boolean
  showCount?: boolean
}

export function ProductTable({ data, pageCount, queryStates, isDialog, showCount = false }: ProductTableProps) {
  const { t } = useTranslation()
  const [rowAction, setRowAction] = React.useState<DataTableRowAction<IResponseProduct> | null>(null)
  const columns = React.useMemo(() => getColumns({ setRowAction, showCount }), [])

  const { user } = useStore()
  const isAdmin = [RoleEnum.ADMIN, RoleEnum.OPERATOR].includes(user?.role as RoleEnum)

  const { data: brandData } = useQuery({
    queryKey: [getAllBrandsApi.queryKey],
    queryFn: getAllBrandsApi.fn,
    enabled: isAdmin // Only fetch brands for admin users
  })
  const { data: categoryData } = useQuery({
    queryKey: [flattenCategoryApi.queryKey],
    queryFn: flattenCategoryApi.fn,
    enabled: isAdmin // Only fetch brands for admin users
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

  const filterFields: DataTableFilterField<IResponseProduct>[] = React.useMemo(() => {
    const brands = brandData?.data ?? []
    const categories = categoryData?.data ?? []
    if (isDialog) {
      return []
    }
    const fields: DataTableFilterField<IResponseProduct>[] = [
      {
        id: 'search',
        label: 'Name',
        placeholder: 'Search product...',
        isCustomFilter: true
      },
      {
        id: 'statuses',
        label: 'Status',
        options: Object.keys(ProductStatusEnum).map((status) => {
          const value = ProductStatusEnum[status as keyof typeof ProductStatusEnum]
          return {
            label: t(`status.${value}`),
            value: value as string,
            icon: '●'
          }
        })
      },
      {
        id: 'minPrice',
        label: 'Min Price',
        placeholder: 'Min price',
        isCustomFilter: true,
        isNumber: true
      },
      {
        id: 'maxPrice',
        label: 'Max Price',
        placeholder: 'Max price',
        isCustomFilter: true,
        isNumber: true
      },
      {
        id: 'categoryId',
        label: 'Category',
        placeholder: 'Select category',
        options: categories?.map((category) => ({
          label: category.name,
          value: category.id
        })),
        isCustomFilter: true,
        isSingleChoice: true
      }
    ]
    if (isAdmin && brandData?.data) {
      fields.push({
        id: 'brandId',
        label: 'Brand',
        options: brands?.map((brand) => ({
          label: brand.name,
          value: brand.id
        })),
        isCustomFilter: true,
        isSingleChoice: true
      })
    }
    return fields
  }, [brandData?.data, categoryData?.data, isDialog, isAdmin, t])

  // Add brand filter for admin users

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
      <DataTable table={table} floatingBar={<ProductsTableFloatingBar table={table} />}>
        <DataTableToolbar table={table} filterFields={filterFields}>
          <ProductTableToolbarActions table={table} />
        </DataTableToolbar>
      </DataTable>
      <BanProductsDialog
        open={rowAction?.type === 'ban'}
        onOpenChange={() => setRowAction(null)}
        Products={rowAction?.row.original ? [rowAction?.row.original] : []}
        showTrigger={false}
        onSuccess={() => rowAction?.row.toggleSelected(false)}
      />
      <ViewDetailsProductSheet
        Product={rowAction?.row.original}
        open={rowAction?.type === 'view'}
        onOpenChange={() => setRowAction(null)}
      />
    </>
  )
}
