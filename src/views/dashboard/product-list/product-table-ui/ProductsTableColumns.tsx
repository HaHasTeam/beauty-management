import { type ColumnDef, Row } from '@tanstack/react-table'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Checkbox } from '@/components/ui/checkbox'
import { DataTableColumnHeader } from '@/components/ui/data-table/data-table-column-header'
import { cn, formatDate } from '@/lib/utils'
import { ProductStatusEnum, TProduct } from '@/types/product'
import { getDisplayString } from '@/utils/string'

import { getStatusIcon } from './helper'

export interface DataTableRowAction<TData> {
  row: Row<TData>
  type: 'ban' | 'view' | 'unbanned'
}
// interface GetColumnsProps {
//   setRowAction: React.Dispatch<React.SetStateAction<DataTableRowAction<TProduct> | null>>
// }
export function getColumns(): ColumnDef<TProduct>[] {
  return [
    {
      id: 'select',
      header: ({ table }) => (
        <Checkbox
          className='-translate-x-2'
          checked={table.getIsAllPageRowsSelected() || (table.getIsSomePageRowsSelected() && 'indeterminate')}
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label='Select all'
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label='Select row'
        />
      ),
      enableSorting: false,
      enableHiding: false,
      size: 100
    },
    {
      id: 'displayName',
      header: ({ column }) => <DataTableColumnHeader column={column} title='Display Name' />,
      cell: ({ row }) => {
        const displayName = row.original.name
        const image =
          'https://d2v5dzhdg4zhx3.cloudfront.net/web-assets/images/storypages/primary/ProductShowcasesampleimages/JPEG/Product+Showcase-1.jpg'
        return (
          <div className='flex space-x-2 items-center'>
            <Avatar className='size-10 object-cover aspect-square p-0.5 rounded-lg border bg-accent shadow-lg'>
              <AvatarImage src={image} />
              <AvatarFallback>{displayName[0].toUpperCase()}</AvatarFallback>
            </Avatar>
            <span className='max-w-[31.25rem] truncate'>{displayName}</span>
          </div>
        )
      }
    },
    {
      accessorKey: 'status',
      header: ({ column }) => <DataTableColumnHeader column={column} title='Status' />,
      cell: ({ row }) => {
        const statusKey = Object.keys(ProductStatusEnum).find((status) => {
          const value = ProductStatusEnum[status as keyof typeof ProductStatusEnum]
          return value === row.original.status
        })

        if (!statusKey) return null

        const statusValue = ProductStatusEnum[statusKey as keyof typeof ProductStatusEnum]

        const Icon = getStatusIcon(statusValue)

        return (
          <div
            className={cn(
              'flex items-center font-medium px-2 py-1 rounded-3xl shadow-xl',
              Icon.textColor,
              Icon.bgColor
            )}
          >
            <Icon.icon
              className={cn('mr-2 size-7 p-0.5 rounded-full animate-pulse', Icon.iconColor)}
              aria-hidden='true'
            />
            <span className='capitalize'>{getDisplayString(statusValue)}</span>
          </div>
        )
      },
      size: 50,
      filterFn: (row, id, value) => {
        return Array.isArray(value) && value.includes(row.getValue(id))
      }
    },
    {
      accessorKey: 'createdAt',
      header: ({ column }) => <DataTableColumnHeader column={column} title='Created At' />,
      cell: ({ cell }) =>
        formatDate(cell.getValue() as Date, {
          hour: 'numeric',
          minute: 'numeric'
        })
    }
  ]
}
