import { Routes } from '@/configs/routes'
import { UserRoleEnum } from '@/types/role'
import type { IRoute } from '@/types/types'

// Define which routes are accessible by which roles
export const roleBasedRoutes: Record<UserRoleEnum, string[]> = {
  [UserRoleEnum.ADMIN]: [], // Admins can access all routes
  [UserRoleEnum.MANAGER]: [
    Routes.DASHBOARD_HOME,
    Routes.MY_BRAND_DASHBOARD,
    Routes.BOOKINGS_AND_REQUESTS,
    Routes.TRANSACTION_MANAGEMENT,
    Routes.BRAND,
    Routes.PRODUCT_LIST,
    Routes.ORDER_LIST,
    Routes.PROFILE_SETTINGS,
    Routes.VOUCHER,
    Routes.PRE_ORDER,
    Routes.FLASH_SALE,
    Routes.GROUP_PRODUCT
  ],
  [UserRoleEnum.CONSULTANT]: [
    Routes.DASHBOARD_HOME,
    Routes.PROFILE_SETTINGS,
    Routes.CONSULTANT_SERVICE,
    Routes.WORKING_TIME,
    Routes.SCHEDULE_BOOKING
  ],
  [UserRoleEnum.STAFF]: [Routes.DASHBOARD_HOME, Routes.PROFILE_SETTINGS],
  [UserRoleEnum.KOL]: [Routes.DASHBOARD_HOME, Routes.PROFILE_SETTINGS],
  [UserRoleEnum.CUSTOMER]: [], // Customers have no access to any dashboard routes
  [UserRoleEnum.OPERATOR]: [
    Routes.DASHBOARD_HOME,
    Routes.ACCOUNTS_DIRECTORY,
    Routes.PROFILE_SETTINGS,
    Routes.REPORTS,
    Routes.SYSTEM_SERVICE_LIST
  ]
}

/**
 * Filter routes based on user role
 * @param routes All available routes
 * @param userRole User's role
 * @returns Filtered routes that the user has permission to access
 */
export const filterRoutesByRole = (routes: IRoute[], userRole: UserRoleEnum): IRoute[] => {
  // Admin can access all routes
  if (userRole === UserRoleEnum.ADMIN) {
    return routes
  }

  // Get allowed routes for the user's role
  const allowedRoutes = roleBasedRoutes[userRole] || []

  // Filter routes based on the allowed routes
  return routes.filter((route) => {
    // Extract the route key from the path
    const routePath = route.path

    // Check if this route is in the allowed routes for this role
    return allowedRoutes.some(() => {
      // Get the path from routesConfig
      const allowedRoutePath = routePath

      // Check if the route path matches or starts with the allowed route path
      return routePath === allowedRoutePath || routePath.startsWith(allowedRoutePath)
    })
  })
}
