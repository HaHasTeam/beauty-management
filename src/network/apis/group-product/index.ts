import { TGroupProduct } from '@/types/group-product'
import { TServerResponse, TServerResponseWithPaging } from '@/types/request'
import { toMutationFetcher, toQueryFetcher } from '@/utils/query'
import { privateRequest } from '@/utils/request'

import {
  GetGroupProductFilterRequestParams,
  TCreateGroupProductRequestParams,
  TUpdateGroupProductRequestParams
} from './type'

export const getAllGroupProductsListApi = toQueryFetcher<void, TServerResponse<TGroupProduct[]>>(
  'getAllGroupProductsApi',
  async () => {
    return privateRequest('/group-products')
  }
)

export const createGroupProductApi = toMutationFetcher<
  TCreateGroupProductRequestParams,
  TServerResponse<TGroupProduct>
>('createGroupProductApi', async (params) => {
  return privateRequest('/group-products/create', {
    method: 'POST',
    data: params
  })
})

export const getGroupProductByIdApi = toQueryFetcher<string, TServerResponse<TGroupProduct>>(
  'getGroupProductByIdApi',
  async (id) => {
    return privateRequest(`/group-products/get-by-id/${id}`)
  }
)

export const updateGroupProductApi = toMutationFetcher<
  TUpdateGroupProductRequestParams,
  TServerResponse<TGroupProduct>
>('updateGroupProductApi', async (params) => {
  return privateRequest(`/group-products/update/${params.id}`, {
    method: 'PUT',
    data: params
  })
})

export const toggleGroupProductStatusApi = toMutationFetcher<string, TServerResponse<TGroupProduct>>(
  'toggleGroupProductStatusApi',
  async (id) => {
    return privateRequest(`/group-products/toggle-status/${id}`, {
      method: 'POST'
    })
  }
)

export const getGroupProductFilterApi = toQueryFetcher<
  GetGroupProductFilterRequestParams,
  TServerResponseWithPaging<TGroupProduct[]>
>('getGroupProductFilterApi', async (params) => {
  return privateRequest('/group-products/filter', {
    params
  })
})
