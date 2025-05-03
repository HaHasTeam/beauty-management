'use client'

import { ListOrderedIcon } from 'lucide-react'
import * as React from 'react'

import { RelatedOrdersDialog } from '@/components/dialog/RelatedOrdersDialog'
import { Button } from '@/components/ui/button'
import { CardContent } from '@/components/ui/card'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { OrderEnum } from '@/types/enum'
import OrderStaticCard from './index'

interface OrderStatisticsWidgetProps {
  orderType?: OrderEnum
  eventId?: string
  className?: string
  header?: React.ReactNode
}

export function OrderStatisticsWidget({ orderType, eventId, className, header }: OrderStatisticsWidgetProps) {
  const [isDialogOpen, setIsDialogOpen] = React.useState(false)

  return (
    <div className={`relative p-0 ${className}`}>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant='ghost'
              size='icon'
              className='absolute top-2 right-2 z-10 h-7 w-7'
              onClick={() => setIsDialogOpen(true)}
              disabled={!orderType && !eventId}
            >
              <ListOrderedIcon className='h-4 w-4' />
              <span className='sr-only'>View Related Orders</span>
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>View Related Orders</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>

      <CardContent className='p-0 flex items-center justify-center min-h-[200px] w-full'>
        <OrderStaticCard eventId={eventId} orderType={orderType} mode={'mini'} header={header} />
      </CardContent>

      <RelatedOrdersDialog open={isDialogOpen} onOpenChange={setIsDialogOpen} type={orderType} eventId={eventId} />
    </div>
  )
}
