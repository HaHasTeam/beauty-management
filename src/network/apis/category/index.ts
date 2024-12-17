import { ICategory } from '@/types/category'
import { TServerResponse } from '@/types/request'
import { toMutationFetcher, toQueryFetcher } from '@/utils/query'
import { privateRequest } from '@/utils/request'

import { AddCategoryRequestParams, GetCategoryByIdRequestParams, UpdateCategoryByIdRequestParams } from './type'

export const getAllCategoryApi = toQueryFetcher<void, TServerResponse<ICategory[]>>('getAllCategoryApi', async () => {
  return privateRequest('/category')
})

export const addCategoryApi = toMutationFetcher<AddCategoryRequestParams, TServerResponse<ICategory>>(
  'addCategoryApi',
  async (data) => {
    return privateRequest('/category', {
      method: 'POST',
      data
    })
  }
)

export const getCategoryByIdApi = toQueryFetcher<GetCategoryByIdRequestParams, TServerResponse<ICategory[]>>(
  'getCategoryByIdApi',
  async (params) => {
    return privateRequest(`/category/get-by-id/${params?.categoryId}`)
  }
)

export const updateCategoryByIdApi = toMutationFetcher<UpdateCategoryByIdRequestParams, TServerResponse<ICategory>>(
  'updateCategoryByIdApi',
  async (data) => {
    return privateRequest(`/category/${data.id}`, {
      method: 'PUT',
      data
    })
  }
)
