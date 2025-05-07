import { useStore } from '@/stores/store'
import { RoleEnum } from '@/types/enum'

const useGrant = (grantedRole?: RoleEnum[]) => {
  const { user } = useStore()
  if (!grantedRole) return true
  const isGranted = grantedRole?.includes(user?.role as RoleEnum)
  return isGranted
}

export default useGrant
