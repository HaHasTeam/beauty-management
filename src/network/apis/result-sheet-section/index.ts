import { TServerResponse } from '@/types/request'
import { toQueryFetcher } from '@/utils/query'
import { privateRequest } from '@/utils/request'

export const deleteResultSheetByIdApi = toQueryFetcher<string, TServerResponse<string>>(
  'deleteResultSheetByIdApi',
  async (params) => {
    return privateRequest(`/result-sheet-sections/${params}`, {
      method: 'DELETE'
    })
  }
)
