import { OrderRequestTypeEnum, RequestStatusEnum } from '@/types/enum'
import { TOrderRequest } from '@/types/order-request'
import { BaseParams, TServerResponseWithPaging } from '@/types/request'
import { toQueryFetcher } from '@/utils/query'
import { privateRequest } from '@/utils/request'

// Define the filter schema type
export type OrderRequestFilterParams = BaseParams<{
  statuses: RequestStatusEnum[]
  types: OrderRequestTypeEnum[]
}>

// Define the API endpoints
export const filterOrderRequests = toQueryFetcher<OrderRequestFilterParams, TServerResponseWithPaging<TOrderRequest[]>>(
  'filterOrderRequests',
  async (params) => {
    const { statuses, types, page, limit, sortBy, order } = params || {}
    const body: OrderRequestFilterParams = {}
    if (statuses?.length) {
      body.statuses = statuses
    }
    if (types?.length) {
      body.types = types
    }
    return privateRequest('/orders/filter-requests', {
      method: 'POST',
      data: body,
      params: { page, limit, sortBy, order }
    })
  }
)
