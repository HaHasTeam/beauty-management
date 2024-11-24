import { useQuery } from '@tanstack/react-query'
import { createContext, useContext, useEffect, useState } from 'react'

import LoadingLayer from '@/components/loading-icon/LoadingLayer'
import { getRoleIdByEnum } from '@/network/apis/role'
import { TRoleResponse } from '@/types/role'

type Props = {
  children: React.ReactNode
}
type AppProviderContextProps = {
  rolesData: Record<string, TRoleResponse>
}
const AppProviderContext = createContext<AppProviderContextProps>({} as AppProviderContextProps)

const AppProvider = (props: Props) => {
  const [rolesData, setRolesData] = useState<Record<string, TRoleResponse>>({})

  const { isLoading: isGettingRolesIdByEnum, data: getRoleIdByEnumData } = useQuery({
    queryKey: [getRoleIdByEnum.queryKey],
    queryFn: getRoleIdByEnum.fn
  })

  useEffect(() => {
    if (getRoleIdByEnumData) {
      setRolesData(getRoleIdByEnumData)
    }
  }, [getRoleIdByEnumData])

  const isLoading = isGettingRolesIdByEnum

  if (isLoading) {
    return <LoadingLayer label='Loading . . .' />
  }

  return <AppProviderContext.Provider value={{ rolesData }}>{props.children}</AppProviderContext.Provider>
}

export const useAppProvider = () => {
  const context = useContext(AppProviderContext)
  if (!context) {
    throw new Error('useAppProvider must be used within a AppProvider')
  }
  return context
}

export default AppProvider
