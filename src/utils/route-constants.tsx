import { Donation, PaymentIcon, Groceries } from '../assets/images';
import {
  ActiveGroceries,
  ActiveHome,
  InActiveHome,
  ActiveDonations,
  ActivePayment,
  ActiveProfile,
  ActiveTransaction,
  InActiveDonations,
  InActiveGroceries,
  InActivePayment,
  InActiveProfile,
  InActiveTransaction,
  ActiveOrders,
  InActiveOrders,
} from '../components/svgs/dashboard/nav-menu';

export const ROUTES = {
  partnersProgram: 'https://vendor.sendsile.com/',
  groceriesPage: '/groceries',
  payBills: '/pay-bills',
  contactUs: '/',
  donation: '/',
  partnerProgram: '/',
  forgotPassword: '/forgot-password',
  signUp: '/sign-up',
  emailVerification: '/email-verification/:token/:id',
  login: '/login',
  searchName: '/search',
  search: '/search/:id',
  detailName: '/quick-view',
  detailsPage: '/quick-view/:id',
  checkout: '/checkout',
  privacy: '/privacy-policy',
  termsOfService: '/terms-of-service',
  cookies: '/cookies',

  ramadanPackages: '/ramadan-packages',
  customRamadanPackage: '/custom-ramadan-package',

  //dashboard paths
  dashboard: '/dashboard',
  dashboardOrders: '/dashboard/orders',
  dashboardGroceriesName: '/dashboard/groceries',
  dashboardDetailPage: '/dashboard/product/:id',
  dashboardDetailPageName: '/dashboard/product',
  dashboardBillPayment: '/dashboard/bill-payment',
  dashboardDonations: '/dashboard/donations',
  dashboardRecentDonations: '/dashboard/donations/recent-donations',
  dashboardTransactions: '/dashboard/transactions',
  singleTransaction: '/transactions/:id',
  singleTransactionName: '/transactions',
  dashboardProfile: '/dashboard/profile',
};

export const navRoutes = [
  {
    path: '',
    text: 'Groceries',
    icon: Groceries,
  },
  {
    path: ROUTES.payBills,
    text: 'Bill payment',
    icon: PaymentIcon,
  },
  {
    path: ROUTES.dashboardDonations,
    text: 'Donation',
    icon: Donation,
  },
  // {
  //   path: "",
  //   text: "Contact",
  //   icon: Donation,
  // },
  // {
  //   path: ROUTES.partnerProgram,
  //   text: "Partners program",
  // }
];

export const dashboardNavMenus = [
  {
    path: ROUTES.dashboard,
    iconActive: <ActiveHome />,
    iconInActive: <InActiveHome />,
    text: 'Home',
  },
  {
    path: ROUTES.dashboardOrders,
    iconActive: <ActiveOrders />,
    iconInActive: <InActiveOrders />,
    text: 'Orders',
  },
  {
    path: ROUTES.dashboardGroceriesName,
    iconActive: <ActiveGroceries />,
    iconInActive: <InActiveGroceries />,
    text: 'Groceries',
  },
  {
    path: ROUTES.dashboardBillPayment,
    iconActive: <ActivePayment />,
    iconInActive: <InActivePayment />,
    text: 'Bill payment',
  },
  {
    path: ROUTES.dashboardDonations,
    iconActive: <ActiveDonations />,
    iconInActive: <InActiveDonations />,
    text: 'Donations',
  },
  {
    path: ROUTES.dashboardTransactions,
    iconActive: <ActiveTransaction />,
    iconInActive: <InActiveTransaction />,
    text: 'Transactions',
  },
  {
    path: ROUTES.dashboardProfile,
    iconActive: <ActiveProfile />,
    iconInActive: <InActiveProfile />,
    text: 'Profile',
  },
];
