import { IBranch } from '@/types/Branch'

export type TRequestCreateBrandParams = IBranch

export type TGetBrandByIdRequestParams = {
  brandId: string
}
export type TUpdateStatusBrandRequestParams = TGetBrandByIdRequestParams & {
  status: string
}

export type TUpdateBrandRequestParams = TGetBrandByIdRequestParams & IBranch
