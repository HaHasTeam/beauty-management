import { TServerResponse } from '@/types/request'
import { IResponseResultSheetData } from '@/types/result-sheet'
import { toMutationFetcher, toQueryFetcher } from '@/utils/query'
import { privateRequest } from '@/utils/request'

import { UpdateResultSheetParams } from './type'

export const getAllResultSheetApi = toQueryFetcher<void, TServerResponse<IResponseResultSheetData[]>>(
  'getAllResultSheetApi',
  async () => {
    return privateRequest('/result-sheets')
  }
)
export const getResultSheetByIdApi = toQueryFetcher<string, TServerResponse<IResponseResultSheetData>>(
  'getResultSheetByIdApi',
  async (params) => {
    return privateRequest(`/result-sheets/get-by-id/${params}`)
  }
)

export const updateResultSheetApi = toMutationFetcher<UpdateResultSheetParams, TServerResponse<string>>(
  'updateResultSheetApi',
  async ({ params, data }: UpdateResultSheetParams) => {
    return privateRequest(`/result-sheets/${params}`, {
      method: 'PUT',
      data
    })
  }
)
