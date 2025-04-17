import { ChevronDown, ChevronUp, MapPin, MessageSquare } from 'lucide-react'
import { useState } from 'react'

import { Button } from '@/components/ui/button'
import { IOrder } from '@/types/order'

interface OrderResultCellProps {
  order: IOrder
}

export function OrderResultCell({ order }: OrderResultCellProps) {
  const [expanded, setExpanded] = useState(false)

  // If no order details exist
  if (!order) {
    return (
      <div className='flex items-center text-sm text-muted-foreground p-1'>
        <span className='italic'>No information available</span>
      </div>
    )
  }

  const toggleExpanded = () => setExpanded(!expanded)

  // Get shipping details
  const shippingAddress = order.shippingAddress || 'N/A'
  const notes = order.notes || 'N/A'

  return (
    <div className='max-w-[170px] bg-card rounded-md'>
      <div className='p-1'>
        {/* Combined row with address, notes and expand button */}
        <div className='flex items-start justify-between gap-x-1'>
          <div className='flex-1 flex flex-col gap-0.5 overflow-hidden'>
            <div className='flex items-center gap-0.5'>
              <MapPin className='h-3 w-3 text-primary flex-shrink-0' />
              <span className='text-xs font-medium whitespace-nowrap'>Addr:</span>
              <span className='truncate text-xs text-muted-foreground max-w-[100px]'>{shippingAddress}</span>
            </div>
            <div className='flex items-center gap-0.5'>
              <MessageSquare className='h-3 w-3 text-primary flex-shrink-0' />
              <span className='text-xs font-medium whitespace-nowrap'>Note:</span>
              <span className='truncate text-xs text-muted-foreground max-w-[100px]'>{notes}</span>
            </div>
          </div>
          <Button
            variant='ghost'
            size='sm'
            className='h-5 w-5 p-0 flex-shrink-0 text-muted-foreground hover:text-foreground hover:bg-accent'
            onClick={toggleExpanded}
          >
            {expanded ? <ChevronUp className='h-3 w-3' /> : <ChevronDown className='h-3 w-3' />}
          </Button>
        </div>

        {expanded && (
          <div className='mt-1'>
            <ul className='space-y-1 pl-1'>
              {/* Shipping Address */}
              <li className='flex items-start gap-1 group hover:bg-muted/30 rounded-md p-0.5 transition-all duration-200'>
                <div className='flex-shrink-0 flex items-center justify-center w-5 h-5 bg-primary/10 text-primary rounded-md'>
                  <MapPin className='h-3 w-3' />
                </div>
                <div className='flex-1 min-w-0'>
                  <div className='text-xs font-semibold text-foreground whitespace-nowrap'>Address</div>
                  <div className='text-xs text-muted-foreground break-words'>{shippingAddress}</div>
                </div>
              </li>

              {/* Notes */}
              <li className='flex items-start gap-1 group hover:bg-muted/30 rounded-md p-0.5 transition-all duration-200'>
                <div className='flex-shrink-0 flex items-center justify-center w-5 h-5 bg-primary/10 text-primary rounded-md'>
                  <MessageSquare className='h-3 w-3' />
                </div>
                <div className='flex-1 min-w-0'>
                  <div className='text-xs font-semibold text-foreground whitespace-nowrap'>Notes</div>
                  <div className='text-xs text-muted-foreground break-words'>{notes}</div>
                </div>
              </li>
            </ul>
          </div>
        )}
      </div>
    </div>
  )
}
