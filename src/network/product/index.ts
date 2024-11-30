import { ICreateProduct, IProduct } from '@/types/product'
import { TServerError, TServerResponse } from '@/types/request'
import { toMutationFetcher, toQueryFetcher } from '@/utils/query'
import { privateRequest } from '@/utils/request'

export const getAllProductApi = toQueryFetcher<void, TServerResponse<IProduct[]>>('getAllProductApi', async () => {
  return privateRequest('/products')
})
export const getProductApi = toQueryFetcher<string, TServerResponse<ICreateProduct>>(
  'getProductApi',
  async (productId) => {
    return privateRequest(`/products/get-by-id/${productId}`)
  }
)

export const createProductApi = toMutationFetcher<ICreateProduct, TServerResponse<ICreateProduct>>(
  'createProductApi',
  async (data) => {
    return privateRequest('/products', {
      method: 'POST',
      data
    })
  }
)

export const updateProductApi = toMutationFetcher<ICreateProduct, TServerResponse<ICreateProduct>>(
  'updateProductApi',
  async (productId, data) => {
    return privateRequest(`/products/get-by-id/${productId}`, {
      method: 'PUT',
      data
    })
  }
)
