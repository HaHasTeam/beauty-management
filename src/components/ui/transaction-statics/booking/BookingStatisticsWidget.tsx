'use client'

import { ListOrderedIcon } from 'lucide-react' // Or another suitable icon for bookings
import * as React from 'react'

import { RelatedBookingDialog } from '@/components/dialog/RelatedBookingDialog' // Assuming this exists and accepts the props
import { Button } from '@/components/ui/button'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import BookingStaticIndexPage from './index' // Import the booking statistics component

interface BookingStatisticsWidgetProps {
  consultantAccountId?: string
  consultantServiceId?: string
  className?: string
  header?: React.ReactNode
}

export function BookingStatisticsWidget({
  consultantAccountId,
  consultantServiceId,
  className,
  header
}: BookingStatisticsWidgetProps) {
  const [isDialogOpen, setIsDialogOpen] = React.useState(false)

  return (
    <div className={`relative p-0 ${className}`}>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant='ghost'
              size='icon'
              className='absolute right-2 top-2 h-6 w-6'
              onClick={() => setIsDialogOpen(true)}
              aria-label='View related bookings'
            >
              <ListOrderedIcon className='h-4 w-4' />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>View Related Bookings</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>

      {header}

      {/* Render Booking Statistics in mini mode */}
      <BookingStaticIndexPage
        mode='mini'
        consultantServiceId={consultantServiceId}
      />

      {/* Related Booking Dialog */}
      <RelatedBookingDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        consultantAccountId={consultantAccountId}
        consultantServiceId={consultantServiceId}
        // Add any other necessary props for the dialog
      />
    </div>
  )
}
