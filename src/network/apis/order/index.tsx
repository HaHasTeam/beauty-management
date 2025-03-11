import {
  ICancelAndReturnRequest,
  ICancelOrder,
  ICancelRequestOrder,
  ICreateOrder,
  ICreatePreOrder,
  IOrder,
  IOrderFilter,
  IOrderItem,
  IRejectReturnRequestOrder,
  IReturnRequestOrder
} from '@/types/order'
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
export const updateOrderStatusApi = toMutationFetcher<
  { id: string; status: string; mediaFiles?: string[] },
  TServerResponse<IOrder>
>('updateOrderStatusApi', async ({ id, status, mediaFiles }) => {
  return privateRequest(`/orders/update-status/${id}`, {
    method: 'PUT',
    data: { status: status, mediaFiles: mediaFiles }
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
export const makeDecisionOnCancelRequestOrderApi = toMutationFetcher<
  { requestId: string; status: string; reasonRejected: string },
  TServerResponse<IOrder>
>('makeDecisionOnCancelRequestOrderApi', async ({ requestId, status, reasonRejected }) => {
  return privateRequest(`/orders/make-decision-on-request/${requestId}`, {
    method: 'POST',
    data: { status, reasonRejected }
  })
})

export const makeDecisionOnReturnRequestOrderApi = toMutationFetcher<
  { requestId: string; status: string; reasonRejected: string; mediaFiles?: string[] },
  TServerResponse<IOrder>
>('makeDecisionOnReturnRequestOrderApi', async ({ requestId, status, reasonRejected, mediaFiles }) => {
  return privateRequest(`/orders/make-decision-on-refund-request/${requestId}`, {
    method: 'POST',
    data: { status, reasonRejected, mediaFiles }
  })
})

export const makeDecisionOnRejectReturnRequestOrderApi = toMutationFetcher<
  { requestId: string; status: string; reasonRejected: string },
  TServerResponse<IOrder>
>('makeDecisionOnRejectReturnRequestOrderApi', async ({ requestId, status, reasonRejected }) => {
  return privateRequest(`/orders/make-decision-on-reject-refund-request/${requestId}`, {
    method: 'POST',
    data: { status, reasonRejected }
  })
})

export const getStatusTrackingByIdApi = toQueryFetcher<string, TServerResponse<IStatusTracking[]>>(
  'getStatusTrackingByIdApi',
  async (orderId) => {
    return privateRequest(`/orders/get-status-tracking/${orderId}`)
  }
)

export const getBrandCancelRequestApi = toMutationFetcher<
  { brandId: string; data: { status?: string } },
  TServerResponse<ICancelRequestOrder[]>
>('getBrandCancelRequestApi', async ({ brandId, data }) => {
  return privateRequest(`/orders/get-cancel-request-of-brand/${brandId}`, {
    method: 'POST',
    data
  })
})
export const getCancelAndReturnRequestApi = toQueryFetcher<string, TServerResponse<ICancelAndReturnRequest>>(
  'getCancelAndReturnRequestApi',
  async (orderId) => {
    return privateRequest(`/orders/get-requests-of-order/${orderId}`, {
      method: 'GET'
    })
  }
)

export const getRejectReturnRequestApi = toQueryFetcher<string, TServerResponse<IRejectReturnRequestOrder>>(
  'getRejectReturnRequestApi',
  async (orderId) => {
    return privateRequest(`/orders/get-reject-request-refund/${orderId}`, {
      method: 'GET'
    })
  }
)

export const getBrandReturnRequestApi = toMutationFetcher<
  { brandId: string; data: { status?: string } },
  TServerResponse<IReturnRequestOrder[]>
>('getBrandReturnRequestApi', async ({ brandId, data }) => {
  return privateRequest(`/orders/get-return-request-of-brand/${brandId}`, {
    method: 'POST',
    data
  })
})
