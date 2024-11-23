const routes = {
  home: '/',
  auth: '/auth/*',
  dashboard: '/dashboard',
  dashboardHome: '/dashboard/home',
  requestsQueue: '/dashboard/requests-queue',
  merchantsDirectory: '/dashboard/merchants-directory',
  servicesCatalog: '/dashboard/services-catalog',
  profileSettings: '/dashboard/profile-settings',
  productManagement: '/dashboard/product-management',
  createProduct: '/dashboard/product-management/create-product',
  updateProduct: '/dashboard/product-management/update-product',
  notFound: '*'
}

export default routes
