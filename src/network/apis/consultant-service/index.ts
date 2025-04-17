import { IConsultantService } from '@/types/consultant-service'
import { TServerResponse, TServerResponseWithPaging } from '@/types/request'
import { toMutationFetcher, toQueryFetcher } from '@/utils/query'
import { privateRequest } from '@/utils/request'

import {
  AddConsultantServiceRequestParams,
  GetConsultantServiceByIdRequestParams,
  GetConsultantServiceFilterRequestParams,
  UpdateConsultantServiceByIdRequestParams
} from './type'

export const getAllConsultantServiceApi = toQueryFetcher<void, TServerResponse<IConsultantService[]>>(
  'getAllConsultantServiceApi',
  async () => {
    return privateRequest('/consultant-services')
  }
)

export const addConsultantServiceApi = toMutationFetcher<
  AddConsultantServiceRequestParams,
  TServerResponse<IConsultantService>
>('addConsultantServiceApi', async (data) => {
  return privateRequest('/consultant-services', {
    method: 'POST',
    data
  })
})

export const getConsultantServiceByIdApi = toQueryFetcher<
  GetConsultantServiceByIdRequestParams,
  TServerResponse<IConsultantService>
>('getConsultantServiceByIdApi', async (params) => {
  return privateRequest(`/consultant-services/get-by-id/${params?.consultantServiceId}`)
})

export const updateConsultantServiceByIdApi = toMutationFetcher<
  UpdateConsultantServiceByIdRequestParams,
  TServerResponse<IConsultantService>
>('updateConsultantServiceByIdApi', async (data) => {
  return privateRequest(`/consultant-services/${data.id}`, {
    method: 'PUT',
    data
  })
})

export const getConsultantServiceFilterApi = toQueryFetcher<
  GetConsultantServiceFilterRequestParams,
  TServerResponseWithPaging<IConsultantService[]>
>('getConsultantServiceFilterApi', async (params) => {
  return privateRequest(`/consultant-services/filter-consultant-services`, {
    method: 'GET',
    params: params
  })
})
