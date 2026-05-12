// Sendsile Admin Configuration
export const Sendsile = {
 
  transactionHistory: {
    pageUrl: 'http://localhost:5173/super-admin/transactions',
    base: 'http://localhost:5173',
    loginPage: 'http://localhost:5173/login',
    
    // Test messages for comprehensive transaction history tests
    message01: 'should handle transaction status updates and actions',
    message02: 'should navigate to transaction history then click first transaction to view details',
    message03: 'should click on all clickable elements and test interactions',
    message04: 'should handle transaction search and filtering functionality',
    message05: 'should handle pagination and sorting',
    message06: 'should test transaction details page functionality',
    message07: 'should handle export functionality',
    message08: 'should handle date range filtering',
    message09: 'should be responsive on different viewports',
    
    // Page structure
    root: '#root, .transaction-container, .main-content, .admin-container',
    pageTitle: 'h1:contains("Transaction History"), h1:contains("Transactions"), .page-title, .admin-title',
    pageDescription: '.page-description, .admin-description, .subtitle',
    
    // Transaction table
    transactionTable: 'table, .table, .transaction-table, [data-testid="transaction-table"]',
    transactionRows: 'tbody tr, .transaction-row, [data-testid*="transaction-row"]',
    transactionClickSelector: 'tbody tr:first-child td:first-child, .transaction-link, [data-testid*="transaction-link"]',
    
    // Transaction details sections
    transactionInfoSection: '.transaction-info, .info-section, [data-testid*="transaction-info"]',
    paymentInfoSection: '.payment-info, .payment-section, [data-testid*="payment-info"]',
    customerInfoSection: '.customer-info, .customer-section, [data-testid*="customer-info"]',
    
    // Cancel order functionality
    cancelOrderButton: 'button:contains("Cancel Order"), button:contains("Cancel"), [data-testid*="cancel"], [data-action*="cancel"]',
    cancelButtonModal: '.cancel-order-modal, [data-testid="cancel-order-modal"]',
    confirmCancellationTitle: 'h2:contains("Confirm Cancellation"), .modal-title:contains("Confirm Cancellation")',
    dropdownSelector: '#\\:r6d\\:-form-item svg.h-4, [id*="-form-item"] svg.h-4',
    formItemSelector: '[id*="-form-item"], .form-item, [data-testid*="form-item"]',
    commentsField: '[name="comments"], textarea[name="comments"], [data-testid*="comments"]',
    confirmationButton: '#radix-\\:r3l\\: button.text-white, button:contains("Confirm"), button[type="submit"]',
    transitionContainerButton: '#transition-container button.text-white, .transition-container button.text-white',
    
    // Cancel order test data
    cancelOrderTestData: {
      reason: 'Item out of stock',
      comment: 'this is a comment',
      optionSelector: 'option[value="Item out of stock"]'
    },
    
    // Search and filter elements
    searchInput: 'input[type="search"], input[placeholder*="search"], input[name*="search"], [data-testid="search-input"]',
    filterButtons: 'button:contains("Filter"), .filter-button, [data-testid*="filter"]',
    dateInputs: 'input[type="date"], input[placeholder*="date"], [data-testid*="date-input"]',
    
    // Export functionality
    exportButton: '.export-button, button:contains("Export"), [data-testid="export-button"]',
    
    // Pagination and sorting
    paginationButtons: '.pagination button, .page-link, [data-testid*="pagination"]',
    sortableHeaders: 'th[sortable], th[data-sortable], .sortable, [data-testid*="sortable"]',
    
    // Form fields selectors (comprehensive)
    allInputs: 'input:not([type="checkbox"]):not([type="radio"]):not([type="file"]):not([type="submit"]):not([type="button"])',
    allTextareas: 'textarea',
    allSelects: 'select',
    allButtons: 'button:not([type="submit"]):not([type="reset"]):not([disabled])',
    
    // Specific field selectors
    textInputs: 'input[type="text"], input:not([type])',
    emailInputs: 'input[type="email"]',
    numberInputs: 'input[type="number"]',
    amountInputs: 'input[name*="amount"], input[placeholder*="amount"]',
    transactionIdInputs: 'input[name*="transaction"], input[placeholder*="transaction"]',
    
    // Dropdown and combobox selectors
    dropdowns: 'select, .dropdown, .combobox, [data-testid*="dropdown"]',
    comboboxButtons: '.combobox-button, [role="combobox"], [data-testid*="combobox"]',
    dropdownOptions: '[role="option"], .dropdown-option, .option, [data-testid*="option"]',
    
    // Status codes
    successStatus: 200,
    notFoundStatus: 404,
    errorStatus: 500,
    
    // Test configuration
    testConfig: {
      waitTimes: {
        pageLoad: 3000,
        authentication: 5000,
        navigation: 2000,
        formSubmission: 3000,
        apiResponse: 2000
      },
      timeouts: {
        default: 10000,
        long: 30000
      },
      retryAttempts: 3
    },
    
    // Test data
    testData: {
      validTransactionId: 'txn_1234567890',
      searchTerm: 'test',
      customerName: 'Test Customer',
      amount: '15000.00',
      currency: 'NGN',
      status: 'Completed',
      date: '2024-04-28',
      reference: 'REF-123456'
    },
    
    // Expected content
    expectedContent: {
      pageTitle: ['Transaction History', 'Transactions', 'transaction'],
      tableHeaders: ['Transaction ID', 'Amount', 'Status', 'Date', 'Customer'],
      statusOptions: ['Completed', 'Pending', 'Failed', 'Cancelled'],
      paymentMethods: ['Bank Transfer', 'Card', 'Wallet'],
      buttonText: ['View', 'Details', 'Export', 'Filter', 'Search'],
      errorMessages: ['Error', 'Failed', 'Unable to', 'No data'],
      successMessages: ['Success', 'Completed', 'Saved', 'Updated']
    },
    
    // Error handling selectors
    errorMessage: '.error, .alert-error, .message-error, [data-testid*="error"]',
    successMessage: '.success, .alert-success, .message-success, [data-testid*="success"]',
    warningMessage: '.warning, .alert-warning, .message-warning, [data-testid*="warning"]',
    notFoundMessage: '.not-found, .no-data, [data-testid*="not-found"]',
    
    // Sidebar navigation
    sidebar: '.sidebar, [data-testid="sidebar"]',
    navTransactions: '.nav-item:contains("Transactions"), [data-testid="nav-transactions"]',
    navHome: '.nav-item:contains("Home"), [data-testid="nav-home"]',
    navDashboard: '.nav-item:contains("Dashboard"), [data-testid="nav-dashboard"]',
    
    // API endpoints (for mocking)
    endpoints: {
      getTransactions: '/api/v1/backoffice-admin/transactions',
      getTransaction: '/api/v1/backoffice-admin/transactions/view/:id',
      searchTransactions: '/api/v1/backoffice-admin/transactions/search',
      exportTransactions: '/api/v1/backoffice-admin/transactions/export',
      filterTransactions: '/api/v1/backoffice-admin/transactions/filter'
    },
    
    // Status codes
    statusCodes: {
      success: 200,
      created: 201,
      badRequest: 400,
      unauthorized: 401,
      forbidden: 403,
      notFound: 404,
      serverError: 500
    }
  },

  inventory: {
    pageUrl: 'http://localhost:5173/super-admin/inventory',
    base: 'http://localhost:5173',
    
    // Test messages for comprehensive inventory tests
    message01: 'should load inventory page with basic structure',
    message02: 'should display summary cards with values',
    message03: 'should display products table correctly',
    message04: 'should handle search functionality',
    message05: 'should handle sorting functionality',
    message06: 'should handle filter functionality',
    message07: 'should handle export functionality',
    message08: 'should handle add product functionality',
    message09: 'should click on table product and fill details form',
    message10: 'should understand page structure and click first product',
    message11: 'should handle button interactions',
    message12: 'should handle link interactions',
    message13: 'should handle scroll functionality',
    message14: 'should display availability status correctly',
    message15: 'should handle pagination',
    message16: 'should handle rows per page',
    message17: 'should handle sidebar navigation',
    message18: 'should be responsive on different viewports',

    // Page structure
    root: '#root, .inventory-container, .main-content, .admin-container',
    pageTitle: 'h1:contains("Inventory List"), .page-title, .admin-title',
    pageDescription: '.page-description, .admin-description, .subtitle',

    // Summary cards
    summaryCards: '.summary-cards, .stats-container, .overview-cards',
    categoriesCard: '[data-testid="categories-card"], .summary-card:contains("Categories")',
    categoriesValue: '[data-testid="categories-value"], .summary-card .value',
    totalProductsCard: '[data-testid="total-products-card"], .summary-card:contains("Total Products")',
    totalProductsValue: '[data-testid="total-products-value"], .summary-card .value',
    inStockCard: '[data-testid="in-stock-card"], .summary-card:contains("In Stock")',
    inStockValue: '[data-testid="in-stock-value"], .summary-card .value',

    // Products table
    productsTable: 'table, .products-table, .data-table, .table-container',
    tableHeader: 'table th, .table-header, [data-testid="table-header"]',
    productRow: 'tbody tr, .product-row, [data-testid="product-row"]',
    productName: '.product-name, [data-testid="product-name"]',
    productImage: '.product-image, [data-testid="product-image"]',
    productSku: '.product-sku, [data-testid="product-sku"]',
    productCategory: '.product-category, [data-testid="product-category"]',
    productQuantity: '.product-quantity, [data-testid="product-quantity"]',
    productPrice: '.product-price, [data-testid="product-price"]',
    productAvailability: '.product-availability, [data-testid="product-availability"]',

    // Search and filter
    searchInput: 'input[type="search"], input[placeholder*="search"], .search-input, [data-testid="search-input"]',
    filterButton: '.filter-button, button:contains("Filter"), [data-testid="filter-button"]',
    filterModal: '.filter-modal, .filter-dropdown, [data-testid="filter-modal"]',
    filterDropdown: '.filter-dropdown, .filter-select, select, [data-testid="filter"]',

    // Sorting
    sortableColumns: 'th[sortable], .sortable, [data-testid*="sort"]',
    sortProduct: 'th:contains("Product"), [data-testid="sort-product"]',
    sortQuantity: 'th:contains("Quantity"), [data-testid="sort-quantity"]',
    sortPrice: 'th:contains("Price"), [data-testid="sort-price"]',

    // Export functionality
    exportButton: '.export-button, button:contains("Export"), [data-testid="export-button"]',

    // Add product
    addProductButton: '.add-product-button, button:contains("Add Product"), [data-testid="add-product-button"]',
    addProductModal: '.add-product-modal, [data-testid="add-product-modal"]',
    
    // Product interactions and form filling
    productClickSelectors: [
      '#transition-container tr:nth-child(1) td:nth-child(2) div.leading-[21px]',
      '#transition-container table.hidden tr:nth-child(3) td:nth-child(4)',
      'tbody tr:first-child td:nth-child(2)',
      'tbody tr:first-child .product-name',
      'tbody tr:first-child [data-testid="product-name"]',
      'tbody tr:first-child td:contains("AL- KYHAR ESSENTIALS")',
      'tbody tr:first-child td:contains("16301")',
      'tbody tr:first-child td.clickable',
      'tbody tr:first-child td.cursor-pointer',
      'tbody tr:first-child',
      'table tbody tr:first-child'
    ],
    productClickSelector: '#transition-container table.hidden tr:nth-child(3) td:nth-child(4)', // Primary selector
    productDetailsPage: '/super-admin/inventory/',
    productAddPage: 'http://localhost:5173/super-admin/inventory/add',
    productEditPage: '/super-admin/inventory/edit',
    
    // Form fields
    formInputs: 'input:visible',
    formTextareas: 'textarea:visible',
    formSelects: 'select:visible',
    fileInputs: 'input[type="file"]',
    
    // Form field types
    textInputs: 'input[type="text"], input:not([type])',
    emailInputs: 'input[type="email"]',
    numberInputs: 'input[type="number"]',
    dateInputs: 'input[type="date"]',
    telInputs: 'input[type="tel"]',
    
    // Form buttons
    submitButtons: 'button[type="submit"], button:contains("Save"), button:contains("Submit"), button:contains("Update"), button:contains("Create")',
    editButtons: 'button:contains("Edit"), button:contains("Modify"), button:contains("Update"), [data-testid*="edit"]',
    viewButtons: 'button:contains("View"), button:contains("Details"), [data-testid*="view"]',
    cancelButton: 'button:contains("Cancel"), button:contains("Close")',
    
    // Product details navigation
    navigationElements: 'button:contains("Edit"), button:contains("View"), button:contains("Details"), a:contains("Edit"), a:contains("View"), a:contains("Details"), .edit-btn, .view-btn, .details-btn',
    
    // Specific product targeting
    targetProduct: 'AL- KYHAR ESSENTIALS',
    targetSku: '16301',

    // Pagination
    pagination: '.pagination, .pager, .page-controls, [data-testid="pagination"]',
    nextButton: '.next-button, button:contains("Next"), [data-testid="next-button"]',
    prevButton: '.prev-button, button:contains("Previous"), [data-testid="prev-button"]',
    rowsPerPage: '.rows-per-page, select:contains("Showing"), [data-testid="rows-per-page"]',

    // Sidebar navigation
    sidebar: '.sidebar, [data-testid="sidebar"]',
    navInventory: '.nav-item:contains("Inventory"), [data-testid="nav-inventory"]',
    navHome: '.nav-item:contains("Home"), [data-testid="nav-home"]',
    navPartners: '.nav-item:contains("Partner Management"), [data-testid="nav-partners"]',
    navDashboard: '.nav-item:contains("Dashboard"), [data-testid="nav-dashboard"]',

    // Responsive design
    mobileMenu: '.mobile-menu, [data-testid="mobile-menu"]',
    mobileView: 'iphone-x',
    tabletView: 'ipad-2',
    desktopView: [1920, 1080],

    // Test configurations
    testConfig: {
      // Wait times in milliseconds
      waitTimes: {
        short: 500,
        medium: 1000,
        long: 2000,
        extraLong: 3000,
        authentication: 5000,
        pageLoad: 3000,
        formLoad: 2000,
        navigation: 1000,
        buttonClick: 1000,
        scrollWait: 500
      },

      // Form filling test data
      testData: {
        productName: 'Test Product Name',
        productDescription: 'Test product description with sufficient detail',
        productPrice: '99.99',
        productQuantity: '100',
        productSku: 'TEST-001',
        email: 'test@example.com',
        phone: '+1234567890',
        date: new Date().toISOString().split('T')[0],
        genericValue: 'Test Value'
      },

      // Form field validation
      formValidation: {
        skipDisabled: true,
        skipReadonly: true,
        skipFileInputs: true,
        useForceForSelects: true,
        maxButtonsToClick: 2
      }
    },

    // API endpoints (for mocking)
    endpoints: {
      getProducts: '/api/inventory',
      exportInventory: '/api/inventory/export',
      addProduct: '/api/inventory/add',
      getCategories: '/api/inventory/categories',
      viewProduct: '/api/inventory/view/:id',
      updateProduct: '/api/inventory/update/:id'
    },

    // Status codes
    successStatus: 200,
    errorStatus: 500,
    notFoundStatus: 404,
    conflictStatus: 409,
    badRequestStatus: 400,
    unauthorizedStatus: 401,
    forbiddenStatus: 403
  },

  partnerManagement: {
    pageUrl: 'http://localhost:5173/super-admin/partner-management',
    base: 'http://localhost:5173',
    
    // Test messages for comprehensive partner management tests
    message01: 'should load partner management page with basic structure',
    message02: 'should display summary cards with values',
    message03: 'should display partners table correctly',
    message04: 'should handle search functionality',
    message05: 'should handle sorting functionality',
    message06: 'should handle filter functionality',
    message07: 'should handle export functionality',
    message08: 'should handle add partner functionality',
    message09: 'should display partner status correctly',
    message10: 'should handle pagination',
    message11: 'should handle rows per page',
    message12: 'should handle sidebar navigation',
    message13: 'should be responsive on different viewports',

    // Page structure
    root: '#root, .partner-container, .main-content, .admin-container',
    pageTitle: 'h1:contains("Partner Management"), .page-title, .admin-title',
    pageDescription: '.page-description, .admin-description, .subtitle',

    // Summary cards
    summaryCards: '.summary-cards, .stats-container, .overview-cards',
    totalPartnersCard: '[data-testid="total-partners-card"], .summary-card:contains("Total Partners")',
    totalPartnersValue: '[data-testid="total-partners-value"], .summary-card .value',
    activePartnersCard: '[data-testid="active-partners-card"], .summary-card:contains("Active Partners")',
    activePartnersValue: '[data-testid="active-partners-value"], .summary-card .value',
    pendingPartnersCard: '[data-testid="pending-partners-card"], .summary-card:contains("Pending Partners")',
    pendingPartnersValue: '[data-testid="pending-partners-value"], .summary-card .value',

    // Partners table
    partnersTable: 'table, .partners-table, .data-table, .table-container',
    tableHeader: 'table th, .table-header, [data-testid="table-header"]',
    partnerRow: 'tbody tr, .partner-row, [data-testid="partner-row"]',
    partnerName: '.partner-name, [data-testid="partner-name"]',
    partnerEmail: '.partner-email, [data-testid="partner-email"]',
    partnerPhone: '.partner-phone, [data-testid="partner-phone"]',
    partnerStatus: '.partner-status, [data-testid="partner-status"]',
    partnerJoined: '.partner-joined, [data-testid="partner-joined"]',

    // Search and filter
    searchInput: 'input[type="search"], input[placeholder*="search"], .search-input, [data-testid="search-input"]',
    filterButton: '.filter-button, button:contains("Filter"), [data-testid="filter-button"]',
    filterModal: '.filter-modal, .filter-dropdown, [data-testid="filter-modal"]',
    filterDropdown: '.filter-dropdown, .filter-select, select, [data-testid="filter"]',

    // Sorting
    sortableColumns: 'th[sortable], .sortable, [data-testid*="sort"]',
    sortName: 'th:contains("Name"), [data-testid="sort-name"]',
    sortEmail: 'th:contains("Email"), [data-testid="sort-email"]',
    sortStatus: 'th:contains("Status"), [data-testid="sort-status"]',

    // Export functionality
    exportButton: '.export-button, button:contains("Export"), [data-testid="export-button"]',

    // Add partner
    addPartnerButton: '.add-partner-button, button:contains("Add Partner"), [data-testid="add-partner-button"]',
    addPartnerModal: '.add-partner-modal, [data-testid="add-partner-modal"]',

    // Pagination
    pagination: '.pagination, .pager, .page-controls, [data-testid="pagination"]',
    nextButton: '.next-button, button:contains("Next"), [data-testid="next-button"]',
    prevButton: '.prev-button, button:contains("Previous"), [data-testid="prev-button"]',
    rowsPerPage: '.rows-per-page, select:contains("Showing"), [data-testid="rows-per-page"]',

    // Sidebar navigation
    sidebar: '.sidebar, [data-testid="sidebar"]',
    navInventory: '.nav-item:contains("Inventory"), [data-testid="nav-inventory"]',
    navPartners: '.nav-item:contains("Partner Management"), [data-testid="nav-partners"]',
    navHome: '.nav-item:contains("Home"), [data-testid="nav-home"]',
    navDashboard: '.nav-item:contains("Dashboard"), [data-testid="nav-dashboard"]',

    // Responsive design
    mobileMenu: '.mobile-menu, [data-testid="mobile-menu"]',
    mobileView: 'iphone-x',
    tabletView: 'ipad-2',
    desktopView: [1920, 1080],

    // API endpoints (for mocking)
    endpoints: {
      getPartners: '/api/partners',
      exportPartners: '/api/partners/export',
      addPartner: '/api/partners/add',
      getPartnerStats: '/api/partners/stats'
    },

    // Status codes
    successStatus: 200,
    errorStatus: 500,
    notFoundStatus: 404,
    conflictStatus: 409,
    badRequestStatus: 400
  },

  transactions: {
    pageUrl: 'http://localhost:5173/super-admin/transactions',
    base: 'http://localhost:5173',
    
    // Test messages for comprehensive transactions tests
    message01: 'should load transactions page with basic structure',
    message02: 'should display summary cards with values',
    message03: 'should display transactions table correctly',
    message04: 'should handle search functionality',
    message05: 'should handle sorting functionality',
    message06: 'should handle filter functionality',
    message07: 'should handle export functionality',
    message08: 'should handle transaction details view',
    message09: 'should display transaction status correctly',
    message10: 'should handle pagination',
    message11: 'should handle rows per page',
    message12: 'should handle sidebar navigation',
    message13: 'should be responsive on different viewports',

    // Page structure
    root: '#root, .transactions-container, .main-content, .admin-container',
    pageTitle: 'h1:contains("Transactions"), .page-title, .admin-title',
    pageDescription: '.page-description, .admin-description, .subtitle',

    // Summary cards
    summaryCards: '.summary-cards, .stats-container, .overview-cards',
    totalTransactionsCard: '[data-testid="total-transactions-card"], .summary-card:contains("Total Transactions")',
    totalTransactionsValue: '[data-testid="total-transactions-value"], .summary-card .value',
    successfulTransactionsCard: '[data-testid="successful-transactions-card"], .summary-card:contains("Successful")',
    successfulTransactionsValue: '[data-testid="successful-transactions-value"], .summary-card .value',
    failedTransactionsCard: '[data-testid="failed-transactions-card"], .summary-card:contains("Failed")',
    failedTransactionsValue: '[data-testid="failed-transactions-value"], .summary-card .value',

    // Transactions table
    transactionsTable: 'table, .transactions-table, .data-table, .table-container',
    tableHeader: 'table th, .table-header, [data-testid="table-header"]',
    transactionRow: 'tbody tr, .transaction-row, [data-testid="transaction-row"]',
    transactionId: '.transaction-id, [data-testid="transaction-id"]',
    transactionAmount: '.transaction-amount, [data-testid="transaction-amount"]',
    transactionDate: '.transaction-date, [data-testid="transaction-date"]',
    transactionStatus: '.transaction-status, [data-testid="transaction-status"]',
    transactionType: '.transaction-type, [data-testid="transaction-type"]',

    // Search and filter
    searchInput: 'input[type="search"], input[placeholder*="search"], .search-input, [data-testid="search-input"]',
    filterButton: '.filter-button, button:contains("Filter"), [data-testid="filter-button"]',
    filterModal: '.filter-modal, .filter-dropdown, [data-testid="filter-modal"]',
    filterDropdown: '.filter-dropdown, .filter-select, select, [data-testid="filter"]',

    // Sorting
    sortableColumns: 'th[sortable], .sortable, [data-testid*="sort"]',
    sortDate: 'th:contains("Date"), [data-testid="sort-date"]',
    sortAmount: 'th:contains("Amount"), [data-testid="sort-amount"]',
    sortStatus: 'th:contains("Status"), [data-testid="sort-status"]',

    // Export functionality
    exportButton: '.export-button, button:contains("Export"), [data-testid="export-button"]',

    // Transaction details
    viewTransactionButton: '.view-transaction-button, button:contains("View"), [data-testid="view-transaction-button"]',
    transactionDetailsModal: '.transaction-details-modal, [data-testid="transaction-details-modal"]',

    // Pagination
    pagination: '.pagination, .pager, .page-controls, [data-testid="pagination"]',
    nextButton: '.next-button, button:contains("Next"), [data-testid="next-button"]',
    prevButton: '.prev-button, button:contains("Previous"), [data-testid="prev-button"]',
    rowsPerPage: '.rows-per-page, select:contains("Showing"), [data-testid="rows-per-page"]',

    // Sidebar navigation
    sidebar: '.sidebar, [data-testid="sidebar"]',
    navInventory: '.nav-item:contains("Inventory"), [data-testid="nav-inventory"]',
    navPartners: '.nav-item:contains("Partner Management"), [data-testid="nav-partners"]',
    navTransactions: '.nav-item:contains("Transactions"), [data-testid="nav-transactions"]',
    navHome: '.nav-item:contains("Home"), [data-testid="nav-home"]',
    navDashboard: '.nav-item:contains("Dashboard"), [data-testid="nav-dashboard"]',

    // Responsive design
    mobileMenu: '.mobile-menu, [data-testid="mobile-menu"]',
    mobileView: 'iphone-x',
    tabletView: 'ipad-2',
    desktopView: [1920, 1080],

    // API endpoints (for mocking)
    endpoints: {
      getTransactions: '/api/transactions',
      exportTransactions: '/api/transactions/export',
      getTransactionDetails: '/api/transactions/:id',
      getTransactionStats: '/api/transactions/stats'
    },

    // Status codes
    successStatus: 200,
    errorStatus: 500,
    
    // Metrics and statistics
    metrics: '[data-testid*="metric"], .metric, .stat, .statistics, .number-display',
    revenueMetrics: '[data-testid*="revenue"], .revenue, .revenue-metric',
    userMetrics: '[data-testid*="user"], .user, .user-metric, .users',
    orderMetrics: '[data-testid*="order"], .order, .order-metric, .orders',
    salesMetrics: '[data-testid*="sale"], .sale, .sales-metric, .sales',
    visitMetrics: '[data-testid*="visit"], .visit, .visit-metric, .visits',
    conversionMetrics: '[data-testid*="conversion"], .conversion, .conversion-metric',
    
    // Navigation elements
    navigation: '.nav, .navigation, .sidebar, .menu, [data-testid*="nav"], [data-testid*="sidebar"]',
    navigationItems: '.nav-item, .menu-item, .sidebar-item, [data-testid*="nav-item"]',
    breadcrumbs: '.breadcrumb, .page-indicator, [data-testid*="breadcrumb"]',
    navigationLinks: 'a, button, [role="button"]',
    
    // Date range and filters
    dateRangeSelector: '.date-range, .date-filter, [data-testid*="date"], .daterangepicker',
    dateRangeInputs: 'input[type="date"], input[name*="date"], [data-testid*="date-input"]',
    filterDropdown: '.filter-dropdown, .dropdown, [data-testid*="filter"]',
    filterOptions: '.filter-option, .dropdown-item, [data-testid*="filter-option"]',
    
    // Export functionality
    exportButton: '.export, .download, button:contains("Export"), button:contains("Download"), [data-testid*="export"]',
    exportOptions: '.export-option, .download-option, [data-testid*="export-option"]',
    
    // Refresh functionality
    refreshButton: '.refresh, button:contains("Refresh"), [data-testid*="refresh"]',
    refreshIcon: '.refresh-icon, .fa-refresh, [data-testid*="refresh-icon"]',
    
    // Interactive elements
    clickableElements: 'button, a[href], .clickable, [role="button"], [onclick]',
    tabs: '.tab, .nav-tab, [data-testid*="tab"]',
    tabContent: '.tab-content, .tab-pane, [data-testid*="tab-content"]',
    
  },

  addProduct: {
    pageUrl: 'http://localhost:5173/super-admin/inventory/add',
    base: 'http://localhost:5173',
    loginPage: 'http://localhost:5173/login',
    
    // Test messages for comprehensive add product tests
    message01: 'should load add product page with basic structure',
    message02: 'should display product form correctly',
    message03: 'should handle general information section',
    message04: 'should handle product variant section',
    message05: 'should handle image upload functionality',
    message06: 'should fill all form fields and submit successfully',
    message07: 'should validate required fields and show error messages',
    message08: 'should handle form validation errors',
    message09: 'should handle image upload and preview',
    message10: 'should handle multiple image uploads',
    message11: 'should handle variant management',
    message12: 'should handle category selection',
    message13: 'should handle partner selection',
    message14: 'should handle pricing inputs',
    message15: 'should handle inventory management',
    message16: 'should handle form submission success',
    message17: 'should handle form submission errors',
    message18: 'should be responsive on different viewports',

    // Page structure
    root: '#root, .add-product-container, .main-content, .admin-container',
    pageTitle: 'h1:contains("Add Product"), h1:contains("New Product"), .page-title, .admin-title',
    pageDescription: '.page-description, .admin-description, .subtitle',
    
    // Form container
    formContainer: '.add-product-form, .product-form, .form-container, [data-testid="add-product-form"]',
    transitionContainer: '#transition-container, .transition-container',
    
    // General Information section
    generalInfoSection: '.general-info, .product-info, .form-section:contains("General"), [data-testid="general-info"]',
    productNameInput: 'input[name*="name"], input[placeholder*="name"], [data-testid="product-name"]',
    productCategorySelect: 'select[name*="category"], [data-testid="category-select"]',
    productPartnerSelect: 'select[name*="partner"], [data-testid="partner-select"]',
    productDescriptionTextarea: 'textarea[name*="description"], textarea[placeholder*="description"], [data-testid="product-description"]',
    productListTextarea: 'textarea[name*="list"], textarea[placeholder*="list"], [data-testid="product-list"]',
    
    // Product Variants section
    variantsSection: '.variants-section, .product-variants, .form-section:contains("Variants"), [data-testid="variants-section"]',
    variantSelect: '[name="variants.0.variation"], [data-testid="variant-select"]',
    variantPriceInput: '[name*="variants"][name*="price"], [data-testid="variant-price"]',
    variantSkuInput: '[name*="variants"][name*="sku"], [data-testid="variant-sku"]',
    variantQuantityInput: '[name*="variants"][name*="quantity"], [data-testid="variant-quantity"]',
    variantDiscountInput: '[name*="variants"][name*="discount"], [data-testid="variant-discount"]',
    addVariantButton: 'button:contains("Add Variant"), button:contains("+ Variant"), [data-testid="add-variant"]',
    
    // Image upload functionality
    imageUploadSection: '.image-upload, .product-images, .form-section:contains("Images"), [data-testid="image-upload"]',
    mainImageUpload: '[data-testid="main-image-upload"], .main-image-upload, input[type="file"][accept*="image"]:first',
    additionalImagesUpload: '[data-testid="additional-images-upload"], .additional-images-upload, input[type="file"][multiple]',
    imagePreview: '[data-testid="image-preview"], .image-preview, img[src*="data:image"]',
    additionalImagePreview: '[data-testid="additional-images-preview"], .additional-images-preview, .gallery-preview',
    
    // Form submission
    submitButton: '#transition-container button.w-fit p, button[type="submit"], button:contains("Save"), button:contains("Create"), [data-testid="submit-button"]',
    cancelButton: 'button:contains("Cancel"), button:contains("Back"), [data-testid="cancel-button"]',
    saveButton: 'button:contains("Save"), button:contains("Save Product"), [data-testid="save-button"]',
    
    // Form validation
    errorMessage: '[data-testid="error-message"], .error-message, .alert-error, .validation-error',
    successMessage: '[data-testid="success-message"], .success-message, .alert-success, .notification-success',
    fieldError: '.field-error, .form-error, .error-text, [data-testid*="error"]',
    
    // Form field selectors (comprehensive)
    allInputs: 'input:not([type="checkbox"]):not([type="radio"]):not([type="file"]):not([type="submit"]):not([type="button"])',
    allTextareas: 'textarea',
    allSelects: 'select',
    allCheckboxes: 'input[type="checkbox"], input[type="radio"]',
    allButtons: 'button:not([type="submit"]):not([type="reset"]):not([disabled])',
    
    // Specific field selectors
    textInputs: 'input[type="text"], input:not([type])',
    emailInputs: 'input[type="email"]',
    numberInputs: 'input[type="number"]',
    priceInputs: 'input[name*="price"], input[placeholder*="price"]',
    quantityInputs: 'input[name*="quantity"], input[placeholder*="quantity"], input[name*="stock"]',
    skuInputs: 'input[name*="sku"], input[placeholder*="sku"]',
    
    // Dropdown and combobox selectors
    dropdowns: 'select, .dropdown, .combobox, [data-testid*="dropdown"]',
    comboboxButtons: '.combobox-button, [role="combobox"], [data-testid*="combobox"]',
    dropdownOptions: '[role="option"], .dropdown-option, .option, [data-testid*="option"]',
    
    // Image upload selectors (comprehensive)
    imageUploadSelectors: [
      '[data-testid="main-image-upload"]',
      '.main-image-upload',
      'input[type="file"][data-testid="main-image"]',
      '[data-testid="product-image"]',
      '.product-image-upload',
      'input[type="file"][data-testid="product-image"]',
      '[data-testid="image-upload"]',
      '.image-upload',
      'input[type="file"][data-testid="image"]',
      '[data-testid="photo-upload"]',
      '.photo-upload',
      'input[type="file"][data-testid="photo"]',
      '[data-testid="file-upload"]',
      '.file-upload',
      'input[type="file"][data-testid="file"]',
      'input[type="file"][accept*="image"]',
      'input[type="file"][name*="image"]',
      'input[type="file"][name*="photo"]',
      'input[type="file"][name*="picture"]',
      '.upload-image',
      '.upload-photo',
      '.upload-file',
      '[class*="upload"][class*="image"]',
      '[class*="upload"][class*="photo"]',
      'input[type="file"]'
    ],
    
    additionalImageUploadSelectors: [
      '[data-testid="additional-images-upload"]',
      '.additional-images-upload',
      'input[type="file"][data-testid="additional-images"]',
      '[data-testid="multiple-images-upload"]',
      '.multiple-images-upload',
      'input[type="file"][data-testid="multiple-images"]',
      '[data-testid="gallery-upload"]',
      '.gallery-upload',
      'input[type="file"][data-testid="gallery"]',
      '[data-testid="product-images-upload"]',
      '.product-images-upload',
      'input[type="file"][data-testid="product-images"]',
      '[data-testid="images-upload"]',
      '.images-upload',
      'input[type="file"][data-testid="images"]',
      '[data-testid="more-images-upload"]',
      '.more-images-upload',
      'input[type="file"][data-testid="more-images"]',
      'input[type="file"][multiple]',
      'input[type="file"][accept*="image"][multiple]',
      'input[type="file"][name*="images"]',
      'input[type="file"][name*="gallery"]',
      'input[type="file"][name*="photos"]',
      '.upload-multiple-images',
      '.upload-gallery',
      '[class*="upload"][class*="multiple"]'
    ],
    
    // Image preview selectors
    imagePreviewSelectors: [
      '[data-testid="image-preview"]',
      '.image-preview',
      '.uploaded-image',
      '.preview-image',
      '.image-thumbnail',
      '.photo-preview',
      '.file-preview',
      '[data-testid="preview"]',
      '.preview',
      'img[src*="data:image"]',
      'img[src*="blob:"]',
      'img[src*="base64"]',
      '[class*="preview"][class*="image"]',
      '[class*="thumbnail"][class*="image"]',
      '.upload-preview',
      '.file-preview-image'
    ],
    
    additionalImagePreviewSelectors: [
      '[data-testid="additional-images-preview"]',
      '.additional-images-preview',
      '.uploaded-additional-images',
      '.gallery-preview',
      '.multiple-images-preview',
      '.product-images-preview',
      '[data-testid="gallery-preview"]',
      '.gallery-preview',
      '[data-testid="multiple-preview"]',
      '.multiple-preview',
      '.images-preview',
      '[data-testid="additional-preview"]',
      '.additional-preview',
      'img[src*="data:image"]:not(:first)',
      'img[src*="blob:"]:not(:first)',
      'img[src*="base64"]:not(:first)',
      '[class*="preview"][class*="additional"]',
      '[class*="preview"][class*="multiple"]',
      '.upload-preview-multiple',
      '.gallery-thumbnails'
    ],
    
    // Error message selectors (comprehensive)
    errorSelectors: [
      '[data-testid="error-message"]',
      '.error-message',
      '.alert-error',
      '.validation-error',
      '.error',
      '.alert-danger',
      '.danger',
      '.text-red-500',
      '.text-red-600',
      '.text-error',
      '.field-error',
      '.form-error',
      '.invalid-feedback',
      '.error-text',
      '[role="alert"]',
      '.notification-error',
      '.message-error',
      '.required-field',
      '.field-required',
      '.validation-message',
      '.error-container'
    ],
    
    serverErrorSelectors: [
      '[data-testid="server-error"]',
      '.server-error',
      '.api-error',
      '.validation-summary',
      '.error-summary',
      '.alert-danger',
      '.alert-error',
      '.notification-error',
      '.error-list',
      '.validation-errors',
      '.form-errors'
    ],
    
    // Test data
    testData: {
      productName: 'Test Product Name',
      productDescription: 'This is a comprehensive test product description with all the necessary details including features, specifications, benefits, and usage instructions. The product is designed to meet customer needs and provide excellent value.',
      productPrice: '99.99',
      productSku: 'TEST-001',
      productQuantity: '100',
      variantName: '6 pieces',
      variantPrice: '899',
      variantDiscount: '10',
      email: 'test@example.com',
      phone: '+1234567890',
      genericValue: 'Test Value',
      
      // Additional test data for comprehensive filling
      brandName: 'Test Brand Name',
      modelName: 'Test Model Name',
      costPrice: '50.00',
      retailPrice: '149.99',
      wholesalePrice: '75.00',
      barcode: '1234567890123',
      isbn: '978-0-123456-78-9',
      upc: '012345678901',
      mpn: 'MPN123456',
      gtin: '01234567890123',
      weight: '1.5',
      height: '10',
      width: '5',
      length: '15',
      color: 'Red',
      size: 'Medium',
      material: 'Cotton',
      tags: 'test,product,demo',
      
      // Variant test data
      variantSize: 'Large',
      variantColor: 'Blue',
      variantStyle: 'Modern',
      variantWeight: '2.0',
      variantHeight: '12',
      variantSku: 'TEST-VAR-001',
      variantBarcode: '9876543210987'
    },
    
    // Test configurations
    testConfig: {
      // Wait times in milliseconds
      waitTimes: {
        short: 500,
        medium: 1000,
        long: 2000,
        extraLong: 3000,
        authentication: 5000,
        pageLoad: 3000,
        formLoad: 2000,
        navigation: 1000,
        buttonClick: 1000,
        scrollWait: 500,
        formSubmission: 3000
      },

      // Form filling configuration
      formFilling: {
        skipDisabled: true,
        skipReadonly: true,
        skipFileInputs: true,
        useForceForSelects: true,
        maxButtonsToClick: 2,
        fillAllFields: true,
        comprehensiveFilling: true
      },

      // Image upload configuration
      imageUpload: {
        skipFixtureUpload: true,
        useTestImage: true,
        testImageName: 'test-image.png',
        testImageType: 'image/png',
        waitAfterUpload: 2000,
        forceUpload: true
      },

      // Validation configuration
      validation: {
        checkRequiredFields: true,
        checkErrorMessages: true,
        checkServerValidation: true,
        waitForValidation: 1000
      }
    },

    // API endpoints (for mocking)
    endpoints: {
      addProduct: '/api/inventory/add',
      uploadImage: '/api/inventory/upload-image',
      getCategories: '/api/inventory/categories',
      getPartners: '/api/inventory/partners',
      validateProduct: '/api/inventory/validate',
      checkSku: '/api/inventory/check-sku'
    },

    // Status codes
    successStatus: 200,
    createdStatus: 201,
    errorStatus: 500,
    notFoundStatus: 404,
    conflictStatus: 409,
    badRequestStatus: 400,
    unauthorizedStatus: 401,
    forbiddenStatus: 403,
    validationErrorStatus: 422
  },

  productDetails: {
    pageUrl: 'http://localhost:5173/super-admin/inventory/e9142bbb-9bbc-47a6-a7db-5bfae66b583f',
    base: 'http://localhost:5173',
    loginPage: 'http://localhost:5173/login',
    
    // Test messages for comprehensive product details tests
    message01: 'should load product details page with basic structure',
    message02: 'should display product information correctly',
    message03: 'should validate general information fields',
    message04: 'should validate product variant fields',
    message05: 'should display product images correctly',
    message06: 'should handle back button navigation',
    message07: 'should handle edit functionality',
    message08: 'should handle delete functionality',
    message09: 'should handle invalid product ID',
    message10: 'should validate API responses',
    message11: 'should handle loading states',
    message12: 'should be responsive on different viewports',

    // Page structure
    root: '#root, .product-details-container, .main-content, .admin-container',
    pageTitle: 'h1:contains("Product Details"), h1:contains("Product"), .page-title, [data-testid="page-title"]',
    pageDescription: '.page-description, .admin-description, .subtitle',
    
    // Navigation elements
    backButton: '[data-testid="back-button"], button:contains("Back"), button:contains("←"), .back-button, [data-testid*="back"]',
    editButton: '[data-testid="edit-button"], button:contains("Edit"), button:contains("Modify"), .edit-button, [data-testid*="edit"]',
    deleteButton: '[data-testid="delete-button"], button:contains("Delete"), button:contains("Remove"), .delete-button, [data-testid*="delete"]',
    
    // Product sections
    productImagesSection: '[data-testid="product-images"], .product-images, .image-gallery, [data-testid="images"]',
    generalInfoSection: '[data-testid="general-info"], .general-info, .product-info, [data-testid="general"]',
    variantSection: '[data-testid="product-variants"], .product-variants, .variant-section, [data-testid="variants"]',
    
    // General Information fields
    productName: '[data-testid="product-name"], .product-name, [data-testid*="name"]',
    productCategory: '[data-testid="product-category"], .product-category, [data-testid*="category"]',
    productBrand: '[data-testid="product-brand"], .product-brand, [data-testid*="brand"]',
    productDescription: '[data-testid="product-description"], .product-description, [data-testid*="description"]',
    productList: '[data-testid="product-list"], .product-list, [data-testid*="list"]',
    productPartner: '[data-testid="product-partner"], .product-partner, [data-testid*="partner"]',
    productSku: '[data-testid="product-sku"], .product-sku, [data-testid*="sku"]',
    productPrice: '[data-testid="product-price"], .product-price, [data-testid*="price"]',
    productQuantity: '[data-testid="product-quantity"], .product-quantity, [data-testid*="quantity"]',
    productStatus: '[data-testid="product-status"], .product-status, [data-testid*="status"]',
    
    // Product Variant fields
    variantName: '[data-testid="variant-name"], .variant-name, [data-testid*="variant-name"]',
    variantPrice: '[data-testid="variant-price"], .variant-price, [data-testid*="variant-price"]',
    variantSku: '[data-testid="variant-sku"], .variant-sku, [data-testid*="variant-sku"]',
    variantQuantity: '[data-testid="variant-quantity"], .variant-quantity, [data-testid*="variant-quantity"]',
    variantAvailability: '[data-testid="variant-availability"], .variant-availability, [data-testid*="variant-availability"]',
    variantDiscount: '[data-testid="variant-discount"], .variant-discount, [data-testid*="variant-discount"]',
    variation: '[data-testid="variation"], .variation, [data-testid*="variation"]',
    
    // Product images
    mainImage: '[data-testid="main-image"], .main-image, .product-image img, [data-testid*="main-image"]',
    thumbnailImages: '[data-testid="thumbnail"], .thumbnail, .product-thumbnail, [data-testid*="thumbnail"]',
    imageGallery: '[data-testid="image-gallery"], .image-gallery, .gallery, [data-testid*="gallery"]',
    
    // Loading and error states
    loadingIndicator: '[data-testid="loading"], .loading, .spinner, [data-testid*="loading"]',
    errorMessage: '[data-testid="error-message"], .error-message, .alert-error, [data-testid*="error"]',
    notFoundMessage: '[data-testid="not-found"], .not-found, .error-404, [data-testid*="not-found"]',
    
    // Delete confirmation modal
    deleteModal: '[data-testid="delete-modal"], .delete-modal, .confirm-modal, [data-testid*="delete-modal"]',
    confirmDeleteButton: '[data-testid="confirm-delete"], button:contains("Delete"), button:contains("Confirm"), [data-testid*="confirm"]',
    cancelDeleteButton: '[data-testid="cancel-delete"], button:contains("Cancel"), button:contains("Close"), [data-testid*="cancel"]',
    
    // Test data
    testData: {
      validProductId: 'e9142bbb-9bbc-47a6-a7db-5bfae66b583f',
      invalidProductId: '99999999-9999-9999-9999-999999999999',
      productName: 'AL- KYHAR ESSENTIALS',
      productCategory: 'Essentials',
      productBrand: 'KYHAR',
      productDescription: 'Essential product description',
      productPartner: 'Partner Name',
      productSku: '16301',
      productPrice: '99.99',
      productQuantity: '100',
      variantName: '6 pieces',
      variantPrice: '899',
      variantSku: 'VAR-001',
      variantQuantity: '50'
    },
    
    // API endpoints
    endpoints: {
      getProduct: '/api/inventory/product/:id',
      deleteProduct: '/api/inventory/product/:id',
      updateProduct: '/api/inventory/product/:id',
      getProductImages: '/api/inventory/product/:id/images'
    },
    
    // Test configurations
    testConfig: {
      waitTimes: {
        short: 500,
        medium: 1000,
        long: 2000,
        extraLong: 3000,
        authentication: 5000,
        pageLoad: 3000,
        navigation: 1000,
        apiResponse: 2000,
        imageLoad: 2000
      },
      
      // API intercept configuration
      apiIntercept: {
        enableMocks: true,
        mockDelay: 1000,
        validateResponses: true
      }
    },
    
    // Status codes
    successStatus: 200,
    notFoundStatus: 404,
    errorStatus: 500,
    unauthorizedStatus: 401,
    forbiddenStatus: 403
  },

  analytics: {
    pageUrl: 'http://localhost:5173/super-admin/analytics',
    base: 'http://localhost:5173',
    
    // Test messages for comprehensive analytics tests
    message01: 'should load analytics page with basic structure',
    message02: 'should display analytics dashboard with metrics',
    message03: 'should display charts and graphs correctly',
    message04: 'should handle date range selection',
    message05: 'should handle filter functionality',
    message06: 'should handle export functionality',
    message07: 'should handle refresh functionality',
    message08: 'should display revenue charts',
    message09: 'should display user activity metrics',
    message10: 'should handle responsive design',
    message11: 'should handle sidebar navigation',
    message12: 'should test all clickable elements',
    
    // Viewport sizes for responsive testing
    mobileView: [375, 667],
    tabletView: [768, 1024],
    desktopView: [1920, 1080],

    // Comprehensive selectors for analytics elements
    selectors: {
      // Page structure
      pageTitle: 'h1, h2, .page-title, [data-testid="page-title"]',
      dashboard: '.analytics-dashboard, .dashboard-container, .metrics-container, .stats-container, [data-testid*="dashboard"]',
      root: '#root, body',
      
      // Charts and graphs
      charts: '.chart-container, .graph-container, .chart, .graph, [data-testid*="chart"], canvas, svg',
      chartsCanvas: 'canvas',
      chartsSvg: 'svg',
      
      // Metrics and statistics
      metrics: '[data-testid*="metric"], .metric, .stat, .statistics, .number-display',
      revenueMetrics: '[data-testid*="revenue"], .revenue, .revenue-metric',
      userMetrics: '[data-testid*="user"], .user, .user-metric, .users',
      orderMetrics: '[data-testid*="order"], .order, .order-metric, .orders',
      salesMetrics: '[data-testid*="sale"], .sale, .sales-metric, .sales',
      visitMetrics: '[data-testid*="visit"], .visit, .visit-metric, .visits',
      conversionMetrics: '[data-testid*="conversion"], .conversion, .conversion-metric',
      
      // Navigation elements
      navigation: '.nav, .navigation, .sidebar, .menu, [data-testid*="nav"], [data-testid*="sidebar"]',
      navigationItems: '.nav-item, .menu-item, .sidebar-item, [data-testid*="nav-item"]',
      breadcrumbs: '.breadcrumb, .page-indicator, [data-testid*="breadcrumb"]',
      navigationLinks: 'a, button, [role="button"]',
      
      // Date range and filters
      dateRangeSelector: '.date-range, .date-filter, [data-testid*="date"], .daterangepicker',
      dateRangeInputs: 'input[type="date"], input[name*="date"], [data-testid*="date-input"]',
      filterDropdown: '.filter-dropdown, .dropdown, [data-testid*="filter"]',
      filterOptions: '.filter-option, .dropdown-item, [data-testid*="filter-option"]',
      
      // Export functionality
      exportButton: '.export, .download, button:contains("Export"), button:contains("Download"), [data-testid*="export"]',
      exportOptions: '.export-option, .download-option, [data-testid*="export-option"]',
      
      // Refresh functionality
      refreshButton: '.refresh, button:contains("Refresh"), [data-testid*="refresh"]',
      refreshIcon: '.refresh-icon, .fa-refresh, [data-testid*="refresh-icon"]',
      
      // Interactive elements
      clickableElements: 'button, a[href], .clickable, [role="button"], [onclick]',
      tabs: '.tab, .nav-tab, [data-testid*="tab"]',
      tabContent: '.tab-content, .tab-pane, [data-testid*="tab-content"]',
      
      // Data tables and lists
      dataTable: 'table, .data-table, .table, [data-testid*="table"]',
      dataRows: 'tr, .data-row, .table-row, [data-testid*="row"]',
      dataLists: 'ul, ol, .list, [data-testid*="list"]',
      
      // Loading and error states
      loadingIndicator: '.loading, .spinner, .loader, [data-testid*="loading"]',
      errorMessage: '.error, .error-message, [data-testid*="error"]',
      emptyState: '.empty, .no-data, [data-testid*="empty"]'
    },

    // Chart types and configurations
    chartTypes: {
      line: '.line-chart, .chart-line, [data-testid*="line"]',
      bar: '.bar-chart, .chart-bar, [data-testid*="bar"]',
      pie: '.pie-chart, .chart-pie, [data-testid*="pie"]',
      doughnut: '.doughnut-chart, .chart-doughnut, [data-testid*="doughnut"]',
      area: '.area-chart, .chart-area, [data-testid*="area"]',
      scatter: '.scatter-chart, .chart-scatter, [data-testid*="scatter"]'
    },

    // Date range configurations
    dateRanges: {
      today: 'Today',
      yesterday: 'Yesterday',
      last7Days: 'Last 7 Days',
      last30Days: 'Last 30 Days',
      lastMonth: 'Last Month',
      thisMonth: 'This Month',
      lastQuarter: 'Last Quarter',
      thisQuarter: 'This Quarter',
      lastYear: 'Last Year',
      thisYear: 'This Year',
      custom: 'Custom Range'
    },

    // Export formats
    exportFormats: {
      pdf: 'PDF',
      excel: 'Excel',
      csv: 'CSV',
      json: 'JSON',
      png: 'PNG',
      jpg: 'JPG'
    },

    // Test configurations
    testConfig: {
      // Wait times in milliseconds
      waitTimes: {
        short: 500,
        medium: 1000,
        long: 2000,
        extraLong: 3000,
        authentication: 5000,
        pageLoad: 3000,
        chartLoad: 2000,
        navigation: 1000,
        export: 2000
      },

      // Performance testing
      performance: {
        maxLoadTime: 10000, // 10 seconds
        maxApiResponseTime: 5000, // 5 seconds
        chartRenderTime: 3000 // 3 seconds
      },

      // Viewport testing
      viewportTesting: {
        switchDelay: 1000,
        validationDelay: 500
      },

      // Element testing
      elementTesting: {
        scrollWaitTime: 500,
        clickWaitTime: 1000,
        visibilityCheckDelay: 200
      },

      // Data validation
      dataValidation: {
        refreshWaitTime: 2000,
        dataLoadTimeout: 5000
      }
    },

    // Expected text content and data
    expectedContent: {
      pageTitle: ['Analytics', 'analytics', 'ANALYTICS'],
      dashboardTypes: ['Analytics Dashboard', 'Dashboard', 'Metrics', 'Statistics'],
      dataTypes: ['Revenue', 'Users', 'Orders', 'Sales', 'Visits', 'Conversion'],
      chartTypes: ['Chart', 'Graph', 'Visualization', 'Report'],
      navigationItems: ['Home', 'Dashboard', 'Analytics', 'Reports', 'Settings'],
      filterLabels: ['Date Range', 'Filter', 'Period', 'Time Range'],
      exportLabels: ['Export', 'Download', 'Save', 'Generate Report'],
      refreshLabels: ['Refresh', 'Reload', 'Update'],
      errorMessages: ['Error', 'Failed', 'Unable to', 'No data'],
      emptyMessages: ['No data', 'No results', 'Empty', 'No records']
    },

    // API endpoints (for mocking)
    endpoints: {
      getAnalytics: '/api/analytics',
      getRevenueData: '/api/analytics/revenue',
      getUserActivity: '/api/analytics/users',
      exportAnalytics: '/api/analytics/export',
      getMetrics: '/api/analytics/metrics'
    },

    // Status codes
    successStatus: 200,
    errorStatus: 500,
    notFoundStatus: 404,
    conflictStatus: 409,
    badRequestStatus: 400,
    unauthorizedStatus: 401,
    forbiddenStatus: 403
  },

  dashboard: {
    pageUrl: 'http://localhost:5173/super-admin/dashboard',
    base: 'http://localhost:5173',
    loginUrl: 'http://localhost:5173/login',
    
    // Authentication credentials
    testAccessToken: 'test-access-token',
    authToken: 'Bearer test-access-token',
    email: "segunibidokun@gmail.com",
    password: "Makanaky",
    userData: {
      name: "Admin User",
      email: "segunibidokun@gmail.com",
      phone: "08012345678",
      role: "admin"
    },
    persistedLocation: { state: { isOpen: false, location: 'nigeria' }, version: 0 },
    
    // Test messages for comprehensive dashboard tests
    message01: 'should load dashboard with basic structure',
    message02: 'should display summary cards with metrics',
    message03: 'should display navigation menu correctly',
    message04: 'should handle View List button clicks',
    message05: 'should handle Manage Inventory navigation',
    message06: 'should handle View Transactions navigation',
    message07: 'should be responsive on different viewports',
    message08: 'should handle all interactive elements',
    message09: 'should handle user interactions properly',
    message10: 'should validate form inputs and submissions',
    message11: 'should handle navigation flows correctly',
    message12: 'should display data correctly',
    message13: 'should handle error states gracefully',

    // Page structure
    root: '#root, .dashboard-container, .main-content, .admin-container',
    pageTitle: 'h1:contains("Dashboard"), .page-title, .admin-title',
    pageDescription: '.page-description, .admin-description, .subtitle',
    mainContent: '.main-content, .dashboard-content, .content-area',

    // Summary cards and metrics
    summaryCards: '.summary-cards, .stats-container, .overview-cards, .metrics-grid',
    totalUsersCard: '[data-testid="total-users-card"], .summary-card:contains("Total Users"), .metric-card:contains("Users")',
    totalUsersValue: '[data-testid="total-users-value"], .summary-card .value, .metric-value',
    totalRevenueCard: '[data-testid="total-revenue-card"], .summary-card:contains("Total Revenue"), .metric-card:contains("Revenue")',
    totalRevenueValue: '[data-testid="total-revenue-value"], .summary-card .value, .metric-value',
    totalOrdersCard: '[data-testid="total-orders-card"], .summary-card:contains("Total Orders"), .metric-card:contains("Orders")',
    totalOrdersValue: '[data-testid="total-orders-value"], .summary-card .value, .metric-value',

    // View List buttons
    viewListButtons: '.view-list, button:contains("View"), a:contains("View"), [data-testid*="view"]',
    totalUsersViewList: '.card button:contains("View"), .stat-card button:contains("View"), [data-testid*="users-view"]',
    totalRevenueViewList: '.card button:contains("View"), .stat-card button:contains("View"), [data-testid*="revenue-view"]',
    totalOrdersViewList: '.card button:contains("View"), .stat-card button:contains("View"), [data-testid*="orders-view"]',

    // Navigation menu
    navigation: '.nav, .navigation, .sidebar, .menu, [data-testid*="nav"], [data-testid*="sidebar"]',
    navigationItems: '.nav-item, .menu-item, .sidebar-item, li, [data-testid*="nav-item"]',
    manageInventoryLink: 'nav li:contains("Manage Inventory"), sidebar li:contains("Manage Inventory"), [data-testid*="manage-inventory"]',
    viewTransactionsLink: 'nav li:contains("View Transactions"), sidebar li:contains("View Transactions"), [data-testid*="view-transactions"]',
    dashboardLink: '.nav-item:contains("Dashboard"), [data-testid="nav-dashboard"]',
    inventoryLink: '.nav-item:contains("Inventory"), [data-testid="nav-inventory"]',
    transactionsLink: '.nav-item:contains("Transactions"), [data-testid="nav-transactions"]',
    analyticsLink: '.nav-item:contains("Analytics"), [data-testid="nav-analytics"]',

    // Interactive elements
    buttons: 'button, input[type="button"], input[type="submit"], .btn, [role="button"]',
    clickableElements: 'button, a[href], .clickable, [role="button"], [onclick]',
    links: 'a[href], .link, [data-testid*="link"]',
    forms: 'form, .form, [data-testid*="form"]',
    inputs: 'input, select, textarea, [data-testid*="input"]',

    // Responsive design
    mobileMenu: '.mobile-menu, [data-testid="mobile-menu"], .hamburger',
    mobileView: [375, 667],
    tabletView: [768, 1024],
    desktopView: [1920, 1080],
    viewports: [
      { name: 'Mobile', width: 375, height: 667 },
      { name: 'Tablet', width: 768, height: 1024 },
      { name: 'Desktop', width: 1920, height: 1080 }
    ],

    // Authentication and login
    loginForm: '.login-form, .auth-form, [data-testid*="login"]',
    emailInput: 'input[type="email"], input[name*="email"], input[placeholder*="email"], [data-testid*="email"]',
    passwordInput: 'input[type="password"], input[name*="password"], input[placeholder*="password"], [data-testid*="password"]',
    loginButton: 'button[type="submit"], button:contains("Login"), button:contains("Sign in"), [data-testid*="login"]',

    // Test configurations
    testConfig: {
      // Wait times in milliseconds
      waitTimes: {
        short: 500,
        medium: 1000,
        long: 2000,
        extraLong: 3000,
        authentication: 5000,
        pageLoad: 3000,
        navigation: 2000,
        elementLoad: 1000
      },

      // Performance testing
      performance: {
        maxLoadTime: 10000, // 10 seconds
        maxApiResponseTime: 5000, // 5 seconds
        elementRenderTime: 3000 // 3 seconds
      },

      // Viewport testing
      viewportTesting: {
        switchDelay: 1000,
        validationDelay: 500,
        responsiveCheckDelay: 200
      },

      // Element testing
      elementTesting: {
        scrollWaitTime: 500,
        clickWaitTime: 1000,
        visibilityCheckDelay: 200,
        interactionDelay: 300
      }
    },

    // Expected text content and data
    expectedContent: {
      pageTitle: ['Dashboard', 'dashboard', 'DASHBOARD'],
      cardTitles: ['Total Users', 'Total Revenue', 'Total Orders'],
      navigationItems: ['Manage Inventory', 'View Transactions', 'Dashboard', 'Analytics'],
      buttonText: ['View', 'View List', 'Manage', 'Transactions'],
      metrics: ['Users', 'Revenue', 'Orders', 'Sales'],
      errorMessages: ['Error', 'Failed', 'Unable to', 'No data'],
      successMessages: ['Success', 'Complete', 'Saved', 'Updated']
    },

    // API endpoints (for mocking)
    endpoints: {
      getDashboard: '/api/dashboard',
      getMetrics: '/api/dashboard/metrics',
      getUserStats: '/api/dashboard/users',
      getRevenueStats: '/api/dashboard/revenue',
      getOrderStats: '/api/dashboard/orders',
      exportData: '/api/dashboard/export'
    },

    // Status codes
    successStatus: 200,
    errorStatus: 500,
    notFoundStatus: 404,
    conflictStatus: 409,
    badRequestStatus: 400,
    unauthorizedStatus: 401,
    forbiddenStatus: 403
  }
};

export default Sendsile;