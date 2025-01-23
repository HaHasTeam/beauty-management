import axios from 'axios'

import { TServerResponse } from '@/types/request'
import { toQueryFetcher } from '@/utils/query'

import { TAddressCommuneMock, TAddressDistrictMock, TAddressProvinceMock } from './type'

const apiUrl = 'https://vietnam-address-api.vercel.app'
// const apiEndpointDistrict = apiUrl + '/district/?idProvince='
// const apiEndpointCommune = apiUrl + '/commune/?idDistrict='
// const apiEndpointProvince = apiUrl + '/province/'

export const getDistrict = toQueryFetcher<string, TServerResponse<TAddressDistrictMock[]>>(
  'getDistrict',
  async (idProvince) => {
    const apiEndpointDistrict = apiUrl + `/district/${idProvince ? '?idProvince=' + idProvince : ''}`
    return await axios.get(apiEndpointDistrict)
  }
)
export const getCommune = toQueryFetcher<string, TServerResponse<TAddressCommuneMock[]>>(
  'getCommune',
  async (idDistrict) => {
    const apiEndpointDistrict = apiUrl + `/commune/${idDistrict ? '?idDistrict=' + idDistrict : ''}`
    return await axios.get(apiEndpointDistrict)
  }
)

export const getProvince = toQueryFetcher<string, TServerResponse<TAddressProvinceMock[]>>(
  'getProvince',
  async (idProvince) => {
    const apiEndpointProvince = apiUrl + `/province/${idProvince ? '?idProvince=' + idProvince : ''}`

    return await axios.get(apiEndpointProvince)
  }
)
