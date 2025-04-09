import type { ColumnSort, Row } from '@tanstack/react-table'
import { type z } from 'zod'

import { type DataTableConfig } from '@/configs/data-table'
import { type filterSchema } from '@/lib/parsers'

export type Prettify<T> = {
  [K in keyof T]: T[K]
} & {}

export type StringKeyOf<TData> = Extract<keyof TData, string>

export interface SearchParams {
  [key: string]: string | string[] | undefined
}

export interface Option {
  label: string
  value: string
  icon?: React.ComponentType<{ className?: string }> | React.ReactNode
  count?: number
  withCount?: boolean
}

export interface ExtendedColumnSort<TData> extends Omit<ColumnSort, 'id'> {
  id: StringKeyOf<TData>
}

export type ExtendedSortingState<TData> = ExtendedColumnSort<TData>[]

export type ColumnType = DataTableConfig['columnTypes'][number]

export type FilterOperator = DataTableConfig['globalOperators'][number]

export type JoinOperator = DataTableConfig['joinOperators'][number]['value']

export interface DataTableFilterField<TData> {
  id: string | keyof TData
  label: string
  placeholder?: string
  options?: Option[]
  isDate?: boolean
  isSingleChoice?: boolean
  /** If true, this is a custom filter not directly mapped to a data property */
  isCustomFilter?: boolean
  isNumber?: boolean
}

export interface DataTableAdvancedFilterField<TData> extends Omit<DataTableFilterField<TData>, 'id'> {
  id: StringKeyOf<TData> | string
  type: ColumnType
  isCustomFilter?: boolean
}

export type Filter<TData> = Prettify<
  Omit<z.infer<typeof filterSchema>, 'id'> & {
    id: StringKeyOf<TData>
  }
>

export interface DataTableRowAction<TData> {
  row: Row<TData>
  type: 'update' | 'delete'
}

export interface DataTableQueryState<TData, TExtendedFilter extends Record<string, unknown> = Record<string, unknown>> {
  fieldFilters: {
    [key in keyof TData]: string | string[]
  } & TExtendedFilter
  page: number
  perPage: number
  sort: ExtendedSortingState<TData>
}
