import { TBooking } from './booking'
import { TBrand } from './brand'
import { TFile } from './file'
import { IOrder } from './order'
import { TUser } from './user'

export type IStatusTracking = {
  reason: string
  status: string
  updatedBy: TUser
  account: TUser
  brand: TBrand
  order: IOrder
  booking: TBooking
  mediaFiles: TFile[]
}
