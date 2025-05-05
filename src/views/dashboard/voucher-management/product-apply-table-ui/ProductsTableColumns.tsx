'use client'

// Update the getColumns function to properly handle product selection
// Keep all imports and interface definitions

import type { ColumnDef } from '@tanstack/react-table'
import { Image, SettingsIcon, Trash } from 'lucide-react'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { DataTableColumnHeader } from '@/components/ui/data-table/data-table-column-header'
import { IProductTable } from '@/types/product'
import { formatNumber } from '@/utils/number'

// const fallBackImage = '/product-placeholder.webp' // No longer needed

// Update the IProductTable interface to match the actual data structure

interface GetColumnsProps {
  onDelete: (id: string) => void
  handleProductSelect?: (id: string) => void
}

export function getColumns({ onDelete, handleProductSelect }: GetColumnsProps): ColumnDef<IProductTable>[] {
  return [
    {
      id: 'select',
      header: ({ table }) => (
        <Checkbox
          className='-translate-x-2'
          checked={table.getIsAllPageRowsSelected() || (table.getIsSomePageRowsSelected() && 'indeterminate')}
          onCheckedChange={(value) => {
            table.toggleAllPageRowsSelected(!!value)
            // When selecting all, update all product IDs
            if (handleProductSelect && value) {
              const allProductIds = table.getRowModel().rows.map((row) => row.original.id || '')
              allProductIds.forEach((id) => {
                if (id) handleProductSelect(id)
              })
            }
          }}
          aria-label='Select all'
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => {
            row.toggleSelected(!!value)
            if (handleProductSelect && row.original.id) {
              handleProductSelect(row.original.id)
            }
          }}
          aria-label='Select row'
        />
      ),
      enableSorting: false,
      enableHiding: false,
      size: 1
    },
    {
      id: 'product',
      header: ({ column }) => <DataTableColumnHeader column={column} title='Name' />,
      cell: ({ row }) => {
        const displayName = row.original.name
        const productImage = row.original.images?.[0]?.fileUrl || ''

        return (
          <div className='flex items-center gap-2 py-2'>
            <div className='w-8 h-8 flex-shrink-0'>
              <Avatar className='rounded-lg w-full h-full'>
                <AvatarImage src={productImage} alt={displayName} className='bg-transparent object-cover' />
                <AvatarFallback className='bg-transparent rounded-lg'>
                  <Image size={24} />
                </AvatarFallback>
              </Avatar>
            </div>
            <span className='max-w-[90%] truncate font-medium'>{displayName}</span>
          </div>
        )
      },
      size: 550
    },
    {
      accessorKey: 'quantity',
      header: ({ column }) => <DataTableColumnHeader column={column} title='Quantity' />,
      cell: ({ cell }) => (
        <div className='text-start font-semibold py-2'>{formatNumber(cell.row.original.quantity)}</div>
      ),
      size: 10,
      enableSorting: false,
      enableHiding: false
    },
    {
      id: 'actions',
      header: () => <SettingsIcon className='-translate-x-1' />,
      cell: function Cell({ row }) {
        const productId = row.original.id || ''
        return (
          <div className='flex items-center'>
            <Button
              type='button'
              variant='ghost'
              className='flex size-8 p-0 hover:text-primary'
              onClick={() => onDelete(productId)}
            >
              <Trash className='size-6 border rounded-full p-1 bg-destructive/80 text-white' aria-hidden='true' />
            </Button>
          </div>
        )
      },
      size: 40,
      enableSorting: false
    }
  ]
}
