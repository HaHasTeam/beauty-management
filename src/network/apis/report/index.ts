import _ from 'lodash'

import { IReport } from '@/types/report'
import { TServerResponse, TServerResponseWithPaging } from '@/types/request'
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

export const filterReports = toQueryFetcher<TGetFilteredReportRequestParams, TServerResponseWithPaging<IReport[]>>(
  'filterReports',
  async (params) => {
    const { page, limit, order, sortBy, ...rest } = params ?? {}
    const cleanedData = _.omitBy(rest, (value) => {
      if (value === undefined || value === null) return true
      if (typeof value === 'string' && value === '') return true
      if (typeof value === 'boolean' && value === false) return true
      if (Array.isArray(value) && value.length === 0) return true
      return false
    })
    return privateRequest('/reports/filter', {
      method: 'POST',
      data: cleanedData,
      params: {
        page,
        limit,
        order,
        sortBy
      }
    })
  }
)
