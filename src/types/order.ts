import { IClassification } from './classification'
import { OrderEnum, PaymentMethod, RequestStatusEnum, ShippingStatusEnum } from './enum'
import { IResponseFeedback } from './feedback'
import { TServerFile } from './file'
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
  shopVoucherDiscount: number
  productClassification: IClassification
  productClassificationPreOrder: null | IClassification
  feedback: IResponseFeedback
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
  shopVoucherDiscount: number
  orderDetails: IOrderDetail[]
  voucher: TVoucher | null
  account: TUser
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
  account: TUser
  children?: IOrder[]
}

// Other interfaces (kept as they were, assuming they're still needed)
export interface IOrderFilter {
  search?: string
  status?: string
}

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
