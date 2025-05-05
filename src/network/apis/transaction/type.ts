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
  accountId?: string
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
  voucherId?: string
}

export type OrderStaticItem = {
  date: string
  totalRevenue: number
  totalPlatformVoucherDiscount: number
  totalShopVoucherDiscount: number
  actualRevenue: number
  totalCommissionFee: number
}

export type OrderStaticTotal = {
  totalRevenue: number
  totalPlatformVoucherDiscount: number
  totalShopVoucherDiscount: number
  totalQuantity: number
  orderCount: number
  actualRevenue: number
  totalCommissionFee: number
}

export type OrderStatic = {
  total: OrderStaticTotal
  items: OrderStaticItem[]
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

// types for get-daily-booking-statistics
export type TGetDailyBookingStatisticsParams = {
  startDate?: string
  endDate?: string
  consultantId?: string
  consultantServiceId?: string
}

export type BookingStatDetail = {
  count: number
  totalPrice: number
  commissionFee: number // Assuming this exists based on response shape
  actualRevenue: number // Assuming this exists based on response shape
}

export type BookingStaticItem = {
  date: string
  cancelled: BookingStatDetail
  booked: BookingStatDetail
}

export type BookingStaticTotal = {
  cancelled: BookingStatDetail
  booked: BookingStatDetail
}

export type BookingStatic = {
  total: BookingStaticTotal
  items: BookingStaticItem[]
}

export type TGetDailySystemStatisticsParams = {
  startDate?: string
  endDate?: string
}

export type DailySystemStatisticsItem = {
  date: string
  totalRevenue: number
  totalCommissionFee: number
  actualRevenue: number
  totalPlatformVoucherDiscount: number
}

export type DailySystemStatisticsTotal = {
  totalRevenue: number
  totalCommissionFee: number
  actualRevenue: number
  totalPlatformVoucherDiscount: number
}

export type DailySystemStatistics = {
  total: DailySystemStatisticsTotal
  items: DailySystemStatisticsItem[]
}
