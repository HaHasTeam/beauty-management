import { TServerResponse } from '@/types/request'
import { TSlot } from '@/types/slot'
import { toQueryFetcher } from '@/utils/query'
import { privateRequest } from '@/utils/request'

export const getAllSlotsApi = toQueryFetcher<void, TServerResponse<TSlot[]>>('getAllSlots', async () => {
  return privateRequest(`/slots/`, {
    method: 'GET'
  })
})
