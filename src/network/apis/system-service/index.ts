import _ from 'lodash'

import { BaseParams, TServerResponse, TServerResponseWithPaging } from '@/types/request'
import { ICreateSystemService, IResponseSystemService, ISystemService } from '@/types/system-service'
import { toMutationFetcher, toQueryFetcher } from '@/utils/query'
import { privateRequest } from '@/utils/request'

import { UpdateSystemServiceParams } from './type'

// Define the parameter type for filtering
export type TFilterSystemServicesParams = BaseParams<{
  statuses?: string
}>

export const getAllSystemServiceApi = toQueryFetcher<void, TServerResponse<IResponseSystemService[]>>(
  'getAllSystemServiceApi',
  async () => {
    return privateRequest('/system-services')
  }
)

export const getSystemServiceByIdApi = toQueryFetcher<string, TServerResponse<IResponseSystemService>>(
  'getSystemServiceByIdApi',
  async (params) => {
    return privateRequest(`/system-services/get-by-id/${params}`)
  }
)

// New API function for filtering system services
export const filterSystemServicesApi = toQueryFetcher<
  TFilterSystemServicesParams, // Input parameters type
  TServerResponseWithPaging<IResponseSystemService[]> // Expected paginated response type
>(
  'filterSystemServicesApi', // Unique query key
  async (params) => {
    const cleanedParams = _.omitBy(params, (value) => !value || (Array.isArray(value) && value.length === 0))
    return privateRequest('/system-services/filter-system-services', {
      method: 'GET',
      params: cleanedParams // Pass the filter parameters as query params
    })
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

export const updateSystemServiceStatusApi = toMutationFetcher<{ id: string; status: string }, TServerResponse<string>>(
  'updateSystemServiceStatusApi',
  async ({ id, status }) => {
    return privateRequest(`/system-services/update-status/${id}`, {
      method: 'PUT',
      data: { status: status }
    })
  }
)
