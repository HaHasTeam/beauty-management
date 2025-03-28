'use client'

// Update the getColumns function to properly handle product selection
// Keep all imports and interface definitions

import type { ColumnDef } from '@tanstack/react-table'
import { Image, SettingsIcon, Trash } from 'lucide-react'

import ImageWithFallback from '@/components/image/ImageWithFallback'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { DataTableColumnHeader } from '@/components/ui/data-table/data-table-column-header'
import { IProductTable } from '@/types/product'

const fallBackImage = '/product-placeholder.webp'

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
    // Update the cell rendering for the product image to handle IImage[] correctly
    {
      id: 'product',
      header: ({ column }) => <DataTableColumnHeader column={column} title='Name' />,
      cell: ({ row }) => {
        const displayName = row.original.name
        // Handle the case where images might be an array or undefined
        const productImage =
          row.original.images && row.original.images.length > 0 ? row.original.images[0].fileUrl || '' : ''

        return (
          <div className='flex items-center gap-2'>
            <div className='w-8 h-8 rounded bg-muted flex items-center justify-center'>
              <Image className='w-4 h-4 text-muted-foreground' />
              <ImageWithFallback fallback={fallBackImage} src={productImage || '/placeholder.svg'} alt={displayName} />
            </div>
            <span>{displayName}</span>
          </div>
        )
      }
    },
    {
      accessorKey: 'quantity',
      header: ({ column }) => <DataTableColumnHeader column={column} title='Quantity' />,
      cell: ({ cell }) => <div>{cell.row.original.quantity}</div>,
      size: 10,
      enableSorting: false,
      enableHiding: false
    },
    {
      accessorKey: 'createdAt',
      id: 'createdAt'
    },
    {
      id: 'actions',
      header: () => <SettingsIcon className='-translate-x-1' />,
      cell: function Cell({ row }) {
        const productId = row.original.id || ''
        return (
          <div className=''>
            <Button
              type='button'
              variant='ghost'
              className='flex size-8 p-0 hover:text-primary'
              onClick={() => onDelete(productId)}
            >
              <Trash className='size-4' aria-hidden='true' />
            </Button>
          </div>
        )
      },
      size: 40,
      enableSorting: false
    }
  ]
}
