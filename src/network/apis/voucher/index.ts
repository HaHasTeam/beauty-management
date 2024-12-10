import { TServerResponse } from '@/types/request'
import { TVoucher } from '@/types/voucher'
import { toMutationFetcher, toQueryFetcher } from '@/utils/query'
import { privateRequest, publicRequest } from '@/utils/request'

import { TGetVoucherByIdRequestParams, TRequestCreateVoucherParams, TUpdateStatusVoucherRequestParams } from './type'

export const requestCreateVoucherApi = toMutationFetcher<TRequestCreateVoucherParams, TServerResponse<TVoucher>>(
  'createVoucher',
  async (params) => {
    return privateRequest('/vouchers/create', {
      method: 'POST',
      data: params
    })
  }
)
export const updateStatusVoucherByIdApi = toMutationFetcher<
  TUpdateStatusVoucherRequestParams,
  TServerResponse<TVoucher>
>('updateStatusVoucherById', async (params) => {
  return publicRequest(`/vouchers/update-status/${params?.voucherId}`, {
    method: 'PUT',
    data: params
  })
})
export const getVoucherByIdApi = toQueryFetcher<TGetVoucherByIdRequestParams, TServerResponse<TVoucher>>(
  'getVoucherById',
  async (params) => {
    return publicRequest(`/vouchers/get-by-id/${params?.voucherId}`, {
      method: 'GET',
      params
    })
  }
)
export const getAllVouchersApi = toQueryFetcher<void, TServerResponse<TVoucher[]>>('getAllVouchers', async () => {
  return privateRequest(`/vouchers/`, {
    method: 'GET'
  })
})
