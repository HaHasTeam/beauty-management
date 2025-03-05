import { useMutation, useQueryClient } from '@tanstack/react-query'
import { CalendarIcon, Check, Clock, FileText, Loader2, MapPin, X } from 'lucide-react'
import moment from 'moment'
import { useTranslation } from 'react-i18next'

import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { useToast } from '@/hooks/useToast'
import { getAllBookingsApi, updateBookingStatusApi } from '@/network/apis/booking'
import type { CalendarEvent } from '@/types/booking'
import { BookingStatusEnum } from '@/types/enum'

import { eventStyleGetter, getStatusBookingText, getStatusClass } from '../helper'

interface BookingDetailsDialogProps {
  selectedEvent: CalendarEvent | null
  onOpenChange: (open: boolean) => void
}

export function BookingDetailsDialog({ selectedEvent, onOpenChange }: BookingDetailsDialogProps) {
  const queryClient = useQueryClient()
  const { successToast, errorToast } = useToast()
  const { t } = useTranslation()

  const { mutate: updateBookingStatus, isPending: isUpdating } = useMutation({
    mutationFn: ({ id, status }: { id: string; status: BookingStatusEnum }) => {
      if (!selectedEvent) throw new Error('No event selected')

      return updateBookingStatusApi.fn({
        id,
        status,
        startTime: moment(selectedEvent.start).format('YYYY-MM-DD HH:mm:ss'),
        endTime: moment(selectedEvent.end).format('YYYY-MM-DD HH:mm:ss')
      })
    },
    onSuccess: (_, variables) => {
      let action = ''
      switch (variables.status) {
        case BookingStatusEnum.BOOKING_CONFIRMED:
          action = 'accepted'
          break
        case BookingStatusEnum.CANCELLED:
          action = 'denied'
          break
        case BookingStatusEnum.COMPLETED:
          action = 'marked as completed'
          break
        default:
          action = 'updated'
      }
      successToast({
        message: `The booking has been successfully ${action}.`
      })
      queryClient.invalidateQueries({ queryKey: [getAllBookingsApi.queryKey] })
      onOpenChange(false)
    },
    onError: () => {
      errorToast({
        message: 'Failed to update booking status. Please try again.'
      })
    }
  })

  const handleAcceptBooking = () => {
    if (selectedEvent) {
      updateBookingStatus({ id: selectedEvent.id.toString(), status: BookingStatusEnum.BOOKING_CONFIRMED })
    }
  }

  const handleDenyBooking = () => {
    if (selectedEvent) {
      updateBookingStatus({ id: selectedEvent.id.toString(), status: BookingStatusEnum.CANCELLED })
    }
  }

  const handleCompleteBooking = () => {
    if (selectedEvent) {
      updateBookingStatus({ id: selectedEvent.id.toString(), status: BookingStatusEnum.COMPLETED })
    }
  }

  const isWaitingForConfirmation = selectedEvent?.resource.status === BookingStatusEnum.WAIT_FOR_CONFIRMATION
  const isConfirmed = selectedEvent?.resource.status === BookingStatusEnum.BOOKING_CONFIRMED

  const eventStyle = selectedEvent ? eventStyleGetter(selectedEvent, t).style : {}

  return (
    <Dialog open={!!selectedEvent} onOpenChange={onOpenChange}>
      <DialogContent className='sm:max-w-[425px]'>
        <DialogHeader>
          <DialogTitle>{selectedEvent?.resource.type}</DialogTitle>
        </DialogHeader>
        <div className='grid gap-4 py-4'>
          <div className='flex items-center gap-4'>
            <CalendarIcon className='h-4 w-4 opacity-70' />
            <span>{selectedEvent && moment(selectedEvent.start).format('MMMM D, YYYY')}</span>
          </div>
          <div className='flex items-center gap-4'>
            <Clock className='h-4 w-4 opacity-70' />
            <span>
              {selectedEvent &&
                `${moment(selectedEvent.start).format('HH:mm')} - ${moment(selectedEvent.end).format('HH:mm')}`}
            </span>
          </div>

          {selectedEvent?.resource.meetUrl && (
            <div className='flex items-center gap-4'>
              <MapPin className='h-4 w-4 opacity-70' />
              <a
                href={selectedEvent.resource.meetUrl}
                target='_blank'
                rel='noopener noreferrer'
                className='text-blue-500 hover:underline'
              >
                Join Meeting
              </a>
            </div>
          )}
          {selectedEvent?.resource.notes && (
            <div className='flex items-start gap-4'>
              <FileText className='h-4 w-4 opacity-70 mt-1' />
              <p className='text-sm'>{selectedEvent.resource.notes}</p>
            </div>
          )}
          {selectedEvent && (
            <div className='flex items-center gap-4'>
              <span
                className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusClass(selectedEvent.resource.status, t)}`}
                style={eventStyle}
              >
                {getStatusBookingText(selectedEvent.resource.status, t)}
              </span>
            </div>
          )}
        </div>
        <DialogFooter className='flex flex-col sm:flex-row gap-2'>
          {isWaitingForConfirmation && (
            <>
              <Button onClick={handleAcceptBooking} disabled={isUpdating} className='w-full sm:w-auto'>
                {isUpdating ? (
                  <>
                    <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                    Accepting...
                  </>
                ) : (
                  <>
                    <Check className='mr-2 h-4 w-4' />
                    Accept Booking
                  </>
                )}
              </Button>
              <Button
                onClick={handleDenyBooking}
                disabled={isUpdating}
                className='w-full sm:w-auto'
                variant='destructive'
              >
                {isUpdating ? (
                  <>
                    <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                    Denying...
                  </>
                ) : (
                  <>
                    <X className='mr-2 h-4 w-4' />
                    Deny Booking
                  </>
                )}
              </Button>
            </>
          )}
          {isConfirmed && (
            <Button onClick={handleCompleteBooking} disabled={isUpdating} className='w-full sm:w-auto'>
              {isUpdating ? (
                <>
                  <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                  Completing...
                </>
              ) : (
                <>
                  <Check className='mr-2 h-4 w-4' />
                  Mark as Completed
                </>
              )}
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
