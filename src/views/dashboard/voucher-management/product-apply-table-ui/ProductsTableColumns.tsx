import { type ColumnDef, Row } from '@tanstack/react-table'
import { Image, SettingsIcon, Trash } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { DataTableColumnHeader } from '@/components/ui/data-table/data-table-column-header'
import { IProductTable } from '@/types/product'

export interface DataTableRowAction<TData> {
  row: Row<TData>
  type: 'ban' | 'view' | 'unbanned' | 'update-status'
}
interface GetColumnsProps {
  onDelete: (productId: string) => void
  handleProductSelect?: (productId: string) => void
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
          }}
          aria-label='Select all'
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => {
            row.toggleSelected(!!value)
            handleProductSelect?.(row.original.id || '')
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
        const displayName = row.original.name + ' ' + row.original.title
        return (
          <div className='flex items-center gap-2'>
            <div className='w-8 h-8 rounded bg-muted flex items-center justify-center'>
              <Image className='w-4 h-4 text-muted-foreground' />
            </div>
            <span>{displayName}</span>
          </div>
        )
      }
    },
    {
      accessorKey: 'title',
      header: ({ column }) => <DataTableColumnHeader column={column} title='Classification' />,
      cell: ({ row }) => {
        const displayName = row.original.title
        return (
          <div className='flex space-x-2 items-center'>
            <span className='max-w-[31.25rem] truncate'>{displayName}</span>
          </div>
        )
      }
    },
    {
      accessorKey: 'sku',
      header: ({ column }) => <DataTableColumnHeader column={column} title='SKU' />,
      cell: ({ cell }) => <div>{cell.row.original.sku || '--'}</div>,
      size: 100,
      enableSorting: false,
      enableHiding: false
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
      accessorKey: 'price',
      header: ({ column }) => <DataTableColumnHeader column={column} title='Price' />,
      cell: ({ cell }) => <div>{cell.row.original.price}</div>,
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
