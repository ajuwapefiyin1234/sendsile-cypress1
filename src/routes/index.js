export const ROUTE = {
  // Auth routes
  login: '/login',
  register: '/register',
  forgotPassword: '/forgot-password',
  newPassword: '/new-password',
  twofaPage: '/2fa',

  // unprotected routes
  homePage: '/',

  // protected routes
  dashboard: '/dashboard',
  dashboardHome: '/dashboard/home',
  analytics: '/dashboard/analytics',
  orderManagement: '/dashboard/order-management',
  eachOrder: '/dashboard/order-management/',
  eachOrderID: '/dashboard/order-management/:id',
  inventory: '/dashboard/inventory',
  eachProduct: '/dashboard/inventory/',
  addProduct: '/dashboard/inventory/add',
  eachProductID: '/dashboard/inventory/:id',
  editEachProduct: '/dashboard/inventory/edit/',
  editEachProductID: '/dashboard/inventory/edit/:id',
  transactions: '/dashboard/transactions',
  settings: '/dashboard/settings',
};

export const protectedRoutes = [
  ROUTE.dashboard,
  ROUTE.dashboardHome,
  ROUTE.analytics,
  ROUTE.orderManagement,
  ROUTE.inventory,
  ROUTE.transactions,
  ROUTE.settings,
  ROUTE.eachOrder,
  ROUTE.eachOrderID,
  ROUTE.eachProduct,
  ROUTE.eachProductID,
  ROUTE.editEachProduct,
  ROUTE.editEachProductID,
  ROUTE.addProduct
];
