import { TServerResponse } from '@/types/request'
import { toMutationFetcher } from '@/utils/query'
import { privateRequest } from '@/utils/request'

export const deleteResultSheetByIdApi = toMutationFetcher<{ params: string }, TServerResponse<string>>(
  'deleteResultSheetByIdApi',
  async ({ params }) => {
    return privateRequest(`/result-sheet-sections/${params}`, {
      method: 'DELETE'
    })
  }
)
