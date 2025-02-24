import { TServerResponse } from '@/types/request'
import { IResponseResultSheetData } from '@/types/result-sheet'
import { toQueryFetcher } from '@/utils/query'
import { privateRequest } from '@/utils/request'

export const getAllResultSheetApi = toQueryFetcher<void, TServerResponse<IResponseResultSheetData[]>>(
  'getAllResultSheetApi',
  async () => {
    return privateRequest('/result-sheets')
  }
)
