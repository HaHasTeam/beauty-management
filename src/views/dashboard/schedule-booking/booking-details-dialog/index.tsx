import { useMutation, useQueryClient } from '@tanstack/react-query'
import {
  AlertCircle,
  Building,
  CalendarIcon,
  Check,
  Clock,
  FileText,
  Loader2,
  MapPin,
  Star,
  User,
  X
} from 'lucide-react'
import moment from 'moment'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useShallow } from 'zustand/react/shallow'

import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { useToast } from '@/hooks/useToast'
import { getMyBookingsApi, saveInterviewNotesApi, updateBookingStatusApi } from '@/network/apis/booking/index'
import { useStore } from '@/stores/store'
import type { CalendarEvent } from '@/types/booking'
import { BookingStatusEnum, BookingTypeEnum } from '@/types/enum'

import { eventStyleGetter, getStatusBookingText, getStatusClass } from '../helper'

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
      queryClient.invalidateQueries({ queryKey: [getMyBookingsApi.queryKey] })
      onOpenChange(false)
    },
    onError: () => {
      errorToast({
        message: 'Failed to update booking status. Please try again.'
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
      queryClient.invalidateQueries({ queryKey: [getMyBookingsApi.queryKey] })
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
  const isInterview = selectedEvent?.resource.type === BookingTypeEnum.INTERVIEW

  const eventStyle = selectedEvent ? eventStyleGetter(selectedEvent, t).style : {}

  return (
    <Dialog open={!!selectedEvent} onOpenChange={onOpenChange}>
      <DialogContent
        className={`sm:max-w-[750px] md:max-w-[850px] p-0 overflow-hidden bg-white rounded-xl shadow-lg border-2 ${
          isCancelled ? 'border-red-200' : 'border-primary/20'
        }`}
      >
        <DialogHeader
          className={`px-6 pt-6 pb-4 ${isCancelled ? 'bg-red-50' : 'bg-gradient-to-r from-primary/5 to-primary/10'}`}
        >
          <DialogTitle className='text-xl font-bold flex items-center'>
            {selectedEvent?.resource.type === BookingTypeEnum.INTERVIEW ? (
              <span
                className={`${isCancelled ? 'bg-red-100 text-red-700' : 'bg-blue-50 text-blue-700'} px-3 py-1 rounded-full text-sm mr-2`}
              >
                Interview
              </span>
            ) : (
              <span
                className={`${isCancelled ? 'bg-red-100 text-red-700' : 'bg-green-50 text-green-700'} px-3 py-1 rounded-full text-sm mr-2`}
              >
                Service
              </span>
            )}
            {selectedEvent?.resource.type}
          </DialogTitle>
        </DialogHeader>

        <div className={`px-6 py-4 max-h-[70vh] overflow-y-auto custom-scrollbar ${isCancelled ? 'bg-gray-50' : ''}`}>
          {/* Cancellation Notice - Only shown for cancelled bookings */}
          {isCancelled && (
            <div className='mb-5 bg-red-50 border border-red-200 rounded-xl p-4 shadow-sm'>
              <div className='flex items-start'>
                <AlertCircle className='h-5 w-5 text-red-500 mr-3 mt-0.5 flex-shrink-0' />
                <div>
                  <h3 className='text-sm font-semibold text-red-700 mb-1'>{t('Booking Cancelled')}</h3>
                  <p className='text-xs text-red-600'>
                    {t('This booking has been cancelled and is no longer active. No further actions can be taken.')}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Booking Information Card */}
          <div
            className={`${
              isCancelled
                ? 'bg-gray-100 border-gray-200 opacity-90'
                : 'bg-gradient-to-r from-white to-primary/5 border-primary/20'
            } rounded-xl p-5 shadow-sm mb-5 border transition-all duration-200 hover:shadow`}
          >
            <div className='flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4'>
              <h3 className='text-sm font-semibold text-gray-700 flex items-center'>
                <CalendarIcon className={`h-4 w-4 mr-2 ${isCancelled ? 'text-gray-500' : 'text-primary'}`} />
                {t('Booking Details')}
              </h3>

              {/* Status Badge - Moved to Booking Details */}
              {selectedEvent && (
                <span
                  className={`px-4 py-2 rounded-full text-sm font-medium ${getStatusClass(
                    selectedEvent.resource.status,
                    t
                  )} shadow-sm transition-all duration-200 hover:shadow-md border border-primary/20 whitespace-nowrap`}
                  style={{ ...eventStyle, minWidth: '150px', textAlign: 'center' }}
                >
                  {getStatusBookingText(selectedEvent.resource.status, t)}
                </span>
              )}
            </div>

            <div className='space-y-4 pl-6'>
              <div className='flex items-center'>
                <div className='w-1/3 text-xs font-medium text-gray-500'>{t('Date')}:</div>
                <div className='w-2/3 flex items-center text-sm'>
                  <CalendarIcon className={`h-4 w-4 mr-2 ${isCancelled ? 'text-gray-400' : 'text-blue-500'}`} />
                  <span className={`font-medium ${isCancelled ? 'text-gray-500' : ''}`}>
                    {selectedEvent && moment(selectedEvent.start).format('MMMM D, YYYY')}
                  </span>
                </div>
              </div>

              <div className='flex items-center'>
                <div className='w-1/3 text-xs font-medium text-gray-500'>{t('Time')}:</div>
                <div className='w-2/3 flex items-center text-sm'>
                  <Clock className={`h-4 w-4 mr-2 ${isCancelled ? 'text-gray-400' : 'text-primary'}`} />
                  <span className={`font-medium ${isCancelled ? 'text-gray-500' : ''}`}>
                    {selectedEvent &&
                      `${moment(selectedEvent.start).format('HH:mm')} - ${moment(selectedEvent.end).format('HH:mm')}`}
                  </span>
                </div>
              </div>

              {selectedEvent?.resource.meetUrl && (
                <div className='flex items-center'>
                  <div className='w-1/3 text-xs font-medium text-gray-500'>{t('Meeting')}:</div>
                  <div className='w-2/3 flex items-center text-sm'>
                    <MapPin className={`h-4 w-4 mr-2 ${isCancelled ? 'text-gray-400' : 'text-primary'}`} />
                    {isCancelled ? (
                      <span className='text-gray-500'>{t('Meeting link unavailable')}</span>
                    ) : (
                      <a
                        href={selectedEvent.resource.meetUrl}
                        target='_blank'
                        rel='noopener noreferrer'
                        className='text-blue-600 hover:text-blue-800 hover:underline font-medium transition-colors duration-200'
                      >
                        {t('Join Meeting')}
                      </a>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Brand and Reviewer Information for INTERVIEW type - Now in 2 columns */}
          {isInterview && selectedEvent?.resource.brand && (
            <div className='grid grid-cols-1 md:grid-cols-2 gap-5 mb-5'>
              {/* Brand Information */}
              <div
                className={`bg-white rounded-xl p-5 shadow-sm border ${
                  isCancelled ? 'border-gray-200 opacity-90' : 'border-primary/30'
                } transition-all duration-200 hover:shadow h-full`}
              >
                <div className='flex items-center mb-4'>
                  <Building className={`h-5 w-5 mr-2 ${isCancelled ? 'text-gray-500' : 'text-primary'}`} />
                  <h4 className='text-sm font-semibold text-gray-800'>{t('Brand Information')}</h4>
                </div>

                {selectedEvent.resource.brand.logo && (
                  <div className='flex justify-center mb-4'>
                    <div
                      className={`p-2 bg-white rounded-lg shadow-sm border ${isCancelled ? 'border-gray-200' : 'border-gray-100'} w-24 h-24 flex items-center justify-center ${isCancelled ? 'opacity-70' : ''}`}
                    >
                      <img
                        src={selectedEvent.resource.brand.logo || '/placeholder.svg'}
                        alt={selectedEvent.resource.brand.name}
                        className='max-h-20 max-w-20 object-contain'
                      />
                    </div>
                  </div>
                )}

                <div className='space-y-3 pl-2'>
                  <div className='flex items-center'>
                    <div className='w-1/3 text-xs font-medium text-gray-500'>{t('Name')}:</div>
                    <div className={`w-2/3 text-sm font-semibold ${isCancelled ? 'text-gray-600' : 'text-gray-800'}`}>
                      {selectedEvent.resource.brand.name}
                    </div>
                  </div>

                  {selectedEvent.resource.brand.star > 0 && (
                    <div className='flex items-center'>
                      <div className='w-1/3 text-xs font-medium text-gray-500'>{t('Rating')}:</div>
                      <div className='w-2/3 flex items-center'>
                        <div className='flex items-center'>
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`h-4 w-4 ${
                                isCancelled
                                  ? selectedEvent.resource.brand && i < selectedEvent.resource.brand.star
                                    ? 'text-gray-400 fill-gray-400'
                                    : 'text-gray-300'
                                  : i < (selectedEvent.resource.brand?.star || 0)
                                    ? 'text-yellow-400 fill-yellow-400'
                                    : 'text-gray-300'
                              }`}
                            />
                          ))}
                        </div>
                        <span className={`ml-2 text-sm font-medium ${isCancelled ? 'text-gray-500' : ''}`}>
                          {selectedEvent.resource.brand.star.toFixed(1)}
                        </span>
                      </div>
                    </div>
                  )}

                  {selectedEvent.resource.brand.description && (
                    <div className='flex'>
                      <div className='w-1/3 text-xs font-medium text-gray-500'>{t('Description')}:</div>
                      <div className={`w-2/3 text-sm line-clamp-3 ${isCancelled ? 'text-gray-500' : 'text-gray-700'}`}>
                        {selectedEvent.resource.brand.description}
                      </div>
                    </div>
                  )}

                  <div className='flex items-center'>
                    <div className='w-1/3 text-xs font-medium text-gray-500'>{t('Email')}:</div>
                    <div className={`w-2/3 text-sm ${isCancelled ? 'text-gray-500' : 'text-blue-600'}`}>
                      {selectedEvent.resource.brand.email}
                    </div>
                  </div>

                  {selectedEvent.resource.brand.phone && (
                    <div className='flex items-center'>
                      <div className='w-1/3 text-xs font-medium text-gray-500'>{t('Phone')}:</div>
                      <div className={`w-2/3 text-sm ${isCancelled ? 'text-gray-500' : ''}`}>
                        {selectedEvent.resource.brand.phone}
                      </div>
                    </div>
                  )}

                  {selectedEvent.resource.brand.address && (
                    <div className='flex'>
                      <div className='w-1/3 text-xs font-medium text-gray-500'>{t('Address')}:</div>
                      <div className={`w-2/3 text-sm ${isCancelled ? 'text-gray-500' : 'text-gray-700'}`}>
                        {selectedEvent.resource.brand.address}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Reviewer Information */}
              {selectedEvent.resource.brand.reviewer ? (
                <div
                  className={`bg-white rounded-xl p-5 shadow-sm border ${
                    isCancelled ? 'border-gray-200 opacity-90' : 'border-primary/20'
                  } transition-all duration-200 hover:shadow h-full`}
                >
                  <div className='flex items-center mb-4'>
                    <User className={`h-5 w-5 mr-2 ${isCancelled ? 'text-gray-500' : 'text-primary'}`} />
                    <h4 className='text-sm font-semibold text-gray-800'>{t('Reviewer Information')}</h4>
                  </div>

                  <div className='space-y-3 pl-2'>
                    <div className='flex items-center'>
                      <div className='w-1/3 text-xs font-medium text-gray-500'>{t('Name')}:</div>
                      <div className={`w-2/3 text-sm font-semibold ${isCancelled ? 'text-gray-600' : 'text-gray-800'}`}>
                        {selectedEvent.resource.brand.reviewer.firstName}{' '}
                        {selectedEvent.resource.brand.reviewer.lastName}
                      </div>
                    </div>

                    {selectedEvent.resource.brand.reviewer.email && (
                      <div className='flex items-center'>
                        <div className='w-1/3 text-xs font-medium text-gray-500'>{t('Email')}:</div>
                        <div className={`w-2/3 text-sm ${isCancelled ? 'text-gray-500' : 'text-blue-600'}`}>
                          {selectedEvent.resource.brand.reviewer.email}
                        </div>
                      </div>
                    )}

                    {selectedEvent.resource.brand.reviewer.phone && (
                      <div className='flex items-center'>
                        <div className='w-1/3 text-xs font-medium text-gray-500'>{t('Phone')}:</div>
                        <div className={`w-2/3 text-sm ${isCancelled ? 'text-gray-500' : ''}`}>
                          {selectedEvent.resource.brand.reviewer.phone}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <div className='hidden md:block'></div> // Empty div to maintain grid layout when no reviewer
              )}
            </div>
          )}

          {/* Interview Notes Section when booking is confirmed */}
          {isConfirmed && (
            <div
              className={`bg-white rounded-xl p-5 shadow-sm border ${
                isCancelled ? 'border-gray-200 opacity-90' : 'border-primary/20'
              } mb-5 transition-all duration-200 hover:shadow`}
            >
              <div className='flex items-center justify-between mb-4'>
                <h3 className='text-sm font-semibold text-gray-800 flex items-center'>
                  <FileText className={`h-5 w-5 mr-2 ${isCancelled ? 'text-gray-500' : 'text-primary'}`} />
                  {t('Interview Notes')}
                </h3>
                {selectedEvent?.resource.notes && (
                  <span className='text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full'>
                    {t('Updated')}: {moment(selectedEvent.resource.updatedAt).format('MMM D, YYYY HH:mm')}
                  </span>
                )}
              </div>

              <div className='space-y-3'>
                <div>
                  <Label htmlFor='interview-summary' className='text-xs font-medium text-gray-700 mb-2 block'>
                    {t('Summary & Key Points')}
                  </Label>
                  <Textarea
                    id='interview-summary'
                    placeholder={t('Summarize the key points discussed in the interview...')}
                    value={interviewNotes}
                    onChange={(e) => setInterviewNotes(e.target.value)}
                    className={`min-h-[150px] border-gray-200 focus:border-primary/50 focus:ring focus:ring-primary/20 focus:ring-opacity-50 rounded-lg resize-none transition-all duration-200 ${
                      isCancelled ? 'bg-gray-100 text-gray-500' : ''
                    }`}
                    readOnly={!hasOperationalAccess || isCancelled}
                  />
                </div>

                {/* Only show Save Notes button if user is admin or operator and booking is not cancelled */}
                {hasOperationalAccess && !isCancelled && (
                  <div className='flex justify-center mt-4'>
                    <Button
                      onClick={handleSaveNotes}
                      disabled={isSavingNotes || !interviewNotes.trim()}
                      size='default'
                      className='w-full max-w-xs bg-gradient-to-r from-primary/80 to-primary hover:from-primary hover:to-primary/90 text-white shadow-md transition-all duration-300 hover:shadow-lg rounded-lg'
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

        <DialogFooter
          className={`flex flex-col sm:flex-row gap-2 p-4 ${
            isCancelled
              ? 'bg-red-50 border-t border-red-100'
              : 'bg-gradient-to-r from-primary/5 to-primary/10 border-t border-primary/20'
          }`}
        >
          {/* Show cancellation reason for cancelled bookings */}
          {isCancelled && (
            <div className='w-full text-center text-sm text-red-600 mb-2'>
              {t('This booking has been cancelled and cannot be modified.')}
            </div>
          )}

          {/* Only show action buttons if booking is not cancelled */}
          {isWaitingForConfirmation && !isCancelled && (
            <>
              <Button
                onClick={handleAcceptBooking}
                disabled={isUpdating}
                className='w-full sm:w-auto bg-gradient-to-r from-primary/80 to-primary hover:from-primary hover:to-primary/90 text-white shadow-md transition-all duration-300 hover:shadow-lg rounded-lg'
              >
                {isUpdating ? (
                  <>
                    <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                    {t('Accepting...')}
                  </>
                ) : (
                  <>
                    <Check className='mr-2 h-4 w-4' />
                    {t('Accept Booking')}
                  </>
                )}
              </Button>
              <Button
                onClick={handleDenyBooking}
                disabled={isUpdating}
                className='w-full sm:w-auto bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white shadow-md transition-all duration-300 hover:shadow-lg rounded-lg'
                variant='destructive'
              >
                {isUpdating ? (
                  <>
                    <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                    {t('Denying...')}
                  </>
                ) : (
                  <>
                    <X className='mr-2 h-4 w-4' />
                    {t('Deny Booking')}
                  </>
                )}
              </Button>
            </>
          )}

          {/* Only show Mark as Completed button if user is admin or operator and booking is confirmed and not cancelled */}
          {isConfirmed && hasOperationalAccess && !isCancelled && (
            <Button
              onClick={handleCompleteBooking}
              disabled={isUpdating}
              className='w-full sm:w-auto bg-gradient-to-r from-primary/80 to-primary hover:from-primary hover:to-primary/90 text-white shadow-md transition-all duration-300 hover:shadow-lg rounded-lg'
            >
              {isUpdating ? (
                <>
                  <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                  {t('Completing...')}
                </>
              ) : (
                <>
                  <Check className='mr-2 h-4 w-4' />
                  {t('Mark as Completed')}
                </>
              )}
            </Button>
          )}

          {/* Close button for cancelled bookings */}
          {isCancelled && (
            <Button
              onClick={() => onOpenChange(false)}
              className='w-full sm:w-auto bg-gray-500 hover:bg-gray-600 text-white shadow-md transition-all duration-300 hover:shadow-lg rounded-lg'
            >
              {t('Close')}
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
