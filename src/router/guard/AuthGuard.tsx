import { useQuery } from '@tanstack/react-query'
import { FC, PropsWithChildren, useEffect } from 'react'
import { Navigate } from 'react-router-dom'
import { useShallow } from 'zustand/react/shallow'

import { Routes, routesConfig } from '@/configs/routes'
import { getUserProfileApi } from '@/network/apis/user'
import { useStore } from '@/stores/store'
import { TUser } from '@/types/user'
// AuthGuard is component that will be used to protect routes
// that should only be accessed by authenticated users.
const AuthGuard: FC<PropsWithChildren> = ({ children }) => {
  const { authData, setAuthState } = useStore(
    useShallow((state) => ({
      authData: state.authData,
      setAuthState: state.setAuthState
    }))
  )
  const { data: useProfileData } = useQuery({
    queryKey: [getUserProfileApi.queryKey],
    queryFn: getUserProfileApi.fn,
    enabled: !!authData
  })

  useEffect(() => {
    // fetch user profile if user is authenticated on first load
    if (authData && useProfileData?.data) {
      setAuthState({
        user: useProfileData.data as unknown as TUser
      })
    }
  }, [authData, setAuthState, useProfileData])

  if (!authData) return <Navigate to={routesConfig[Routes.AUTH_LOGIN].getPath()} replace />

  return <>{children}</>
}

export default AuthGuard
