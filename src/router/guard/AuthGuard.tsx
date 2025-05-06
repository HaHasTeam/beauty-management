/* eslint-disable no-console */
'use client'

import { useQuery } from '@tanstack/react-query'
import { type FC, type PropsWithChildren, useEffect } from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { useShallow } from 'zustand/react/shallow'

import LoadingContentLayer from '@/components/loading-icon/LoadingContentLayer'
import { Routes, routesConfig } from '@/configs/routes'
import { getUserProfileApi } from '@/network/apis/user'
import { useStore } from '@/stores/store'
import { UserRoleEnum } from '@/types/role'
import type { TUser } from '@/types/user'

// Enable or disable debug logging
const DEBUG = true

// Helper function for debug logging
const debug = (message: string, data?: unknown) => {
  if (DEBUG) {
    if (data) {
      console.log(`[AuthGuard] ${message}:`, data)
    } else {
      console.log(`[AuthGuard] ${message}`)
    }
  }
}

// Define which routes are accessible by which roles
const roleBasedRoutes: Record<UserRoleEnum, string[]> = {
  [UserRoleEnum.ADMIN]: [], // Admins can access all routes
  [UserRoleEnum.MANAGER]: [
    Routes.DASHBOARD_HOME,
    Routes.ACCOUNTS_DIRECTORY,
    Routes.PRODUCT_LIST,
    Routes.CREATE_PRODUCT,
    Routes.UPDATE_PRODUCT,
    Routes.PRODUCT_DETAILS,
    Routes.ORDER_LIST,
    Routes.ORDER_DETAILS,
    Routes.PROFILE_SETTINGS,
    Routes.MY_BRAND_DASHBOARD,
    Routes.TRANSACTION_MANAGEMENT,
    Routes.PRE_ORDER,
    Routes.PRE_ORDER_DETAILS,
    Routes.ADD_PRE_ORDER,
    Routes.FLASH_SALE,
    Routes.FLASH_SALE_DETAILS,
    Routes.ADD_FLASH_SALE,
    Routes.GROUP_PRODUCT,
    Routes.GROUP_PRODUCT_DETAILS,
    Routes.SCHEDULE_BOOKING,
    Routes.VOUCHER,
    Routes.UPDATE_VOUCHER,
    Routes.ADD_VOUCHER,
    Routes.REPORTS,
    Routes.SELECT_INTERVIEW_SLOT,
    Routes.GROUP_BUYING,
    Routes.REPORTS
  ],
  [UserRoleEnum.CONSULTANT]: [
    Routes.DASHBOARD_HOME,
    Routes.TRANSACTION_MANAGEMENT,
    Routes.PROFILE_SETTINGS,
    Routes.CONSULTANT_SERVICE,
    Routes.CONSULTANT_SERVICE_DETAILS,
    Routes.WORKING_TIME,
    Routes.SCHEDULE_BOOKING,
    Routes.BOOKINGS_AND_REQUESTS,
    Routes.BOOKING_DETAILS,
    Routes.BOOKING_DETAIL,
    Routes.BOOKING_LIST,
    Routes.REPORTS
  ],
  [UserRoleEnum.STAFF]: [
    Routes.DASHBOARD_HOME,
    Routes.PRODUCT_LIST,
    Routes.CREATE_PRODUCT,
    Routes.UPDATE_PRODUCT,
    Routes.PRODUCT_DETAILS,
    Routes.ORDER_LIST,
    Routes.ORDER_DETAILS,
    Routes.PROFILE_SETTINGS,
    Routes.PRE_ORDER,
    Routes.PRE_ORDER_DETAILS,
    Routes.ADD_PRE_ORDER,
    Routes.FLASH_SALE,
    Routes.FLASH_SALE_DETAILS,
    Routes.ADD_FLASH_SALE,
    Routes.GROUP_PRODUCT,
    Routes.GROUP_PRODUCT_DETAILS,
    Routes.SCHEDULE_BOOKING,
    Routes.VOUCHER,
    Routes.UPDATE_VOUCHER,
    Routes.ADD_VOUCHER,
    Routes.REPORTS,
    Routes.GROUP_BUYING,
    Routes.REPORTS
  ],
  [UserRoleEnum.KOL]: [Routes.DASHBOARD_HOME, Routes.PROFILE_SETTINGS, Routes.REPORTS],
  [UserRoleEnum.CUSTOMER]: [], // Customers have no access to any dashboard routes
  [UserRoleEnum.OPERATOR]: [
    Routes.DASHBOARD_HOME,
    Routes.ACCOUNTS_DIRECTORY,
    Routes.PROFILE_SETTINGS,
    Routes.REPORTS,
    Routes.BRAND,
    Routes.BOOKINGS_AND_REQUESTS,
    Routes.BOOKING_DETAILS,
    Routes.BOOKING_LIST,
    Routes.BOOKING_DETAIL,
    Routes.TRANSACTION_MANAGEMENT,
    Routes.CATEGORY,
    Routes.ADD_CATEGORY,
    Routes.PRODUCT_LIST,
    Routes.PRE_ORDER,
    Routes.FLASH_SALE,
    Routes.GROUP_PRODUCT,
    Routes.SCHEDULE_BOOKING,
    Routes.WORKING_TIME,
    Routes.SYSTEM_SERVICE_LIST,
    Routes.BLOG,
    Routes.REPORTS
  ]
}

// AuthGuard is component that will be used to protect routes
// that should only be accessed by authenticated users.
const AuthGuard: FC<PropsWithChildren> = ({ children }) => {
  const location = useLocation()
  const { authData, setAuthState } = useStore(
    useShallow((state) => ({
      authData: state.authData,
      setAuthState: state.setAuthState
    }))
  )

  debug('Component rendered', { path: location.pathname })
  debug('Auth data', authData ? 'Present' : 'Not present')

  const {
    data: useProfileData,
    isLoading,
    error
  } = useQuery({
    queryKey: [getUserProfileApi.queryKey],
    queryFn: getUserProfileApi.fn,
    enabled: !!authData
  })

  useEffect(() => {
    // fetch user profile if user is authenticated on first load
    if (authData && useProfileData?.data) {
      debug('User profile data received', useProfileData.data)
      setAuthState({
        user: useProfileData.data as unknown as TUser
      })
    }
  }, [authData, setAuthState, useProfileData])

  if (isLoading) {
    return (
      <>
        {children}
        <LoadingContentLayer />
      </>
    )
  }
  // Debug query status
  debug('Profile query status', { isLoading, error: error?.message, hasData: !!useProfileData })

  // Check if user is authenticated
  if (!authData) {
    debug('User not authenticated, redirecting to login')
    return <Navigate to={routesConfig[Routes.AUTH_LOGIN].getPath()} replace />
  }

  // Get current user role
  const userRole = useProfileData?.data?.role as unknown as UserRoleEnum
  debug('User role', useProfileData)

  // Skip permission check for the forbidden page itself
  if (location.pathname === '/dashboard/forbidden') {
    debug('Accessing forbidden page, skipping permission check')
    return <>{children}</>
  }

  // If user is a CUSTOMER, redirect them to the public forbidden page
  if (userRole === UserRoleEnum.CUSTOMER) {
    debug('Customer role detected, redirecting to public forbidden page (403)')
    return <Navigate to='/forbidden' state={{ from: location, statusCode: 403 }} replace />
  }

  // Admin can access all routes
  if (userRole === UserRoleEnum.ADMIN) {
    debug('Admin role detected, granting access to all routes')
    return <>{children}</>
  }

  // For other roles, check if the current route is in their allowed routes
  const allowedRoutes = roleBasedRoutes[userRole as UserRoleEnum] || []
  debug('Allowed routes for role', { role: userRole, routes: allowedRoutes })

  // Check if any of the allowed routes match the current path
  const currentPath = location.pathname
  debug('Current path', currentPath)

  // Log each route check for detailed debugging
  const routeCheckResults = allowedRoutes.map((routeKey) => {
    const route = routesConfig[routeKey]
    const routePath = route.path.replace('[id]', '').replace(':id', '')
    const isMatch = currentPath.startsWith(routePath)
    return {
      routeKey,
      routePath,
      isMatch
    }
  })

  debug('Route check details', routeCheckResults)

  const isRouteAllowed = routeCheckResults.some((result) => result.isMatch)
  debug('Route access decision', { isAllowed: isRouteAllowed })

  // If the route is not allowed, redirect to the dashboard forbidden page
  if (!isRouteAllowed) {
    debug('Access denied, redirecting to dashboard forbidden page', {
      from: location.pathname,
      role: userRole
    })
    return <Navigate to='/dashboard/forbidden' state={{ from: location, statusCode: 403 }} replace />
  }

  debug('Access granted')
  return <>{children}</>
}

export default AuthGuard
