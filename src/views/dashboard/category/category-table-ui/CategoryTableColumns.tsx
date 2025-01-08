import { UpdateIcon } from '@radix-ui/react-icons'
import { type ColumnDef, Row } from '@tanstack/react-table'
import { Ellipsis, EyeIcon, SettingsIcon } from 'lucide-react'
import { Link } from 'react-router-dom'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { DataTableColumnHeader } from '@/components/ui/data-table/data-table-column-header'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { Routes, routesConfig } from '@/configs/routes'
import { formatDate } from '@/lib/utils'
import { ICategory } from '@/types/category'

export interface DataTableRowAction<TData> {
  row: Row<TData>
  type: 'ban' | 'view' | 'unbanned'
}
interface GetColumnsProps {
  setRowAction: React.Dispatch<React.SetStateAction<DataTableRowAction<ICategory> | null>>
}
export function getColumns({ setRowAction }: GetColumnsProps): ColumnDef<ICategory>[] {
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
      id: 'product',
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
      accessorKey: 'createdAt',
      header: ({ column }) => <DataTableColumnHeader column={column} title='Created At' />,
      cell: ({ cell }) =>
        formatDate(cell.getValue() as Date, {
          hour: 'numeric',
          minute: 'numeric'
        })
    },
    {
      id: 'actions',
      header: () => <SettingsIcon className='-translate-x-1' />,
      cell: function Cell({ row }) {
        return (
          <DropdownMenu modal={false}>
            <DropdownMenuTrigger asChild>
              <Button aria-label='Open menu' variant='ghost' className='flex size-8 p-0 data-[state=open]:bg-muted'>
                <Ellipsis className='size-4' aria-hidden='true' />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align='end' className='w-40'>
              <DropdownMenuItem
                onClick={() => {
                  setRowAction({ row: row, type: 'view' })
                }}
              >
                <span className='w-full flex gap-2 items-center cursor-pointer'>
                  <EyeIcon />
                  View Details
                </span>
              </DropdownMenuItem>
              <Link
                to={routesConfig[Routes.CATEGORY_DETAILS].getPath({
                  id: row.original.id
                })}
              >
                <DropdownMenuItem>
                  <span className='w-full flex gap-2 items-center cursor-pointer'>
                    <UpdateIcon />
                    Update
                  </span>
                </DropdownMenuItem>
              </Link>
            </DropdownMenuContent>
          </DropdownMenu>
        )
      },
      size: 40,
      enableSorting: false,
      enableHiding: false
    }
  ]
}
