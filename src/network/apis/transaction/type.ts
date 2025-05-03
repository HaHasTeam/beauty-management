import { OrderEnum } from '@/types/enum'
import { BaseParams } from '@/types/request'
import { TransactionTypeEnum } from '@/types/transaction'

/**
 * Parameters for filtering transactions
 */
export type TFilterTransactionsParams = BaseParams<{
  types?: TransactionTypeEnum[]
  buyerId?: string
  brandId?: string
  consultantId?: string
  startDate?: string
  endDate?: string
  minAmount?: number
  maxAmount?: number
}>

export enum PAY_TYPE {
  ORDER = 'ORDER',
  BOOKING = 'BOOKING'
}

/**
 * Parameters for getting daily order statistics
 */
export type TGetDailyOrderStatisticsParams = {
  brandId?: string
  startDate?: string
  endDate?: string
  orderType?: OrderEnum
  productIds?: string[]
  eventIds?: string[]
  groupProductIds?: string[]
  preOrderProductIds?: string[]
  flashSaleIds?: string[]
}

export type OrderStatic = {
  total: {
    totalRevenue: number
    totalQuantity: number
    totalPlatformVoucherDiscount: number
    totalShopVoucherDiscount: number
  }
  items: {
    date: string
    totalRevenue: number
    totalQuantity: number
    totalPlatformVoucherDiscount: number
    totalShopVoucherDiscount: number
  }[]
}
export enum StatisticsTimeEnum {
  ALL_TIME = 'ALL_TIME',
  SPECIFIC_TIME = 'SPECIFIC_TIME'
}

export type TGetBrandRevenueStatisticsParams = {
  brandId?: string
  startDate?: string
  endDate?: string
}

export type TGetBrandRevenueStatisticsResponse = {
  cancelledOrders: {
    count: number
    sumTotalPrice: number
  }
  refundedOrders: {
    count: number
    sumTotalPrice: number
  }
  inProgressReturnedOrders: {
    count: number
    sumTotalPrice: number
  }
  completedOrders: {
    count: number
    sumTotalPrice: number
  }
  unpaidForBrandOrders: {
    count: number
    sumTotalPrice: number
  }
}
