import { useRoutes } from 'react-router-dom'

import Layout from '@/components/layout/index'
import Auth from '@/views/auth'
import DashboardHome from '@/views/dashboard'
import MerchantsDirectory from '@/views/dashboard/merchants-directory'
import { RedirectToMainDashboard } from '@/views/dashboard/others'
import ProfileSettings from '@/views/dashboard/profile-settings'
import RequestsQueue from '@/views/dashboard/requests-queue'
import ServicesCatalog from '@/views/dashboard/service-catalog'
import Home from '@/views/Home'

export default function RouterProvider() {
  return useRoutes([
    {
      path: '/',
      element: <Home />
    },
    {
      path: '/dashboard',
      element: <Layout />,
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
    },
    {
      path: '/auth/*',
      element: <Auth />
    }
  ])
}
