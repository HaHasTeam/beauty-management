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
  PRE_ORDER = 'pre-order',
  BRAND = 'brand',
  PRE_ORDER_DETAILS = 'pre-order-details',
  ADD_PRE_ORDER = 'add-pre-order',
  FLASH_SALE = 'flash-sale',
  ADD_FLASH_SALE = 'add-flash-sale',
  FLASH_SALE_DETAILS = 'flash-sale-details',
  PRODUCT_LIST = 'products',
  CREATE_PRODUCT = 'create-product',
  CATEGORY = 'category',
  ADD_CATEGORY = 'add-category',
  CATEGORY_DETAILS = 'category-details',
  UPDATE_PRODUCT = 'update-product',
  PRODUCT_DETAILS = 'product-details',
  REGISTER_BRAND = 'register-brand',
  ADD_BRAND = 'add-brand',
  UPDATE_BRAND = 'update-brand',
  VOUCHER = 'voucher',
  ADD_VOUCHER = 'add-voucher',
  UPDATE_VOUCHER = 'update-voucher',
  GROUP_PRODUCT = 'group-product',
  ADD_GROUP_PRODUCT = 'add-group-product',
  GROUP_PRODUCT_DETAILS = 'group-product-details',
  ORDER_DETAILS = 'order-details',
  ORDER_LIST = 'order-list',
  SYSTEM_SERVICE_LIST = 'system-services',
  SYSTEM_SERVICE_DETAILS = 'system-services-details',
  CREATE_SYSTEM_SERVICE = 'system-services/create',
  UPDATE_SYSTEM_SERVICE = 'system-services/update',
  SELECT_INTERVIEW_SLOT = 'select-interview',
  SCHEDULE_BOOKING = 'schedule-booking',
  CONSULTANT_SERVICE = 'consultant-service',
  ADD_CONSULTANT_SERVICE = 'add-consultant-service',
  CONSULTANT_SERVICE_DETAILS = 'consultant-service-details',
  REPORTS = 'reports',
  WORKING_TIME = 'working-time'
}

export const routesConfig: TRoutes = {
  [Routes.AUTH_LOGIN]: {
    name: 'Login to Allure',
    title: 'Login to Allure',
    description: 'Login to your Allure account to access the dashboard',
    path: '/auth/signin/password-signin',
    getPath: (params) => '/auth/signin/password-signin' + (params ? '?' + new URLSearchParams(params).toString() : '')
  },
  [Routes.REGISTER_BRAND]: {
    name: 'Register Brand',
    title: 'Register Brand',
    description: 'Register Brand',
    path: '/register',
    getPath: () => `/register`
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
  [Routes.BRAND]: {
    name: 'Brand Management',
    title: 'Brand Management',
    description: 'Brand Management',
    path: '/dashboard/brand',
    getPath: () => '/dashboard/brand'
  },
  [Routes.ADD_BRAND]: {
    name: 'Add Brand',
    title: 'Add Brand',
    description: 'Add Brand',
    path: '/dashboard/brand/create-Brand',
    getPath: () => '/dashboard/brand/create-Brand'
  },
  [Routes.UPDATE_BRAND]: {
    name: 'Update Brand',
    title: 'Update Brand',
    description: 'Update Brand',
    path: '/dashboard/brand/update/[id]',
    getPath: (id) => `/dashboard/brand/update/${id}`
  },
  [Routes.SCHEDULE_BOOKING]: {
    name: 'Schedule Booking',
    title: 'Schedule Booking',
    description: 'Schedule',
    path: '/dashboard/Schedule',
    getPath: () => `/dashboard/Schedule`
  },
  [Routes.SELECT_INTERVIEW_SLOT]: {
    name: 'Schedule Meeting',
    title: 'Schedule Meeting',
    description: 'Schedule Meeting',
    path: '/dashboard/select-interview',
    getPath: () => '/dashboard/select-interview'
  },
  [Routes.VOUCHER]: {
    name: 'Voucher Management',
    title: 'Voucher Management',
    description: 'Voucher Management',
    path: '/dashboard/voucher',
    getPath: () => '/dashboard/voucher'
  },
  [Routes.ADD_VOUCHER]: {
    name: 'Add Voucher',
    title: 'Add Voucher',
    description: 'Add Voucher',
    path: '/dashboard/voucher/create-voucher',
    getPath: () => '/dashboard/voucher/create-voucher'
  },
  [Routes.UPDATE_VOUCHER]: {
    name: 'Update Voucher',
    title: 'Update Voucher',
    description: 'Update Voucher',
    path: '/dashboard/voucher/update/[id]',
    getPath: (id) => `/dashboard/voucher/update/${id}`
  },
  [Routes.PRE_ORDER]: {
    name: 'Pre-order Product',
    title: 'Pre-order Product',
    description: 'Pre Order',
    path: '/dashboard/pre-order',
    getPath: () => '/dashboard/pre-order'
  },
  [Routes.PRE_ORDER_DETAILS]: {
    name: 'Pre Order Details',
    title: 'Pre Order Details',
    description: 'Pre Order Details',
    path: '/dashboard/pre-order/[id]',
    getPath: (params) => `/dashboard/pre-order/${params.id}`
  },
  [Routes.ADD_PRE_ORDER]: {
    name: 'Add Pre-order',
    title: 'Add Pre-order',
    description: 'Add Pre Order',
    path: '/dashboard/pre-order/add',
    getPath: () => '/dashboard/pre-order/add'
  },
  [Routes.FLASH_SALE]: {
    name: 'Flash Sale Product',
    title: 'Flash Sale',
    description: 'Flash Sale',
    path: '/dashboard/flash-sale',
    getPath: () => '/dashboard/flash-sale'
  },
  [Routes.FLASH_SALE_DETAILS]: {
    name: 'Flash Sale Details',
    title: 'Flash Sale Details',
    description: 'Flash Sale Details',
    path: '/dashboard/flash-sale/[id]',
    getPath: (params) => `/dashboard/flash-sale/${params.id}`
  },
  [Routes.ADD_FLASH_SALE]: {
    name: 'Add Flash Sale',
    title: 'Add Flash Sale',
    description: 'Add Flash Sale',
    path: '/dashboard/flash-sale/add',
    getPath: () => '/dashboard/flash-sale/add'
  },
  [Routes.DASHBOARD_HOME]: {
    name: 'Main Dashboard',
    title: 'Main Dashboard',
    description: 'Access the main dashboard to configure your business',
    path: '/dashboard/home',
    getPath: () => '/dashboard/home'
  },
  [Routes.CATEGORY]: {
    name: 'Category',
    title: 'Category',
    description: 'Manage your product categories',
    path: '/dashboard/category',
    getPath: () => '/dashboard/category'
  },
  [Routes.ADD_CATEGORY]: {
    name: 'Add Category',
    title: 'Add Category',
    description: 'Add a new product category',
    path: '/dashboard/category/add',
    getPath: () => '/dashboard/category/add'
  },
  [Routes.CATEGORY_DETAILS]: {
    name: 'Category Details',
    title: 'Category Details',
    description: 'View and manage category details',
    path: '/dashboard/category/[id]',
    getPath: (params) => `/dashboard/category/${params.id}`
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
    name: 'Accounts ',
    title: 'Accounts',
    description: 'Browse the accounts',
    path: '/dashboard/accounts',
    getPath: () => '/dashboard/accounts'
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
    path: '/dashboard/products',
    getPath: () => '/dashboard/products'
  },
  [Routes.CREATE_PRODUCT]: {
    name: 'Create Product',
    title: 'Create Product',
    description: 'Create a new beauty product',
    path: '/dashboard/products/add',
    getPath: () => '/dashboard/products/add'
  },
  [Routes.UPDATE_PRODUCT]: {
    name: 'Update Product',
    title: 'Update Product',
    description: 'Update beauty product',
    path: '/dashboard/products/update/:id',
    getPath: (params) => `/dashboard/products/update/${params.id}`
  },
  [Routes.PRODUCT_DETAILS]: {
    name: 'Product Details',
    title: 'Product Details',
    description: 'Beauty product',
    path: '/dashboard/products/:id',
    getPath: (params) => `/dashboard/products/${params.id}`
  },
  [Routes.GROUP_PRODUCT]: {
    name: 'Group Product',
    title: 'Group Product',
    description: 'Manage your beauty products',
    path: '/dashboard/group-product',
    getPath: () => '/dashboard/group-product'
  },
  [Routes.ADD_GROUP_PRODUCT]: {
    name: 'Add Group Product',
    title: 'Add Group Product',
    description: 'Add a new beauty product',
    path: '/dashboard/group-product/add',
    getPath: () => '/dashboard/group-product/add'
  },
  [Routes.GROUP_PRODUCT_DETAILS]: {
    name: 'Group Product Details',
    title: 'Group Product Details',
    description: 'View and manage group product details',
    path: '/dashboard/group-product/[id]',
    getPath: (params) => `/dashboard/group-product/${params.id}`
  },
  [Routes.ORDER_LIST]: {
    name: 'Order List',
    title: 'Order List',
    description: 'Order List',
    path: '/dashboard/orders',
    getPath: () => '/dashboard/orders'
  },
  [Routes.ORDER_DETAILS]: {
    name: 'Order Details',
    title: 'Order Details',
    description: 'Beauty order',
    path: '/dashboard/orders/:id',
    getPath: (params) => `/dashboard/orders/${params.id}`
  },
  [Routes.SYSTEM_SERVICE_LIST]: {
    name: 'System Service List',
    title: 'System Service List',
    description: 'System Service List',
    path: '/dashboard/system-services',
    getPath: () => '/dashboard/system-services'
  },
  [Routes.SYSTEM_SERVICE_DETAILS]: {
    name: 'System Service Details',
    title: 'System Service Details',
    description: 'System Service Details',
    path: '/dashboard/system-services/:id',
    getPath: (params) => `/dashboard/system-services/${params.id}`
  },
  [Routes.CREATE_SYSTEM_SERVICE]: {
    name: 'Create System Service',
    title: 'Create System Service',
    description: 'Create a system service',
    path: '/dashboard/system-services/add',
    getPath: () => '/dashboard/system-services/add'
  },
  [Routes.UPDATE_SYSTEM_SERVICE]: {
    name: 'Update System Service',
    title: 'Update System Service',
    description: 'Update system service',
    path: '/dashboard/system-services/update/:id',
    getPath: (params) => `/dashboard/system-services/update/${params.id}`
  },
  [Routes.CONSULTANT_SERVICE]: {
    name: 'Consultant Service',
    title: 'Consultant Service',
    description: 'Consultant Service',
    path: '/dashboard/consultant-service',
    getPath: () => '/dashboard/consultant-service'
  },
  [Routes.ADD_CONSULTANT_SERVICE]: {
    name: 'Add Consultant Service',
    title: 'Add Consultant Service',
    description: 'Add Consultant Service',
    path: '/dashboard/consultant-service/add',
    getPath: () => '/dashboard/consultant-service/add'
  },
  [Routes.CONSULTANT_SERVICE_DETAILS]: {
    name: 'Consultant Service Details',
    title: 'Consultant Service Details',
    description: 'Consultant Service Details',
    path: '/dashboard/consultant-service/:id',
    getPath: (params) => `/dashboard/consultant-service/${params.id}`
  },
  [Routes.REPORTS]: {
    name: 'Reports',
    title: 'Reports',
    description: 'Reports',
    path: '/dashboard/reports',
    getPath: () => '/dashboard/reports'
  },
  [Routes.WORKING_TIME]: {
    name: 'Working Time',
    title: 'Working Time',
    description: 'Manage your working time slots',
    path: '/dashboard/working-time',
    getPath: () => '/dashboard/working-time'
  }
}
