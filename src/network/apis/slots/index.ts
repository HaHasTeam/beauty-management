import { TServerResponse } from '@/types/request'
import { TBulkSlotCreate, TSlot, TSlotResponse } from '@/types/slot'
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
  const response = (await privateRequest(`/bookings/get-available-slots-for-interview`, {
    method: 'POST',
    data: data
  })) as TServerResponse<TSlot[]>

  return response
})

export const createSlotApi = toMutationFetcher<TSlot, TServerResponse<TSlot>>('createSlot', async (data) => {
  return privateRequest(`/slots/`, {
    method: 'POST',
    data
  })
})

export const bulkCreateSlotsApi = toMutationFetcher<TBulkSlotCreate, TServerResponse<TSlotResponse>>(
  'bulkCreateSlots',
  async (data) => {
    return privateRequest(`/slots/bulk-create`, {
      method: 'POST',
      data
    })
  }
)

export const updateSlotApi = toMutationFetcher<TSlot & { id: string }, TServerResponse<TSlot>>(
  'updateSlot',
  async (data) => {
    const { id, ...rest } = data
    return privateRequest(`/slots/${id}`, {
      method: 'PUT',
      data: rest
    })
  }
)

export const deleteSlotApi = toMutationFetcher<{ id: string }, TServerResponse<void>>('deleteSlot', async (data) => {
  return privateRequest(`/slots/${data.id}`, {
    method: 'DELETE'
  })
})

/**
 * Get all available working slots from the API
 * @returns A list of available working time slots
 */
export const getAllWorkingSlotsApi = toQueryFetcher<void, TServerResponse<TSlot[]>>('getAllWorkingSlots', async () => {
  return privateRequest(`/slots/`, {
    method: 'GET'
  })
})

/**
 * Update the active working slots with the provided slot IDs
 * @param slotIds Array of slot IDs to be set as active
 * @returns Server response
 */
export const updateActiveSlotsApi = toMutationFetcher<{ slotIds: string[] }, TServerResponse<void>>(
  'updateActiveSlots',
  async (data) => {
    return privateRequest(`/slots/active-slots`, {
      method: 'POST',
      data
    })
  }
)

/**
 * Update the user's working slots with the provided slot IDs
 * @param slotIds Array of slot IDs to be set as the user's working slots
 * @returns Server response
 */
export const updateWorkingSlotsApi = toMutationFetcher<{ slotIds: string[] }, TServerResponse<void>>(
  'updateWorkingSlots',
  async (data) => {
    return privateRequest(`/slots/update-working-slots`, {
      method: 'POST',
      data
    })
  }
)

/**
 * Get all working slots assigned to a specific consultant
 * @param consultantId ID of the consultant
 * @returns List of working time slots assigned to the consultant
 */
export const getWorkingSlotsOfConsultantApi = toQueryFetcher<string, TServerResponse<TSlot[]>>(
  'getWorkingSlotsOfConsultant',
  async (consultantId) => {
    return privateRequest(`/slots/get-working-slots-of-consultant/${consultantId}`, {
      method: 'GET'
    })
  }
)
