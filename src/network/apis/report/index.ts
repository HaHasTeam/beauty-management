import { IReport } from '@/types/report'
import { TServerResponse } from '@/types/request'
import { toMutationFetcher, toQueryFetcher } from '@/utils/query'
import { privateRequest } from '@/utils/request'

import {
  TAssignReportRequestParams,
  TCreateReportRequestParams,
  TGetFilteredReportRequestParams,
  TUpdateReportNoteRequestParams,
  TUpdateReportStatusRequestParams
} from './type'

export const getFilteredReports = toQueryFetcher<TGetFilteredReportRequestParams, TServerResponse<IReport[]>>(
  'getFilteredReports',
  async (query) => {
    return privateRequest('/reports/filter-reports', {
      method: 'POST',
      data: query
    })
  }
)

export const createReport = toMutationFetcher<TCreateReportRequestParams, TServerResponse<IReport>>(
  'createReport',
  async (params) => {
    return privateRequest('/reports/create', {
      method: 'POST',
      data: params
    })
  }
)

export const assignReport = toMutationFetcher<TAssignReportRequestParams, TServerResponse<IReport>>(
  'assignReport',
  async (params) => {
    return privateRequest('/reports/assign/' + params.id, {
      method: 'POST',
      data: {
        assigneeId: params.assigneeId
      }
    })
  }
)

export const updateReportStatus = toMutationFetcher<TUpdateReportStatusRequestParams, TServerResponse<IReport>>(
  'updateReportStatus',
  async (params) => {
    return privateRequest('/reports/update-status/' + params.id, {
      method: 'POST',
      data: {
        status: params.status
      }
    })
  }
)

export const updateReportNote = toMutationFetcher<TUpdateReportNoteRequestParams, TServerResponse<IReport>>(
  'updateReportNote',
  async (params) => {
    return privateRequest('/reports/note-result/' + params.id, {
      method: 'POST',
      data: {
        resultNote: params.resultNote
      }
    })
  }
)
