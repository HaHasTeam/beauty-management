import { RouteObject } from 'react-router-dom'

import Layout from '@/components/layout'
import { Routes, routesConfig } from '@/configs/routes'
import DashboardHome from '@/views/dashboard'
import AccountsDirectory from '@/views/dashboard/accounts-directory'
import AccountDetails from '@/views/dashboard/accounts-directory/account-details'
import BlogManagement from '@/views/dashboard/blog-management'
import BlogDetails from '@/views/dashboard/blog-management/BlogDetails'
import CreateBlog from '@/views/dashboard/blog-management/CreateBlog'
import UpdateBlog from '@/views/dashboard/blog-management/UpdateBlog'
import BookingManagement from '@/views/dashboard/booking-management'
import Brands from '@/views/dashboard/brand-management'
import BookingDetail from '@/views/dashboard/brand-management/booking-detail'
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
import Forbidden403 from '@/views/dashboard/forbidden'
import GroupBuy from '@/views/dashboard/group-buying'
import GroupBuyDetailById from '@/views/dashboard/group-buying/[id]'
import GroupProduct from '@/views/dashboard/group-product'
import GroupProductDetailById from '@/views/dashboard/group-product/[id]'
import AddGroupProduct from '@/views/dashboard/group-product/AddGroupProduct'
import Livestream from '@/views/dashboard/live-stream'
import LivestreamDetail from '@/views/dashboard/live-stream/[id]'
import MasterConfig from '@/views/dashboard/master-config'
import MyBrandDashBoard from '@/views/dashboard/my-brand-dashboard'
import OrderList from '@/views/dashboard/order-management'
import OrderParentDetail from '@/views/dashboard/order-management/order-parent-detail'
import OrderDetails from '@/views/dashboard/order-management/OrderDetails'
import { RedirectToMainDashboard } from '@/views/dashboard/others'
import PreOrder from '@/views/dashboard/pre-order'
import PreOrderDetailById from '@/views/dashboard/pre-order/[id]'
import AddPreOrder from '@/views/dashboard/pre-order/AddPreOrder'
import ProductList from '@/views/dashboard/product-list'
import ProductDetails from '@/views/dashboard/product-list/ProductDetails'
import ProfileSettings from '@/views/dashboard/profile-settings'
import Reports from '@/views/dashboard/report'
import RequestsQueue from '@/views/dashboard/requests-queue'
import ScheduleBooking from '@/views/dashboard/schedule-booking'
import ScheduleMeeting from '@/views/dashboard/schedule-meeting'
import ServicesCatalog from '@/views/dashboard/service-catalog'
import SystemService from '@/views/dashboard/system-service'
import CreateSystemService from '@/views/dashboard/system-service/CreateSystemService'
import SystemServiceDetail from '@/views/dashboard/system-service/SystemServiceDetail'
import UpdateSystemService from '@/views/dashboard/system-service/UpdateSystemService'
import TransactionManagement from '@/views/dashboard/transaction-management'
import UpdateProduct from '@/views/dashboard/update-product'
import Vouchers from '@/views/dashboard/voucher-management'
import ViewVoucherDetail from '@/views/dashboard/voucher-management/ViewVoucherDetail'
import VoucherDetailPage from '@/views/dashboard/voucher-management/VoucherDetailPage'
import WorkingTime from '@/views/dashboard/working-time'

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
        path: routesConfig[Routes.DASHBOARD_HOME].path.replace('/dashboard/', ''),
        element: <DashboardHome />
      },
      {
        path: routesConfig[Routes.BOOKINGS_AND_REQUESTS].path.replace('/dashboard/', ''),
        element: <BookingManagement />
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
            path: ':id',
            element: <VoucherDetailPage />
          },
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
        path: routesConfig[Routes.BLOG].path.replace('/dashboard/', ''),
        children: [
          {
            index: true,
            element: <BlogManagement />
          },
          { path: 'add', element: <CreateBlog /> },
          {
            path: ':id',
            element: <BlogDetails />
          },
          {
            path: 'update/:id',
            element: <UpdateBlog />
          }
        ]
      },
      {
        path: routesConfig[Routes.BOOKING_LIST].path.replace('/dashboard/', ''),
        children: [
          {
            path: ':id',
            element: <BookingDetail />
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
        path: routesConfig[Routes.MY_BRAND_DASHBOARD].path.replace('/dashboard/', ''),
        element: <MyBrandDashBoard />
      },
      {
        path: routesConfig[Routes.TRANSACTION_MANAGEMENT].path.replace('/dashboard/', ''),
        element: <TransactionManagement />
      },
      {
        path: routesConfig[Routes.ACCOUNTS_DIRECTORY].path.replace('/dashboard/', ''),
        children: [
          {
            index: true,
            element: <AccountsDirectory />
          },
          {
            path: ':id',
            element: <AccountDetails />
          }
        ]
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
        path: routesConfig[Routes.MASTER_CONFIG_DETAILS].path.replace('/dashboard/', ''),
        element: <MasterConfig />
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
        path: routesConfig[Routes.WORKING_TIME].path.replace('/dashboard/', ''),
        element: <WorkingTime />
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
        path: routesConfig[Routes.ORDER_PARENT_LIST].path.replace('/dashboard/', ''),
        children: [
          {
            index: true,
            element: <OrderList />
          },
          { path: ':id', element: <OrderParentDetail /> }
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
        path: routesConfig[Routes.LIVESTREAM].path.replace('/dashboard/', ''),
        children: [
          {
            index: true,
            element: <Livestream />
          },
          {
            path: ':id',
            element: <LivestreamDetail />
          }
        ]
      },
      {
        path: routesConfig[Routes.REPORTS].path.replace('/dashboard/', ''),
        children: [
          {
            index: true,
            element: <Reports />
          }
        ]
      },
      {
        path: routesConfig[Routes.GROUP_BUYING].path.replace('/dashboard/', ''),
        children: [
          {
            index: true,
            element: <GroupBuy />
          },
          {
            path: ':id',
            element: <GroupBuyDetailById />
          }
        ]
      },
      {
        path: '*',
        element: <RedirectToMainDashboard />
      },
      {
        path: 'forbidden',
        element: <Forbidden403 />
      }
    ]
  }
]
