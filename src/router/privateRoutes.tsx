import { RouteObject } from 'react-router-dom'

import Layout from '@/components/layout'
import { Routes, routesConfig } from '@/configs/routes'
import DashboardHome from '@/views/dashboard'
import AccountsDirectory from '@/views/dashboard/accounts-directory'
import Brands from '@/views/dashboard/brand-management'
import CreateProduct from '@/views/dashboard/create-product'
import FlashSale from '@/views/dashboard/flash-sale'
import AddFlashSale from '@/views/dashboard/flash-sale/AddFlashSale'
import MerchantsDirectory from '@/views/dashboard/merchants-directory'
import { RedirectToMainDashboard } from '@/views/dashboard/others'
import PreOrder from '@/views/dashboard/pre-order'
import PreOrderDetailById from '@/views/dashboard/pre-order/[id]'
import AddPreOrder from '@/views/dashboard/pre-order/AddPreOrder'
import ProductList from '@/views/dashboard/product-list'
import ProfileSettings from '@/views/dashboard/profile-settings'
import RequestsQueue from '@/views/dashboard/requests-queue'
import ServicesCatalog from '@/views/dashboard/service-catalog'
import UpdateProduct from '@/views/dashboard/update-product'

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
        path: routesConfig[Routes.DASHBOARD_HOME].path.replace('/dashboard/', ''),
        element: <DashboardHome />
      },
      {
        path: routesConfig[Routes.REQUESTS_QUEUE].path.replace('/dashboard/', ''),
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
        path: routesConfig[Routes.ACCOUNTS_DIRECTORY].path.replace('/dashboard/', ''),
        element: <AccountsDirectory />
      },
      {
        path: routesConfig[Routes.SERVICES_CATALOG].path.replace('/dashboard/', ''),
        element: <ServicesCatalog />
      },
      {
        path: routesConfig[Routes.PROFILE_SETTINGS].path.replace('/dashboard/', ''),
        element: <ProfileSettings />
      },
      {
        path: routesConfig[Routes.PRODUCT_LIST].path.replace('/dashboard/', ''),
        element: <ProductList />
      },
      {
        path: routesConfig[Routes.CREATE_PRODUCT].path.replace('/dashboard/', ''),
        element: <CreateProduct />
      },
      {
        path: routesConfig[Routes.UPDATE_PRODUCT].path.replace('/dashboard/', ''),
        element: <UpdateProduct />
      },
      {
        path: '*',
        element: <RedirectToMainDashboard />
      }
    ]
  }
]
