import { TBaseEntity } from './common'

export type TCartItem = TBaseEntity & {
  quantity: number
  productId: string
  accountId: string
  price: number
  totalPrice: number
}
