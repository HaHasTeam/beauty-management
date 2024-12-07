import { TVoucher } from '@/types/voucher'

export type TRequestCreateVoucherParams = TVoucher

export type TGetVoucherByIdRequestParams = {
  voucherId: string
}
export type TUpdateStatusVoucherRequestParams = TGetVoucherByIdRequestParams & {
  status: string
}
