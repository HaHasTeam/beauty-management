import { TBooking } from '@/types/booking'
import { TServerResponse } from '@/types/request'
import { toMutationFetcher, toQueryFetcher } from '@/utils/query'
import { privateRequest } from '@/utils/request'

import { TRequestCreateBookingParams } from './type'

export const getAllBookingsApi = toQueryFetcher<void, TServerResponse<TBooking[]>>('getAllBookingsApi', async () => {
  return privateRequest(`/bookings/`, {
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
