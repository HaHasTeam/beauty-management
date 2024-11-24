import { defer } from 'react-router-dom'

import { getRoleIdByEnum } from '@/network/apis/role'

export async function loader() {
  const rolesData = await getRoleIdByEnum()

  return defer({ rolesData })
}
