import { TServerResponse } from '@/types/request'
import { TVoucher } from '@/types/voucher'
import { toMutationFetcher, toQueryFetcher } from '@/utils/query'
import { privateRequest, publicRequest } from '@/utils/request'

import { TRequestCreateVoucherParams, TUpdateStatusVoucherRequestParams, TUpdateVoucherRequestParams } from './type'

export const createVoucherApi = toMutationFetcher<TRequestCreateVoucherParams, TServerResponse<TVoucher>>(
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

export const updateVoucherByIdApi = toMutationFetcher<TUpdateVoucherRequestParams, TServerResponse<TVoucher>>(
  'updateVoucherById',
  async (params) => {
    return privateRequest(`/vouchers/update-detail/${params?.id}`, {
      method: 'PUT',
      data: params
    })
  }
)

export const getVoucherByIdApi = toQueryFetcher<string, TServerResponse<TVoucher>>('getVoucherById', async (params) => {
  return publicRequest(`/vouchers/get-by-id/${params}`, {
    method: 'GET'
  })
})
export const getAllVouchersApi = toQueryFetcher<void, TServerResponse<TVoucher[]>>('getAllVouchers', async () => {
  return privateRequest(`/vouchers/`, {
    method: 'GET'
  })
})
