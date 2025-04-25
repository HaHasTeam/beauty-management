import _ from 'lodash'

import { TServerResponse, TServerResponseWithPaging } from '@/types/request'
import { ITransaction, TTransaction } from '@/types/transaction'
import { toMutationFetcher, toQueryFetcher } from '@/utils/query'
import { privateRequest } from '@/utils/request'

import {
  BookingStatic,
  OrderStatic,
  PAY_TYPE,
  TFilterTransactionsParams,
  TGetBrandRevenueStatisticsParams,
  TGetBrandRevenueStatisticsResponse,
  TGetDailyBookingStatisticsParams,
  TGetDailyOrderStatisticsParams
} from './type'

/**
 * Get a transaction by ID
 */
export const getTransactionById = toQueryFetcher<string, TServerResponse<ITransaction>>(
  'getTransactionById',
  async (id) => {
    return privateRequest(`/transactions/${id}`)
  }
)

export const payTransactionApi = toMutationFetcher<
  { orderId: string; id: string; type: PAY_TYPE },
  TServerResponse<ITransaction>
>('payTransactionApi', async (params) => {
  return privateRequest(`/transactions/pay`, {
    method: 'POST',
    data: params
  })
})

/**
 * Filter transactions with pagination
 */
export const filterTransactions = toQueryFetcher<TFilterTransactionsParams, TServerResponseWithPaging<TTransaction[]>>(
  'filterTransactions',
  async (params) => {
    const { page, limit, order, sortBy, ...filterParams } = params || {}
    const dataPre: TFilterTransactionsParams = {}
    if (filterParams.startDate) {
      dataPre.startDate = filterParams.startDate
    }
    if (filterParams.endDate) {
      dataPre.endDate = filterParams.endDate
    }
    if (filterParams.types?.length) {
      dataPre.types = filterParams.types
    }
    return privateRequest('/transactions/filter', {
      method: 'POST',
      data: dataPre,
      params: {
        page,
        limit,
        order,
        sortBy
      }
    })
  }
)

/**
 * Get transactions statistics (for dashboard or reports)
 */
export const getTransactionStatistics = toQueryFetcher<
  { startDate: string; endDate: string },
  TServerResponse<{ totalAmount: number; count: number }>
>('getTransactionStatistics', async (params) => {
  return privateRequest('/transactions/statistics', {
    method: 'POST',
    data: params
  })
})

/**
 * Get daily order statistics for a brand
 */
export const getDailyOrderStatistics = toQueryFetcher<TGetDailyOrderStatisticsParams, TServerResponse<OrderStatic>>(
  'getDailyOrderStatistics',
  async (params) => {
    if (!params) throw new Error('Params is required')

    // Remove falsy values and empty arrays
    const cleanedData = _.omitBy(params, (value) => {
      if (value === undefined || value === null) return true
      if (typeof value === 'string' && value === '') return true
      if (typeof value === 'boolean' && value === false) return true
      if (Array.isArray(value) && value.length === 0) return true
      return false
    })

    return privateRequest(`/transactions/get-daily-order-statistics`, {
      method: 'POST',
      data: cleanedData
    })
  }
)

/**
 * Get financial summary
 */
export const getFinancialSummary = toQueryFetcher<
  void,
  TServerResponse<{
    totalRevenue: number
    totalExpense: number
    netIncome: number
  }>
>('getFinancialSummary', async () => {
  return privateRequest('/transactions/get-financial-summary', {
    method: 'GET'
  })
})

export const getBrandRevenueStatistics = toQueryFetcher<
  TGetBrandRevenueStatisticsParams,
  TServerResponse<TGetBrandRevenueStatisticsResponse>
>('getBrandRevenueStatistics', async (params) => {
  if (!params) throw new Error('Params is required')
  const { ...rest } = params
  // Remove falsy values and empty arrays
  const cleanedData = _.omitBy(rest, (value) => {
    if (value === undefined || value === null) return true
    if (typeof value === 'string' && value === '') return true
    if (typeof value === 'boolean' && value === false) return true
    if (Array.isArray(value) && value.length === 0) return true
    return false
  })

  return privateRequest(`/transactions/order-statistics`, {
    method: 'POST',
    data: cleanedData
  })
})

/**
 * Get all transactions (assuming GET request)
 */
export const getAllTransactions = toQueryFetcher<
  void, // Assuming no specific parameters needed
  TServerResponse<TTransaction[]> // Assuming a paginated response like filterTransactions
>(
  'getAllTransactions', // Unique query key
  async () => {
    return privateRequest('/transactions', {
      method: 'GET' // Assuming GET method
    })
  }
)

/**
 * Get daily booking statistics
 */
export const getDailyBookingStatistics = toQueryFetcher<
  TGetDailyBookingStatisticsParams, // Input parameter type
  TServerResponse<BookingStatic> // Expected response type
>(
  'getDailyBookingStatistics', // Unique query key
  async (params) => {
    // Remove falsy values and empty arrays before sending
    const cleanedData = _.omitBy(params, (value) => {
      if (value === undefined || value === null) return true
      if (typeof value === 'string' && value === '') return true
      // consultantId might be relevant even if false/0, keep those
      // if (typeof value === 'boolean' && value === false) return true
      if (Array.isArray(value) && value.length === 0) return true
      return false
    })

    return privateRequest(`/transactions/get-daily-booking-statistics`, {
      method: 'POST',
      data: cleanedData
    })
  }
)
