import { TBooking } from '@/types/booking'
import { BookingTypeEnum } from '@/types/enum'
import { TServerResponse, TServerResponseWithPaging } from '@/types/request'
import { toMutationFetcher, toQueryFetcher } from '@/utils/query'
import { privateRequest } from '@/utils/request'

import {
  TAssignUserBookingParams,
  TFilterBookingsParams,
  TNoteResultBookingParams,
  TRequestCreateBookingParams,
  TUpdateStatusBookingParams
} from './type'

export const getAllBookingsApi = toQueryFetcher<void, TServerResponse<TBooking[]>>('getAllBookingsApi', async () => {
  return privateRequest(`/bookings/`, {
    method: 'GET'
  })
})

// API to filter bookings with multiple params
export const filterBookingsApi = toQueryFetcher<TFilterBookingsParams, TServerResponseWithPaging<TBooking[]>>(
  'filterBookingsApi',
  async (params) => {
    return privateRequest('/bookings/filter-booking', {
      method: 'GET',
      params: {
        ...params,
        type: params?.type || BookingTypeEnum.SERVICE
      }
    })
  }
)

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
export const updateBookingStatusApi = toMutationFetcher<TUpdateStatusBookingParams, TServerResponse<void>>(
  'updateBookingStatusApi',
  async (params) => {
    return privateRequest(`/bookings/update-status/${params.id}`, {
      method: 'PUT',
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
