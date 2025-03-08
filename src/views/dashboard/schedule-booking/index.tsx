'use client'

import 'react-big-calendar/lib/css/react-big-calendar.css'

import { useQuery } from '@tanstack/react-query'
import { Clock } from 'lucide-react'
import moment from 'moment'
import { useCallback, useState } from 'react'
import { Calendar, momentLocalizer } from 'react-big-calendar'
import { useTranslation } from 'react-i18next'

import { getAllBookingsApi } from '@/network/apis/booking'
import type { CalendarEvent, TBooking } from '@/types/booking'

import { BookingDetailsDialog } from './booking-details-dialog'
import { eventStyleGetter, getStatusBookingText, getStatusClass } from './helper'

const localizer = momentLocalizer(moment)

function ScheduleBooking() {
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null)
  const { t } = useTranslation()

  const { data: eventsdata } = useQuery({
    queryKey: [getAllBookingsApi.queryKey],
    queryFn: getAllBookingsApi.fn,
    select: (data) => {
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
  const EventComponent = useCallback(
    ({ event }: { event: CalendarEvent }) => (
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
            className={`inline-block px-2 py-1 rounded-full text-[10px] font-medium ${getStatusClass(event.resource.status, t)}`}
          >
            {getStatusBookingText(event.resource.status, t)}
          </span>
        </div>
      </div>
    ),
    [t]
  )

  const handleSelectEvent = useCallback((event: CalendarEvent) => {
    setSelectedEvent(event)
  }, [])

  const handleDialogOpenChange = useCallback((open: boolean) => {
    if (!open) setSelectedEvent(null)
  }, [])

  const memoizedEventStyleGetter = useCallback((event: CalendarEvent) => eventStyleGetter(event, t), [t])

  return (
    <div className='h-screen p-6 bg-background text-foreground'>
      <div className='bg-card text-card-foreground rounded-lg shadow-lg p-6'>
        <Calendar
          localizer={localizer}
          events={eventsdata}
          style={{ height: 'calc(100vh - 200px)' }}
          eventPropGetter={memoizedEventStyleGetter}
          onSelectEvent={handleSelectEvent}
          components={{
            event: EventComponent
          }}
          className='rounded-[var(--radius)]'
        />
      </div>
      <BookingDetailsDialog selectedEvent={selectedEvent} onOpenChange={handleDialogOpenChange} />
    </div>
  )
}

export default ScheduleBooking
