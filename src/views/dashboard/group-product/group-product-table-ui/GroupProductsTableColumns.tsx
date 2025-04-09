import { type ColumnDef, Row } from '@tanstack/react-table'
import { Ellipsis, EyeIcon, FilePenLine, MoveRight, SettingsIcon, TicketCheck } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { DataTableColumnHeader } from '@/components/ui/data-table/data-table-column-header'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { Routes, routesConfig } from '@/configs/routes'
import { cn, formatDate } from '@/lib/utils'
import { DiscountTypeEnum } from '@/types/enum'
import { GroupProductStatusEnum, TGroupProduct } from '@/types/group-product'
import { formatCurrency, formatNumber } from '@/utils/number'
import { getDisplayString } from '@/utils/string'

import { getStatusIcon } from './helper'

export interface DataTableRowAction<TData> {
  row: Row<TData>
  type: 'ban' | 'view' | 'publish'
}
interface GetColumnsProps {
  setRowAction: React.Dispatch<React.SetStateAction<DataTableRowAction<TGroupProduct> | null>>
}
export function getColumns({ setRowAction }: GetColumnsProps): ColumnDef<TGroupProduct>[] {
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
      size: 34
    },
    {
      accessorKey: 'name',
      header: ({ column }) => <DataTableColumnHeader column={column} title='Name Of Group' />,
      cell: ({ row }) => <div>{row.original.name}</div>,
      size: 220,
      enableHiding: false
    },
    {
      accessorKey: 'products',
      header: ({ column }) => <DataTableColumnHeader column={column} title='Products' />,
      cell: ({ row }) => {
        const products = row.original.products.map((product) => product.name).join(', ')
        return <div>{products}</div>
      },
      size: 220,
      enableHiding: false
    },
    {
      accessorKey: 'criterias',
      header: ({ column }) => <DataTableColumnHeader column={column} title='Strategy Of Group' />,
      cell: ({ row }) => {
        const criteriaLength = row.original.criterias.length
        const sortedCriterias = row.original.criterias.sort((a, b) => a.threshold - b.threshold)

        const children = sortedCriterias.reduce((pre, item, index) => {
          const itemEl = (
            <>
              <div key={item.id} className='flex items-center gap-2 p-1 px-2 bg-primary/10 w-fit rounded-lg shadow-lg'>
                <TicketCheck size={20} className='border p-1 rounded-full bg-primary' color='white' />
                <div className='flex items-center'>
                  <span className='text-xs font-bold'>
                    Off{' '}
                    {item.voucher.discountType === DiscountTypeEnum.AMOUNT
                      ? formatCurrency(item.voucher.discountValue)
                      : formatNumber(item.voucher.discountValue, '%')}{' '}
                  </span>
                  <span className='text-xs ml-1'>- {formatNumber(item.threshold, ' People')}</span>
                </div>
              </div>
              {index < criteriaLength - 1 && <MoveRight />}
            </>
          )
          return [...pre, itemEl]
        }, [] as JSX.Element[])
        return <div className='flex items-center gap-1 flex-wrap space-y-1 '>{children}</div>
      },
      size: 1000,
      enableSorting: false,
      enableHiding: false
    },
    {
      accessorKey: 'maxBuyAmountEachPerson',
      header: ({ column }) => <DataTableColumnHeader column={column} title='Max Amount' />,
      cell: ({ row }) =>
        row.original.maxBuyAmountEachPerson && (
          <div className='text-center font-bold'>{formatNumber(row.original.maxBuyAmountEachPerson)}</div>
        ),
      size: 200
    },
    {
      accessorKey: 'status',
      header: ({ column }) => <DataTableColumnHeader column={column} title='Status' />,
      cell: ({ row }) => {
        const statusKey = Object.keys(GroupProductStatusEnum).find((status) => {
          const value = GroupProductStatusEnum[status as keyof typeof GroupProductStatusEnum]
          return value === row.original.status
        })

        if (!statusKey) return null

        const statusValue = GroupProductStatusEnum[statusKey as keyof typeof GroupProductStatusEnum]

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
                  <span className='font-semibold'>Edit</span>
                </span>
              </DropdownMenuItem>
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
