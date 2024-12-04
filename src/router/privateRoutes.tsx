import { RouteObject } from 'react-router-dom'

import Layout from '@/components/layout'
import DashboardHome from '@/views/dashboard'
import AccountsDirectory from '@/views/dashboard/accounts-directory'
import Brands from '@/views/dashboard/brand-management'
import FlashSale from '@/views/dashboard/flash-sale'
import AddFlashSale from '@/views/dashboard/flash-sale/AddFlashSale'
import MerchantsDirectory from '@/views/dashboard/merchants-directory'
import { RedirectToMainDashboard } from '@/views/dashboard/others'
import PreOrder from '@/views/dashboard/pre-order'
import PreOrderDetailById from '@/views/dashboard/pre-order/[id]'
import AddPreOrder from '@/views/dashboard/pre-order/AddPreOrder'
import ProfileSettings from '@/views/dashboard/profile-settings'
import RequestsQueue from '@/views/dashboard/requests-queue'
import ServicesCatalog from '@/views/dashboard/service-catalog'

// import Brands from '@/views/dashboard/brand-management'
// import Brands from '@/views/dashboard/brand-management'

export const privateRoutes: RouteObject[] = [
  {
    path: '/dashboard',
    element: (
      // <AuthGuard>
      <Layout />
      // </AuthGuard>
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
        path: 'brand',

        children: [
          {
            index: true,
            element: <Brands />
          }
          // { path: 'create-Brand', element: <AddPreOrder /> },
          // {
          //   path: ':id',
          //   element: <PreOrderDetailById />
          // }
        ]
      },
      {
        path: 'pre-order',

        children: [
          {
            index: true,
            element: <PreOrder />
          },
          { path: 'add-pre-order', element: <AddPreOrder /> },
          {
            path: ':id',
            element: <PreOrderDetailById />
          }
        ]
      },
      {
        path: 'flash-sale',
        children: [
          {
            index: true,
            element: <FlashSale />
          },
          {
            path: 'add-flash-sale',
            element: <AddFlashSale />
          }
        ]
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
