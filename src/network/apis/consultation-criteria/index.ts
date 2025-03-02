import { IResponseConsultationCriteriaData } from '@/types/consultation-criteria'
import { TServerResponse } from '@/types/request'
import { toMutationFetcher, toQueryFetcher } from '@/utils/query'
import { privateRequest } from '@/utils/request'

import { UpdateConsultationCriteriaParams } from './type'

export const getAllConsultationCriteriaApi = toQueryFetcher<void, TServerResponse<IResponseConsultationCriteriaData[]>>(
  'getAllConsultationCriteriaApi',
  async () => {
    return privateRequest('/consultation-criteria')
  }
)
export const getConsultationCriteriaByIdApi = toQueryFetcher<
  string,
  TServerResponse<IResponseConsultationCriteriaData>
>('getConsultationCriteriaByIdApi', async (params) => {
  return privateRequest(`/consultation-criteria/get-by-id/${params}`)
})

export const updateConsultationCriteriaApi = toMutationFetcher<
  UpdateConsultationCriteriaParams,
  TServerResponse<string>
>('updateConsultationCriteriaApi', async ({ params, data }: UpdateConsultationCriteriaParams) => {
  return privateRequest(`/consultation-criteria/${params}`, {
    method: 'PUT',
    data
  })
})
