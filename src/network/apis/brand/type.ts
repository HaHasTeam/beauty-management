import { IBranch } from '@/types/Branch'

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
