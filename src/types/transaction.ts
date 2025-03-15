import { TBrand } from './brand'
import { IOrder } from './order'
import { PaymentMethodEnum } from './payment'
import { TMetaData } from './request'
import { TUser } from './user'

export type ITransaction = TMetaData & {
  order?: IOrder
  buyer: TUser
  brand?: TBrand
  amount: number
  paymentMethod: PaymentMethodEnum
  type: TransactionTypeEnum
  status: TransactionStatusEnum
}

export enum TransactionTypeEnum {
  PURCHASE = 'PURCHASE',
  DEPOSIT = 'DEPOSIT',
  WITHDRAW = 'WITHDRAW'
}

export enum TransactionStatusEnum {
  PENDING = 'PENDING',
  COMPLETED = 'COMPLETED',
  REFUNDED = 'REFUNDED',
  CANCELLED = 'CANCELLED'
}
