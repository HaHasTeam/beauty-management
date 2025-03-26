import { type FC, type PropsWithChildren } from 'react'
import { Navigate } from 'react-router-dom'
import { useShallow } from 'zustand/react/shallow'

import { Routes, routesConfig } from '@/configs/routes'
import { useStore } from '@/stores/store'

// GuestGuard is a component that protects auth routes (login, register)
// If the user is already authenticated, they will be redirected to the main page
const GuestGuard: FC<PropsWithChildren> = ({ children }) => {
  const { authData } = useStore(
    useShallow((state) => ({
      authData: state.authData
    }))
  )

  // If user is authenticated, redirect to main page (e.g., dashboard)
  if (authData) {
    return <Navigate to={routesConfig[Routes.DASHBOARD_HOME].getPath()} replace />
  }

  // If not authenticated, render the children (login/register screens)
  return <>{children}</>
}

export default GuestGuard
