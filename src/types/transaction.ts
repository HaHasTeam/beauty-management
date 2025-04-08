import { TBrand } from './brand'
import { IOrder } from './order'
import { PaymentMethodEnum } from './payment'
import { TMetaData } from './request'
import { TUser } from './user'

export enum TransactionTypeEnum {
  DEPOSIT = 'DEPOSIT',
  WITHDRAW = 'WITHDRAW',
  ORDER_PURCHASE = 'ORDER_PURCHASE',
  BOOKING_PURCHASE = 'BOOKING_PURCHASE',
  ORDER_REFUND = 'ORDER_REFUND',
  BOOKING_REFUND = 'BOOKING_REFUND',
  ORDER_CANCEL = 'ORDER_CANCEL',
  BOOKING_CANCEL = 'BOOKING_CANCEL',
  TRANSFER_TO_WALLET = 'TRANSFER_TO_WALLET'
}

export enum TransactionStatusEnum {
  PENDING = 'PENDING',
  PROCESSING = 'PROCESSING',
  COMPLETED = 'COMPLETED',
  FAILED = 'FAILED',
  REFUNDED = 'REFUNDED'
}

export type TBooking = {
  id: string
  bookingNumber: string
}

export type ITransaction = TMetaData & {
  order?: IOrder
  booking?: TBooking
  buyer: TUser
  brand?: TBrand
  consultant?: TUser
  amount: number
  balanceAfterTransaction: number
  paymentMethod: PaymentMethodEnum
  type: TransactionTypeEnum
  description?: string
}

export type TTransaction = {
  id: string
  type: TransactionTypeEnum
  amount: number
  balanceAfterTransaction: number
  paymentMethod: PaymentMethodEnum
  description?: string
  buyer: TUser
  brand?: TBrand
  consultant?: TUser
  order?: IOrder
  booking?: TBooking
  createdAt: string
  updatedAt: string
}
