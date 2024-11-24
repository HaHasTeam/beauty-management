import { UserRoleEnum } from './role'

export enum UserGenderEnum {
  MALE = 'MALE',
  FEMALE = 'FEMALE',
  OTHER = 'OTHER'
}

export enum UserStatusEnum {
  PENDING = 'PENDING',
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
  BANNED = 'BANNED'
}

export type TUser = {
  firstName?: string
  lastName?: string
  username: string
  email: string
  password: string
  role: UserRoleEnum | string
  gender?: UserGenderEnum | string
  phone?: string
  dob?: string
  avatar?: string
  status: UserStatusEnum | string
  isEmailVerify: boolean
  brand?: string
}
