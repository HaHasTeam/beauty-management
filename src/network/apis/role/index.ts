import { TServerResponse } from '@/types/request'
import { TRoleResponse } from '@/types/role'
import { toQueryFetcher } from '@/utils/query'
import { publicRequest } from '@/utils/request'

type GetRoleByEnumResponse = Record<string, TRoleResponse>
export const getRolesApi = toQueryFetcher<void, TServerResponse<TRoleResponse[]>>('getRolesApi', async () => {
  return publicRequest('/role')
})

export const getRoleIdByEnum = toQueryFetcher<void, GetRoleByEnumResponse>('getRoleIdByEnum', async () => {
  const response = await getRolesApi.raw()
  const roles = response.data

  const mappedRoles = roles.reduce<GetRoleByEnumResponse>((acc, roleItem) => {
    const key = roleItem.role
    acc[key] = roleItem
    return acc
  }, {})

  return mappedRoles
})
