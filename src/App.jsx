import {
  Route,
  RouterProvider,
  createBrowserRouter,
  createRoutesFromElements,
} from 'react-router-dom';
import Layout from './components/Layout';
import ErrorPage from './pages/ErrorPage';
import NotFoundPage from './pages/NotFoundPage';
import { lazy } from 'react';
import { ROUTE } from './routes';
import withSuspense from './components/WithSuspense';
import { SUPER_ADMIN_ROUTES } from './routes/superAdminRoutes';
import SuperAdminLayout from './components/superadmin/SuperAdminLayout';

// Lazy load the pages
// const Homepage = lazy(() => import("./pages/Homepage"));
const Login = lazy(() => import('./pages/auth/Login'));
const Dashboard = lazy(() => import('./pages/Dashboard'));
const AnalyticsPage = lazy(() => import('./pages/Dashboard/Analytics'));
const ForgotPassword = lazy(() => import('./pages/auth/ForgotPassword'));
const OrderManagementPage = lazy(() =>
  import('./pages/Dashboard/order-management')
);
const OrderDetailsPage = lazy(() =>
  import('./pages/Dashboard/order-management/OrderDetailsPage')
);
const InventoryPage = lazy(() => import('./pages/Dashboard/Inventory'));
const ProductDetailPage = lazy(() =>
  import('./pages/Dashboard/Inventory/ProductDetailPage')
);
const AddProductPage = lazy(() =>
  import('./pages/Dashboard/Inventory/AddProductPage.jsx')
);
const EditProductPage = lazy(() =>
  import('./pages/Dashboard/Inventory/EditProductPage')
);
const TransactionsPage = lazy(() => import('./pages/Dashboard/Transactions'));
const SettingsPage = lazy(() => import('./pages/Dashboard/Settings'));
const TwoFa = lazy(() => import('./pages/auth/TwoFA'));

// Super Admin Imports
const SuperAdminHome = lazy(() => import('./pages/SuperAdmin/SuperAdminHome'));
const PartnerManagement = lazy(() =>
  import('./pages/SuperAdmin/Partners/PartnerManagement')
);
const SuperAdminOrderManagement = lazy(() =>
  import('./pages/SuperAdmin/SuperAdminOrderManagement')
);
const SuperAdminCustomer = lazy(() =>
  import('./pages/SuperAdmin/Customer/SuperAdminCustomer')
);

const AddPartner = lazy(() =>
  import('./pages/SuperAdmin/Partners/AddPartners')
);

const PartnerDetail = lazy(() =>
  import('./pages/SuperAdmin/Partners/PartnerDetails')
);

const SuperAdminInventory = lazy(() =>
  import('./pages/SuperAdmin/Inventory/SuperAdminInventoryPage')
);
const SuperAdminTransaction = lazy(() =>
  import('./pages/SuperAdmin/Transaction/TransactionPage')
);

const SuperAdminAnalytics = lazy(() =>
  import('./pages/SuperAdmin/Analytics/SuperAdminAnalytics')
);

const SuperAdminCustomerDetail = lazy(() =>
  import('./pages/SuperAdmin/Customer/CustomerDetails')
);

const SuperAdminActivityLog = lazy(() =>
  import('./pages/SuperAdmin/Customer/ActivityLog')
);
const InventoryActivityLog = lazy(() =>
  import('./pages/SuperAdmin/Inventory/InventoryActivityLog')
);

function App() {
  const router = createBrowserRouter(
    createRoutesFromElements(
      <>
        <Route path="/" element={<Layout />} errorElement={<ErrorPage />}>
          <Route index element={withSuspense(Login)()} />
          <Route path={ROUTE.login} element={withSuspense(Login)()} />
          <Route
            path={ROUTE.forgotPassword}
            element={withSuspense(ForgotPassword)()}
          />
          <Route path={ROUTE.twofaPage} element={withSuspense(TwoFa)()} />
          <Route
            path={ROUTE.dashboardHome}
            element={withSuspense(Dashboard)()}
          />
          <Route
            path={ROUTE.analytics}
            element={withSuspense(AnalyticsPage)()}
          />
          <Route
            path={ROUTE.orderManagement}
            element={withSuspense(OrderManagementPage)()}
          />
          <Route
            path={ROUTE.eachOrderID}
            element={withSuspense(OrderDetailsPage)()}
          />
          <Route
            path={ROUTE.inventory}
            element={withSuspense(InventoryPage)()}
          />
          <Route
            path={ROUTE.addProduct}
            element={withSuspense(AddProductPage)()}
          />
          <Route
            path={ROUTE.eachProductID}
            element={withSuspense(ProductDetailPage)()}
          />
          <Route
            path={ROUTE.editEachProductID}
            element={withSuspense(EditProductPage)()}
          />

          <Route
            path={ROUTE.transactions}
            element={withSuspense(TransactionsPage)()}
          />
          <Route path={ROUTE.settings} element={withSuspense(SettingsPage)()} />
          <Route path="*" element={<NotFoundPage />} />
        </Route>
        {/* Super Admin Pages */}
        <Route
          path={SUPER_ADMIN_ROUTES.home}
          element={<SuperAdminLayout />}
          errorElement={<ErrorPage />}
        >
          <Route index element={withSuspense(SuperAdminHome)()} />
          <Route
            path={SUPER_ADMIN_ROUTES.login}
            element={withSuspense(Login)()}
          />
          <Route
            path={SUPER_ADMIN_ROUTES.dashboard}
            element={withSuspense(SuperAdminHome)()}
          />
          <Route
            path={SUPER_ADMIN_ROUTES.partnerManagement}
            element={withSuspense(PartnerManagement)()}
          />
          <Route
            path={SUPER_ADMIN_ROUTES.addPartner}
            element={withSuspense(AddPartner)()}
          />
          <Route
            path={SUPER_ADMIN_ROUTES.partnerDetailID}
            element={withSuspense(PartnerDetail)()}
          />
          <Route
            path={SUPER_ADMIN_ROUTES.orderManagement}
            element={withSuspense(SuperAdminOrderManagement)()}
          />
          <Route
            path={SUPER_ADMIN_ROUTES.eachOrderID}
            element={withSuspense(OrderDetailsPage)()}
          />
          <Route
            path={SUPER_ADMIN_ROUTES.customer}
            element={withSuspense(SuperAdminCustomer)()}
          />
          <Route
            path={SUPER_ADMIN_ROUTES.customerDetailsID}
            element={withSuspense(SuperAdminCustomerDetail)()}
          />
          <Route
            path={SUPER_ADMIN_ROUTES.customerActivityLogID}
            element={withSuspense(SuperAdminActivityLog)()}
          />
          <Route
            path={SUPER_ADMIN_ROUTES.inventory}
            element={withSuspense(SuperAdminInventory)()}
          />
          <Route
            path={SUPER_ADMIN_ROUTES.productActivityLogID}
            element={withSuspense(InventoryActivityLog)()}
          />
          <Route
            path={SUPER_ADMIN_ROUTES.addProduct}
            element={withSuspense(AddProductPage)()}
          />
          <Route
            path={SUPER_ADMIN_ROUTES.eachProductID}
            element={withSuspense(ProductDetailPage)()}
          />

          <Route
            path={SUPER_ADMIN_ROUTES.editEachProductID}
            element={withSuspense(EditProductPage)()}
          />
          <Route
            path={SUPER_ADMIN_ROUTES.transactions}
            element={withSuspense(SuperAdminTransaction)()}
          />
          <Route
            path={SUPER_ADMIN_ROUTES.analytics}
            element={withSuspense(SuperAdminAnalytics)()}
          />
          <Route
            path={SUPER_ADMIN_ROUTES.settings}
            element={withSuspense(SettingsPage)()}
          />
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </>
    )
  );

  return <RouterProvider router={router} />;
}

export default App;
