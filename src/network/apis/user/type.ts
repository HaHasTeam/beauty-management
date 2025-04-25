import { TBrand } from '@/types/brand'
import { RoleEnum } from '@/types/enum'
import { TProduct } from '@/types/product'
import { BaseParams } from '@/types/request'
import { TRoleResponse } from '@/types/role'
import { TUser, UserStatusEnum } from '@/types/user'

export type TCreateUserRequestParams = Pick<TUser, 'username' | 'email' | 'password' | 'phone'> & {
  brands?: string[]
  role: string
} & Partial<Omit<TUser, 'role' | 'brands'>> & {
    redirectUrl?: string
    brands?: string[]
  }

export type TLoginUserRequestParams = Pick<TUser, 'email' | 'password'>

export type TUpdateUserRequestParams = Partial<Omit<TUser, 'email' | 'password'>>

export type TInviteCoWorkerRequestParams = Pick<TUser, 'email'> & {
  role: string
  brand?: string
  redirectUrl?: string
}

export type TInviteMultipleCoWorkersRequestParams = {
  emails: string[]
  role: string
  brand?: string
  redirectUrl?: string
}

export type TUserResponse = Omit<TUser, 'role'> & {
  role?: TRoleResponse
}

export type TUpdateUserStatusRequestParams = {
  id: string
  status: UserStatusEnum
  reason: string
}

export type TUpdateUsersListStatusRequestParams = {
  ids: string[]
  status: UserStatusEnum
  reason: string
}
export type TGetAccountFilterRequestParams = BaseParams<TUser> & {
  brand?: string
  role?: string
  statuses?: string
  search?: string
}

export type TGetConsultantRecommendationParams = {
  consultantId: string
}

export type TConsultantBrief = {
  name: string | null
  email: string | null
  introduceVideo: string | null
  role: RoleEnum | string
  brands: Partial<TBrand>[]
  addresses: unknown[]
  files: unknown[]
}

export type TBrandRecommendation = {
  brandId: string
  percentage: number
}

export type TProductSuggestion = {
  id: string
  createdAt?: string
  updatedAt?: string
  title: string | null
  price: number | null
  quantity: number | null
  color: string | null
  size: string | null
  other: string | null
  sku: string | null
  type: string | null
  isAvailable: boolean | null
  status: string | null
  product?: Partial<TProduct> & {
    brand?: Partial<TBrand>
  }
}

export type TMonthlyBookingStat = {
  month: string
  totalBookings: string
  totalRevenue: number
}

export type TServiceMonthlyBookingStat = {
  serviceId: string
  serviceName: string
  month: string
  totalBookings: string
  totalRevenue: number
}

export type TConsultantRecommendationData = {
  consultant: TConsultantBrief
  brandRecommendations: TBrandRecommendation[]
  totalProductSuggestions: number
  productSuggestList: TProductSuggestion[]
  monthlyData: TMonthlyBookingStat[]
  serviceMonthlyData: TServiceMonthlyBookingStat[]
}
