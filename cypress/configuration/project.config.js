// Read env values from Cypress at runtime.
// If a key is missing, use the provided fallback so tests still run locally.
// const getCypressEnv = (key, fallback) => {
//     if (typeof Cypress !== "undefined" && typeof Cypress.env === "function") {
//         const value = Cypress.env(key);
//         return value ?? fallback;
//     }
//     return fallback;
// };

// Base URL for your frontend app pages visited by Cypress (e.g. /login, /sign-up).
const WEB_BASE_URL = 'https://www.sendsile.com';
// Base URL for your backend API used by app requests (staging by default fallback).
const API_BASE_URL = 'https://staging-api.sendsile.com/api/v1';
// Route path for login page and login API intercept pattern.
const LOGIN_PATH = '/login';
// Route path for sign-up page.
const SIGNUP_PATH = '/sign-up';
// Route path for forgot-password page.
const FORGOT_PASSWORD_PATH = '/forgot-password';
// Route path template for email verification page.
const EMAIL_VERIFICATION_PATH = '/email-verification/:token/:id';
// API path used for register endpoint intercepts.
const REGISTER_API_PATH = '/register';
// API path used for forgot-password reset-initiate intercepts.
const RESET_INITIATE_API_PATH = '/password/reset/initiate';
// API path used for resend verification email intercepts.
const RESEND_EMAIL_API_PATH = '/email/resend';
// API path used for groceries endpoint intercepts
const GROCERIES_PATH = '/dashboard/groceries';

export const Sendsile = {
  login: {
    pageUrl: 'https://www.sendsile.com/login',
    emailId: '#email',
    message01: 'Login to your account',
    emailentry: 'hello@test.com',
    passwordentry: 'mypassword',
    message02: 'Forgot password?',
    message03: 'Continue with google',
    message04: 'Invalid credentials',
    wrongemail: 'wrong@example.com',
    wrongpassword: 'wrongpassword',
    button: 'Continue',
    statuscode: 200,
    statuscodefail: 400,
    testemail: 'user@example.com',
    testname: 'Test User',
    testbalance: 0,
    testphone: '0000000000',
    photo: '',
    temp_token: 'temp-2fa-token',
    loginUrl: '/login',
    login2faUrl: '/login/2fa',
    loginmessage01: 'OTP',
    loginmessage02: 'OTP sent to your email',
    loginemail: 'user@example.com',
    loginpassword: 'Password123',
    loginmessage03: 'Invalid OTP',
    instructionmessage01: 'Enter the 6-digit code on your Authenticator App',
    message05: 'should display correct page title and basic structure',
    root: '#root',
    pageTitle: 'h1:contains("Login"), h2:contains("Sign In"), .login-title',
    pageDescription: 'p:contains("login"), .subtitle:contains("login")',
    message06: 'should display login form elements',
    emailInput: '#email, input[type="email"], input[name="email"]',
    passwordInput: '#password, input[type="password"], input[name="password"]',
    rememberMeCheckbox: '.remember-me, input[type="checkbox"]',
    forgotPasswordLink: 'a:contains("Forgot Password"), a:contains("Reset")',
    message07: 'should display social login options',
    googleLoginBtn: 'button:contains("Google"), .google-login, [data-testid="google-login"]',
    facebookLoginBtn: 'button:contains("Facebook"), .facebook-login',
    socialLoginSection: '.social-login, .third-party-login',
    message08: 'should display action buttons',
    loginBtn: 'button:contains("Login"), button:contains("Sign In"), button:contains("Continue")',
    createAccountBtn: 'button:contains("Sign Up"), button:contains("Create Account")',
    message09: 'should handle form validation',
    emailError: '.email-error, .error:contains("email"), .validation-error',
    passwordError: '.password-error, .error:contains("password")',
    requiredFieldError: '.required, .error:contains("required")',
    message10: 'should handle loading states',
    loadingIndicator: '.loading, .spinner, .loader, .skeleton',
    loadingBtn: '.loading-button, button:disabled',
    message11: 'should handle error states',
    errorMessage: '.error, .alert-error, .error-message, [role="alert"]',
    invalidCredentialsError: '.invalid-credentials, .auth-error',
    message12: 'should be responsive on different viewports',
    mobileView: 'iphone-x',
    tabletView: 'ipad-2',
    message13: 'should handle successful login redirect',
    dashboardRedirect: '.dashboard-redirect, :contains("dashboard")',
    successMessage: '.success, .alert-success, .success-message',
    message14: 'should handle two-factor authentication',
    otpInput: '.otp-input, input[name="otp"], input[type="text"]',
    otpSection: '.otp-section, .two-factor-section',
    verifyBtn: 'button:contains("Verify"), button:contains("Submit OTP")',
    resendOtpBtn: 'button:contains("Resend"), button:contains("Send Again")',
    message15: 'should handle navigation to signup',
    signupLink: 'a:contains("Sign Up"), a:contains("Create Account")',
    signupRedirect: '.signup-redirect',
    message16: 'should handle invalid login attempt',
    message17: 'should handle form field interactions',
    message18: 'should handle social login interactions',
    message19: 'should display 2FA setup/verification elements',
    message20: 'should handle 2FA verification success',
    message21: 'should handle 2FA verification failure',
    message22: 'should handle navigation to forgot password',
  },
  signup: {
    pageUrl: `${WEB_BASE_URL}${SIGNUP_PATH}`,
    base: API_BASE_URL,
    
    // Test messages for comprehensive signup tests
    message01: 'should load signup page with basic structure',
    message02: 'should display signup form elements',
    message03: 'should validate form inputs correctly',
    message04: 'should show error for invalid email format',
    message05: 'should show error for weak password',
    message06: 'should show error when passwords do not match',
    message07: 'should handle successful registration',
    message08: 'should handle email already exists error',
    message09: 'should handle server errors gracefully',
    message10: 'should navigate to login page',
    message11: 'should handle social signup options',
    message12: 'should be responsive on different viewports',
    message13: 'should handle terms and conditions',
    message14: 'should handle email verification flow',
    message15: 'should handle form field interactions',

    // Page structure
    root: '#root, .signup-container, .main-content',
    pageTitle: 'h1:contains("Sign Up"), h2:contains("Sign Up"), h1:contains("Create Account"), .signup-title',
    pageDescription: '.signup-description, .subtitle, p:contains("sign up")',

    // Form elements with flexible selectors
    nameInput: '#fullname, #name, input[name="fullname"], input[name="name"], input[placeholder*="name"]',
    emailInput: '#email, input[type="email"], input[name="email"], input[placeholder*="email"]',
    passwordInput: '#password, input[type="password"], input[name="password"], input[placeholder*="password"]',
    confirmPasswordInput: '#confirmPassword, #confirm-password, input[name="confirmPassword"], input[name="confirm_password"], input[placeholder*="confirm"]',
    
    // Additional form fields
    phoneInput: '#phone, input[type="tel"], input[name="phone"], input[placeholder*="phone"]',
    termsCheckbox: '#terms, input[name="terms"], input[type="checkbox"][name*="terms"], .terms-checkbox',
    newsletterCheckbox: '#newsletter, input[name="newsletter"], input[type="checkbox"][name*="newsletter"]',

    // Buttons with multiple fallback selectors
    signupBtn: 'button:contains("Sign Up"), button:contains("Create Account"), button:contains("Continue"), .signup-btn, .register-btn, [data-testid="signup"]',
    loginLink: 'a:contains("Login"), a:contains("Sign In"), a[href*="login"], .login-link',
    googleSignupBtn: 'button:contains("Google"), .google-signup, [data-testid="google-signup"]',
    facebookSignupBtn: 'button:contains("Facebook"), .facebook-signup, [data-testid="facebook-signup"]',

    // Validation and error messages
    nameError: '.name-error, .error:contains("name"), .validation-error:contains("name")',
    emailError: '.email-error, .error:contains("email"), .validation-error:contains("email")',
    passwordError: '.password-error, .error:contains("password"), .validation-error:contains("password")',
    confirmPasswordError: '.confirm-password-error, .error:contains("match"), .validation-error:contains("match")',
    termsError: '.terms-error, .error:contains("terms"), .validation-error:contains("terms")',
    
    // General error and success messages
    errorMessage: '.error, .alert-error, .error-message, [role="alert"]',
    successMessage: '.success, .alert-success, .success-message',
    validationError: '.validation-error, .field-error, .input-error',

    // Social login section
    socialLoginSection: '.social-login, .third-party-login, .oauth-section',
    dividerText: '.divider, .or-text, :contains("or")',

    // Loading states
    loadingIndicator: '.loading, .spinner, .loader, .processing',
    loadingBtn: '.loading-button, button:disabled, .btn-loading',

    // API endpoints and responses
    registerApi: REGISTER_API_PATH,
    verifyEmailApi: '/email/verify',
    
    // Test data
    testUser: {
      name: 'Test User',
      email: 'test@example.com',
      password: 'Password123',
      confirmPassword: 'Password123',
      phone: '08012345678',
      weakPassword: '123',
      invalidEmail: 'invalid-email',
      existingEmail: 'existing@example.com'
    },

    // Response messages
    successRegistrationMessage: 'Registration successful',
    emailExistsMessage: 'Email already exists',
    passwordMismatchMessage: 'Passwords do not match',
    weakPasswordMessage: 'Password is too weak',
    termsRequiredMessage: 'You must accept the terms and conditions',
    invalidEmailMessage: 'Invalid email format',

    // Redirect URLs
    emailVerificationUrl: '/email-verification',
    loginUrl: '/login',

    // Status codes
    successStatus: 200,
    conflictStatus: 409,
    badRequestStatus: 400,
    serverErrorStatus: 500,

    // Responsive design
    mobileView: 'iphone-x',
    tabletView: 'ipad-2',
    desktopView: [1280, 720],
    viewports: ['iphone-x', 'ipad-2', [1280, 720]],
  },
  emailVerification: {
    pageUrl: 'https://www.sendsile.com/email-verification',
    verifyUrl: 'https://www.sendsile.com/email-verification/test-token/123?signature=abc&expires=1',
    base: API_BASE_URL,
    header01: 'Check your inbox',
    header02: 'A verification email has been sent to your email',
    resendButton: 'Resend verification email',
    resendmessage01: 'Verification email resent',
    resenderror: 'Unable to resend verification email',
    resendUrl: '/email/verify/test-token/123?signature=abc&expires=1',
    resendmessage02: 'Email verified',
    resendendpoint: RESEND_EMAIL_API_PATH,
    verifyendpoint: '/email/verify/test-token/123?*',
    statuscode: 200,
    statuscodefail: 400,
  },
  forgotpassword: {
    pageUrl: 'https://www.sendsile.com/forgot-password',
    base: API_BASE_URL,
    header01: 'Forgot your password?',
    emailId: '#email',
    resetButton: 'Reset password',
    rememberPassword: 'Remember password?',
    resetmessage01: 'Set a new password',
    resetURL: RESET_INITIATE_API_PATH,
    resetmessage02: 'Reset link sent',
    resetmessage03: 'Email does not exist',
    reseterror: 'Unable to reset password',
    statuscode: 200,
    statuscodefail: 400,
    emailtest: 'test@example.com',
  },
  groceries: {
    pageUrl: "https://www.sendsile.com/dashboard/groceries",
    root: '#root',
    navMenu: 'nav, .navbar, .sidebar, .menu',
    dashLink: 'a[href*="dashboard"], a:contains("Dashboard"), a:contains("Home")',
    headings: 'h1:contains("Groceries"), h2:contains("Groceries"), .title:contains("Groceries")',
    description: 'p:contains("grocery"), .subtitle:contains("grocery")',
    categoryCard: '.category-card, .grocery-category, .section-card',
    categoryNav: '.category-nav, .tab-navigation, .filter-tabs',
    productGrid: '.product-grid, .product-list, .grocery-items',
    productCard: '.product-card, .grocery-item, .item-card',
    productNames: '.product-name, .item-name, .grocery-name',
    productPrices: '.price, .amount, :contains("$")',
    productImages: 'img[alt*="product"], .product-image, .item-image',
    searchInput: 'input[type="search"], input[placeholder*="search"], .search-box',
    searchFunc: 'input[type="search"], input[placeholder*="search"]',
    filterDropdown: 'select, .dropdown, .filter',
    sortingOption: '.sort-control, .sort-dropdown, :contains("Sort")',
    cartButton: 'button:contains("Add to Cart"), .add-to-cart, .cart-btn',
    cartIcon: '.cart-icon, .shopping-cart, :contains("Cart")',
    cartItem: '.cart-count, .badge, :contains("0")',
    offerBanners: '.offer-banner, .discount-banner, .promo-section',
    discountBadges: '.discount-badge, .sale-tag, :contains("%")',
    loadingIndicator: '.loading, .spinner, .loader, .skeleton',
    emptyState: '.empty-state, .no-data, :contains("No products"), :contains("Empty")',
    errorMessage: '.error, .alert-error, .error-message, [role="alert"]',
    retryButton: 'button:contains("Retry"), button:contains("Try again"), .retry-btn',
    testLink: 'a[href]',
    message: 'Groceries page loaded successfully',
    message01: 'should display correct page title and basic structure',
    message02: 'should display dashboard navigation elements',
    message03: 'should display groceries page header',
    message04: 'should display grocery categories or sections',
    message05: 'should display grocery products',
    message06: 'should display product information',
    message07: 'should display search and filter controls',
    message08: 'should display shopping cart functionality',
    message09: 'should display special offers or discounts',
    message10: 'should handle loading and empty states appropriately',
    message11: 'should be responsive on different viewports',
    message12: 'should handle basic user interactions',
    message13: 'should handle error states gracefully',
    message14: 'should display product details correctly',
    message15: 'should handle adding/removing items from cart',
    message16: 'should filter and sort products correctly',
    message17: 'should validate search input functionality',
    message18: 'should ensure buttons are enabled/disabled appropriately',
    message19: 'should display dynamic UI updates after user actions',
    message20: 'should intercept and validate API requests',
    message21: 'should validate success scenarios',
    message22: 'should validate failure scenarios',
    message23: 'should verify cart state updates',
    productDetailsModal: '.product-details-modal, .product-detail-page, .modal-product-details',
    productDescription: '.product-description, .item-description, .description-text',
    clearSearchButton: '.clear-search-button, .search-clear-btn, button[aria-label="Clear search"]',
    mobileView: 'iphone-x',
    tabletView: 'ipad-2',
  },
   
  billPayment: {
    pageUrl: 'https://www.sendsile.com/dashboard/bill-payment',
    message: 'API request processed',
    message01: 'should display correct page title and basic structure',
    message02: 'should display dashboard navigation elements',
    navMenu: 'nav, .navbar, .sidebar, .menu',
    dashLink: 'a[href*="dashboard"], a:contains("Dashboard"), a:contains("Home")',
    message03: 'should display bill payment page header',
    pageTitle: 'h1:contains("Bill Payment"), h2:contains("Payment"), .payment-title',
    pageDescript: 'p:contains("bill"), p:contains("payment"), .subtitle:contains("bill")',
    message04: 'should display bill selection form',
    billSelectionInput: 'select, .bill-selector, .dropdown',
    billSearchFunctionality:
      'input[type="search"], input[placeholder*="bill"], input[placeholder*="search"]',
    message05: 'should display payment information form',
    paymentAmountInput: 'input[type="number"], input[placeholder*="amount"], .amount-input',
    paymentMethodSelection: '.payment-method, .payment-options, select[name*="payment"]',
    cardDetailsInput: 'input[name*="card"], input[placeholder*="card"], .card-input',
    message06: 'should display billing information',
    billDetailsSection: '.bill-details, .billing-info, .invoice-details',
    dueDateDisplay: '.due-date, .payment-due, :contains("Due")',
    billAmountDisplay: '.bill-amount, .total-amount, :contains("$")',
    message07: 'should display payment processing controls',
    submitPaymentButton:
      'button:contains("Pay"), button:contains("Submit"), button:contains("Process"), .pay-btn',
    cancelButton: 'button:contains("Cancel"), button:contains("Back"), .cancel-btn',
    savePaymentMethod: 'input[type="checkbox"], .save-payment, :contains("Save")',
    message08: 'should display payment history',
    paymentHistoryList: '.payment-history, .transaction-list, table',
    paymentStatusIndicator: '.status, .payment-status, :contains("Status")',
    message09: 'should display security and validation features',
    cvvInput: 'input[name*="cvv"], input[placeholder*="cvv"], .cvv-input',
    expiryInput: 'input[name*="expiry"], input[placeholder*="expiry"], .expiry-input',
    securityBadges: '.security-badge, .ssl-badge, .lock-icon',
    message10: 'should handle loading and error states appropriately',
    loadingIndicators: '.loading, .spinner, .loader, .skeleton',
    errorMessages: '.error, .alert-error, .error-message, [role="alert"]',
    successMessage: '.success, .alert-success, .success-message',
    message11: 'should be responsive on different viewports',
    message12: 'should handle basic form interactions',
    amountInput: 'input[type="number"], input[placeholder*="amount"]',
    paymentMethod: 'select, .payment-method',
    message13: 'should validate form inputs and show errors',
    emptyFormSubmission: 'button:contains("Pay"), button:contains("Submit")',
    validationErrors: '.error, .validation-error, .required',
  },
  dashboard: {
    pageUrl: 'https://www.sendsile.com/dashboard',
    message: 'API request processed',
    message01: 'should load dashboard home page and show key UI sections',
    message02: 'should exercise dashboard interactive elements and verify navigation',
    message03: 'should validate password form errors and password update API responses',
    message04: 'should submit the address form and show both error and success states',
    message05: 'should handle two-factor authentication initiation and verification',
    root: '#root',
    transactionsPath: '/dashboard/transactions',
    billPaymentPath: '/dashboard/bill-payment',
    donationsPath: '/dashboard/donations',
    profilePath: '/dashboard/profile',
    testAccessToken: 'test-access-token',
    authToken: 'Bearer test-access-token',
    walletAmount: '5000',
    otpCode: '123456',
    wrongPassword: 'short',
    currentPassword: 'CurrentPass1',
    newPassword: 'NewPassword1',
    mismatchedPassword: 'NewPassword2',
    streetAddress: '14 Bourdillon Road',
    region: 'Lagos',
    city: 'Ikoyi',
    country: 'Nigeria',
    incorrectPasswordMessage: 'Current password is incorrect',
    passwordUpdateSuccessMessage: 'Password updated successfully',
    addressUpdateErrorMessage: 'Unable to update address',
    addressUpdateSuccessMessage: 'Address updated successfully',
    twoFactorSuccessMessage: '2FA enabled successfully',
    twoFactorSecret: 'ABC123SECRET',
    notificationEmptyMessage: 'You have no notifications',
    billPaymentPlaceholder: 'Coming soon',
    headings: {
      walletBalance: 'Wallet balance',
      quickAccess: 'Quick access',
      recentTransactions: 'Recent transactions',
      contactInformation: 'Contact Information',
      updatePassword: 'Update password',
      changeAddress: 'CHANGE ADDRESS',
      twoFactorAuthentication: 'TWO-FACTOR AUTHENTICATION',
      fundWallet: 'Fund your',
      paymentMode: 'Select mode of',
      notifications: 'Notifications',
    },
    buttons: {
      fundWallet: 'Fund wallet',
      seeAll: 'See all',
      logout: 'Logout',
      updatePassword: 'Update password',
      updateAddress: 'Update Address',
      makePayment: 'Make payment',
    },
    links: {
      home: 'Home',
      orders: 'Orders',
      groceries: 'Groceries',
      billPayment: 'Bill payment',
      donations: 'Donations',
      transactions: 'Transactions',
      profile: 'Profile',
    },
    quickAccessCards: {
      groceries: 'Buy groceries',
      payBills: 'Pay bills',
      donations: 'Make a donation',
    },
    selectors: {
      table: 'table',
      tableDateHeader: 'Date',
      transactionNarration: 'Fresh produce order',
      notificationToggle: 'div.shadow-\\\\[0px_3px_4px_0px\\\\]',
      walletAmountInput: 'input[name="amount"]',
      modalCloseButton: 'button.absolute.top-4.right-4',
      oldPasswordInput: '#oldPassword',
      newPasswordInput: '#new-password',
      confirmPasswordInput: '#confirm-password',
      streetAddressInput: '#street_address',
      regionInput: '#region',
      cityInput: '#city',
      countryInput: '#country',
      twoFactorSwitch: '#switch',
      qrCodeImage: 'img[alt="qr_code"]',
      otpInputs: 'form input',
    },
    paymentProvider: 'Paystack',
    transactions: [
      {
        transaction_id: 'txn-001',
        date: '2026-04-08',
        amount: 'NGN 25,000',
        type: 'Groceries',
        narration: 'Fresh produce order',
        status: 'successful',
      },
      {
        transaction_id: 'txn-002',
        date: '2026-04-07',
        amount: 'NGN 10,500',
        type: 'Donation',
        narration: 'Community support',
        status: 'pending',
      },
    ],
    categories: [
      {
        id: 'cat-001',
        name: 'Foodstuff',
      },
    ],
    userData: {
      id: 'user-123',
      name: 'Test User',
      email: 'test@example.com',
      phone: '08012345678',
      balance: 250000,
      delivery_address: '12 Admiralty Way, Lekki',
      two_factor_enabled: 'disabled',
      pin_set: true,
    },
    persistedLocation: {
      state: {
        isOpen: false,
        location: 'nigeria',
      },
      version: 0,
    },
    twoFactorPayload: {
      secret: 'ABC123SECRET',
      qr_code_image:
        '<?xml version="1.0" encoding="UTF-8"?><svg xmlns="http://www.w3.org/2000/svg" width="120" height="120"><rect width="120" height="120" fill="white"/><rect x="20" y="20" width="20" height="20" fill="black"/><rect x="50" y="20" width="20" height="20" fill="black"/><rect x="80" y="20" width="20" height="20" fill="black"/></svg>',
    },
  },
  donations: {
    pageUrl: 'https://www.sendsile.com/dashboard/donations',
    message: 'API request processed',
    message01: 'should display correct page title and basic structure',
    message02: 'should display dashboard navigation elements',
    navMenu: 'nav, .navbar, .sidebar, .menu',
    dashLink: 'a[href*="dashboard"], a:contains("Dashboard"), a:contains("Home")',
    message03: 'should display donations page header',
    pageTitle: 'h1:contains("Donations"), h2:contains("Donate"), .donations-title',
    pageDescription: 'p:contains("donation"), .subtitle:contains("donation")',
    message04: 'should display donations data table or list',
    table: 'table',
    tableHeader: 'thead, th',
    tableBody: 'tbody, tr',
    cardView: '.donation-list, .donation-card, .list-item',
    message05: 'should display donation statistics or summary',
    statCard: '.stat-card, .summary-card, .metric-card',
    totalAmount: 'span:contains("$"), .amount, .total, .sum',
    countDisplay: '.count, .number, .quantity',
    message06: 'should display filter and search controls',
    searchInput: 'input[type="search"], input[placeholder*="search"], .search-box',
    filterDropdown: 'select, .dropdown, .filter',
    dateRangePicker: 'input[type="date"], .date-picker, .calendar',
    message07: 'should display action buttons',
    exportBtn: 'button:contains("Export"), button:contains("Download"), .export-btn',
    addDonationBtn:
      'button:contains("Add"), button:contains("Create"), button:contains("New"), .add-btn',
    refreshBtn: 'button:contains("Refresh"), .refresh-btn, .reload-btn',
    message08: 'should display pagination if data is paginated',
    pagination: '.pagination, .pager, .page-nav',
    pageNumber: ".page-number, .page-item, a[href*='page']",
    nextBtn: 'button:contains("Next"), button:contains("Previous"), .next, .prev',
    message09: 'should handle loading and empty states appropriately',
    loadingIndicator: '.loading, .spinner, .loader, .skeleton',
    emptyState: '.empty-state, .no-data, :contains("No donations"), :contains("No data")',
    message10: 'should be responsive on different viewports',
    mobileView: 'iphone-x',
    tabletView: 'ipad-2',
    message11: 'should handle basic user interactions',
    searchFunc: 'input[type="search"], input[placeholder*="search"]',
    btnExist: 'button',
    linkExist: 'a[href]',
    message12: 'should handle error states gracefully',
    errorMessage: '.error, .alert-error, .error-message, [role="alert"]',
    retryMechanism: 'button:contains("Retry"), button:contains("Try again"), .retry-btn',
  },
  
  logout: {
    pageUrl: 'https://www.sendsile.com/dashboard/logout',
    message: 'Logout successful',
    message01: 'should display logout page correctly',
    root: '#root',
    pageTitle: 'h1:contains("Logout"), h2:contains("Sign Out"), .logout-title',
    pageDescription: 'p:contains("logout"), .subtitle:contains("logout")',
    message02: 'should display logout confirmation',
    logoutMessage: '.logout-message, .confirmation-message, :contains("Are you sure")',
    confirmationText: '.confirmation-text, .warning-text',
    message03: 'should display logout buttons',
    logoutBtn: 'button:contains("Logout"), button:contains("Sign Out"), .logout-btn',
    cancelBtn: 'button:contains("Cancel"), button:contains("Go Back"), .cancel-btn',
    message04: 'should handle logout process',
    logoutForm: '.logout-form, form[action*="logout"]',
    sessionClear: '.session-cleared, .logged-out',
    message05: 'should redirect after logout',
    loginRedirect: '.login-redirect, :contains("login")',
    homeRedirect: '.home-redirect, :contains("home")',
    redirectMessage: '.redirect-message, .success-message',
    message06: 'should clear authentication tokens',
    tokenCheck: '.token-cleared, .auth-cleared',
    localStorageCheck: '.storage-cleared',
    message07: 'should handle logout error states',
    logoutError: '.error, .alert-error, .error-message',
    retryBtn: 'button:contains("Retry"), button:contains("Try Again")',
    message08: 'should be responsive on different viewports',
    mobileView: 'iphone-x',
    tabletView: 'ipad-2',
    message09: 'should handle user session cleanup',
    activeSession: '.active-session, .current-session',
    sessionExpired: '.session-expired, .timeout-message',
    message10: 'should display logout success confirmation',
    successMessage: '.success, .alert-success, .success-message',
    logoutComplete: '.logout-complete, .signed-out',
    message11: 'should handle navigation after logout',
    loginLink: 'a[href*="login"], a:contains("Login")',
    homeLink: 'a[href*="home"], a:contains("Home")',
    message12: 'should validate logout flow',
    logoutFlow: '.logout-flow, .sign-out-process',
    flowComplete: '.flow-complete, .process-finished',
    message13: 'should handle logout completion and final states',
  },
  checkout: {
    pageUrl: 'https://www.sendsile.com/checkout',
    base: 'https://www.sendsile.com',
    message01: 'should display checkout page header',
    message02: 'should display order summary section',
    message03: 'should display shipping information form',
    message04: 'should display billing information form',
    message05: 'should display payment method selection',
    message06: 'should display order items list',
    message07: 'should handle coupon code functionality',
    message08: 'should display order total calculation',
    message09: 'should handle form validation',
    message10: 'should handle loading states',
    message11: 'should handle error states',
    message12: 'should be responsive on different viewports',
    message13: 'should complete checkout process successfully',

    // Page structure
    root: '#root, .checkout-container, .main-content',
    pageTitle: 'h1:contains("Checkout"), h2:contains("Payment"), .checkout-title',
    pageDescription: '.checkout-description, .order-summary',

    // Order summary
    orderSummary: '.order-summary, .checkout-summary, .summary-section',
    orderItems: '.order-item, .product-item, .checkout-item',
    itemQuantity: '.quantity, .item-quantity, .qty',
    itemPrice: '.price, .item-price, .amount',
    subtotal: '.subtotal, .order-subtotal',

    // Shipping information
    shippingForm: '.shipping-form, .address-form',
    firstName: 'input[name*="firstName"], input[placeholder*="first"]',
    lastName: 'input[name*="lastName"], input[placeholder*="last"]',
    email: 'input[name*="email"], input[type="email"]',
    phone: 'input[name*="phone"], input[type="tel"]',
    address: 'input[name*="address"], textarea[name="address"]',
    city: 'input[name*="city"], input[placeholder*="city"]',
    state: 'select[name*="state"], .state-select',
    zipCode: 'input[name*="zip"], input[name*="postal"], input[placeholder*="zip"]',
    country: 'select[name*="country"], .country-select',

    // Billing information
    billingForm: '.billing-form, .payment-form',
    cardNumber: 'input[name*="cardNumber"], input[placeholder*="card"]',
    cardName: 'input[name*="cardName"], input[placeholder*="name"]',
    expiryDate: 'input[name*="expiry"], input[placeholder*="expiry"]',
    cvv: 'input[name*="cvv"], input[placeholder*="cvv"]',

    // Payment methods
    paymentMethods: '.payment-methods, .payment-options',
    creditCardOption: 'input[value="credit"], .credit-card-option',
    paypalOption: 'input[value="paypal"], .paypal-option',
    applePayOption: 'input[value="apple"], .apple-pay-option',
    googlePayOption: 'input[value="google"], .google-pay-option',

    // Coupon functionality
    couponInput: '.coupon-input, input[name*="coupon"]',
    couponButton: '.apply-coupon, button:contains("Apply")',
    couponMessage: '.coupon-message, .discount-message',

    // Order total
    orderTotal: '.order-total, .total-amount, .final-price',
    tax: '.tax, .tax-amount',
    shipping: '.shipping-cost, .delivery-fee',
    discount: '.discount, .coupon-discount',

    // Action buttons
    placeOrderBtn:
      '.place-order, button:contains("Place Order"), button:contains("Complete Purchase")',
    continueBtn: '.continue-shopping, button:contains("Continue Shopping")',
    backBtn: '.back-to-cart, button:contains("Back to Cart")',

    // Form validation
    requiredFieldError: '.error, .validation-error, .required',
    invalidEmailError: '.email-error, .invalid-email',
    invalidCardError: '.card-error, .invalid-card',

    // Loading and error states
    loadingIndicator: '.loading, .spinner, .loader, .processing',
    errorMessage: '.error-message, .alert-error, .checkout-error',
    successMessage: '.success-message, .alert-success, .order-success',

    // Responsive design
    mobileView: 'iphone-x',
    tabletView: 'ipad-2',
    desktopView: [1280, 720],
    viewports: ['iphone-x', 'ipad-2', [1280, 720]],

    // API data for mocking
    categories: [
      { id: 1, name: 'Groceries', icon: 'grocery' },
      { id: 2, name: 'Bills', icon: 'bill' },
      { id: 3, name: 'Donations', icon: 'donation' }
    ],
    
    // Test data
    testEmail: 'test@example.com',
    testSearch: 'test search',
    testNewsletterEmail: 'test@example.com',

    // Loading and error states
    loadingIndicator: '.loading, .spinner, .loader, .processing',
    errorMessage: '.error, .error-message, .alert-error',
    successMessage: '.success, .success-message, .alert-success',
  },
  quickView: {
    pageUrl:
      'https://www.sendsile.com/quick-view/e9142bbb-9bbc-47a6-a7db-5bfae66b583f?v=8b3fb20a-4090-401e-9bf0-d0099409c2ee',
    base: 'https://www.sendsile.com',
    message01: 'should display order details header',
    message02: 'should display order information section',
    message03: 'should display order items list',
    message04: 'should display order status section',
    message05: 'should display order timeline section',
    message06: 'should display shipping information',
    message07: 'should display billing information',
    message08: 'should display order total section',
    message09: 'should handle order actions',
    message10: 'should display order tracking information',
    message11: 'should handle loading states',
    message12: 'should handle error states',
    message13: 'should be responsive on different viewports',
    message14: 'should display order actions correctly',
    message15: 'should handle order tracking functionality',
    message16: 'should display detailed product information',
    message17: 'should handle navigation to related pages',

    // Page structure
    root: '#root, .order-container, .main-content',
    pageTitle: 'h1:contains("Order Details"), h2:contains("Order"), .order-title',
    pageDescription: '.order-description, .order-summary',

    // Order information
    orderInfo: '.order-info, .order-details, .order-section',
    orderId: ".order-id, .order-number, :contains('Order #')",
    orderDate: ".order-date, .order-date-info, :contains('Order Date')",
    orderStatus: '.order-status, .status-badge, .order-state',

    // Order items
    itemsList: '.order-items, .items-list, .product-list',
    orderItem: '.order-item, .product-item, .item-row',
    itemName: '.item-name, .product-name, .item-title',
    itemPrice: '.item-price, .product-price, .item-amount',
    itemQuantity: '.item-quantity, .product-quantity, .item-qty',
    itemImage: '.item-image, .product-image, .item-photo',

    // Order status
    statusSection: '.status-section, .order-status-section',
    statusBadge: '.status-badge, .order-status-badge',
    trackingNumber: ".tracking-number, .tracking-info, :contains('Tracking')",

    // Order timeline
    timeline: '.order-timeline, .activity-timeline, .order-history',
    timelineEvent: '.timeline-event, .activity-item, .order-activity',
    eventDate: '.event-date, .activity-date',
    eventDescription: '.event-description, .activity-description',

    // Shipping information
    shippingInfo: '.shipping-info, .delivery-info, .shipping-section',
    shippingAddress: '.shipping-address, .delivery-address, .order-address',
    recipientName: '.recipient-name, .customer-name, .shipping-name',
    shippingMethod: '.shipping-method, .delivery-method, .shipping-type',
    estimatedDelivery: '.estimated-delivery, .delivery-date, .shipping-estimate',

    // Billing information
    billingInfo: '.billing-info, .payment-info, .billing-section',
    billingAddress: '.billing-address, .payment-address',
    paymentMethod: '.payment-method, .payment-type, .order-payment',
    cardLast4: ".card-last4, .payment-card, :contains('****')",

    // Order total
    totalSection: '.order-total, .summary-total, .total-section',
    subtotal: '.subtotal, .order-subtotal',
    tax: '.tax, .order-tax, .tax-amount',
    shipping: '.shipping-cost, .delivery-fee, .order-shipping',
    discount: '.discount, .coupon-discount, .order-discount',
    grandTotal: '.grand-total, .order-total, .final-amount',

    // Order actions
    actionsSection: '.order-actions, .action-buttons, .order-buttons',
    trackOrderBtn: '.track-order, button:contains("Track"), button:contains("Track Order")',
    downloadInvoiceBtn:
      '.download-invoice, button:contains("Download"), button:contains("Invoice")',
    cancelOrderBtn: '.cancel-order, button:contains("Cancel"), button:contains("Cancel Order")',
    reorderBtn: '.reorder, button:contains("Reorder"), button:contains("Buy Again")',

    // Order tracking
    trackingInfo: '.tracking-details, .tracking-section',
    trackingLink: 'a[href*="tracking"], .tracking-link, :contains("Track Package")',

    // Form validation
    requiredFieldError: '.error, .validation-error, .required',
    invalidDataError: '.error-message, .alert-error, .order-error',

    // Loading and error states
    loadingIndicator: '.loading, .spinner, .loader, .processing',
    errorMessage: '.error-message, .alert-error, .order-error',
    successMessage: '.success-message, .alert-success, .order-success',

    // Responsive design
    mobileView: 'iphone-x',
    tabletView: 'ipad-2',
  },
  
  addToCart: {
    pageUrl: 'https://www.sendsile.com/dashboard/product/81d0be09-0cae-4b60-a973-f3fa99294ad2?v=ce25da2f-875e-4a4d-bc4e-845076d6818c',
    fallbackUrl: 'https://www.sendsile.com/dashboard/products',
    mockProductUrl: 'https://www.sendsile.com/mock-product-page',
    useMockMode: true, // Use mock mode to avoid error page redirection issues
    base: 'https://www.sendsile.com',
    
    // Test messages for comprehensive add-to-cart tests
    message01: 'should load product page with basic structure',
    message02: 'should display product information correctly',
    message03: 'should display product images and gallery',
    message04: 'should handle product quantity selection',
    message05: 'should handle product size and color options',
    message06: 'should add product to cart successfully',
    message07: 'should handle cart icon and cart count updates',
    message08: 'should handle product wishlist functionality',
    message09: 'should handle product sharing functionality',
    message10: 'should handle product reviews and ratings',
    message11: 'should handle related products section',
    message12: 'should handle product comparison',
    message13: 'should handle back to products navigation',
    message14: 'should be responsive on different viewports',
    message15: 'should handle product availability and stock',
    message16: 'should handle product price and discounts',
    message17: 'should handle product description and details',
    message18: 'should handle product specifications',
    message19: 'should handle product shipping information',
    message20: 'should handle product return policy',

    // Page structure
    root: '#root, .product-container, .main-content, .product-page',
    pageTitle: 'h1:contains("Product"), .product-title, .product-name',
    pageDescription: '.product-description, .product-summary, .product-details',
    productSection: '.product-section, .product-main, .product-info',
    imageGallery: '.product-gallery, .product-images, .image-carousel',
    productInfo: '.product-info, .product-details, .product-data',

    // Product information elements
    productName: '.product-name, .product-title, h1, .title',
    productPrice: '.product-price, .price, .current-price, .amount',
    originalPrice: '.original-price, .old-price, .compare-price',
    discountPrice: '.discount-price, .sale-price, .discount-amount',
    discountBadge: '.discount-badge, .sale-badge, .discount-tag',
    productSku: '.product-sku, .sku, .product-code',
    productCategory: '.product-category, .category, .product-type',
    productBrand: '.product-brand, .brand, .manufacturer',
    availability: '.availability, .stock-status, .in-stock',
    stockCount: '.stock-count, .quantity-available, .items-left',
    rating: '.product-rating, .rating, .stars',
    reviewCount: '.review-count, .reviews-count, .number-of-reviews',

    // Product images
    mainImage: '.main-image, .product-image img, .primary-image',
    thumbnailImages: '.thumbnail, .thumb-image, .product-thumb',
    imageZoom: '.image-zoom, .zoom-container, .magnifier',
    imageNav: '.image-nav, .image-controls, .carousel-controls',
    prevImageBtn: '.prev-image, .prev-btn, .image-prev',
    nextImageBtn: '.next-image, .next-btn, .image-next',

    // Product options
    sizeSelector: '.size-selector, .size-options, .product-sizes',
    sizeOption: '.size-option, .size-btn, .size-choice',
    colorSelector: '.color-selector, .color-options, .product-colors',
    colorOption: '.color-option, .color-btn, .color-choice',
    quantityInput: '.quantity-input, input[name="quantity"], .qty-input',
    quantityIncrease: '.quantity-increase, .qty-plus, .increase-qty',
    quantityDecrease: '.quantity-decrease, .qty-minus, .decrease-qty',
    
    // Add to cart functionality
    addToCartBtn: '.add-to-cart, .cart-btn, button:contains("Add to Cart"), button:contains("Add to Bag")',
    addToCartBtnLoading: '.add-to-cart.loading, .cart-btn.loading, .btn-loading',
    buyNowBtn: '.buy-now, .purchase-btn, button:contains("Buy Now")',
    checkoutBtn: '.checkout-btn, button:contains("Checkout")',

    // Cart and wishlist
    cartIcon: '.cart-icon, .shopping-cart, .bag-icon, .cart-btn',
    cartCount: '.cart-count, .cart-badge, .item-count',
    cartDropdown: '.cart-dropdown, .cart-modal, .mini-cart',
    wishlistBtn: '.wishlist-btn, .favorite-btn, button:contains("Wishlist")',
    wishlistIcon: '.wishlist-icon, .favorite-icon, .heart-icon',

    // Product actions
    shareBtn: '.share-btn, .share-product, button:contains("Share")',
    compareBtn: '.compare-btn, .compare-product, button:contains("Compare")',
    backToProductsBtn: '.back-btn, .back-to-products, a:contains("Back")',
    similarProducts: '.similar-products, .related-products, .recommended',
    productReviews: '.product-reviews, .reviews-section, .customer-reviews',
    writeReviewBtn: '.write-review, .add-review, button:contains("Write Review")',

    // Product details sections
    descriptionTab: '.description-tab, .tab:contains("Description"), .product-description',
    specificationsTab: '.specifications-tab, .tab:contains("Specifications"), .product-specs',
    shippingTab: '.shipping-tab, .tab:contains("Shipping"), .shipping-info',
    returnsTab: '.returns-tab, .tab:contains("Returns"), .return-policy',
    reviewsTab: '.reviews-tab, .tab:contains("Reviews"), .reviews-section',

    // Loading and error states
    loadingIndicator: '.loading, .spinner, .loader, .processing',
    errorMessage: '.error, .error-message, .alert-error',
    successMessage: '.success, .success-message, .alert-success',
    outOfStockMessage: '.out-of-stock, .stock-error, .unavailable',

    // API endpoints
    addToCartApi: '/api/cart/add',
    wishlistApi: '/api/wishlist/add',
    productApi: '/api/products',

    // Test data
    testProduct: {
      name: 'Test Product',
      price: '99.99',
      originalPrice: '149.99',
      sku: 'TEST-001',
      category: 'Electronics',
      brand: 'Test Brand',
      quantity: 1,
      size: 'M',
      color: 'Blue'
    },

    // Response messages
    addedToCartMessage: 'Product added to cart',
    outOfStockMessage: 'Product is out of stock',
    addedToWishlistMessage: 'Product added to wishlist',
    removedFromWishlistMessage: 'Product removed from wishlist',

    // Status codes
    successStatus: 200,
    conflictStatus: 409,
    notFoundStatus: 404,
    badRequestStatus: 400,

    // Responsive design
    mobileView: 'iphone-x',
    tabletView: 'ipad-2',
    desktopView: [1280, 720],
    viewports: ['iphone-x', 'ipad-2', [1280, 720]],
  },
  
  homepage: {
    pageUrl: 'https://www.sendsile.com',
    base: 'https://www.sendsile.com',
    
    // Test messages for interactive homepage tests
    message01: 'should load homepage and navigate to login',
    message02: 'should navigate to signup page', 
    message03: 'should click navigation menu links',
    message04: 'should interact with hero section buttons',
    message05: 'should interact with search functionality',
    message06: 'should click footer links',
    message07: 'should interact with social media links',
    message08: 'should interact with mobile menu',
    message09: 'should interact with homepage forms',
    message10: 'should interact with dropdowns and selects',
    message11: 'should click on linked images',
    message12: 'should interact with tabs and accordions',
    message13: 'should interact with modals and popups',
    message14: 'should interact with newsletter signup',
    message15: 'should test responsive interactions',

    // Page structure
    root: '#root, .main-container, .app-container',
    pageTitle: 'h1:contains("Sendsile"), h1:contains("Welcome"), .site-title',
    pageDescription: '.hero-description, .tagline, .subtitle',

    // Navigation elements
    navMenu: 'nav, .navbar, .navigation, .header, .header-nav',
    logo: '.logo, .brand, .site-logo, img[alt*="logo"]',
    navigationLinks: 'nav a, .navbar a, header a',
    
    // Authentication selectors
    loginSelectors: [
      'a:contains("Login")',
      'button:contains("Login")',
      'a[href*="login"]',
      '.login-btn',
      '[data-testid="login"]',
      '[data-cy="login"]',
      'a:contains("Sign In")',
      'button:contains("Sign In")',
      'a[href*="signin"]',
      'a[href*="sign-in"]'
    ],
    
    signupSelectors: [
      'a:contains("Sign Up")',
      'a:contains("Get Started")',
      'button:contains("Sign Up")',
      'button:contains("Get Started")',
      'a[href*="sign-up"]',
      'a[href*="signup"]',
      '.signup-btn',
      '[data-testid="signup"]',
      '[data-testid="get-started"]'
    ],

    // Hero section
    heroSection: '.hero, .banner, .main-hero, .jumbotron',
    heroSelectors: ['.hero', '.banner', '.main-hero', '.jumbotron'],
    heroTitle: '.hero-title, h1, .main-title',
    heroDescription: '.hero-description, .tagline, .subtitle',
    heroButtons: '.cta-button, .hero-button, button:contains("Get Started")',

    // Search functionality
    searchSelectors: [
      'input[type="search"]',
      'input[placeholder*="search"]',
      '.search-box input',
      '.search-input'
    ],
    searchBtnSelectors: [
      '.search-btn',
      'button:contains("Search")',
      '.search-button',
      '[data-testid="search-submit"]'
    ],

    // Footer elements
    footer: 'footer, .site-footer, .footer-section',
    footerLinks: 'footer a, .footer a',
    
    // Social media links
    socialSelectors: [
      'a[href*="facebook.com"]',
      'a[href*="twitter.com"]',
      'a[href*="linkedin.com"]',
      'a[href*="instagram.com"]',
      '.social-icons a',
      '.social-media a'
    ],

    // Mobile menu
    mobileMenuSelectors: [
      '.mobile-menu-toggle',
      '.hamburger',
      '.menu-toggle',
      '.sidebar-toggle'
    ],
    mobileMenuItems: '.mobile-menu a, .sidebar a',

    // Forms
    formSelectors: 'form',
    formInputs: 'input[type="text"], input[type="email"]',
    submitButtons: 'button[type="submit"], input[type="submit"]',

    // Dropdowns and selects
    dropdownSelectors: 'select, .dropdown, .select-field',

    // Linked images
    linkedImages: 'a img',

    // Tabs and accordions
    tabSelectors: '.tab, .tab-button, [role="tab"]',
    accordionSelectors: '.accordion-header, .accordion-toggle',

    // Modals and popups
    modalSelectors: [
      '[data-toggle="modal"]',
      '.modal-trigger',
      '.popup-trigger',
      'button:contains("Contact")',
      'button:contains("Subscribe")'
    ],
    modalCloseBtn: '.modal-close, .close, button:contains("Close")',

    // Newsletter signup
    newsletterSelectors: [
      '.newsletter',
      '.newsletter-signup',
      '.subscribe-form',
      '[data-testid="newsletter"]'
    ],
    emailInput: 'input[type="email"], input[placeholder*="email"]',
    submitBtn: 'button:contains("Subscribe"), button:contains("Sign Up")',

    // Responsive design
    mobileView: 'iphone-x',
    tabletView: 'ipad-2',
    desktopView: [1280, 720],
    viewports: ['iphone-x', 'ipad-2', [1280, 720]],

    // API data for mocking
    categories: [
      { id: 1, name: 'Groceries', icon: 'grocery' },
      { id: 2, name: 'Bills', icon: 'bill' },
      { id: 3, name: 'Donations', icon: 'donation' }
    ],
    
    // Test data
    testEmail: 'test@example.com',
    testSearch: 'test search',
    testNewsletterEmail: 'test@example.com',

    // Loading and error states
    loadingIndicator: '.loading, .spinner, .loader, .processing',
    errorMessage: '.error, .error-message, .alert-error',
    successMessage: '.success, .success-message, .alert-success',
  },
   
  checkout: {
    pageUrl: 'https://www.sendsile.com/checkout',
    base: 'https://www.sendsile.com',

    // Page structure and display
    message01: 'should display checkout page header',
    message02: 'should display order summary section',
    message03: 'should display shipping information form',
    message04: 'should display billing information form',
    message05: 'should display payment method selection',
    message06: 'should display order items list',
    message07: 'should handle coupon code functionality',
    message08: 'should display order total calculation',
    message09: 'should handle form validation',
    message10: 'should handle loading states',
    message11: 'should handle error states',
    message12: 'should be responsive on different viewports',
    message13: 'should complete checkout process successfully',
    message14: 'should handle valid inputs correctly',
    message15: 'should handle invalid inputs appropriately',
    message16: 'should handle all input field interactions',
    message17: 'should click buttons, type inputs, and navigate pages correctly',
    message18: 'should submit form successfully with valid data',
    message19: 'should handle send as a gift option with valid and invalid inputs',
    message20: 'should simulate realistic user shopping behavior',

    // Page elements
    root: '#root, .checkout-container, .main-content',
    pageTitle: 'h1:contains("Checkout"), h2:contains("Checkout"), .page-title, .checkout-header',
    pageDescription: '.page-description, .checkout-description',

    // Order summary
    orderSummary: '.order-summary, .summary, .cart-summary',
    orderItem: '.order-item, .product-item, .cart-item',

    // Forms
    shippingForm: '.shipping-form, .shipping-info, form',
    billingForm: '.billing-form, .billing-info, .payment-form',

    // Input fields
    emailInput: 'input[type="email"], input[name*="email"]',
    firstNameInput: 'input[name*="first"], input[id*="first"]',
    lastNameInput: 'input[name*="last"], input[id*="last"]',
    phoneInput: 'input[type="tel"], input[name*="phone"]',
    addressInput: 'input[name*="address"], input[name*="street"]',
    cityInput: 'input[name*="city"]',
    zipInput: 'input[name*="zip"], input[name*="postal"]',
    cardInput: 'input[name*="card"], input[name*="cardnumber"]',
    expiryInput: 'input[name*="expiry"], input[name*="exp"]',
    cvvInput: 'input[name*="cvv"], input[name*="cvc"]',

    // Payment methods
    paymentMethods: '.payment-methods, .payment-options',
    paymentMethodInput: 'input[name*="payment"], .payment-method input',

    // Buttons
    submitButton: 'button[type="submit"], .pay-btn, .continue-btn, .checkout-btn',
    backButton: '.back-btn, .previous-btn, button:contains("Back")',

    // Validation and errors
    errorMessage: '.error, .invalid, .required, .validation-error',
    successMessage: '.success, .confirmation, .thank-you',
    loadingIndicator: '.loading, .spinner, .processing',

    // Gift options
    giftCheckbox: 'input[type="checkbox"][id*="gift"], .gift-option',
    giftMessage: 'textarea[name*="gift"], textarea[id*="message"], .gift-message',
    recipientEmail: 'input[name*="recipient"], input[name*="gift-email"], .recipient-email',
    recipientName: 'input[name*="recipient-name"], input[name*="gift-name"], .recipient-name',

    // Coupon
    couponSection: '.coupon-section, .promo-code, .discount-code',
    couponInput: 'input[name*="coupon"], input[name*="promo"]',
    applyCouponBtn: '.apply-coupon, .apply-promo',

    // Order total
    orderTotal: '.order-total, .total-amount, .summary-total',
    subtotal: '.subtotal, .item-total',
    tax: '.tax, .vat',

    // Responsive design
    mobileView: 'iphone-x',
    tabletView: 'ipad-2',
  },
};
