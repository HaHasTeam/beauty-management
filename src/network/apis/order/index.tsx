import {
  ICancelAndReturnRequest,
  ICancelOrder,
  ICancelRequestOrder,
  ICreateOrder,
  ICreatePreOrder,
  IOrder,
  IOrderFilter,
  IOrderFilterFilter,
  IOrderItem,
  IRejectReturnRequestOrder,
  IReturnRequestOrder
} from '@/types/order'
import { TServerResponse, TServerResponseWithPagination, TServerResponseWithPaging } from '@/types/request'
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

export const getAllChildOrderListApi = toQueryFetcher<void, TServerResponse<IOrder[]>>(
  'getAllChildOrderListApi',
  async () => {
    return privateRequest('/orders/get-children', {
      method: 'GET'
    })
  }
)

export const filterOrdersParentApi = toQueryFetcher<IOrderFilterFilter, TServerResponseWithPagination<IOrder[]>>(
  'filterOrdersParentApi',
  async (filterData) => {
    const { page, limit, sortBy, order, ...rest } = filterData || {}

    const body: IOrderFilterFilter = {}
    if (rest.search) {
      body.search = rest.search
    }

    return privateRequest('/orders/filter-parent', {
      method: 'POST',
      data: body,
      params: {
        page,
        limit,
        sortBy,
        order
      }
    })
  }
)

export const getParentOrderByIdApi = toQueryFetcher<string, TServerResponse<IOrder>>(
  'getParentOrderByIdApi',
  async (orderId) => {
    return privateRequest(`/orders/get-parent-by-id/${orderId}`)
  }
)

export const getOnlyChildOrderListApi = toQueryFetcher<void, TServerResponse<IOrder[]>>(
  'getOnlyChildOrderListApi',
  async () => {
    const parentOrder = (await getAllOrderListApi.raw()).data
    const childOrders: IOrder[] = []

    const recursivePush = async (order: IOrder) => {
      const childrenLength = order?.children?.length
      if (!childrenLength) {
        childOrders.push(order)
        return
      } else {
        const children = order.children
        for (let i = 0; i < (childrenLength ?? 0); i++) {
          const child = children?.[i]
          if (child) {
            recursivePush(child)
          }
        }
      }
    }

    for (let i = 0; i < parentOrder.length; i++) {
      await recursivePush(parentOrder[i])
    }
    return { data: childOrders, message: 'Success' }
  }
)

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
export const takeReceivedActionApi = toMutationFetcher<{ id: string; action: string }, TServerResponse<IOrder>>(
  'takeReceivedActionApi',
  async ({ id, action }) => {
    return privateRequest(`/orders/take-received-action/${id}`, {
      method: 'POST',
      data: { action: action }
    })
  }
)

export const cancelOrderApi = toMutationFetcher<ICancelOrder, TServerResponse<IOrder>>(
  'cancelOrderApi',
  async ({ orderId, reason }) => {
    return privateRequest(`/orders/customer-cancel-order/${orderId}`, {
      method: 'POST',
      data: { reason }
    })
  }
)
export const brandCancelOrderApi = toMutationFetcher<ICancelOrder, TServerResponse<IOrder>>(
  'brandCancelOrderApi',
  async ({ orderId, reason }) => {
    return privateRequest(`/orders/brand-cancel-order/${orderId}`, {
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
export const complaintReturnOrderApi = toMutationFetcher<
  { orderId: string; reason: string; mediaFiles?: string[] },
  TServerResponse<IOrder>
>('complaintReturnOrderApi', async ({ orderId, reason, mediaFiles }) => {
  return privateRequest(`/orders/request-complaint/${orderId}`, {
    method: 'POST',
    data: { reason, mediaFiles }
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
export const makeDecisionOnComplaintRequestApi = toMutationFetcher<
  { requestId: string; status: string; reasonRejected: string },
  TServerResponse<IOrder>
>('makeDecisionOnComplaintRequestApi', async ({ requestId, status, reasonRejected }) => {
  return privateRequest(`/orders/make-decision-on-complaint-request/${requestId}`, {
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

export const filterOrdersApi = toQueryFetcher<IOrderFilter, TServerResponseWithPaging<IOrder[]>>(
  'filterOrdersApi',
  async (filterData) => {
    const { page, limit, sortBy, order, ...rest } = filterData || {}

    const body: IOrderFilter = {}
    if (rest.search) {
      body.search = rest.search
    }
    if (rest.statuses?.length) {
      body.statuses = rest.statuses
    }
    if (rest.types?.length) {
      body.types = rest.types
    }
    if (rest.paymentMethods?.length) {
      body.paymentMethods = rest.paymentMethods
    }
    if (rest.productIds?.length) {
      body.productIds = rest.productIds
    }
    if (rest.type && rest.eventId) {
      body.type = rest.type
      body.eventId = rest.eventId
    }

    return privateRequest('/orders/filter', {
      method: 'POST',
      data: body,
      params: {
        page,
        limit,
        sortBy,
        order
      }
    })
  }
)

export const filterParentOrdersApi = toQueryFetcher<IOrderFilter, TServerResponseWithPaging<IOrder[]>>(
  'filterParentOrdersApi',
  async (filterData) => {
    const { page, limit, sortBy, order, ...rest } = filterData || {}

    const body: IOrderFilter = {}
    if (rest.search) {
      body.search = rest.search
    }
    if (rest.statuses?.length) {
      body.statuses = rest.statuses
    }
    if (rest.types?.length) {
      body.types = rest.types
    }
    if (rest.paymentMethods?.length) {
      body.paymentMethods = rest.paymentMethods
    }
    if (rest.productIds?.length) {
      body.productIds = rest.productIds
    }

    return privateRequest('/orders/filter-parent', {
      method: 'POST',
      data: body,
      params: {
        page,
        limit,
        sortBy,
        order
      }
    })
  }
)
