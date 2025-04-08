import { IBranch } from '@/types/Branch'
import { BrandStatusEnum } from '@/types/brand'
import { BaseParams } from '@/types/request'

export type TRequestCreateBrandParams = IBranch

export type TGetBrandByIdRequestParams = {
  brandId: string
}
export type TUpdateStatusBrandRequestParams = TGetBrandByIdRequestParams & {
  reason?: string
  status: string
  url: string
}

export type TUpdateBrandRequestParams = TGetBrandByIdRequestParams & IBranch

export type RequestAssignOperatorParams = {
  brandId: string
  operatorId: string
}

export type TFilterBrandRequestParams = BaseParams<{
  name?: string
  reviewerId?: string
  statuses?: BrandStatusEnum[]
}>
