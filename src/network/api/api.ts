import { request } from '@/network/axios'

import { getCanvasData } from './api-params-moudle'
import { GetCityTotal } from './api-res-model'

enum APIS {
  GET_CITY_TOTAL_NUMBER = '/xxxx/xxxx/xxxxx'
}

export const getCityTotalNumber = (params: getCanvasData) =>
  request.get<GetCityTotal>(APIS.GET_CITY_TOTAL_NUMBER, params)
