import { TBooking } from '@/types/booking'
import { TServerResponse } from '@/types/request'
import { toMutationFetcher, toQueryFetcher } from '@/utils/query'
import { privateRequest } from '@/utils/request'

import { TRequestCreateBookingParams, TUpdateStatusBookingParams } from './type'

export const getAllBookingsApi = toQueryFetcher<void, TServerResponse<TBooking[]>>('getAllBookingsApi', async () => {
  return privateRequest(`/bookings/`, {
    method: 'GET'
  })
})

export const getStatusBookingsApi = toQueryFetcher<void, TServerResponse<void>>('getStatusBookingsApi', async () => {
  return privateRequest(`/bookings/get-status-booking-interview`, {
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
