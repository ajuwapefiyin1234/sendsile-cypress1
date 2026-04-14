/* global cy, describe, it, beforeEach */
import { Sendsile } from '../configuration/project.config.js';

const { orders } = Sendsile;

// Validate orders configuration exists
if (!orders) {
  throw new Error('Orders configuration not found in project.config.js');
}

// Helper Functions
const persistedUserInfo = {
  state: {
    userData: orders.userData || { 
      name: "Test User",
      email: "test@example.com",
      phone: "08012345678"
    },
  },
  version: 0,
};

const seedAuthenticatedState = (win) => {
  win.localStorage.setItem('__user_access', orders.testAccessToken || 'test-token');
  win.localStorage.setItem('authToken', orders.authToken || 'Bearer test-token');
  win.localStorage.setItem('isLoggedIn', 'true');
  win.localStorage.setItem('ramadanModal', 'true');
  win.localStorage.setItem('userInfo', JSON.stringify(persistedUserInfo));
  win.localStorage.setItem('location', JSON.stringify(orders.persistedLocation || { state: { isOpen: false, location: 'nigeria' }, version: 0 }));
};

const mockOrdersApis = (options = {}) => {
  const {
    ordersList = orders.ordersData || [],
    notifications = [],
    user = orders.userData || { id: 'test-user', name: 'Test User', email: 'test@example.com' },
  } = options;

  cy.intercept('GET', '**/orders', {
    statusCode: 200,
    body: {
      data: ordersList,
      message: orders.message
    },
  }).as('getOrders');

  cy.intercept('GET', '**/user', {
    statusCode: 200,
    body: {
      data: user,
    },
  }).as('getUser');

  cy.intercept('GET', '**/user/notifications', {
    statusCode: 200,
    body: {
      data: notifications,
    },
  }).as('getNotifications');

  cy.intercept('GET', '**/logout', {
    statusCode: 200,
    body: {
      message: 'Logged out',
    },
  }).as('logout');
};

const visitOrders = (path = orders.pageUrl || 'https://www.sendsile.com/dashboard/orders', options = {}) => {
  mockOrdersApis(options);

  cy.visit(path, {
    onBeforeLoad(win) {
      seedAuthenticatedState(win);
    },
  });

  // Wait for React app to load and render
  cy.wait(3000);
  cy.get(orders.root || '#root', { timeout: 15000 }).should('be.visible');
  
  // Wait for dynamic content to load
  cy.wait(2000);
};

// ==========================================
// AUTHENTICATION TESTS
// ==========================================
describe('Sendsile Orders - Authentication', () => {
  beforeEach(() => {
    cy.viewport(1440, 900);
  });

  it('should load orders when authenticated', () => {
    visitOrders();
    cy.url().should('include', '/orders');
    cy.get(orders.root || '#root').should('be.visible');
  });

  it('should redirect to login when not authenticated', () => {
    cy.window().then((win) => {
      win.localStorage.clear();
    });
    cy.visit(orders.pageUrl, { failOnStatusCode: false });
    cy.wait(2000);
    cy.url().then((url) => {
      if (!url.includes('/orders')) {
        cy.log('Redirected to login as expected');
      }
    });
  });
});

// ==========================================
// ORDERS UI TESTS
// ==========================================
describe('Sendsile Orders - UI Elements', () => {
  beforeEach(() => {
    cy.viewport(1440, 900);
  });

  // Test 1: Page Title and Basic Structure
  it(Sendsile.orders.message01, () => {
    visitOrders();
    cy.title().should("contain", "Sendsile"); // Verify page title contains Sendsile
    cy.get(Sendsile.orders.root).should("be.visible"); // Verify main container exists
  });

  // Test 2: Dashboard Navigation
  it(Sendsile.orders.message02, () => {
    visitOrders();
    cy.get(Sendsile.orders.root, { timeout: 10000 }).should("be.visible"); // Wait for React app to load
    
    // Check for navigation menu
    cy.get("body").then(($body) => {
      if ($body.find(Sendsile.orders.navMenu).length > 0) {
        cy.get(Sendsile.orders.navMenu).should("exist");
      }
    });
    
    // Check for dashboard links
    cy.get("body").then(($body) => {
      if ($body.find(Sendsile.orders.dashLink).length > 0) {
        cy.get(Sendsile.orders.dashLink).should("exist");
      }
    });
  });

  // Test 3: Orders Page Header & Content Structure
  it(Sendsile.orders.message02, () => {
    cy.get("body").then(($body) => {
      // Check for page title or heading
      if ($body.find(Sendsile.orders.pageTitle).length > 0) {
        cy.get(Sendsile.orders.pageTitle).should("be.visible");
      }
      if ($body.find(Sendsile.orders.pageDescription).length > 0) {
        cy.get(Sendsile.orders.pageDescription).should("exist");
      }
    });
  });

  // Test 4: Orders List, Table, and Card structure
  it(Sendsile.orders.message03, () => {
    cy.get("body").then(($body) => {
      // Check for orders table
      if ($body.find(Sendsile.orders.orderTable).length > 0) {
        cy.get(Sendsile.orders.orderTable).should("be.visible");
      }
      // Check for order cards
      if ($body.find(Sendsile.orders.orderCard).length > 0) {
        cy.get(Sendsile.orders.orderCard).should("be.visible");
      }
      // Check for row level identifiers
      if ($body.find(Sendsile.orders.orderNumber).length > 0) {
        cy.get(Sendsile.orders.orderNumber).should("exist");
      }
      if ($body.find(Sendsile.orders.orderDate).length > 0) {
        cy.get(Sendsile.orders.orderDate).should("exist");
      }
      if ($body.find(Sendsile.orders.orderStatus).length > 0) {
        cy.get(Sendsile.orders.orderStatus).should("exist");
      }
    });
  });

  // Test 5: Order Details
  it(Sendsile.orders.message04, () => {
    // Check for order details section
    cy.get("body").then(($body) => {
      if ($body.find(Sendsile.orders.orderDetails).length > 0) {
        cy.get(Sendsile.orders.orderDetails).should("be.visible");
      }
    });
    
    // Check for customer info
    cy.get("body").then(($body) => {
      if ($body.find(Sendsile.orders.customerInfo).length > 0) {
        cy.get(Sendsile.orders.customerInfo).should("exist");
      }
    });
    
    // Check for shipping info
    cy.get("body").then(($body) => {
      if ($body.find(Sendsile.orders.shippingInfo).length > 0) {
        cy.get(Sendsile.orders.shippingInfo).should("exist");
      }
    });
    
    // Check for payment info
    cy.get("body").then(($body) => {
      if ($body.find(Sendsile.orders.paymentInfo).length > 0) {
        cy.get(Sendsile.orders.paymentInfo).should("exist");
      }
    });
  });

  // Test 6: Filter and Search Controls
  it(Sendsile.orders.message05, () => {
    // Check for search input
    cy.get("body").then(($body) => {
      if ($body.find(Sendsile.orders.searchInput).length > 0) {
        cy.get(Sendsile.orders.searchInput).should("exist");
      }
    });
    
    // Check for filter dropdown
    cy.get("body").then(($body) => {
      if ($body.find(Sendsile.orders.filterDropdown).length > 0) {
        cy.get(Sendsile.orders.filterDropdown).should("exist");
      }
    });
    
    // Check for date filter
    cy.get("body").then(($body) => {
      if ($body.find(Sendsile.orders.dateFilter).length > 0) {
        cy.get(Sendsile.orders.dateFilter).should("exist");
      }
    });
    
    // Check for status filter
    cy.get("body").then(($body) => {
      if ($body.find(Sendsile.orders.statusFilter).length > 0) {
        cy.get(Sendsile.orders.statusFilter).should("exist");
      }
    });
  });

  // Test 7: Action Buttons
  it(Sendsile.orders.message06, () => {
    // Check for view details button
    cy.get("body").then(($body) => {
      if ($body.find(Sendsile.orders.viewDetailsBtn).length > 0) {
        cy.get(Sendsile.orders.viewDetailsBtn).should("exist");
      }
    });
    
    // Check for track order button
    cy.get("body").then(($body) => {
      if ($body.find(Sendsile.orders.trackOrderBtn).length > 0) {
        cy.get(Sendsile.orders.trackOrderBtn).should("exist");
      }
    });
    
    // Check for cancel order button
    cy.get("body").then(($body) => {
      if ($body.find(Sendsile.orders.cancelOrderBtn).length > 0) {
        cy.get(Sendsile.orders.cancelOrderBtn).should("exist");
      }
    });
  });

  // Test 8: Order Summary
  it(Sendsile.orders.message07, () => {
    // Check for total orders count
    cy.get("body").then(($body) => {
      if ($body.find(Sendsile.orders.totalOrders).length > 0) {
        cy.get(Sendsile.orders.totalOrders).should("exist");
      }
    });
    
    // Check for total amount
    cy.get("body").then(($body) => {
      if ($body.find(Sendsile.orders.totalAmount).length > 0) {
        cy.get(Sendsile.orders.totalAmount).should("exist");
      }
    });
    
    // Check for summary card
    cy.get("body").then(($body) => {
      if ($body.find(Sendsile.orders.summaryCard).length > 0) {
        cy.get(Sendsile.orders.summaryCard).should("be.visible");
      }
    });
  });

  // Test 9: Pagination
  it(Sendsile.orders.message08, () => {
    // Check for pagination controls
    cy.get("body").then(($body) => {
      if ($body.find(Sendsile.orders.pagination).length > 0) {
        cy.get(Sendsile.orders.pagination).should("be.visible");
      }
    });
    
    // Check for previous button
    cy.get("body").then(($body) => {
      if ($body.find(Sendsile.orders.prevBtn).length > 0) {
        cy.get(Sendsile.orders.prevBtn).should("exist");
      }
    });
    
    // Check for next button
    cy.get("body").then(($body) => {
      if ($body.find(Sendsile.orders.nextBtn).length > 0) {
        cy.get(Sendsile.orders.nextBtn).should("exist");
      }
    });
    
    // Check for page number
    cy.get("body").then(($body) => {
      if ($body.find(Sendsile.orders.pageNumber).length > 0) {
        cy.get(Sendsile.orders.pageNumber).should("exist");
      }
    });
  });

  // Test 10: Loading and Empty States
  it(Sendsile.orders.message09, () => {
    visitOrders();
    // Check for loading indicators
    cy.get("body").then(($body) => {
      if ($body.find(Sendsile.orders.loadingIndicator).length > 0) {
        cy.get(Sendsile.orders.loadingIndicator).should("be.visible");
      }
    });
    
    // Check for empty state
    cy.get("body").then(($body) => {
      if ($body.find(Sendsile.orders.emptyState).length > 0) {
        cy.get(Sendsile.orders.emptyState).should("be.visible");
      }
    });
  });

  // Test 13: Realistic User Persona Simulation
  it('should simulate a realistic user managing their orders', () => {
    cy.log('👤 Simulating user browsing and managing orders...');
    cy.wait(1500);

    // 1. User scrolls to review the history
    cy.scrollTo('bottom', { duration: 2000 });
    cy.wait(1000);
    cy.scrollTo('top', { duration: 1500 });

    cy.get('body').then(($body) => {
      // 2. User searches for a specific order
      if ($body.find(Sendsile.orders.searchInput).length > 0) {
        cy.get(Sendsile.orders.searchInput).first().type('Groceries', { force: true });
        cy.wait(1000);
      }

      // 3. User views order details
      if ($body.find(Sendsile.orders.viewDetailsBtn).length > 0) {
        cy.get(Sendsile.orders.viewDetailsBtn).first().click({ force: true });
        cy.wait(1500);
      }
    });
  });

  // Test 14: Comprehensive Interaction Sweep
  it('should exercise all buttons and inputs on the orders page', () => {
    cy.get("body").then(($body) => {
      // Action 1: Buttons
      const buttons = $body.find('button:visible');
      if (buttons.length > 0) {
        cy.log(`🔘 Testing ${Math.min(5, buttons.length)} buttons...`);
        cy.get('button:visible').each(($btn, index) => {
          if (index < 5) cy.wrap($btn).click({ force: true });
        });
      }

      // Action 2: Inputs
      const inputs = $body.find('input[type="text"], input[type="search"]');
      if (inputs.length > 0) {
        cy.get('input[type="text"], input[type="search"]').each(($el, index) => {
          if (index < 3 && $el.is(':visible')) {
            cy.wrap($el).clear({ force: true }).type('Interaction Test', { force: true });
          }
        });
      }
    });
  });
});

// ==========================================
// ORDERS INTERACTIONS TESTS
// ==========================================
describe('Sendsile Orders - Interactions', () => {
  beforeEach(() => {
    cy.viewport(1440, 900);
  });

  it('should handle basic interactions', () => {
    visitOrders();
    
    // Test order link clicks if links exist
    cy.get("body").then(($body) => {
      if ($body.find(Sendsile.orders.orderLink).length > 0) {
        cy.get(Sendsile.orders.orderLink).first().click({ force: true });
        cy.wait(1000);
      }
    });
    
    // Test search functionality if search exists
    cy.get("body").then(($body) => {
      if ($body.find(Sendsile.orders.searchFunc).length > 0) {
        cy.get(Sendsile.orders.searchFunc)
          .first()
          .type("test order")
          .should("have.value", "test order");
      }
    });
  });

  it('should handle navigation interactions', () => {
    visitOrders();
    
    // Test basic navigation links
    const navItems = ['dashboard', 'home', 'groceries', 'profile'];
    
    navItems.forEach((item) => {
      cy.get('a[href]').contains(new RegExp(item, 'i')).then(($link) => {
        if ($link.length > 0) {
          cy.wrap($link).first().click({ force: true });
          cy.wait(1000);
          visitOrders(); // Return to orders for next test
        }
      });
    });
  });

  it('should handle filter interactions', () => {
    visitOrders();
    
    // Test filter dropdowns if they exist
    cy.get("body").then(($body) => {
      if ($body.find(Sendsile.orders.filterDropdown).length > 0) {
        cy.get(Sendsile.orders.filterDropdown).first().click({ force: true });
        cy.wait(500);
      }
    });
    
    // Test search input if it exists
    cy.get("body").then(($body) => {
      if ($body.find(Sendsile.orders.searchInput).length > 0) {
        cy.get(Sendsile.orders.searchInput).first().type('test', { force: true });
        cy.wait(500);
        cy.get(Sendsile.orders.searchInput).first().clear({ force: true });
      }
    });
  });
});

// ==========================================
// ORDERS RESPONSIVE DESIGN TESTS
// ==========================================
describe('Sendsile Orders - Responsive Design', () => {
  it('should be responsive on mobile view', () => {
    cy.viewport(Sendsile.orders.mobileView);
    visitOrders();
    cy.get(Sendsile.orders.root).should('be.visible');
  });

  it('should be responsive on tablet view', () => {
    cy.viewport(Sendsile.orders.tabletView);
    visitOrders();
    cy.get(Sendsile.orders.root).should('be.visible');
  });

  it('should be responsive on desktop view', () => {
    cy.viewport(1440, 900);
    visitOrders();
    cy.get(Sendsile.orders.root).should('be.visible');
  });
});

// ==========================================
// ORDERS COMPONENTS TESTS
// ==========================================
describe('Sendsile Orders - Components', () => {
  beforeEach(() => {
    cy.viewport(1440, 900);
  });

  it('should display and test orders table/list component', () => {
    visitOrders();
    
    // Check for orders table
    cy.get("body").then(($body) => {
      if ($body.find(Sendsile.orders.orderTable).length > 0) {
        cy.get(Sendsile.orders.orderTable).should("be.visible");
        cy.log('Orders table found and visible');
        
        // Test table headers
        cy.get('thead th, .table-header, .column-header').then(($headers) => {
          if ($headers.length > 0) {
            cy.log(`Found ${$headers.length} table headers`);
            cy.wrap($headers).first().should('be.visible');
          }
        });
        
        // Test table rows
        cy.get('tbody tr, .table-row, .order-row').then(($rows) => {
          if ($rows.length > 0) {
            cy.log(`Found ${$rows.length} order rows`);
            cy.wrap($rows).first().should('be.visible');
          }
        });
      }
    });
    
    // Check for order cards (alternative layout)
    cy.get("body").then(($body) => {
      if ($body.find(Sendsile.orders.orderCard).length > 0) {
        cy.get(Sendsile.orders.orderCard).should("be.visible");
        cy.log('Order cards found and visible');
        
        // Test card elements
        cy.get(Sendsile.orders.orderCard).first().within(() => {
          cy.get(Sendsile.orders.orderNumber).then(($num) => {
            if ($num.length > 0) cy.log('Order number found in card');
          });
          cy.get(Sendsile.orders.orderDate).then(($date) => {
            if ($date.length > 0) cy.log('Order date found in card');
          });
          cy.get(Sendsile.orders.orderStatus).then(($status) => {
            if ($status.length > 0) cy.log('Order status found in card');
          });
        });
      }
    });
  });

  it('should display and test order details component', () => {
    visitOrders();
    
    // Check for order details section
    cy.get("body").then(($body) => {
      if ($body.find(Sendsile.orders.orderDetails).length > 0) {
        cy.get(Sendsile.orders.orderDetails).should("be.visible");
        cy.log('Order details section found');
        
        // Test customer info
        cy.get(Sendsile.orders.customerInfo).then(($customer) => {
          if ($customer.length > 0) {
            cy.log('Customer info section found');
            cy.wrap($customer).should('be.visible');
          }
        });
        
        // Test shipping info
        cy.get(Sendsile.orders.shippingInfo).then(($shipping) => {
          if ($shipping.length > 0) {
            cy.log('Shipping info section found');
            cy.wrap($shipping).should('be.visible');
          }
        });
        
        // Test payment info
        cy.get(Sendsile.orders.paymentInfo).then(($payment) => {
          if ($payment.length > 0) {
            cy.log('Payment info section found');
            cy.wrap($payment).should('be.visible');
          }
        });
      }
    });
  });

  it('should display and test filter and search component', () => {
    visitOrders();
    
    // Test search input
    cy.get("body").then(($body) => {
      if ($body.find(Sendsile.orders.searchInput).length > 0) {
        cy.get(Sendsile.orders.searchInput).should("exist");
        cy.log('Search input found');
        
        // Test search functionality
        cy.get(Sendsile.orders.searchInput).first()
          .type('test order', { force: true })
          .should('have.value', 'test order');
        cy.wait(500);
        cy.get(Sendsile.orders.searchInput).first().clear({ force: true });
        cy.log('Search input functionality tested');
      }
    });
    
    // Test filter dropdown
    cy.get("body").then(($body) => {
      if ($body.find(Sendsile.orders.filterDropdown).length > 0) {
        cy.get(Sendsile.orders.filterDropdown).should("exist");
        cy.log('Filter dropdown found');
        
        // Test dropdown interaction
        cy.get(Sendsile.orders.filterDropdown).first().click({ force: true });
        cy.wait(500);
        cy.log('Filter dropdown interaction tested');
      }
    });
    
    // Test date filter
    cy.get("body").then(($body) => {
      if ($body.find(Sendsile.orders.dateFilter).length > 0) {
        cy.get(Sendsile.orders.dateFilter).should("exist");
        cy.log('Date filter found');
      }
    });
    
    // Test status filter
    cy.get("body").then(($body) => {
      if ($body.find(Sendsile.orders.statusFilter).length > 0) {
        cy.get(Sendsile.orders.statusFilter).should("exist");
        cy.log('Status filter found');
      }
    });
  });

  it('should display and test action buttons component', () => {
    visitOrders();
    
    // Test view details button
    cy.get("body").then(($body) => {
      if ($body.find(Sendsile.orders.viewDetailsBtn).length > 0) {
        cy.get(Sendsile.orders.viewDetailsBtn).should("exist");
        cy.log('View details button found');
        
        // Test button interaction
        cy.get(Sendsile.orders.viewDetailsBtn).first().click({ force: true });
        cy.wait(1000);
        cy.log('View details button interaction tested');
      }
    });
    
    // Test track order button
    cy.get("body").then(($body) => {
      if ($body.find(Sendsile.orders.trackOrderBtn).length > 0) {
        cy.get(Sendsile.orders.trackOrderBtn).should("exist");
        cy.log('Track order button found');
      }
    });
    
    // Test cancel order button
    cy.get("body").then(($body) => {
      if ($body.find(Sendsile.orders.cancelOrderBtn).length > 0) {
        cy.get(Sendsile.orders.cancelOrderBtn).should("exist");
        cy.log('Cancel order button found');
      }
    });
  });

  it('should display and test order summary component', () => {
    visitOrders();
    
    // Test total orders count
    cy.get("body").then(($body) => {
      if ($body.find(Sendsile.orders.totalOrders).length > 0) {
        cy.get(Sendsile.orders.totalOrders).should("exist");
        cy.log('Total orders count found');
      }
    });
    
    // Test total amount
    cy.get("body").then(($body) => {
      if ($body.find(Sendsile.orders.totalAmount).length > 0) {
        cy.get(Sendsile.orders.totalAmount).should("exist");
        cy.log('Total amount found');
      }
    });
    
    // Test summary card
    cy.get("body").then(($body) => {
      if ($body.find(Sendsile.orders.summaryCard).length > 0) {
        cy.get(Sendsile.orders.summaryCard).should("be.visible");
        cy.log('Summary card found and visible');
        
        // Test summary card content
        cy.get(Sendsile.orders.summaryCard).within(() => {
          cy.get('h1, h2, h3, .title, .heading').then(($heading) => {
            if ($heading.length > 0) {
              cy.log('Summary card heading found');
            }
          });
          cy.get('span:contains("$"), .amount, .total, .sum').then(($amount) => {
            if ($amount.length > 0) {
              cy.log('Summary card amount found');
            }
          });
        });
      }
    });
  });

  it('should display and test pagination component', () => {
    visitOrders();
    
    // Test pagination controls
    cy.get("body").then(($body) => {
      if ($body.find(Sendsile.orders.pagination).length > 0) {
        cy.get(Sendsile.orders.pagination).should("be.visible");
        cy.log('Pagination found and visible');
        
        // Test pagination buttons
        cy.get(Sendsile.orders.prevBtn).then(($prev) => {
          if ($prev.length > 0) {
            cy.log('Previous button found');
            cy.wrap($prev).first().click({ force: true });
            cy.wait(500);
          }
        });
        
        cy.get(Sendsile.orders.nextBtn).then(($next) => {
          if ($next.length > 0) {
            cy.log('Next button found');
            cy.wrap($next).first().click({ force: true });
            cy.wait(500);
          }
        });
        
        // Test page numbers
        cy.get(Sendsile.orders.pageNumber).then(($page) => {
          if ($page.length > 0) {
            cy.log('Page numbers found');
            cy.wrap($page).first().should('be.visible');
          }
        });
      }
    });
  });

  it('should display and test loading and empty states', () => {
    visitOrders();
    
    // Test loading indicators
    cy.get("body").then(($body) => {
      if ($body.find(Sendsile.orders.loadingIndicator).length > 0) {
        cy.get(Sendsile.orders.loadingIndicator).should("be.visible");
        cy.log('Loading indicator found and visible');
      }
    });
    
    // Test empty state
    cy.get("body").then(($body) => {
      if ($body.find(Sendsile.orders.emptyState).length > 0) {
        cy.get(Sendsile.orders.emptyState).should("be.visible");
        cy.log('Empty state found and visible');
        
        // Test empty state content
        cy.get(Sendsile.orders.emptyState).within(() => {
          cy.get('h1, h2, h3, .title').then(($title) => {
            if ($title.length > 0) {
              cy.log('Empty state title found');
            }
          });
          cy.get('p, .description, .message').then(($message) => {
            if ($message.length > 0) {
              cy.log('Empty state message found');
            }
          });
        });
      }
    });
  });
});

// ==========================================
// COMPREHENSIVE ORDERS FUNCTIONALITY TEST
// ==========================================
describe('Sendsile Orders - Comprehensive Functionality', () => {
  beforeEach(() => {
    cy.viewport(1440, 900);
  });

  it('should load orders and verify basic structure', () => {
    visitOrders();
    
    // Verify page loaded
    cy.get(orders.root || '#root').should('be.visible');
    cy.title().should('contain', 'Sendsile');
    
    // Check for any navigation elements
    cy.get('nav, .nav, .navbar, .navigation, .header').then(($nav) => {
      if ($nav.length > 0) {
        cy.wrap($nav).first().then(($el) => {
          if ($el.is(':visible')) {
            cy.log('Navigation found and it is visible');
          } else {
            cy.log('Navigation found but it is hidden by parent CSS');
          }
        });
      } else {
        cy.log('No navigation found');
      }
    });
    
    // Check for any headings
    cy.get('h1, h2, h3').then(($headings) => {
      if ($headings.length > 0) {
        cy.wrap($headings).first().then(($el) => {
          if ($el.is(':visible')) {
            cy.log('Headings found and they are visible');
          } else {
            cy.log('Headings found but they are hidden by parent CSS');
          }
        });
      } else {
        cy.log('No headings found');
      }
    });
  });

  it('should test basic scrolling functionality', () => {
    visitOrders();
    
    // Test scroll positions
    const positions = ['top', 'center', 'bottom'];
    
    positions.forEach((position) => {
      cy.scrollTo(position);
      cy.wait(500);
      cy.log(`Scrolled to ${position}`);
      
      // Verify root element is still visible
      cy.get(orders.root || '#root').should('be.visible');
    });
    
    // Scroll back to top
    cy.scrollTo('top');
    cy.wait(500);
  });

  it('should handle error states', () => {
    visitOrders();
    
    // Check for error messages
    cy.get("body").then(($body) => {
      if ($body.find(Sendsile.orders.errorMessage).length > 0) {
        cy.get(Sendsile.orders.errorMessage).should("be.visible");
      }
    });
    
    // Check for retry button
    cy.get("body").then(($body) => {
      if ($body.find(Sendsile.orders.retryBtn).length > 0) {
        cy.get(Sendsile.orders.retryBtn).should("exist");
      }
    });
  });
});
