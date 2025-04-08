import { IAddress } from './address'
import { TBankAccount } from './bank-account'
import { IBrand } from './brand'
import { TCartItem } from './cart-item'
import { TMetaData } from './request'
import { TRoleResponse } from './role'

export enum UserGenderEnum {
  MALE = 'MALE',
  FEMALE = 'FEMALE',
  OTHER = 'OTHER'
}

export enum UserStatusEnum {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
  PENDING = 'PENDING',
  BANNED = 'BANNED'
}

export enum UserRoleEnum {
  ADMIN = 'ADMIN',
  MANAGER = 'MANAGER',
  CONSULTANT = 'CONSULTANT',
  CUSTOMER = 'CUSTOMER'
}

export type TUser = TMetaData & {
  firstName?: string
  lastName?: string
  username: string
  email: string
  password?: string
  role: UserRoleEnum | string
  gender?: UserGenderEnum | string
  phone?: string
  dob?: string
  avatar?: string
  status: UserStatusEnum | string
  isEmailVerify: boolean
  brands?: IBrand[]
  description?: string
  majorTitle?: string
  introduceVideo?: string
  yoe?: number
  addresses?: IAddress[]
  bankAccounts?: TBankAccount[]
  cartItems?: TCartItem[]
}

export type TUserFull = Omit<TUser, 'role'> & {
  role: TRoleResponse
}

export type TUserResponse = TUser & {
  createdAt: string
  updatedAt: string
}

export type TUserFeedback = TMetaData & {
  firstName?: string
  lastName?: string
  username: string
  email: string
  password: string
  role: TRoleResponse
  gender?: UserGenderEnum | string
  phone?: string
  dob?: string
  avatar?: string
  status: UserStatusEnum | string
  isEmailVerify: boolean
  brands?: IBrand[]
}

export type TUserUpdateStatusTracking = TMetaData & {
  firstName?: string
  lastName?: string
  username: string
  email: string
  password: string
  role: TRoleResponse
  gender?: UserGenderEnum | string
  phone?: string
  dob?: string
  avatar?: string
  status: UserStatusEnum | string
  isEmailVerify: boolean
  brands?: IBrand[]
}
