import { RouteObject } from 'react-router-dom'

import Layout from '@/components/layout'
import { Routes, routesConfig } from '@/configs/routes'
import DashboardHome from '@/views/dashboard'
import AccountsDirectory from '@/views/dashboard/accounts-directory'
import Brands from '@/views/dashboard/brand-management'
import ViewBrandForm from '@/views/dashboard/brand-management/ViewBrandForm'
import Category from '@/views/dashboard/category'
import CategoryDetailById from '@/views/dashboard/category/[id]'
import AddCategory from '@/views/dashboard/category/AddCategory'
import ConsultantService from '@/views/dashboard/consultant-service'
import ConsultantServiceDetailById from '@/views/dashboard/consultant-service/[id]'
import AddConsultantService from '@/views/dashboard/consultant-service/AddConsultantService'
import CreateProduct from '@/views/dashboard/create-product'
import FlashSale from '@/views/dashboard/flash-sale'
import FlashSaleDetailsById from '@/views/dashboard/flash-sale/[id]'
import AddFlashSale from '@/views/dashboard/flash-sale/AddFlashSale'
import GroupProduct from '@/views/dashboard/group-product'
import GroupProductDetailById from '@/views/dashboard/group-product/[id]'
import AddGroupProduct from '@/views/dashboard/group-product/AddGroupProduct'
import MerchantsDirectory from '@/views/dashboard/merchants-directory'
import OrderList from '@/views/dashboard/order-management'
import OrderDetails from '@/views/dashboard/order-management/OrderDetails'
import { RedirectToMainDashboard } from '@/views/dashboard/others'
import PreOrder from '@/views/dashboard/pre-order'
import PreOrderDetailById from '@/views/dashboard/pre-order/[id]'
import AddPreOrder from '@/views/dashboard/pre-order/AddPreOrder'
import ProductList from '@/views/dashboard/product-list'
import ProductDetails from '@/views/dashboard/product-list/ProductDetails'
import ProfileSettings from '@/views/dashboard/profile-settings'
import RequestsQueue from '@/views/dashboard/requests-queue'
import ScheduleBooking from '@/views/dashboard/schedule-booking'
import ScheduleMeeting from '@/views/dashboard/schedule-meeting'
import ServicesCatalog from '@/views/dashboard/service-catalog'
import SystemService from '@/views/dashboard/system-service'
import CreateSystemService from '@/views/dashboard/system-service/CreateSystemService'
import SystemServiceDetail from '@/views/dashboard/system-service/SystemServiceDetail'
import UpdateSystemService from '@/views/dashboard/system-service/UpdateSystemService'
import UpdateProduct from '@/views/dashboard/update-product'
import Vouchers from '@/views/dashboard/voucher-management'
import ViewVoucherDetail from '@/views/dashboard/voucher-management/ViewVoucherDetail'

import AuthGuard from './guard/AuthGuard'
// import Brands from '@/views/dashboard/brand-management'
// import Brands from '@/views/dashboard/brand-management'\

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
        path: routesConfig[Routes.DASHBOARD_HOME].path.replace('/dashboard/', ''),
        element: <DashboardHome />
      },
      {
        path: routesConfig[Routes.REQUESTS_QUEUE].path.replace('/dashboard/', ''),
        element: <RequestsQueue />
      },
      {
        path: routesConfig[Routes.BRAND].path.replace('/dashboard/', ''),
        children: [
          {
            index: true,
            element: <Brands />
          },
          { path: routesConfig[Routes.ADD_BRAND].path, element: <ViewBrandForm /> },
          {
            path: 'update/:id',
            element: <ViewBrandForm />
          }
        ]
      },
      {
        path: routesConfig[Routes.VOUCHER].path.replace('/dashboard/', ''),

        children: [
          {
            index: true,
            element: <Vouchers />
          },
          { path: routesConfig[Routes.ADD_VOUCHER].path, element: <ViewVoucherDetail /> },
          {
            path: 'update/:id',
            element: <ViewVoucherDetail />
          }
        ]
      },
      {
        path: routesConfig[Routes.PRE_ORDER].path.replace('/dashboard/', ''),
        children: [
          {
            index: true,
            element: <PreOrder />
          },
          {
            path: 'add',
            element: <AddPreOrder />
          },
          {
            path: ':id',
            element: <PreOrderDetailById />
          }
        ]
      },
      {
        path: routesConfig[Routes.FLASH_SALE].path.replace('/dashboard/', ''),
        children: [
          {
            index: true,
            element: <FlashSale />
          },
          {
            path: 'add',
            element: <AddFlashSale />
          },
          {
            path: ':id',
            element: <FlashSaleDetailsById />
          }
        ]
      },
      {
        path: routesConfig[Routes.CATEGORY].path.replace('/dashboard/', ''),
        children: [
          {
            index: true,
            element: <Category />
          },
          { path: 'add', element: <AddCategory /> },
          {
            path: ':id',
            element: <CategoryDetailById />
          }
        ]
      },
      {
        path: routesConfig[Routes.CONSULTANT_SERVICE].path.replace('/dashboard/', ''),
        children: [
          {
            index: true,
            element: <ConsultantService />
          },
          { path: 'add', element: <AddConsultantService /> },
          {
            path: ':id',
            element: <ConsultantServiceDetailById />
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
        children: [
          {
            index: true,
            element: <ProductList />
          },
          {
            path: 'add',
            element: <CreateProduct />
          },
          {
            path: ':id',
            element: <ProductDetails />
          },
          {
            path: 'update/:id',
            element: <UpdateProduct />
          }
        ]
      },
      {
        path: routesConfig[Routes.SELECT_INTERVIEW_SLOT].path.replace('/dashboard/', ''),
        element: <ScheduleMeeting />
      },

      {
        path: routesConfig[Routes.SCHEDULE_BOOKING].path.replace('/dashboard/', ''),
        element: <ScheduleBooking />
      },
      {
        path: routesConfig[Routes.GROUP_PRODUCT].path.replace('/dashboard/', ''),
        children: [
          {
            index: true,
            element: <GroupProduct />
          },
          {
            path: 'add',
            element: <AddGroupProduct />
          },
          {
            path: ':id',
            element: <GroupProductDetailById />
          }
        ]
      },
      {
        path: routesConfig[Routes.ORDER_LIST].path.replace('/dashboard/', ''),
        children: [
          {
            index: true,
            element: <OrderList />
          },
          { path: ':id', element: <OrderDetails /> }
        ]
      },
      {
        path: routesConfig[Routes.SYSTEM_SERVICE_LIST].path.replace('/dashboard/', ''),

        children: [
          {
            index: true,
            element: <SystemService />
          },
          { path: ':id', element: <SystemServiceDetail /> },
          { path: 'add', element: <CreateSystemService /> },
          { path: 'update/:id', element: <UpdateSystemService /> }
        ]
      },
      {
        path: '*',
        element: <RedirectToMainDashboard />
      }
    ]
  }
]
