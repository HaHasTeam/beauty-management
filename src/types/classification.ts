import { TMetaData } from './request'

export type TClassification = TMetaData & {
  title: string
  price: number
  quantity: number
  image: string | null
  status: ClassificationStatusEnum
}

export enum ClassificationStatusEnum {
  PENDING = 'PENDING',
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
  BANNED = 'BANNED'
}
