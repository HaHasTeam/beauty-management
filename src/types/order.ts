import { IClassification } from './classification'
import { PaymentMethod, ShippingStatusEnum } from './enum'
import { TUser } from './user'
import { TVoucher } from './voucher'

export interface IOrderDetail {
  platformVoucherDiscount: number
  shopVoucherDiscount: number
  id: string
  createdAt: string
  updatedAt: string
  subTotal: number
  totalPrice: number
  quantity: number
  type: string | null
  isFeedback: boolean
  productClassification: IClassification
  productClassificationPreOrder: null | IClassification
  unitPriceAfterDiscount: number
  unitPriceBeforeDiscount: number
}

export interface IOrderItem {
  platformVoucherDiscount: number
  shopVoucherDiscount: number
  id: string
  createdAt: string
  updatedAt: string
  subTotal: number
  totalPrice: number
  shippingAddress: string
  phone: string
  paymentMethod: PaymentMethod
  notes: string
  type: string
  status: ShippingStatusEnum
  orderDetails: IOrderDetail[]
  voucher: null | TVoucher
  message: string
  recipientName: string
}

export type IOrder = {
  platformVoucherDiscount: number
  shopVoucherDiscount: number
  id: string
  createdAt: string
  updatedAt: string
  subTotal: number
  totalPrice: number
  shippingAddress: string
  phone: string
  paymentMethod: string
  notes: string
  type: string
  status: string
  account: TUser
  children: IOrderItem[]
}

export type IOrderFilter = {
  search?: string
  status?: string
}

export type IOrderCheckoutItem = {
  productClassificationId: string
  quantity?: number
}

export type ICreateOrderItem = {
  shopVoucherId?: string
  items: IOrderCheckoutItem[]
  message?: string
}

export type ICreateOrder = {
  orders: ICreateOrderItem[]
  addressId: string
  paymentMethod: string
  platformVoucherId?: string
}

export type ICreatePreOrder = {
  productClassificationId: string
  quantity: number
  addressId: string
  paymentMethod: string
  notes: string
}

export type ICancelOrder = {
  orderId: string
  reason: string
}

export interface ICancelRequestOrder {
  id: string
  createdAt: string
  updatedAt: string
  reason: string
  status: string
  order: IOrder
}
