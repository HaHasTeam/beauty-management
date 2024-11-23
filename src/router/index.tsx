import { useRoutes } from 'react-router-dom'

import Layout from '@/components/layout/index'
import CreateProduct from '@/components/product-management/CreateProduct'
import UpdateProduct from '@/components/product-management/UpdateProduct'
import configs from '@/config'
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
      path: configs.routes.home,
      element: <Home />
    },
    {
      path: configs.routes.dashboard,
      element: <Layout />,
      children: [
        {
          index: true,
          element: <RedirectToMainDashboard />
        },
        {
          path: configs.routes.dashboardHome.replace('/dashboard/', ''),
          element: <DashboardHome />
        },
        {
          path: configs.routes.requestsQueue.replace('/dashboard/', ''),
          element: <RequestsQueue />
        },
        {
          path: configs.routes.merchantsDirectory.replace('/dashboard/', ''),
          element: <MerchantsDirectory />
        },
        {
          path: configs.routes.servicesCatalog.replace('/dashboard/', ''),
          element: <ServicesCatalog />
        },
        {
          path: configs.routes.profileSettings.replace('/dashboard/', ''),
          element: <ProfileSettings />
        },
        {
          path: configs.routes.productManagement.replace('/dashboard/', ''),
          element: <ProductManagement />
        },
        {
          path: configs.routes.createProduct.replace('/dashboard/', ''),
          element: <CreateProduct />
        },
        {
          path: configs.routes.updateProduct.replace('/dashboard/', ''),
          element: <UpdateProduct />
        },
        {
          path: configs.routes.notFound,
          element: <RedirectToMainDashboard />
        }
      ]
    },
    {
      path: configs.routes.auth,
      element: <Auth />
    }
  ])
}
