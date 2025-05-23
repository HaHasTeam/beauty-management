import { TServerResponse } from '@/types/request'
import { toMutationFetcher } from '@/utils/query'
import { privateRequest } from '@/utils/request'

import { IUpdateProductClassificationQuantity } from './type'

export const updateProductClassificationsQuantityApi = toMutationFetcher<
  IUpdateProductClassificationQuantity[],
  TServerResponse<string>
>('updateProductClassificationsQuantityApi', async (data) => {
  return privateRequest(`/product-classification/update-classifications-quantity`, {
    method: 'POST',
    data: { data }
  })
})
