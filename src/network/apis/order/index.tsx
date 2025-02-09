import { ICancelOrder, ICreateOrder, ICreatePreOrder, IOrder, IOrderFilter, IOrderItem } from '@/types/order'
import { TServerResponse } from '@/types/request'
import { IStatusTracking } from '@/types/status-tracking'
import { toMutationFetcher, toQueryFetcher } from '@/utils/query'
import { privateRequest } from '@/utils/request'

export const createOderApi = toMutationFetcher<ICreateOrder, TServerResponse<IOrder>>('createOderApi', async (data) => {
  return privateRequest('/orders/create-normal', {
    method: 'POST',
    data
  })
})

export const createPreOderApi = toMutationFetcher<ICreatePreOrder, TServerResponse<IOrder>>(
  'createPreOderApi',
  async (data) => {
    return privateRequest('/orders/create-pre-order', {
      method: 'POST',
      data
    })
  }
)
export const getMyOrdersApi = toMutationFetcher<IOrderFilter, TServerResponse<IOrderItem[]>>(
  'getMyOrdersApi',
  async (data) => {
    return privateRequest('/orders/get-my-orders/', {
      method: 'POST',
      data
    })
  }
)

export const getOrderByIdApi = toQueryFetcher<string, TServerResponse<IOrderItem>>(
  'getOrderByIdApi',
  async (orderId) => {
    return privateRequest(`/orders/get-by-id/${orderId}`)
  }
)

export const getAllOrderListApi = toQueryFetcher<void, TServerResponse<IOrder[]>>('getAllOrderListApi', async () => {
  return privateRequest('/orders', {
    method: 'GET'
  })
})

export const updateOrderApi = toMutationFetcher<IOrder, TServerResponse<IOrder>>('updateOrderApi', async (data) => {
  return privateRequest(`/orders/${data.id}`, {
    method: 'PUT',
    data
  })
})

export const cancelOrderApi = toMutationFetcher<ICancelOrder, TServerResponse<IOrder>>(
  'cancelOrderApi',
  async ({ orderId, reason }) => {
    return privateRequest(`/orders/customer-cancel-order/${orderId}`, {
      method: 'POST',
      data: { reason }
    })
  }
)

export const getStatusTrackingByIdApi = toQueryFetcher<string, TServerResponse<IStatusTracking[]>>(
  'getStatusTrackingByIdApi',
  async (orderId) => {
    return privateRequest(`/orders/get-status-tracking/${orderId}`)
  }
)
