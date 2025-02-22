import { TServerResponse } from '@/types/request'
import { ICreateSystemService, IResponseSystemService, ISystemService } from '@/types/system-service'
import { toMutationFetcher, toQueryFetcher } from '@/utils/query'
import { privateRequest } from '@/utils/request'

import { UpdateSystemServiceParams } from './type'

export const getAllSystemServiceApi = toQueryFetcher<void, TServerResponse<IResponseSystemService[]>>(
  'getAllSystemServiceApi',
  async () => {
    return privateRequest('/system-services')
  }
)

export const getSystemServiceByIdApi = toQueryFetcher<string, TServerResponse<IResponseSystemService>>(
  'getSystemServiceByIdApi',
  async (params) => {
    return privateRequest(`/products/system-services/${params}`)
  }
)

export const createSystemServiceApi = toMutationFetcher<ICreateSystemService, TServerResponse<ICreateSystemService>>(
  'createSystemServiceApi',
  async (data) => {
    return privateRequest('/system-services', {
      method: 'POST',
      data
    })
  }
)

export const updateSystemServiceApi = toMutationFetcher<UpdateSystemServiceParams, TServerResponse<ISystemService>>(
  'updateSystemServiceApi',
  async ({ params, data }: UpdateSystemServiceParams) => {
    return privateRequest(`/system-services/${params}`, {
      method: 'PUT',
      data
    })
  }
)
