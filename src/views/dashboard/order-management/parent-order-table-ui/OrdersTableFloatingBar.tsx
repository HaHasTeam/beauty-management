import { SelectTrigger } from '@radix-ui/react-select'
import { type Table } from '@tanstack/react-table'
import { CheckCircle2, Download, FileText, Loader, Trash2, X } from 'lucide-react'
import * as React from 'react'
import { useNavigate } from 'react-router-dom'

import { Button } from '@/components/ui/button'
import { Kbd } from '@/components/ui/kbd'
import { Portal } from '@/components/ui/portal'
import { Select, SelectContent, SelectGroup, SelectItem } from '@/components/ui/select'
import { Separator } from '@/components/ui/separator'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import { Routes, routesConfig } from '@/configs/routes'
import { exportTableToCSV } from '@/lib/export'
import { ShippingStatusEnum } from '@/types/enum'
import { IOrder } from '@/types/order'

interface OrdersTableFloatingBarProps {
  table: Table<IOrder>
}

export function OrdersTableFloatingBar({ table }: OrdersTableFloatingBarProps) {
  const rows = table.getFilteredSelectedRowModel().rows
  const navigate = useNavigate()

  const [isPending, startTransition] = React.useTransition()
  const [action, setAction] = React.useState<'update-status' | 'export' | 'delete' | 'view-details'>()

  // Clear selection on Escape key press
  React.useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        table.toggleAllRowsSelected(false)
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [table])

  const handleViewDetails = () => {
    if (rows.length === 1) {
      const orderId = rows[0].original.id

      navigate(routesConfig[Routes.ORDER_DETAILS].getPath(orderId))
    }
  }

  return (
    <Portal>
      <div className='fixed inset-x-0 bottom-6 z-50 mx-auto w-fit px-2.5'>
        <div className='w-full overflow-x-auto'>
          <div className='mx-auto flex w-fit items-center gap-2 rounded-md border bg-primary/80 p-2 text-foreground shadow'>
            <div className='flex h-7 items-center rounded-md border border-dashed pl-2.5 pr-1'>
              <span className='whitespace-nowrap text-xs'>{rows.length} selected</span>
              <Separator orientation='vertical' className='ml-2 mr-1' />
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant='ghost'
                    size='icon'
                    className='size-5 hover:border'
                    onClick={() => table.toggleAllRowsSelected(false)}
                  >
                    <X className='size-3.5 shrink-0' aria-hidden='true' />
                  </Button>
                </TooltipTrigger>
                <TooltipContent className='flex items-center border bg-accent px-2 py-1 font-semibold text-foreground dark:bg-zinc-900'>
                  <p className='mr-2'>Clear selection</p>
                  <Kbd abbrTitle='Escape' variant='outline'>
                    Esc
                  </Kbd>
                </TooltipContent>
              </Tooltip>
            </div>
            <Separator orientation='vertical' className='hidden h-5 sm:block' />
            <div className='flex items-center gap-1.5'>
              <Select>
                <Tooltip>
                  <SelectTrigger asChild>
                    <TooltipTrigger asChild>
                      <Button
                        variant='secondary'
                        size='icon'
                        className='size-7 border data-[state=open]:bg-accent data-[state=open]:text-accent-foreground'
                        disabled={isPending}
                      >
                        {isPending && action === 'update-status' ? (
                          <Loader className='size-3.5 animate-spin' aria-hidden='true' />
                        ) : (
                          <CheckCircle2 className='size-3.5' aria-hidden='true' />
                        )}
                      </Button>
                    </TooltipTrigger>
                  </SelectTrigger>
                  <TooltipContent className='border bg-accent font-semibold text-foreground dark:bg-zinc-900'>
                    <p>Update status</p>
                  </TooltipContent>
                </Tooltip>
                <SelectContent align='center'>
                  <SelectGroup>
                    {Object.values(ShippingStatusEnum).map((status) => (
                      <SelectItem key={status} value={status} className='capitalize'>
                        {status}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant='secondary'
                    size='icon'
                    className='size-7 border'
                    onClick={() => {
                      setAction('export')
                      startTransition(() => {
                        exportTableToCSV(table, {
                          excludeColumns: ['select', 'actions'],
                          onlySelected: true
                        })
                      })
                    }}
                    disabled={isPending}
                  >
                    {isPending && action === 'export' ? (
                      <Loader className='size-3.5 animate-spin' aria-hidden='true' />
                    ) : (
                      <Download className='size-3.5' aria-hidden='true' />
                    )}
                  </Button>
                </TooltipTrigger>
                <TooltipContent className='border bg-accent font-semibold text-foreground dark:bg-zinc-900'>
                  <p>Export orders</p>
                </TooltipContent>
              </Tooltip>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant='secondary'
                    size='icon'
                    className='size-7 border'
                    onClick={() => {
                      setAction('view-details')
                      handleViewDetails()
                    }}
                    disabled={isPending || rows.length !== 1}
                  >
                    {isPending && action === 'view-details' ? (
                      <Loader className='size-3.5 animate-spin' aria-hidden='true' />
                    ) : (
                      <FileText className='size-3.5' aria-hidden='true' />
                    )}
                  </Button>
                </TooltipTrigger>
                <TooltipContent className='border bg-accent font-semibold text-foreground dark:bg-zinc-900'>
                  <p>View order details</p>
                </TooltipContent>
              </Tooltip>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant='secondary'
                    size='icon'
                    className='size-7 border'
                    onClick={() => {
                      setAction('delete')
                    }}
                    disabled={isPending}
                  >
                    {isPending && action === 'delete' ? (
                      <Loader className='size-3.5 animate-spin' aria-hidden='true' />
                    ) : (
                      <Trash2 className='size-3.5' aria-hidden='true' />
                    )}
                  </Button>
                </TooltipTrigger>
                <TooltipContent className='border bg-accent font-semibold text-foreground dark:bg-zinc-900'>
                  <p>Cancel orders</p>
                </TooltipContent>
              </Tooltip>
            </div>
          </div>
        </div>
      </div>
    </Portal>
  )
}
