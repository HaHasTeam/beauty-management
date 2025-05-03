'use client'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import BookingTable from '@/views/dashboard/booking-management/booking-table-ui/index'
// Reusing the existing table
//
interface RelatedBookingDialogProps {
  consultantAccountId?: string
  consultantServiceId?: string
  open: boolean
  onOpenChange: (open: boolean) => void
}
export function RelatedBookingDialog({
  consultantAccountId,
  consultantServiceId,
  open,
  onOpenChange
}: RelatedBookingDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      {/* Increase max width for better table view */}
      <DialogContent className='sm:max-w-[80%] max-h-[80vh] overflow-auto flex flex-col gap-4'>
        <DialogHeader>
          <DialogTitle>Bookings that related to this event</DialogTitle>
          <DialogDescription>Showing bookings related to the selected criteria.</DialogDescription>
        </DialogHeader>
        <div className='flex-1 overflow-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden'>
          <BookingTable
            consultantAccountId={consultantAccountId}
            consultantServiceId={consultantServiceId}
            mode='mini'
          />
        </div>
        {/* Reusing the structure from the order management index */}
      </DialogContent>
    </Dialog>
  )
}
