import { RouteObject } from 'react-router-dom'

import Layout from '@/components/layout'
import DashboardHome from '@/views/dashboard'
import AccountsDirectory from '@/views/dashboard/accounts-directory'
import MerchantsDirectory from '@/views/dashboard/merchants-directory'
import { RedirectToMainDashboard } from '@/views/dashboard/others'
import ProfileSettings from '@/views/dashboard/profile-settings'
import RequestsQueue from '@/views/dashboard/requests-queue'
import ServicesCatalog from '@/views/dashboard/service-catalog'

import AuthGuard from './guard/AuthGuard'

export const privateRoutes: RouteObject[] = [
  {
    path: '/dashboard',
    element: (
      <AuthGuard>
        <Layout />
      </AuthGuard>
    ),
    children: [
      {
        index: true,
        element: <RedirectToMainDashboard />
      },
      {
        path: 'home',
        element: <DashboardHome />
      },
      {
        path: 'requests-queue',
        element: <RequestsQueue />
      },
      {
        path: 'merchants-directory',
        element: <MerchantsDirectory />
      },
      {
        path: 'accounts-directory',
        element: <AccountsDirectory />
      },
      {
        path: 'services-catalog',
        element: <ServicesCatalog />
      },
      {
        path: 'profile-settings',
        element: <ProfileSettings />
      },
      {
        path: '*',
        element: <RedirectToMainDashboard />
      }
    ]
  }
]
