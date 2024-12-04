import { TMetaData } from './request'

export type TBrand = TMetaData & {
  name: string
  logo: string
  document: string
  description: string
  email: string
  phone: string
  address: string
  star?: number
  status: BrandStatusEnum
}

export enum BrandStatusEnum {
  PENDING = 'PENDING',
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
  BANNED = 'BANNED'
}
export enum StatusEnum {
  PENDING = 'PENDING',
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
  BANNED = 'BANNED'
}
export type IBrand = {
  id: string
  createdAt: string
  updatedAt: string
  name: string
  logo: string
  document: string
  description: string
  email: string
  phone: string
  address: string
  star: number
  status: StatusEnum.ACTIVE | StatusEnum.BANNED | StatusEnum.INACTIVE | StatusEnum.PENDING
}
