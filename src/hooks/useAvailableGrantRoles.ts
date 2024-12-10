import { useMemo } from 'react'
import { useShallow } from 'zustand/react/shallow'

import { useAppProvider } from '@/contexts/AppProvider'
import { useStore } from '@/stores/store'
import { UserRoleEnum } from '@/types/role'

const useAvailableGrantRoles = () => {
  const { rolesData } = useAppProvider()
  const { currentUserRole } = useStore(
    useShallow((state) => ({
      currentUserRole: state.user.role
    }))
  )

  const grantableRoles = useMemo(() => {
    if (currentUserRole === UserRoleEnum.ADMIN) {
      const rolesToGrant = [UserRoleEnum.OPERATOR, UserRoleEnum.CONSULTANT]
      return rolesToGrant.map((key) => rolesData[key]).filter(Boolean)
    }
    if (currentUserRole === UserRoleEnum.MANAGER) {
      const rolesToGrant = [UserRoleEnum.STAFF]
      return rolesToGrant.map((key) => rolesData[key]).filter(Boolean)
    }
    return []
  }, [currentUserRole, rolesData])

  return grantableRoles
}

export default useAvailableGrantRoles
