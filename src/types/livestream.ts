import { LiveStreamEnum } from './enum'
import { ILivestreamProduct } from './product'
import { TUser } from './user'

export interface ILivestream {
  id: string
  createdAt: string
  updatedAt: string
  title: string
  startTime: string
  endTime: string
  record: string | null
  thumbnail: string
  status: LiveStreamEnum
  livestreamProducts: ILivestreamProduct[]
  account: TUser
}
