'use client'

import type { Table } from '@tanstack/react-table'
import { X } from 'lucide-react'
import * as React from 'react'

import { DataTableFacetedFilter, type ColumnOrCustom } from '@/components/ui/data-table/data-table-faceted-filter'
import { DataTableViewOptions } from '@/components/ui/data-table/data-table-view-options'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

import { cn } from '@/lib/utils'
import type { DataTableFilterField } from '@/types/table'
import { FlexDatePicker } from '@/components/flexible-date-picker/FlexDatePicker'

interface DataTableToolbarProps<TData> extends React.HTMLAttributes<HTMLDivElement> {
  table: Table<TData>
  /**
   * An array of filter field configurations for the data table.
   * - When options are provided, a faceted filter is rendered.
   * - When isDate is true, a date picker is rendered.
   * - When isSingleChoice is true with options, a single-choice faceted filter is rendered.
   * - When isNumber is true, a number input is rendered.
   * - Otherwise, a search filter is rendered.
   *
   * @example
   * const filterFields = [
   *   {
   *     id: 'name',
   *     label: 'Name',
   *     placeholder: 'Filter by name...'
   *   },
   *   {
   *     id: 'status',
   *     label: 'Status',
   *     options: [
   *       { label: 'Active', value: 'active', icon: ActiveIcon, count: 10 },
   *       { label: 'Inactive', value: 'inactive', icon: InactiveIcon, count: 5 }
   *     ]
   *   },
   *   {
   *     id: 'priority',
   *     label: 'Priority',
   *     isSingleChoice: true,
   *     options: [
   *       { label: 'Low', value: 'low' },
   *       { label: 'Medium', value: 'medium' },
   *       { label: 'High', value: 'high' }
   *     ]
   *   },
   *   {
   *     id: 'dueDate',
   *     label: 'Due Date',
   *     isDate: true
   *   }
   * ]
   */
  filterFields?: DataTableFilterField<TData>[]
  isTable?: boolean
}

export function DataTableToolbar<TData>({
  table,
  filterFields = [],
  children,
  isTable = true,
  className,
  ...props
}: DataTableToolbarProps<TData>) {
  const isFiltered = table.getState().columnFilters.length > 0

  // Memoize computation of searchableColumns, filterableColumns, dateColumns, and numberColumns
  const { searchableColumns, filterableColumns, dateColumns, numberColumns } = React.useMemo(() => {
    return {
      searchableColumns: filterFields.filter((field) => !field.options && !field.isDate && !field.isNumber),
      filterableColumns: filterFields.filter((field) => field.options),
      dateColumns: filterFields.filter((field) => field.isDate),
      numberColumns: filterFields.filter((field) => field.isNumber)
    }
  }, [filterFields])

  // Helper function to check if a column exists or should be treated as a custom filter
  const shouldRenderFilter = (columnId: string) => {
    const column = table.getColumn(columnId)
    const field = filterFields.find((f) => f.id === columnId)
    return column || (field && field.isCustomFilter)
  }

  // Helper function to get column or handle custom filter
  const getColumnOrCustom = (columnId: string): ColumnOrCustom<TData, unknown> => {
    const column = table.getColumn(columnId)
    // If it's a regular column, return it
    if (column) return column

    // For custom filters, we'll create a proxy object with the necessary methods
    // This allows custom filters to work with the same UI components
    return {
      getFilterValue: () => {
        // Look up the filter value in columnFilters state
        const filterValue = table.getState().columnFilters.find((f) => f.id === columnId)?.value
        return filterValue
      },
      setFilterValue: (value: unknown) => {
        // Update columnFilters state for this custom filter
        const currentFilters = table.getState().columnFilters

        if (value === undefined || (Array.isArray(value) && value.length === 0)) {
          // Remove filter if value is empty
          table.setColumnFilters(currentFilters.filter((f) => f.id !== columnId))
        } else {
          // Update or add filter
          const filterIndex = currentFilters.findIndex((f) => f.id === columnId)
          if (filterIndex >= 0) {
            const newFilters = [...currentFilters]
            newFilters[filterIndex] = { id: columnId, value }
            table.setColumnFilters(newFilters)
          } else {
            table.setColumnFilters([...currentFilters, { id: columnId, value }])
          }
        }
      }
    }
  }

  const isHaveFilter =
    searchableColumns.length > 0 || filterableColumns.length > 0 || dateColumns.length > 0 || numberColumns.length > 0
  if (!isHaveFilter) return null
  return (
    <div className={cn('flex w-full items-center justify-between gap-2 overflow-auto p-1', className)} {...props}>
      <div className='flex flex-1 items-center gap-2'>
        {searchableColumns.length > 0 &&
          searchableColumns.map(
            (column) =>
              shouldRenderFilter(String(column.id)) && (
                <Input
                  key={String(column.id)}
                  placeholder={column.placeholder}
                  value={(getColumnOrCustom(String(column.id)).getFilterValue() as string) ?? ''}
                  onChange={(event) => getColumnOrCustom(String(column.id)).setFilterValue(event.target.value)}
                  className='h-8 w-40 lg:w-64'
                />
              )
          )}
        {numberColumns.length > 0 &&
          numberColumns.map(
            (column) =>
              shouldRenderFilter(String(column.id)) && (
                <Input
                  key={String(column.id)}
                  type='number'
                  placeholder={column.placeholder}
                  value={(getColumnOrCustom(String(column.id)).getFilterValue() as string) ?? ''}
                  onChange={(event) => {
                    getColumnOrCustom(String(column.id)).setFilterValue(event)
                  }}
                  className='h-8 w-36'
                />
              )
          )}
        {filterableColumns.length > 0 &&
          filterableColumns.map((column) => {
            try {
              return (
                shouldRenderFilter(String(column.id)) && (
                  <DataTableFacetedFilter
                    key={String(column.id)}
                    column={getColumnOrCustom(String(column.id))}
                    title={column.label}
                    placeholder={column.placeholder}
                    options={column.options ?? []}
                    isSingleChoice={column.isSingleChoice}
                  />
                )
              )
            } catch (error) {
              console.error(`Error rendering filter for column ${String(column.id)}:`, error)
              return null
            }
          })}
        {dateColumns.length > 0 &&
          dateColumns.map(
            (column) =>
              shouldRenderFilter(String(column.id)) && (
                <FlexDatePicker
                  key={String(column.id)}
                  field={{
                    value: getColumnOrCustom(String(column.id)).getFilterValue() as string,
                    onChange: (value) =>
                      getColumnOrCustom(String(column.id)).setFilterValue(
                        new Date(value as unknown as string).toLocaleString()
                      )
                  }}
                  label={column.label}
                />
              )
          )}
        {isFiltered && (
          <Button
            aria-label='Reset filters'
            variant='ghost'
            className='h-8 px-2 lg:px-3'
            onClick={() => table.resetColumnFilters()}
          >
            Reset
            <X className='ml-2 size-4' aria-hidden='true' />
          </Button>
        )}
      </div>
      <div className='flex items-center gap-2'>
        <div className='flex items-center gap-2'>{children}</div>
        {isTable && <DataTableViewOptions table={table} />}
      </div>
    </div>
  )
}
