import { TPreOrder } from '@/types/pre-order'
import { TServerResponse } from '@/types/request'
import { toMutationFetcher, toQueryFetcher } from '@/utils/query'
import { privateRequest } from '@/utils/request'

import { TAddPreOderRequestParams, TUpdatePreOrderRequestParams } from './type'

export const addPreOderApi = toMutationFetcher<TAddPreOderRequestParams, TServerResponse<TPreOrder>>(
  'addPreOderApi',
  async (params) => {
    return privateRequest('/pre-order-product', {
      method: 'POST',
      data: params
    })
  }
)

export const getPreOrderByIdApi = toQueryFetcher<string, TServerResponse<TPreOrder>>(
  'getPreOrderByIdApi',
  async (id) => {
    return privateRequest(`/pre-order-product/get-by-id/${id}`, {
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
