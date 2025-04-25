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
      <div className='flex items-center text-sm text-muted-foreground p-1.5'>
        <span className='italic'>No information available</span>
      </div>
    )
  }

  const toggleExpanded = () => setExpanded(!expanded)

  // Get shipping details
  const shippingAddress = order.shippingAddress || 'N/A'
  const notes = order.notes || 'N/A'

  return (
    <div className='w-full bg-card rounded-md'>
      <div className='p-1.5'>
        {/* Wrapper to constrain width ONLY for the unexpanded row */}
        <div className='max-w-sm'>
          {' '}
          {/* Adjust max-w-sm as needed (e.g., max-w-xs, max-w-md) */}
          {/* Combined row with address, notes and expand button */}
          <div className='flex items-center justify-between gap-x-2'>
            <div className='flex-1 flex items-center gap-x-3 overflow-hidden'>
              <div className='truncate flex items-center gap-1'>
                <MapPin className='h-3 w-3 text-primary flex-shrink-0' />
                <span className='text-foreground font-medium whitespace-nowrap text-xs'>Address:</span>
                <span className='truncate text-xs text-muted-foreground'>{shippingAddress}</span>
              </div>
              <div className='truncate flex items-center gap-1'>
                <MessageSquare className='h-3 w-3 text-primary flex-shrink-0' />
                <span className='text-foreground font-medium whitespace-nowrap text-xs'>Notes:</span>
                <span className='truncate text-xs text-muted-foreground'>{notes}</span>
              </div>
            </div>
            <Button
              variant='ghost'
              size='sm'
              className='h-6 w-6 p-0 flex-shrink-0 text-muted-foreground hover:text-foreground hover:bg-accent ml-1'
              onClick={toggleExpanded}
            >
              {expanded ? <ChevronUp className='h-3.5 w-3.5' /> : <ChevronDown className='h-3.5 w-3.5' />}
            </Button>
          </div>
        </div>

        {expanded && (
          <div className='mt-2'>
            <ul className='space-y-2 pl-2'>
              {/* Shipping Address */}
              <li className='flex items-start gap-2 group hover:bg-muted/30 rounded-md p-1 transition-all duration-200'>
                <div className='flex-shrink-0 flex items-center justify-center w-6 h-6 bg-primary/10 text-primary rounded-md mt-0.5'>
                  <MapPin className='h-3.5 w-3.5' />
                </div>
                <div className='flex-1 min-w-0'>
                  <div className='text-xs font-semibold text-foreground whitespace-nowrap'>Shipping Address</div>
                  <div className='text-xs text-muted-foreground break-words'>{shippingAddress}</div>
                </div>
              </li>

              {/* Notes */}
              <li className='flex items-start gap-2 group hover:bg-muted/30 rounded-md p-1 transition-all duration-200'>
                <div className='flex-shrink-0 flex items-center justify-center w-6 h-6 bg-primary/10 text-primary rounded-md mt-0.5'>
                  <MessageSquare className='h-3.5 w-3.5' />
                </div>
                <div className='flex-1 min-w-0'>
                  <div className='text-xs font-semibold text-foreground whitespace-nowrap'>Order Notes</div>
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
