import { TServerResponse } from '@/types/request'
import { TSlot } from '@/types/slot'
import { toMutationFetcher, toQueryFetcher } from '@/utils/query'
import { privateRequest } from '@/utils/request'

export const getAllSlotsApi = toQueryFetcher<void, TServerResponse<TSlot[]>>('getAllSlots', async () => {
  return privateRequest(`/slots/`, {
    method: 'GET'
  })
})
export const getAvailableSlotsApi = toMutationFetcher<
  {
    startDate: string
    endDate: string
  },
  TServerResponse<TSlot[]>
>('getAvailableSlotsApi', async (data) => {
  return privateRequest(`/bookings/get-available-slots-for-interview`, {
    method: 'POST',
    data: data
  })
})
