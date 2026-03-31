import { createBrowserRouter, createRoutesFromElements, Route } from 'react-router-dom';
import { Root } from '../components/layouts/root';
// import LandingPage from "../pages/(public)/landing-page";
// import NotFound from "../pages/(public)/not-found";
import { Auth } from '../components/layouts/auth';
import Login from '../pages/(public)/login';
import ForgotPassword from '../pages/(public)/forgot-password';
import SignUp from '../pages/(public)/sign-up';
import EmailVerification from '../pages/(public)/email-verification';
import { MainPageLayout } from '../components/layouts/main-layout';
import PayBills from '../pages/(public)/pay-bills';
import { DashboardLayout } from '../components/layouts/dashboard-layout';
import DashboardHome from '../pages/(protected)/dashboard/home';
import DashboardOrders from '../pages/(protected)/dashboard/orders';
import Groceries from '../pages/(protected)/dashboard/groceries';
import Payment from '../pages/(protected)/checkout';
import FarmProduce from '../pages/(public)/farm-produce';
import SearchPage from '../pages/(public)/search';
import Details from '../pages/(public)/details';
import { CheckoutLayout } from '../components/layouts/checkout-layout';
import TransactionStatus from '../pages/(protected)/dashboard/transaction-status';
import Donations from '../pages/(protected)/dashboard/donations';
import Transactions from '../pages/(protected)/dashboard/transactions';
import Profile from '../pages/(protected)/dashboard/profile';
import BillPayment from '../pages/(protected)/dashboard/bill-payment';
import { ROUTES } from '../utils/route-constants';
import DashboardDetailsPage from '../pages/(protected)/dashboard/details-page';
import PrivacyPolicy from '../pages/(public)/privacy-policy';
import TermsOfService from '../pages/(public)/terms-of-service';
import CookieNotice from '../pages/(public)/cookie-notice';
import { PrivateRoute } from '../components/auth/private-route';
import ErrorPage from '../pages/(public)/error';

import RamadanLandingPage from '../pages/(public)/ramadan-landing-page';
import RamadanPackages from '../pages/(public)/ramadan-packages';
import CustomRamadanPackage from '../pages/(public)/custom-ramadan-package';

import WaitlistPage from '../pages/(public)/waitlist';
import JoinWaitlist from '../pages/(public)/join-waitlist';
// import LandingPage from '../pages/(public)/landing-page';

export const route = createBrowserRouter(
  createRoutesFromElements(
    <Route errorElement={<ErrorPage />}>
      <Route path="/" element={<Root />}>
        <Route index element={<RamadanLandingPage />} />
        <Route path={ROUTES.privacy} element={<PrivacyPolicy />} />
        <Route path={ROUTES.termsOfService} element={<TermsOfService />} />
        <Route path={ROUTES.cookies} element={<CookieNotice />} />
      </Route>
      <Route element={<Auth />}>
        <Route path={ROUTES.login} element={<Login />} />
        <Route path={ROUTES.forgotPassword} element={<ForgotPassword />} />
        <Route path={ROUTES.signUp} element={<SignUp />} />
        <Route path={ROUTES.emailVerification} element={<EmailVerification />} />
        <Route path={ROUTES.emailVerificationToken} element={<EmailVerification />} />
        <Route path={ROUTES.payBills} element={<PayBills />} />
      </Route>

      <Route element={<MainPageLayout />}>
        {/* <Route index element={<RamadanLandingPage />} /> */}
        <Route
          path={ROUTES.search}
          element={
            <SearchPage
              title="Farm fresh"
              spanText="produce"
              text="Shop affordable groceries for families and friends, anywhere around the world. Our network sources the freshest local produce, meats, and dairy products directly from farmers and vendors nearest your loved ones."
            />
          }
        />
        <Route
          path={ROUTES.groceriesPage}
          element={
            <FarmProduce
              title="Farm fresh"
              spanText="produce"
              text="Shop affordable groceries for families and friends, anywhere around the world. Our network sources the freshest local produce, meats, and dairy products directly from farmers and vendors nearest your loved ones."
            />
          }
        />
        <Route path={ROUTES.detailsPage} element={<Details />} />
        {/* <Route index element={<RamadanPackages />} /> */}
        <Route path={ROUTES.ramadanPackages} element={<RamadanPackages />} />
        <Route path={ROUTES.customRamadanPackage} element={<CustomRamadanPackage />} />
      </Route>

      <Route path="waitlist" element={<WaitlistPage />} />
      <Route path="join-waitlist" element={<JoinWaitlist />} />
      {/* protected */}
      <Route element={<PrivateRoute />}>
        <Route element={<DashboardLayout />}>
          <Route path={ROUTES.dashboard} element={<DashboardHome />} />
          <Route path={ROUTES.dashboardOrders} element={<DashboardOrders />} />
          <Route path={ROUTES.dashboardGroceriesName} element={<Groceries />} />
          <Route path={ROUTES.dashboardDetailPage} element={<DashboardDetailsPage />} />
          <Route path={ROUTES.dashboardDonations} element={<Donations />} />
          <Route path={ROUTES.dashboardTransactions} element={<Transactions />} />
          <Route path={ROUTES.dashboardProfile} element={<Profile />} />
          <Route path={ROUTES.dashboardBillPayment} element={<BillPayment />} />
        </Route>

        {/* protected */}
        <Route element={<CheckoutLayout />}>
          <Route path={ROUTES.checkout} element={<Payment />} />
        </Route>

        <Route path={ROUTES.singleTransaction} element={<TransactionStatus />} />
      </Route>
    </Route>
  )
);
