import { IOrder } from './order'
import { TUser } from './user'

export interface IStatusTracking {
  id: string
  createdAt: string
  updatedAt: string
  reason: string | null
  status: string
  updatedBy: TUser
  order: IOrder
}
