import { type ColumnDef, Row } from '@tanstack/react-table'
import { Ellipsis, FilePenLine, SettingsIcon } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

import { Button } from '@/components/ui/button'
import { DataTableColumnHeader } from '@/components/ui/data-table/data-table-column-header'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { Routes, routesConfig } from '@/configs/routes'
import useGrant from '@/hooks/useGrant'
import { formatDate } from '@/lib/utils'
import { RoleEnum } from '@/types/enum'
import { TGroupProduct } from '@/types/group-product'
import { formatNumber } from '@/utils/number'

import { GroupProductProductsCell } from './GroupProductProductsCell'
import { GroupProductStatusCell } from './GroupProductStatusCell'
import { GroupProductStrategyCell } from './GroupProductStrategyCell'

export interface DataTableRowAction<TData> {
  row: Row<TData>
  type: 'ban' | 'view' | 'publish'
}

export function getColumns(): ColumnDef<TGroupProduct>[] {
  return [
    {
      accessorKey: 'name',
      header: ({ column }) => <DataTableColumnHeader column={column} title='Name Of Group' />,
      cell: ({ row }) => <div>{row.original.name}</div>,
      size: 320,
      enableHiding: false
    },
    {
      accessorKey: 'products',
      header: ({ column }) => <DataTableColumnHeader column={column} title='Products' />,
      cell: ({ row }) => {
        return <GroupProductProductsCell products={row.original.products} />
      },
      enableHiding: false,
      size: 220
    },
    {
      accessorKey: 'criterias',
      header: ({ column }) => <DataTableColumnHeader column={column} title='Strategy Of Group' />,
      cell: ({ row }) => {
        return <GroupProductStrategyCell groupProduct={row.original} />
      },
      size: 400,
      enableSorting: false,
      enableHiding: false
    },
    {
      accessorKey: 'maxBuyAmountEachPerson',
      header: ({ column }) => <DataTableColumnHeader column={column} title='Max Amount' />,
      cell: ({ row }) =>
        row.original.maxBuyAmountEachPerson && (
          <div className='text-end font-bold'>{formatNumber(row.original.maxBuyAmountEachPerson)}</div>
        ),
      size: 50
    },
    {
      accessorKey: 'status',
      header: ({ column }) => <DataTableColumnHeader column={column} title='Status' />,
      cell: ({ row }) => {
        return <GroupProductStatusCell groupProduct={row.original} />
      },
      filterFn: (row, id, value) => {
        return Array.isArray(value) && value.includes(row.getValue(id))
      },
      minSize: 100
    },
    {
      accessorKey: 'updatedAt',
      header: ({ column }) => <DataTableColumnHeader column={column} title='Updated At' />,
      cell: ({ cell }) =>
        formatDate(cell.getValue() as Date, {
          hour: 'numeric',
          minute: 'numeric',
          month: '2-digit'
        }),
      size: 250
    },
    {
      id: 'actions',
      header: () => <SettingsIcon className='-translate-x-1' />,
      cell: function Cell({ row }) {
        const navigate = useNavigate()
        const handleNavigate = () => {
          navigate(routesConfig[Routes.GROUP_PRODUCT_DETAILS].getPath({ id: row.original.id }))
        }
        const isGranted = useGrant([RoleEnum.MANAGER, RoleEnum.STAFF])
        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button aria-label='Open menu' variant='ghost' className='flex size-8 p-0 data-[state=open]:bg-muted'>
                <Ellipsis className='size-4' aria-hidden='true' />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align='end' className='w-40'>
              <DropdownMenuItem onClick={handleNavigate} className='bg-blue-200 text-blue-500'>
                <span className='w-full flex gap-2 items-center cursor-pointer'>
                  <FilePenLine size={16} strokeWidth={3} />
                  <span className='font-semibold'>{isGranted ? 'Edit' : 'View'}</span>
                </span>
              </DropdownMenuItem>
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
