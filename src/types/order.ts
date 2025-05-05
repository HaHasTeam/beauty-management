import { TBrand } from './brand'
import { IClassification } from './classification'
import { OrderEnum, PaymentMethod, RequestStatusEnum, ShippingStatusEnum } from './enum'
import { IResponseFeedback } from './feedback'
import { TServerFile } from './file'
import { ILivestream } from './livestream'
import { PaymentMethodEnum } from './payment'
import { BaseParams } from './request'
import { TUser, TUserUpdateStatusTracking } from './user'
import { TVoucher } from './voucher'

// Order detail interface
export interface IOrderDetail {
  id: string
  createdAt: string
  updatedAt: string
  unitPriceBeforeDiscount: number
  unitPriceAfterDiscount: number
  subTotal: number
  totalPrice: number
  quantity: number
  productName: string
  classificationName: string
  type: OrderEnum
  isFeedback: boolean
  platformVoucherDiscount: number
  platformVoucherId: string
  shopVoucherId: string
  shopVoucherDiscount: number
  productClassification: IClassification
  productClassificationPreOrder: null | IClassification
  feedback: IResponseFeedback
  livestream: ILivestream
}

// Order item interface
export interface IOrderItem {
  id: string
  createdAt: string
  updatedAt: string
  subTotal: number
  totalPrice: number
  shippingAddress: string
  phone: string
  recipientName: string
  paymentMethod: PaymentMethod
  notes: string
  message: string | null
  type: OrderEnum
  status: ShippingStatusEnum
  platformVoucherDiscount: number
  platformVoucherId: string
  shopVoucherDiscount: number
  shopVoucherId: string
  livestreamId: string
  orderDetails: IOrderDetail[]
  voucher: TVoucher | null
  account: TUser
  parent: IOrderItem
}

// Main order interface
export interface IOrder {
  id: string
  createdAt: string
  updatedAt: string
  subTotal: number
  totalPrice: number
  shippingAddress: string
  phone: string
  recipientName: string
  paymentMethod: PaymentMethod
  notes: string
  message: string | null
  type: OrderEnum
  status: ShippingStatusEnum
  platformVoucherDiscount: number
  shopVoucherDiscount: number
  platformVoucherId: string
  shopVoucherId: string
  livestream: ILivestream
  account: TUser
  brand?: TBrand
  children?: IOrder[]
  orderDetails?: IOrderDetail[]
  isPaymentMethodUpdated: boolean
  voucher: TVoucher | null
}

// Other interfaces (kept as they were, assuming they're still needed)
export type IOrderFilter = BaseParams<{
  search?: string
  statuses?: ShippingStatusEnum[]
  types?: OrderEnum[]
  paymentMethods?: PaymentMethodEnum[]
  productIds?: string[]
  eventId?: string
  type?: OrderEnum
  voucherId?: string
}>

export type IOrderFilterFilter = BaseParams<{
  search?: string
  statuses?: ShippingStatusEnum[] | undefined | ShippingStatusEnum
  types?: OrderEnum[]
  paymentMethods?: PaymentMethodEnum[]
  productIds?: string[]
}>

export interface IOrderCheckoutItem {
  productClassificationId: string
  quantity?: number
}

export interface ICreateOrderItem {
  shopVoucherId?: string
  items: IOrderCheckoutItem[]
  message?: string
}

export interface ICreateOrder {
  orders: ICreateOrderItem[]
  addressId: string
  paymentMethod: string
  platformVoucherId?: string
}

export interface ICreatePreOrder {
  productClassificationId: string
  quantity: number
  addressId: string
  paymentMethod: string
  notes: string
}

export interface ICancelOrder {
  orderId: string
  reason: string
}

export interface ICancelRequestOrder {
  id: string
  createdAt: string
  updatedAt: string
  reason: string
  status: RequestStatusEnum
  order: IOrder
  updatedBy: TUserUpdateStatusTracking
}

export interface IRejectReturnRequestOrder extends ICancelRequestOrder {
  mediaFiles: TServerFile[]
  reasonRejected: string | null
}
export interface IReturnRequestOrder extends ICancelRequestOrder {
  mediaFiles: TServerFile[]
  rejectedRefundRequest: IRejectReturnRequestOrder
  reasonRejected: string | null
}

export interface ICancelAndReturnRequest {
  cancelRequest: ICancelRequestOrder
  refundRequest: IReturnRequestOrder
  complaintRequest: IReturnRequestOrder
}
export interface IOrderFeedback extends IOrderItem {
  account: TUser
  productClassification: IClassification
  quantity: number
}

export interface IOrderDetailFeedback extends IOrderDetail {
  order: IOrderFeedback
}
