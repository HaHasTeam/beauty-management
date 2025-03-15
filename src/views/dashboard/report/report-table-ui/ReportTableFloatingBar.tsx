import { type Table } from '@tanstack/react-table'
import { X } from 'lucide-react'
import * as React from 'react'

import { Button } from '@/components/ui/button'
import { Kbd } from '@/components/ui/kbd'
import { Portal } from '@/components/ui/portal'
import { Separator } from '@/components/ui/separator'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import { IReport } from '@/types/report'

interface ReportTableFloatingBarProps {
  table: Table<IReport>
}

export function ReportTableFloatingBar({ table }: ReportTableFloatingBarProps) {
  const rows = table.getFilteredSelectedRowModel().rows

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
          </div>
        </div>
      </div>
    </Portal>
  )
}
