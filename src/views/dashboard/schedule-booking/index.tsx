import 'react-big-calendar/lib/css/react-big-calendar.css'

import { useQuery } from '@tanstack/react-query'
import { CalendarIcon, Clock, CreditCard, FileText, MapPin } from 'lucide-react'
import moment from 'moment'
import { useCallback, useState } from 'react'
import { Calendar, momentLocalizer } from 'react-big-calendar'

import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { getAllBookingsApi } from '@/network/apis/booking'
import { CalendarEvent, TBooking } from '@/types/booking'

import { eventStyleGetter, getStatusBookingText, getStatusClass } from './helper'

const localizer = momentLocalizer(moment)

function ScheduleBooking() {
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null)

  const { data: events } = useQuery({
    queryKey: [getAllBookingsApi.queryKey],
    queryFn: getAllBookingsApi.fn,
    select(data) {
      return data.data.map(
        (booking: TBooking): CalendarEvent => ({
          id: booking.id,
          title: booking.type,
          start: new Date(booking.startTime),
          end: new Date(booking.endTime),
          resource: booking // Store the original booking data here
        })
      )
    }
  })

  const EventComponent = ({ event }: { event: CalendarEvent }) => (
    <div className='p-2 overflow-hidden'>
      <div className='font-semibold text-sm mb-1 truncate'>{event.resource.type}</div>
      <div className='flex items-center text-xs mb-1'>
        <Clock className='w-3 h-3 mr-1' />
        <span>
          {moment(event.start).format('HH:mm')} - {moment(event.end).format('HH:mm')}
        </span>
      </div>

      <div className='mt-1'>
        <span
          className={`inline-block px-2 py-1 rounded-full text-[10px] font-medium ${getStatusClass(event.resource.status)}`}
        >
          {getStatusBookingText(event.resource.status)}
        </span>
      </div>
    </div>
  )
  const handleSelectEvent = useCallback((event: CalendarEvent) => {
    setSelectedEvent(event)
  }, [])
  return (
    <div className='h-screen p-6 bg-background text-foreground'>
      <div className='bg-card text-card-foreground rounded-lg shadow-lg p-6'>
        <Calendar
          localizer={localizer}
          events={events}
          style={{ height: 'calc(100vh - 200px)' }}
          eventPropGetter={eventStyleGetter}
          onSelectEvent={handleSelectEvent}
          components={{
            event: EventComponent
          }}
          className='rounded-[var(--radius)] '
        />
      </div>

      <Dialog open={!!selectedEvent} onOpenChange={() => setSelectedEvent(null)}>
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
            <div className='flex items-center gap-4'>
              <CreditCard className='h-4 w-4 opacity-70' />
              <span>{selectedEvent?.resource.paymentMethod}</span>
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
            <div className='flex items-center gap-4'>
              <span
                className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusClass(selectedEvent?.resource.status || '')}`}
              >
                {getStatusBookingText(selectedEvent?.resource.status || '')}
              </span>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default ScheduleBooking
