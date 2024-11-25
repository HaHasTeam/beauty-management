import { TRoute } from '@/types/route'

export type TRoutes = Record<string, TRoute>

export enum Routes {
  AUTH_LOGIN = 'auth-login',
  AUTH_EMAIL_VERIFICATION = 'auth-email-verification',
  DASHBOARD_HOME = 'dashboard-home',
  REQUESTS_QUEUE = 'requests-queue',
  MERCHANTS_DIRECTORY = 'merchants-directory',
  SERVICES_CATALOG = 'services-catalog',
  PROFILE_SETTINGS = 'profile-settings',
  ACCOUNTS_DIRECTORY = 'accounts-directory',
  AUTH_SIGN_UP = 'auth-sign-up',
  PRODUCT_LIST = 'product-list',
  CREATE_PRODUCT = 'create-product',
  UPDATE_PRODUCT = 'update-product'
}

export const routesConfig: TRoutes = {
  [Routes.AUTH_LOGIN]: {
    name: 'Login to Allure',
    title: 'Login to Allure',
    description: 'Login to your Allure account to access the dashboard',
    path: '/auth/signin/password-signin',
    getPath: (params) => '/auth/signin/password-signin' + (params ? '?' + new URLSearchParams(params).toString() : '')
  },
  [Routes.AUTH_SIGN_UP]: {
    name: 'Sign Up to Allure',
    title: 'Sign Up to Allure',
    description: 'Sign Up to your Allure account to access the dashboard',
    path: '/auth/signup',
    getPath: (params) => '/auth/signup' + (params ? '?' + new URLSearchParams(params).toString() : '')
  },
  [Routes.AUTH_EMAIL_VERIFICATION]: {
    name: 'Email Verification',
    title: 'Email Verification',
    description: 'Verify your email address to access the dashboard',
    path: '/auth/email-verification',
    getPath: (params) => {
      return `/auth/email-verification` + (params ? '?' + new URLSearchParams(params).toString() : '')
    }
  },
  [Routes.DASHBOARD_HOME]: {
    name: 'Main Dashboard',
    title: 'Main Dashboard',
    description: 'Access the main dashboard to configure your business',
    path: '/dashboard/home',
    getPath: () => '/dashboard/home'
  },
  [Routes.REQUESTS_QUEUE]: {
    name: 'Requests Queue',
    title: 'Requests Queue',
    description: 'View and manage requests queue',
    path: '/dashboard/requests-queue',
    getPath: () => '/dashboard/requests-queue'
  },
  [Routes.MERCHANTS_DIRECTORY]: {
    name: 'Merchants Directory',
    title: 'Merchants Directory',
    description: 'Browse the merchants directory',
    path: '/dashboard/merchants-directory',
    getPath: () => '/dashboard/merchants-directory'
  },
  [Routes.ACCOUNTS_DIRECTORY]: {
    name: 'Accounts Directory ',
    title: 'Accounts Directory',
    description: 'Browse the accounts directory',
    path: '/dashboard/accounts-directory',
    getPath: () => '/dashboard/accounts-directory'
  },
  [Routes.SERVICES_CATALOG]: {
    name: 'Services Catalog',
    title: 'Services Catalog',
    description: 'Explore the services catalog',
    path: '/dashboard/services-catalog',
    getPath: () => '/dashboard/services-catalog'
  },
  [Routes.PROFILE_SETTINGS]: {
    name: 'Profile Settings',
    title: 'Profile Settings',
    description: 'Manage your profile settings',
    path: '/dashboard/profile-settings',
    getPath: () => '/dashboard/profile-settings'
  },
  [Routes.PRODUCT_LIST]: {
    name: 'Product List',
    title: 'Product List',
    description: 'Manage your beauty products',
    path: '/dashboard/products/list',
    getPath: () => '/dashboard/products/list'
  },
  [Routes.CREATE_PRODUCT]: {
    name: 'Create Product',
    title: 'Create Product',
    description: 'Create a new beauty product',
    path: '/dashboard/products/create',
    getPath: () => '/dashboard/products/create'
  },
  [Routes.UPDATE_PRODUCT]: {
    name: 'Update Product',
    title: 'Update Product',
    description: 'Update beauty product',
    path: '/dashboard/products/update',
    getPath: () => '/dashboard/products/update'
  }
}
