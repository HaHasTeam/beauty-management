import { TMetaData } from './request'
import { TUser } from './user'

export type TBrand = TMetaData & {
  name: string
  logo: string
  document: string
  description: string
  email: string
  phone: string
  address: string
  star?: number
  businessTaxCode: string
  businessRegistrationCode: string
  establishmentDate: string
  province: string
  district: string
  ward: string
  businessRegistrationAddress: string
  reviewer?: TUser
  status: BrandStatusEnum
}

export enum BrandStatusEnum {
  PENDING_REVIEW = 'PENDING_REVIEW', // chờ xét duyệt hồ sơ
  NEED_ADDITIONAL_DOCUMENTS = 'NEED_ADDITIONAL_DOCUMENTS', // cần bổ sung hồ sơ
  PRE_APPROVED_FOR_MEETING = 'PRE_APPROVED_FOR_MEETING', // Được chấp thuận hồ sơ trước khi xác nhận lại trong buổi meeting
  DONE_MEETING = 'DONE_MEETING',
  DENIED = 'DENIED',
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
  BANNED = 'BANNED'
}
export enum StatusEnum {
  PENDING = 'PENDING',
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
  BANNED = 'BANNED',
  DENIED = 'DENIED'
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
  status: BrandStatusEnum
  businessTaxCode: string
  businessRegistrationCode: string
  establishmentDate: string
  ward: string
  district: string
  province: string
  reviewer?: TUser
}
