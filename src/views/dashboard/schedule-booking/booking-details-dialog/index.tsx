'use client'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { CalendarIcon, Check, Clock, FileText, Loader2, MapPin, Plus, X } from 'lucide-react'
import moment from 'moment'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useShallow } from 'zustand/react/shallow'

import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { Textarea } from '@/components/ui/textarea'
import { useToast } from '@/hooks/useToast'
import {
  assignUserToBookingApi,
  getAllBookingsApi,
  saveInterviewNotesApi,
  updateBookingStatusApi
} from '@/network/apis/booking/index'
import { useStore } from '@/stores/store'
import type { CalendarEvent } from '@/types/booking'
import { BookingStatusEnum } from '@/types/enum'

import { eventStyleGetter, getStatusBookingText, getStatusClass } from '../helper'
import { UserSelect } from './user-select'

interface BookingDetailsDialogProps {
  selectedEvent: CalendarEvent | null
  onOpenChange: (open: boolean) => void
}

export function BookingDetailsDialog({ selectedEvent, onOpenChange }: BookingDetailsDialogProps) {
  const queryClient = useQueryClient()
  const { successToast, errorToast } = useToast()
  const { user } = useStore(
    useShallow((state) => ({
      user: state.user
    }))
  )
  const { t } = useTranslation()
  const [showUserSelect, setShowUserSelect] = useState(false)
  // Add state for interview notes
  const [interviewNotes, setInterviewNotes] = useState(selectedEvent?.resource.notes || '')

  // Check user roles
  const isAdmin = user?.role === 'admin'
  const isOperator = user?.role === 'operator'
  const hasOperationalAccess = isAdmin || isOperator

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

  // Assign user mutation
  const { mutate: assignUser, isPending: isAssigning } = useMutation({
    mutationKey: [assignUserToBookingApi.mutationKey],
    mutationFn: assignUserToBookingApi.fn,
    onSuccess: () => {
      successToast({
        message: 'User has been successfully assigned to the booking.'
      })
      setShowUserSelect(false)

      queryClient.invalidateQueries({ queryKey: [getAllBookingsApi.queryKey] })
    },
    onError: (error) => {
      errorToast({
        message: error instanceof Error ? error.message : 'Failed to assign user to booking. Please try again.'
      })
    }
  })

  // Add mutation for saving interview notes
  const { mutate: saveInterviewNotes, isPending: isSavingNotes } = useMutation({
    mutationKey: [saveInterviewNotesApi.mutationKey],
    mutationFn: saveInterviewNotesApi.fn,
    onSuccess: () => {
      successToast({
        message: 'Interview notes have been successfully saved.'
      })
      queryClient.invalidateQueries({ queryKey: [getAllBookingsApi.queryKey] })
    },
    onError: (error) => {
      errorToast({
        message: error.message ?? 'Failed to save interview notes. Please try again.'
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

  const handleUserSelect = (userId: string) => {
    assignUser({
      id: selectedEvent?.id.toString() ?? '',
      assigneeId: userId
    })
  }

  // Add handler for saving notes
  const handleSaveNotes = () => {
    if (selectedEvent) {
      saveInterviewNotes({
        id: selectedEvent.id.toString(),
        resultNote: interviewNotes
      })
    }
  }

  const isWaitingForConfirmation = selectedEvent?.resource.status === BookingStatusEnum.WAIT_FOR_CONFIRMATION
  const isConfirmed = selectedEvent?.resource.status === BookingStatusEnum.BOOKING_CONFIRMED
  const isCancelled = selectedEvent?.resource.status === BookingStatusEnum.CANCELLED

  const eventStyle = selectedEvent ? eventStyleGetter(selectedEvent, t).style : {}

  return (
    <Dialog open={!!selectedEvent} onOpenChange={onOpenChange}>
      <DialogContent className='sm:max-w-[500px]'>
        <DialogHeader>
          <DialogTitle>{selectedEvent?.resource.type}</DialogTitle>
        </DialogHeader>
        <div className='grid gap-4 py-4'>
          {/* Booking Information Section with Labels */}
          <div className='space-y-3'>
            <div className='grid grid-cols-3 gap-2 items-center'>
              <Label className='text-xs text-muted-foreground'>{t('Date')}:</Label>
              <div className='col-span-2 flex items-center'>
                <CalendarIcon className='h-4 w-4 opacity-70 mr-2' />
                <span>{selectedEvent && moment(selectedEvent.start).format('MMMM D, YYYY')}</span>
              </div>
            </div>

            <div className='grid grid-cols-3 gap-2 items-center'>
              <Label className='text-xs text-muted-foreground'>{t('Time')}:</Label>
              <div className='col-span-2 flex items-center'>
                <Clock className='h-4 w-4 opacity-70 mr-2' />
                <span>
                  {selectedEvent &&
                    `${moment(selectedEvent.start).format('HH:mm')} - ${moment(selectedEvent.end).format('HH:mm')}`}
                </span>
              </div>
            </div>

            {selectedEvent?.resource.meetUrl && (
              <div className='grid grid-cols-3 gap-2 items-center'>
                <Label className='text-xs text-muted-foreground'>{t('Meeting Link')}:</Label>
                <div className='col-span-2 flex items-center'>
                  <MapPin className='h-4 w-4 opacity-70 mr-2' />
                  <a
                    href={selectedEvent.resource.meetUrl}
                    target='_blank'
                    rel='noopener noreferrer'
                    className='text-blue-500 hover:underline'
                  >
                    {t('Join Meeting')}
                  </a>
                </div>
              </div>
            )}

            <div className='grid grid-cols-3 gap-2 items-center'>
              <Label className='text-xs text-muted-foreground'>{t('Status')}:</Label>
              <div className='col-span-2'>
                {selectedEvent && (
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusClass(selectedEvent.resource.status, t)}`}
                    style={eventStyle}
                  >
                    {getStatusBookingText(selectedEvent.resource.status, t)}
                  </span>
                )}
              </div>
            </div>
          </div>

          <Separator className='my-2' />

          {/* Participants Section */}
          <div>
            <div className='flex items-center justify-between mb-2'>
              <h3 className='text-sm font-medium'>{t('Interview Participants')}</h3>
              {/* Only show Assign User button if user is admin and booking is not cancelled */}
              {isAdmin && !isCancelled && (
                <Button
                  variant='outline'
                  size='sm'
                  onClick={() => setShowUserSelect(!showUserSelect)}
                  disabled={isAssigning}
                >
                  {showUserSelect ? <X className='h-4 w-4 mr-1' /> : <Plus className='h-4 w-4 mr-1' />}
                  {showUserSelect ? t('Cancel') : t('Assign User')}
                </Button>
              )}
            </div>

            {showUserSelect && (
              <div className='mb-4'>
                <UserSelect onSelect={handleUserSelect} disabled={isAssigning} />
                {isAssigning && (
                  <div className='flex items-center justify-center mt-2'>
                    <Loader2 className='h-4 w-4 animate-spin mr-2' />
                    <span className='text-xs'>{t('Assigning user...')}</span>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Interview Notes Section when booking is confirmed */}
          {isConfirmed && (
            <div className='space-y-4 bg-gray-50 p-4 rounded-lg border'>
              <div className='flex items-center justify-between'>
                <h3 className='text-sm font-medium flex items-center'>
                  <FileText className='h-4 w-4 mr-2' />
                  {t('Interview Notes')}
                </h3>
                {selectedEvent?.resource.notes && (
                  <span className='text-xs text-muted-foreground'>
                    {t('Last updated')}: {moment(selectedEvent.resource.updatedAt).format('MMM D, YYYY HH:mm')}
                  </span>
                )}
              </div>

              <div className='space-y-3'>
                <div>
                  <Label htmlFor='interview-summary' className='text-xs font-medium'>
                    {t('Summary & Key Points')}
                  </Label>
                  <Textarea
                    id='interview-summary'
                    placeholder={t('Summarize the key points discussed in the interview...')}
                    value={interviewNotes}
                    onChange={(e) => setInterviewNotes(e.target.value)}
                    className='min-h-[150px] mt-1'
                    readOnly={!hasOperationalAccess}
                  />
                </div>

                {/* Only show Save Notes button if user is admin or operator */}
                {hasOperationalAccess && (
                  <div className='flex justify-center mt-4'>
                    <Button
                      onClick={handleSaveNotes}
                      disabled={isSavingNotes || !interviewNotes.trim()}
                      size='default'
                      className='w-full max-w-xs bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white shadow-md transition-all duration-200 hover:shadow-lg'
                    >
                      {isSavingNotes ? (
                        <>
                          <Loader2 className='mr-2 h-5 w-5 animate-spin' />
                          {t('Saving Notes...')}
                        </>
                      ) : (
                        <>
                          <Check className='mr-2 h-5 w-5' />
                          {t('Save Interview Notes')}
                        </>
                      )}
                    </Button>
                  </div>
                )}
              </div>
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
          {/* Only show Mark as Completed button if user is admin or operator */}
          {isConfirmed && hasOperationalAccess && (
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
