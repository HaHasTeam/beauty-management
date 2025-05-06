import { TProduct } from './product'
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
  status: LiveStreamStatusEnum
  livestreamProducts: TProduct[] | null
  account: TUser
}
export enum LiveStreamStatusEnum {
  SCHEDULED = 'SCHEDULED',
  LIVE = 'LIVE',
  ENDED = 'ENDED',
  CANCELLED = 'CANCELLED'
}
