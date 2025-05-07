import { IMasterConfig } from '@/types/master-config'
import { TServerResponse } from '@/types/request'
import { toMutationFetcher, toQueryFetcher } from '@/utils/query'
import { privateRequest, publicRequest } from '@/utils/request'

export const getMasterConfigApi = toQueryFetcher<string, TServerResponse<IMasterConfig[]>>(
  'getMasterConfigApi',
  async () => {
    return publicRequest(`/master-config/`, {
      method: 'GET'
    })
  }
)
type UpdateMasterConfigParams = { id: string; data: IMasterConfig }
export const updateMasterConfigApi = toMutationFetcher<UpdateMasterConfigParams, TServerResponse<void>>(
  'updateMasterConfigApi',
  async ({ id, data }: UpdateMasterConfigParams) => {
    return privateRequest(`/master-config/${id}`, {
      method: 'PUT',
      data
    })
  }
)
