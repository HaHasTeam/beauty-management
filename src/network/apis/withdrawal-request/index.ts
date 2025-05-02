import { TServerResponse, TServerResponseWithPaging } from '@/types/request'
import { TWithdrawalRequest, WithdrawalStatusEnum } from '@/types/withdrawal-request'
import { toMutationFetcher, toQueryFetcher } from '@/utils/query'
import { privateRequest } from '@/utils/request'

import { TCreateWithdrawalRequestParams, TFilterWithdrawalRequestsParams, TUpdateWithdrawalRequestParams } from './type'

/**
 * Create a new withdrawal request
 */
export const createWithdrawalRequest = toMutationFetcher<
  TCreateWithdrawalRequestParams,
  TServerResponse<TWithdrawalRequest>
>('createWithdrawalRequest', async (data) => {
  return privateRequest('/withdrawal-requests', {
    method: 'POST',
    data
  })
})

/**
 * Get current user's withdrawal requests
 */
export const getMyWithdrawalRequests = toQueryFetcher<
  { page?: number; limit?: number },
  TServerResponseWithPaging<TWithdrawalRequest[]>
>('getMyWithdrawalRequests', async (params) => {
  return privateRequest('/withdrawal-requests/get-my-withdrawal-requests', {
    method: 'GET',
    params
  })
})

/**
 * Get a single withdrawal request by ID
 */
export const getWithdrawalRequestById = toQueryFetcher<string, TServerResponse<TWithdrawalRequest>>(
  'getWithdrawalRequestById',
  async (id) => {
    return privateRequest(`/withdrawal-requests/${id}`)
  }
)

/**
 * Filter withdrawal requests with pagination
 */
export const filterWithdrawalRequests = toQueryFetcher<
  TFilterWithdrawalRequestsParams,
  TServerResponseWithPaging<TWithdrawalRequest[]>
>('filterWithdrawalRequests', async (params) => {
  const { page, limit, order, sortBy, ...filterParams } = params || {}
  const data: TFilterWithdrawalRequestsParams = {}
  if (filterParams.statuses?.length) {
    data.statuses = filterParams.statuses
  }
  if (filterParams.startDate) {
    data.startDate = filterParams.startDate
  }
  if (filterParams.endDate) {
    data.endDate = filterParams.endDate
  }
  if (filterParams.relatedAccountId) {
    data.relatedAccountId = filterParams.relatedAccountId
  }
  return privateRequest('/withdrawal-requests/filter', {
    method: 'POST',
    data,
    params: {
      page,
      limit,
      order,
      sortBy
    }
  })
})

/**
 * Update a withdrawal request (approve, reject, etc.)
 */
export const updateWithdrawalRequest = toMutationFetcher<
  { id: string; data: TUpdateWithdrawalRequestParams },
  TServerResponse<TWithdrawalRequest>
>('updateWithdrawalRequest', async ({ id, data }) => {
  return privateRequest(`/withdrawal-requests/update/${id}`, {
    method: 'POST',
    data
  })
})

/**
 * Approve a withdrawal request (shorthand for updateWithdrawalRequest)
 */
export const approveWithdrawalRequest = toMutationFetcher<{ id: string }, TServerResponse<TWithdrawalRequest>>(
  'approveWithdrawalRequest',
  async ({ id }) => {
    return updateWithdrawalRequest.fn({
      id,
      data: {
        status: WithdrawalStatusEnum.APPROVED
      }
    })
  }
)

/**
 * Complete a withdrawal request (shorthand for updateWithdrawalRequest)
 */
export const completeWithdrawalRequest = toMutationFetcher<
  {
    id: string
    transactionId?: string
    evidences?: string[]
  },
  TServerResponse<TWithdrawalRequest>
>('completeWithdrawalRequest', async ({ id, transactionId, evidences }) => {
  const data: TUpdateWithdrawalRequestParams = {
    status: WithdrawalStatusEnum.COMPLETED
  }

  if (transactionId) {
    data.transactionId = transactionId
  }

  if (evidences) {
    data.evidences = evidences
  }

  return updateWithdrawalRequest.fn({
    id,
    data
  })
})

/**
 * Reject a withdrawal request (shorthand for updateWithdrawalRequest)
 */
export const rejectWithdrawalRequest = toMutationFetcher<
  { id: string; rejectedReason: string },
  TServerResponse<TWithdrawalRequest>
>('rejectWithdrawalRequest', async ({ id, rejectedReason }) => {
  return updateWithdrawalRequest.fn({
    id,
    data: {
      status: WithdrawalStatusEnum.REJECTED,
      rejectedReason
    }
  })
})
