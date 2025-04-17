import { z } from 'zod'

import { BookingFormAnswerSchema, ConsultationResultSchema } from '@/schemas/booking.schema'
import { IBooking, TBooking } from '@/types/booking'
import { TServerResponse } from '@/types/request'
import { IStatusTracking } from '@/types/statusTracking'
import { toMutationFetcher, toQueryFetcher } from '@/utils/query'
import { privateRequest } from '@/utils/request'

import { TAssignUserBookingParams, TNoteResultBookingParams, TRequestCreateBookingParams } from './type'

export const getAllBookingsApi = toQueryFetcher<void, TServerResponse<TBooking[]>>('getAllBookingsApi', async () => {
  return privateRequest(`/bookings/`, {
    method: 'GET'
  })
})
export const getMyBookingsApi = toQueryFetcher<void, TServerResponse<TBooking[]>>('getMyBookingsApi', async () => {
  return privateRequest(`/bookings/get-my-bookings/`, {
    method: 'GET'
  })
})
export const getMyBookingByIdBrandApi = toQueryFetcher<string, TServerResponse<TBooking>>(
  'getMyBookingByIdBrandApi',
  async (params) => {
    return privateRequest(`/bookings/get-booking-of-brand/${params}`, {
      method: 'GET'
    })
  }
)
export const getStatusBookingsApi = toQueryFetcher<void, TServerResponse<void>>('getStatusBookingsApi', async () => {
  return privateRequest(`/bookings/get-status-booking-interview`, {
    method: 'GET'
  })
})

export const getBookingDetailsApi = toQueryFetcher<void, TServerResponse<void>>('getBookingDetailsApi', async () => {
  return privateRequest(`/bookings/get-`, {
    method: 'GET'
  })
})
export const createBookingApi = toMutationFetcher<TRequestCreateBookingParams, TServerResponse<TBooking>>(
  'createBooking',
  async (params) => {
    return privateRequest('/bookings/', {
      method: 'POST',
      data: params
    })
  }
)

export const assignUserToBookingApi = toMutationFetcher<TAssignUserBookingParams, TServerResponse<void>>(
  'assignUserToBookingApi',
  async (params) => {
    return privateRequest(`/bookings/assign-for-interview/${params.id}`, {
      method: 'POST',
      data: params
    })
  }
)
export const saveInterviewNotesApi = toMutationFetcher<TNoteResultBookingParams, TServerResponse<void>>(
  'saveInterviewNotesApi',
  async (params) => {
    return privateRequest(`/bookings/note-result/${params.id}`, {
      method: 'POST',
      data: params
    })
  }
)

// Get booking details by ID
export const getBookingByIdApi = toQueryFetcher<string, TServerResponse<IBooking>>(
  'getBookingById',
  async (bookingId) => {
    return privateRequest(`/bookings/get-by-id/${bookingId}`)
  }
)

// Get booking status tracking
export const getBookingStatusTrackingApi = toQueryFetcher<string, TServerResponse<IStatusTracking[]>>(
  'getBookingStatusTracking',
  async (bookingId) => {
    return await privateRequest(`/bookings/status-tracking/${bookingId}`)
  }
)

// Update booking status
interface UpdateBookingStatusParams {
  id: string
  status: string
  bookingFormAnswer?: z.infer<typeof BookingFormAnswerSchema>
  consultationResult?: z.infer<typeof ConsultationResultSchema>
  mediaFiles?: string[]
  resultNote?: string
}

export const updateBookingStatusApi = toMutationFetcher<UpdateBookingStatusParams, TServerResponse<IBooking>>(
  'updateBookingStatus',
  async ({ id, status, bookingFormAnswer, consultationResult, mediaFiles, resultNote }) => {
    return privateRequest(`/bookings/update-booking-status/${id}`, {
      method: 'PUT',
      data: {
        status,
        bookingFormAnswer: bookingFormAnswer ? bookingFormAnswer : undefined,
        consultationResult: consultationResult ? consultationResult : undefined,
        mediaFiles: mediaFiles ? mediaFiles : undefined,
        resultNote: resultNote ? resultNote : undefined
      }
    })
  }
)

// Cancel booking
interface CancelBookingParams {
  bookingId: string
  reason: string
}

export const cancelBookingApi = toMutationFetcher<CancelBookingParams, TServerResponse<IBooking>>(
  'cancelBooking',
  async ({ bookingId, reason }) => {
    return privateRequest(`/bookings/cancelled-booking/${bookingId}`, {
      method: 'PUT',
      data: {
        reason
      }
    })
  }
)
