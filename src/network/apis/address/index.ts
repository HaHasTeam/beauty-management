import axios from 'axios'

import { TServerResponse } from '@/types/request'
import { toMutationFetcher, toQueryFetcher } from '@/utils/query'

import { TAddressCommuneMock, TAddressDistrictMock, TAddressProvinceMock } from './type'

const apiUrl = 'https://vietnam-address-api.vercel.app'
// const apiEndpointDistrict = apiUrl + '/district/?idProvince='
// const apiEndpointCommune = apiUrl + '/commune/?idDistrict='
// const apiEndpointProvince = apiUrl + '/province/'

export const getDistrict = toQueryFetcher<
  {
    idProvince?: string
    idDistrict?: string
  },
  TServerResponse<TAddressDistrictMock[]>
>('getDistrict', async (params) => {
  const apiEndpointDistrict = apiUrl + `/district`
  return await axios.get(apiEndpointDistrict, {
    params: params
  })
})
export const getCommune = toQueryFetcher<
  {
    idProvince?: string
    idDistrict?: string
    idCommune?: string
  },
  TServerResponse<TAddressCommuneMock[]>
>('getCommune', async (params) => {
  const apiEndpointDistrict = apiUrl + `/commune`
  return await axios.get(apiEndpointDistrict, {
    params: params
  })
})

export const getProvince = toQueryFetcher<string, TServerResponse<TAddressProvinceMock[]>>(
  'getProvince',
  async (idProvince) => {
    const apiEndpointProvince = apiUrl + `/province/${idProvince ? '?idProvince=' + idProvince : ''}`

    return await axios.get(apiEndpointProvince)
  }
)

export const getProvinceMutation = toMutationFetcher<string, TServerResponse<TAddressProvinceMock[]>>(
  'getProvince',
  async (idProvince) => {
    const apiEndpointProvince = apiUrl + `/province/${idProvince ? '?idProvince=' + idProvince : ''}`

    return await axios.get(apiEndpointProvince)
  }
)
export const getCommuneMutation = toMutationFetcher<
  {
    idProvince?: string
    idDistrict?: string
    idCommune?: string
  },
  TServerResponse<TAddressCommuneMock[]>
>('getCommune', async (params) => {
  const apiEndpointDistrict = apiUrl + `/commune`
  return await axios.get(apiEndpointDistrict, {
    params: params
  })
})

export const getDistrictMutation = toMutationFetcher<
  {
    idProvince?: string
    idDistrict?: string
  },
  TServerResponse<TAddressDistrictMock[]>
>('getDistrict', async (params) => {
  const apiEndpointDistrict = apiUrl + `/district`
  return await axios.get(apiEndpointDistrict, {
    params: params
  })
})
