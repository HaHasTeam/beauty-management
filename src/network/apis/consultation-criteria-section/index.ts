import { TServerResponse } from '@/types/request'
import { toMutationFetcher } from '@/utils/query'
import { privateRequest } from '@/utils/request'

export const deleteConsultationCriteriaByIdApi = toMutationFetcher<{ params: string }, TServerResponse<string>>(
  'deleteConsultationCriteriaByIdApi',
  async ({ params }) => {
    return privateRequest(`/consultation-criteria-sections/${params}`, {
      method: 'DELETE'
    })
  }
)
