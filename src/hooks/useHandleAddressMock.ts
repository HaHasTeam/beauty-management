import { useQuery } from '@tanstack/react-query'

import { getCommune, getDistrict, getProvince } from '@/network/apis/address'

export const useHandleAddressMock = ({ provinceId, districtId }: { provinceId?: string; districtId?: string }) => {
  const { data: provinceData, ...provinceQuery } = useQuery({
    queryKey: [getProvince.queryKey],
    queryFn: getProvince.fn,
    select(data) {
      return data.data
    }
  })
  const { data: communeData, ...communeQuery } = useQuery({
    queryKey: [getCommune.queryKey, { idDistrict: districtId }],
    queryFn: getCommune.fn,
    select(data) {
      return data.data
    },
    enabled: !!districtId
  })
  const { data: districtData, ...districtQuery } = useQuery({
    queryKey: [getDistrict.queryKey, { idProvince: provinceId }],
    queryFn: getDistrict.fn,
    select(data) {
      return data.data
    },
    enabled: !!provinceId
  })

  return {
    provinceData,
    communeData,
    districtData,
    provinceQuery,
    communeQuery,
    districtQuery
  }
}
