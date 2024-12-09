import { TPreOrder } from '@/types/pre-order'
import { TServerResponse } from '@/types/request'
import { toMutationFetcher, toQueryFetcher } from '@/utils/query'
import { privateRequest } from '@/utils/request'

import { TAddPreOderRequestParams, TGetPreOrderByIdRequestParams, TUpdatePreOrderRequestParams } from './type'

export const addPreOderApi = toMutationFetcher<TAddPreOderRequestParams, TServerResponse<TPreOrder>>(
  'addPreOderApi',
  async (params) => {
    return privateRequest('/pre-order-product', {
      method: 'POST',
      data: params
    })
  }
)

export const getPreOrderByIdApi = toQueryFetcher<TGetPreOrderByIdRequestParams, TServerResponse<TPreOrder>>(
  'getPreOrderByIdApi',
  async (params) => {
    return privateRequest(`/pre-order-product/get-pre-order-product-of-brand/${params?.id}`, {
      method: 'GET'
    })
  }
)

export const getAllPreOrderListApi = toQueryFetcher<void, TServerResponse<TPreOrder[]>>(
  'getPreOrderListApi',
  async () => {
    return privateRequest('/pre-order-product', {
      method: 'GET'
    })
  }
)

export const updatePreOrderApi = toMutationFetcher<TUpdatePreOrderRequestParams, TServerResponse<TPreOrder>>(
  'updatePreOrderApi',
  async (params) => {
    return privateRequest(`/pre-order-product/${params.id}`, {
      method: 'PUT',
      data: params
    })
  }
)
