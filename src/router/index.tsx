import { useRoutes } from 'react-router-dom'

import Layout from '@/components/layout/index'
import Auth from '@/views/Auth'
import DashboardHome from '@/views/Dashboard'
import MerchantsDirectory from '@/views/Dashboard/merchants-directory'
import { RedirectToMainDashboard } from '@/views/Dashboard/others'
import ProductManagement from '@/views/Dashboard/product-management'
import ProfileSettings from '@/views/Dashboard/profile-settings'
import RequestsQueue from '@/views/Dashboard/requests-queue'
import ServicesCatalog from '@/views/Dashboard/service-catalog'
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
          path: '/dashboard/product-management',
          element: <ProductManagement />
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
