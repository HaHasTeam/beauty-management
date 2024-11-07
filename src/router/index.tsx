import { useRoutes } from 'react-router-dom'

import Layout from '@/components/layout/index'
import Auth from '@/views/Auth'
import DashboardHome from '@/views/Dashboard'
import MerchantsDirectory from '@/views/Dashboard/MerchantsDirectory'
import { RedirectToMainDashboard } from '@/views/Dashboard/others'
import RequestsQueue from '@/views/Dashboard/RequestsQueue'
import ServicesCatalog from '@/views/Dashboard/ServicesCatalog'
import ProfileSettings from '@/views/Dashboard/Settings'
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
