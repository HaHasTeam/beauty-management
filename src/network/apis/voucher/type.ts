import { VoucherApplyTypeEnum, VoucherStatusEnum, VoucherVisibilityEnum } from '@/types/enum'
import { BaseParams } from '@/types/request'
import { TVoucher } from '@/types/voucher'

export type TRequestCreateVoucherParams = Omit<TVoucher, 'id' | 'updatedAt' | 'createdAt' | 'brand'>

export type TGetVoucherByIdRequestParams = {
  voucherId: string
}
export type TUpdateStatusVoucherRequestParams = TGetVoucherByIdRequestParams & {
  status: string
}
export type TUpdateVoucherRequestParams = Partial<Omit<TVoucher, 'updatedAt' | 'createdAt' | 'brand'>>

export type TFilterVouchersParams = BaseParams<{
  statuses?: VoucherStatusEnum[]
  applyType?: VoucherApplyTypeEnum
  visibility?: VoucherVisibilityEnum
  brandId?: string
  startTime?: string
  endTime?: string
  applyProductIds?: string[]
}>
