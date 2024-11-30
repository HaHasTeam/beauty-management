import { TAuth } from '@/types/auth'
import { ICreateProduct, IProduct } from '@/types/product'
import { TServerResponse } from '@/types/request'
import { TUser } from '@/types/user'
import { toMutationFetcher, toQueryFetcher } from '@/utils/query'
import { privateRequest } from '@/utils/request'

export const getAllProductApi = toQueryFetcher<void, TServerResponse<IProduct[]>>('getAllProductApi', async () => {
  return privateRequest('/products')
})
export const getProductApi = toQueryFetcher<void, TServerResponse<IProduct>>('getProductApi', async (id) => {
  return privateRequest('/products/get-by-id/' + id)
})

export const createProductApi = toMutationFetcher<ICreateProduct, TServerResponse<TAuth>>(
  'createProductApi',
  async (data) => {
    return privateRequest('/products', {
      method: 'POST',
      data
    })
  }
)

export const updateProductApi = toMutationFetcher<IProduct, TServerResponse<TUser>>(
  'updateProductApi',
  async (id, data) => {
    return privateRequest('/products/get-by-id/' + id, {
      method: 'PUT',
      data
    })
  }
)
