import { TRoute } from '@/types/route'

export type TRoutes = Record<string, TRoute>

export enum Routes {
  AUTH_LOGIN = 'auth-login',
  AUTH_EMAIL_VERIFICATION = 'auth-email-verification',
  DASHBOARD_HOME = 'dashboard-home',
  REQUESTS_QUEUE = 'requests-queue',
  MERCHANTS_DIRECTORY = 'merchants-management',
  SERVICES_CATALOG = 'services-catalog',
  PROFILE_SETTINGS = 'profile-settings',
  MASTER_CONFIG_DETAILS = 'master-configs',
  UPDATE_MASTER_CONFIG = 'update/master-configs',
  ACCOUNTS_DIRECTORY = 'accounts-management',
  ACCOUNT_DETAILS = 'account-details',
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
  ORDER_PARENT_DETAIL = 'order-origin-details',
  ORDER_LIST = 'order-list',
  ORDER_PARENT_LIST = 'order-list/origin',
  SYSTEM_SERVICE_LIST = 'system-services',
  SYSTEM_SERVICE_DETAILS = 'system-services-details',
  CREATE_SYSTEM_SERVICE = 'system-services/create',
  UPDATE_SYSTEM_SERVICE = 'system-services/update',
  SELECT_INTERVIEW_SLOT = 'select-interview',
  SCHEDULE_BOOKING = 'schedule-booking',
  CONSULTANT_SERVICE = 'consultant-service',
  ADD_CONSULTANT_SERVICE = 'add-consultant-service',
  CONSULTANT_SERVICE_DETAILS = 'consultant-service-details',
  WORKING_TIME = 'working-time',
  REPORTS = 'reports',
  BOOKING_LIST = 'bookings',
  BOOKING_DETAIL = 'bookings-details',
  BLOG = 'blogs',
  CREATE_BLOG = 'add-blog',
  UPDATE_BLOG = 'update-blog',
  BLOG_DETAILS = 'blog-details',
  MY_BRAND_DASHBOARD = 'my-brand',
  LIVESTREAM = 'liveStream',
  LIVESTREAM_DETAILS = 'liveStream-details',
  TRANSACTION_MANAGEMENT = 'transaction-management',
  BOOKINGS_AND_REQUESTS = 'bookings-and-requests',
  BOOKING_DETAILS = 'booking-details',
  ORIGINAL_ORDER_DETAILS = 'original-order-details',
  FORBIDDEN = 'forbidden',
  FORBIDDEN_PUBLIC = 'forbidden-public',
  ADD_LIVESTREAM = 'add-liveStream',
  GROUP_BUYING = 'group-buying',
  GROUP_BUYING_DETAILS = 'group-buying-details',
  ADD_GROUP_BUYING = 'add-group-buying'
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
  [Routes.MY_BRAND_DASHBOARD]: {
    name: 'My Brand',
    title: 'My Brand',
    description: 'My Brand',
    path: '/dashboard/my-brand',
    getPath: () => '/dashboard/my-brand'
  },
  [Routes.TRANSACTION_MANAGEMENT]: {
    name: 'Transaction & Withdrawal',
    title: 'Transaction & Withdrawal',
    description: 'Manage transactions and withdrawal requests',
    path: '/dashboard/transactions',
    getPath: () => '/dashboard/transactions'
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
    path: '/dashboard/schedule-booking',
    getPath: () => `/dashboard/schedule-booking`
  },
  [Routes.SELECT_INTERVIEW_SLOT]: {
    name: 'Schedule Meeting',
    title: 'Schedule Meeting',
    description: 'Schedule Meeting',
    path: '/dashboard/select-interview',
    getPath: () => '/dashboard/select-interview'
  },
  [Routes.VOUCHER]: {
    name: 'Vouchers',
    title: 'Vouchers',
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
    name: 'PreOrder Products',
    title: 'PreOrder Products',
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
  [Routes.BOOKING_DETAIL]: {
    name: 'Booking Details',
    title: 'Booking Details',
    description: 'View and manage booking details',
    path: '/dashboard/bookings/:id',
    getPath: (params) => `/dashboard/bookings/${params.id}`
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
  [Routes.ACCOUNT_DETAILS]: {
    name: 'Account Details',
    title: 'Account Details',
    description: 'View account details',
    path: '/dashboard/accounts/[id]',
    getPath: (params) => `/dashboard/accounts/${params.id}`
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
    name: 'Products',
    title: 'Products',
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
  [Routes.UPDATE_MASTER_CONFIG]: {
    name: 'Update Master Config',
    title: 'Update Master Config',
    description: 'Update master config',
    path: '/dashboard/master-config/update/',
    getPath: () => `/dashboard/master-config/update`
  },
  [Routes.MASTER_CONFIG_DETAILS]: {
    name: 'Master Config',
    title: 'Master Config',
    description: 'Master config',
    path: '/dashboard/master-config/',
    getPath: () => `/dashboard/master-config`
  },
  [Routes.BLOG]: {
    name: 'Blog Management',
    title: 'Blog Management',
    description: 'Manage your website blog',
    path: '/dashboard/blogs',
    getPath: () => '/dashboard/blogs'
  },
  [Routes.CREATE_BLOG]: {
    name: 'Create Blog',
    title: 'Create Blog',
    description: 'Create a new blog',
    path: '/dashboard/blogs/add',
    getPath: () => '/dashboard/blogs/add'
  },
  [Routes.UPDATE_BLOG]: {
    name: 'Update Blog',
    title: 'Update Blog',
    description: 'Update blog',
    path: '/dashboard/blogs/update/:id',
    getPath: (params) => `/dashboard/blogs/update/${params.id}`
  },
  [Routes.BLOG_DETAILS]: {
    name: 'Blog Details',
    title: 'Blog Details',
    description: 'Blog',
    path: '/dashboard/blogs/:id',
    getPath: (params) => `/dashboard/blogs/${params.id}`
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
    name: 'Orders & Requests',
    title: 'Orders & Requests',
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
  [Routes.ORDER_PARENT_LIST]: {
    name: 'Orders & Requests',
    title: 'Orders & Requests',
    description: 'Order List',
    path: '/dashboard/orders/origin',
    getPath: () => '/dashboard/orders/origin'
  },
  [Routes.ORDER_PARENT_DETAIL]: {
    name: 'Order Details',
    title: 'Order Details',
    description: 'Beauty order',
    path: '/dashboard/orders/origin/:id',
    getPath: (params) => `/dashboard/orders/origin/${params.id}`
  },
  [Routes.SYSTEM_SERVICE_LIST]: {
    name: 'System Services',
    title: 'System Services',
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
    name: 'Consultant Services',
    title: 'Consultant Services',
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
  [Routes.WORKING_TIME]: {
    name: 'Working Time',
    title: 'Working Time',
    description: 'Working Time',
    path: '/dashboard/working-time',
    getPath: () => '/dashboard/working-time'
  },
  [Routes.REPORTS]: {
    name: 'Reports',
    title: 'Reports',
    description: 'Reports',
    path: '/dashboard/reports',
    getPath: () => '/dashboard/reports'
  },
  [Routes.BOOKINGS_AND_REQUESTS]: {
    name: 'Bookings & Requests',
    title: 'Bookings & Requests',
    description: 'Manage bookings and requests',
    path: '/dashboard/bookings',
    getPath: () => '/dashboard/bookings'
  },
  [Routes.BOOKING_DETAILS]: {
    name: 'Booking Details',
    title: 'Booking Details',
    description: 'Booking Details',
    path: '/dashboard/bookings/:id',
    getPath: (params) => `/dashboard/bookings/${params.id}`
  },
  [Routes.ORIGINAL_ORDER_DETAILS]: {
    name: 'Original Order Details',
    title: 'Original Order Details',
    description: 'Original Order Details',
    path: '/dashboard/orders/origin/:id',
    getPath: (params) => `/dashboard/orders/origin/${params.id}`
  },
  [Routes.BOOKING_LIST]: {
    name: 'Booking List',
    title: 'Booking List',
    description: 'Booking List',
    path: '/dashboard/bookings',
    getPath: () => '/dashboard/bookings'
  },
  [Routes.FORBIDDEN]: {
    name: 'Access Denied',
    title: 'Access Denied',
    description: 'You do not have permission to access this page',
    path: '/dashboard/forbidden',
    getPath: () => '/dashboard/forbidden'
  },
  [Routes.FORBIDDEN_PUBLIC]: {
    name: 'Access Denied',
    title: 'Access Denied',
    description: 'You do not have permission to access this resource',
    path: '/forbidden',
    getPath: () => '/forbidden'
  },
  [Routes.LIVESTREAM]: {
    name: 'Livestream',
    title: 'Livestream',
    description: 'Livestream',
    path: '/dashboard/livestream',
    getPath: () => '/dashboard/livestream'
  },
  [Routes.ADD_LIVESTREAM]: {
    name: 'Add Livestream',
    title: 'Add Livestream',
    description: 'Add Livestream',
    path: '/dashboard/livestream/add',
    getPath: () => '/dashboard/livestream/add'
  },
  [Routes.LIVESTREAM_DETAILS]: {
    name: 'Livestream Details',
    title: 'Livestream Details',
    description: 'Livestream Details',
    path: '/dashboard/livestream/:id',
    getPath: (params) => `/dashboard/livestream/${params.id}`
  },
  [Routes.GROUP_BUYING]: {
    name: 'Group Buying',
    title: 'Group Buying',
    description: 'Group Buying',
    path: '/dashboard/group-buying',
    getPath: () => '/dashboard/group-buying'
  },
  [Routes.GROUP_BUYING_DETAILS]: {
    name: 'Group Buying Details',
    title: 'Group Buying Details',
    description: 'Group Buying Details',
    path: '/dashboard/group-buying/:id',
    getPath: (params) => `/dashboard/group-buying/${params.id}`
  }
}

export const externalLinks = import.meta.env.VITE_API_CUSTOMER_URL || ''

export const blogSlugEnum = {
  privacyPolicy: 'chinh-sach-quyen-rieng-tu',
  termsAndConditions: 'dieu-khoan-va-dieu-kien-su-dung-dich-vu',
  returnCondition: 'chinh-sach-tra-hang-hoan-tien',
  kolAndLivestreamPrivacy: 'chinh-sach-livestream-kol',
  platformPrivacy: 'chinh-sach-cua-nen-tang',
  consultantPolicy: 'chinh-sach-danh-cho-chuyen-gia-tu-van',
  brandPolicy: 'chinh-sach-danh-cho-thuong-hieu',
  voucherPolicy: 'chinh-sach-ma-giam-gia',
  groupBuyingPolicy: 'chinh-sach-mua-chung',
  preOrderPolicy: 'chinh-sach-dat-truoc',
  flashSalePolicy: 'chinh-sach-flash-sale',
  cashFlowWithdrawalPolicy: 'chinh-sach-dong-tien-rut-tien',
  whyBuyAuthenticBeautyProducts: 'tai-sao-nen-mua-my-pham-chinh-hang-tren-allure',
  beginnerSkincareGuide: 'skincare-routine-co-ban-cho-nguoi-moi-bat-dau-don-gian-nhung-hieu-qua',
  commonMistakesBuyingCosmeticsOnline: 'nhung-loi-thuong-gap-khi-mua-my-pham-online',
  dealHuntingTips: 'cach-san-deal-hieu-qua-tren-allure',
  beautyReason: 'nhung-ly-do-tai-sao-allure-la-lua-chon-toi-uu-cho-nhung-nguoi-yeu-thich-lam-dep'
}
