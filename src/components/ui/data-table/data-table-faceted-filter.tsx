import type { Column } from '@tanstack/react-table'
import { Check, PlusCircle } from 'lucide-react'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator
} from '@/components/ui/command'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Separator } from '@/components/ui/separator'
import { cn } from '@/lib/utils'
import type { Option } from '@/types/table'

// Define a custom filter column interface that mimics the necessary Column methods
export interface CustomFilterColumn {
  getFilterValue: () => unknown
  setFilterValue: (value: unknown) => void
}

// Extend the Column type to include our custom filter column
export type ColumnOrCustom<TData, TValue> = Column<TData, TValue> | CustomFilterColumn

interface DataTableFacetedFilterProps<TData, TValue> {
  column?: ColumnOrCustom<TData, TValue>
  title?: string
  options: Option[]
  /**
   * Whether the filter should be a single-choice filter.
   * When true, selecting an option will deselect any previously selected option.
   * @default false
   */
  isSingleChoice?: boolean
  placeholder?: string
}

export function DataTableFacetedFilter<TData, TValue>({
  column,
  title,
  options,
  isSingleChoice = false,
  placeholder
}: DataTableFacetedFilterProps<TData, TValue>) {
  const unknownValue = column?.getFilterValue()
  const selectedValues = new Set(
    Array.isArray(unknownValue) ? unknownValue : unknownValue !== undefined ? [unknownValue] : []
  )

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant='outline' size='sm' className='h-8 border-dashed'>
          <PlusCircle className='mr-2 size-4' />
          {title}
          {selectedValues?.size > 0 && (
            <>
              <Separator orientation='vertical' className='mx-2 h-4' />
              <Badge variant='secondary' className='rounded-sm px-1 font-normal lg:hidden'>
                {selectedValues.size}
              </Badge>
              <div className='hidden space-x-1 lg:flex'>
                {selectedValues.size > 2 ? (
                  <Badge variant='secondary' className='rounded-sm px-1 font-normal'>
                    {selectedValues.size} selected
                  </Badge>
                ) : (
                  options
                    .filter((option) => selectedValues.has(option.value))
                    .map((option) => (
                      <Badge variant='secondary' key={option.value} className='rounded-sm px-1 font-normal'>
                        {option.label}
                      </Badge>
                    ))
                )}
              </div>
            </>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className='w-fit max-w-[400px] p-0' align='start'>
        <Command>
          <CommandInput placeholder={placeholder ?? title} />
          <CommandList className='max-h-full'>
            <CommandEmpty>No results found.</CommandEmpty>
            <CommandGroup className='max-h-[18.75rem] overflow-y-auto overflow-x-hidden'>
              {options.map((option) => {
                const isSelected = selectedValues.has(option.value)
                return (
                  <CommandItem
                    key={option.value}
                    onSelect={() => {
                      if (isSingleChoice) {
                        // For single choice, set just this value or clear if already selected
                        if (isSelected) {
                          column?.setFilterValue(undefined)
                        } else {
                          column?.setFilterValue(option.value)
                        }
                      } else {
                        // For multi-choice, add or remove from the set
                        if (isSelected) {
                          selectedValues.delete(option.value)
                        } else {
                          selectedValues.add(option.value)
                        }
                        const filterValues = Array.from(selectedValues)
                        column?.setFilterValue(filterValues.length ? filterValues : undefined)
                      }
                    }}
                  >
                    <div
                      className={cn(
                        'mr-2 flex size-4 items-center justify-center rounded-sm border border-primary',
                        isSelected ? 'bg-primary text-primary-foreground' : 'opacity-50 [&_svg]:invisible'
                      )}
                    >
                      <Check className='size-4' aria-hidden='true' />
                    </div>
                    {option.icon && typeof option.icon === 'function' ? (
                      <option.icon className='mr-2 size-4 text-muted-foreground' aria-hidden='true' />
                    ) : option.icon ? (
                      <span className='mr-2 size-4 text-muted-foreground'>{option.icon}</span>
                    ) : null}
                    <span className='flex-1 truncate'>{option.label}</span>
                    {option.count && (
                      <span className='ml-auto flex size-4 items-center justify-center font-mono text-xs'>
                        {option.count}
                      </span>
                    )}
                  </CommandItem>
                )
              })}
            </CommandGroup>
            {selectedValues.size > 0 && (
              <>
                <CommandSeparator />
                <CommandGroup>
                  <CommandItem
                    onSelect={() => column?.setFilterValue(undefined)}
                    className='justify-center text-center'
                  >
                    Clear filters
                  </CommandItem>
                </CommandGroup>
              </>
            )}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
