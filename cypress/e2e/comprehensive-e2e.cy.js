/* global cy, describe, it, beforeEach */

// ==========================================
// COMPREHENSIVE CYPRESS E2E TEST SUITE
// ==========================================

// Base URL and configuration
const BASE_URL = 'https://www.sendsile.com';
const LOGIN_URL = '/login';
const DASHBOARD_URL = '/dashboard';
const GROCERIES_URL = '/dashboard/groceries';

// Test credentials (avoid hardcoding in production)
const TEST_CREDENTIALS = {
  email: 'test@example.com',
  password: 'testpassword123'
};

// ==========================================
// LOGIN HELPER COMMANDS
// ==========================================

/**
 * Custom login command using cy.session() for reusability
 * Handles authentication and API intercepts
 */
Cypress.Commands.add('login', () => {
  // Create session for login reuse
  cy.session([TEST_CREDENTIALS.email], () => {
    // Visit login page
    cy.visit(`${BASE_URL}${LOGIN_URL}`);
    
    // Intercept login API call
    cy.intercept('POST', '**/api/v1/login', {
      statusCode: 200,
      body: {
        success: true,
        message: 'Login successful',
        data: {
          token: 'mock-jwt-token',
          user: {
            id: 1,
            name: 'Test User',
            email: TEST_CREDENTIALS.email
          }
        }
      }
    }).as('loginRequest');
    
    // Fill login form with stable selectors
    cy.get('[data-testid="email-input"], input[type="email"], input[name="email"]')
      .type(TEST_CREDENTIALS.email);
    
    cy.get('[data-testid="password-input"], input[type="password"], input[name="password"]')
      .type(TEST_CREDENTIALS.password);
    
    // Submit login form
    cy.get('[data-testid="login-button"], button[type="submit"], button:contains("Login")')
      .click();
    
    // Wait for login API response
    cy.wait('@loginRequest').its('response.statusCode').should('eq', 200);
    
    // Assert redirect to dashboard
    cy.url().should('include', DASHBOARD_URL);
    
    // Verify authentication state
    cy.window().then((win) => {
      expect(win.localStorage.getItem('isLoggedIn')).to.equal('true');
      expect(win.localStorage.getItem('authToken')).to.exist;
    });
  });
});

/**
 * Setup API intercepts for groceries page
 */
Cypress.Commands.add('setupGroceriesIntercepts', () => {
  // Intercept products API
  cy.intercept('GET', '**/api/v1/products*', {
    statusCode: 200,
    body: {
      success: true,
      data: [
        {
          id: 1,
          name: 'Fresh Apples',
          price: 2.99,
          image: '/apples.jpg',
          category: 'Fruits',
          inStock: true,
          description: 'Fresh and crispy apples'
        },
        {
          id: 2,
          name: 'Organic Milk',
          price: 3.50,
          image: '/milk.jpg',
          category: 'Dairy',
          inStock: true,
          description: 'Fresh organic milk'
        },
        {
          id: 3,
          name: 'Farm Eggs',
          price: 4.25,
          image: '/eggs.jpg',
          category: 'Dairy',
          inStock: true,
          description: 'Fresh farm eggs'
        }
      ]
    }
  }).as('getProducts');
  
  // Intercept categories API
  cy.intercept('GET', '**/api/v1/categories', {
    statusCode: 200,
    body: {
      success: true,
      data: [
        { id: 1, name: 'Fruits', image: '/fruits.jpg' },
        { id: 2, name: 'Vegetables', image: '/vegetables.jpg' },
        { id: 3, name: 'Dairy', image: '/dairy.jpg' }
      ]
    }
  }).as('getCategories');
  
  // Intercept add to cart API
  cy.intercept('POST', '**/api/v1/cart/add', {
    statusCode: 200,
    body: {
      success: true,
      message: 'Item added to cart',
      data: {
        cartCount: 1,
        cartItems: [
          {
            id: 1,
            name: 'Fresh Apples',
            price: 2.99,
            quantity: 1
          }
        ]
      }
    }
  }).as('addToCart');
  
  // Intercept quick view API
  cy.intercept('GET', '**/api/v1/products/*', {
    statusCode: 200,
    body: {
      success: true,
      data: {
        id: 1,
        name: 'Fresh Apples',
        price: 2.99,
        image: '/apples.jpg',
        category: 'Fruits',
        inStock: true,
        description: 'Fresh and crispy apples from our local farm',
        nutrition: 'Calories: 52, Protein: 0.3g, Carbs: 14g',
        storage: 'Store in refrigerator for best freshness'
      }
    }
  }).as('getProductDetails');
});

// ==========================================
// MAIN TEST SUITE
// ==========================================

describe('Sendsile E2E Test Suite', () => {
  
  // ==========================================
  // 1. LOGIN HELPER TESTS
  // ==========================================
  
  describe('Login Flow', () => {
    
    it('should login successfully and redirect to dashboard', () => {
      // Use custom login command
      cy.login();
      
      // Verify dashboard loaded
      cy.url().should('include', DASHBOARD_URL);
      cy.get('body').should('be.visible');
      
      // Verify user is authenticated
      cy.window().then((win) => {
        expect(win.localStorage.getItem('isLoggedIn')).to.equal('true');
      });
    });
    
    it('should handle login errors gracefully', () => {
      cy.visit(`${BASE_URL}${LOGIN_URL}`);
      
      // Mock failed login
      cy.intercept('POST', '**/api/v1/login', {
        statusCode: 401,
        body: {
          success: false,
          message: 'Invalid credentials'
        }
      }).as('loginFailed');
      
      // Fill form with wrong credentials
      cy.get('[data-testid="email-input"], input[type="email"]')
        .type('wrong@example.com');
      cy.get('[data-testid="password-input"], input[type="password"]')
        .type('wrongpassword');
      
      // Submit form
      cy.get('[data-testid="login-button"], button[type="submit"]')
        .click();
      
      // Wait for failed response
      cy.wait('@loginFailed');
      
      // Verify error message appears
      cy.get('[data-testid="error-message"], .error, .alert-error')
        .should('be.visible')
        .and('contain', 'Invalid credentials');
    });
  });
  
  // ==========================================
  // 2. GROCERIES PAGE TESTS
  // ==========================================
  
  describe('Groceries Page', () => {
    beforeEach(() => {
      // Login before each test
      cy.login();
      
      // Setup API intercepts
      cy.setupGroceriesIntercepts();
      
      // Visit groceries page
      cy.visit(`${BASE_URL}${GROCERIES_URL}`);
    });
    
    it('should load groceries page with products', () => {
      // Wait for products to load
      cy.wait('@getProducts');
      cy.wait('@getCategories');
      
      // Verify page loaded
      cy.url().should('include', GROCERIES_URL);
      cy.get('body').should('be.visible');
      
      // Assert product list is visible
      cy.get('[data-testid="product-list"], .product-grid, .products-container')
        .should('exist');
      
      // Verify products are displayed
      cy.get('[data-testid="product-item"], .product-card, .product')
        .should('have.length.at.least', 1);
      
      // Verify product details
      cy.get('[data-testid="product-name"], .product-name, .product-title')
        .should('have.length.at.least', 1);
      cy.get('[data-testid="product-price"], .price')
        .should('have.length.at.least', 1);
    });
    
    it('should click first product and open quick view', () => {
      // Wait for products to load
      cy.wait('@getProducts');
      
      // Click first product with error handling
      cy.get('[data-testid="product-item"], .product-card, .product')
        .first()
        .click();
      
      // Wait for product details API
      cy.wait('@getProductDetails');
      
      // Assert quick view opens
      cy.get('[data-testid="quick-view-modal"], .modal, .dialog')
        .should('be.visible');
      
      // Verify modal content
      cy.get('[data-testid="modal-title"], .modal-title')
        .should('contain.text', 'Fresh Apples');
      cy.get('[data-testid="modal-price"], .modal-price, .price')
        .should('contain.text', '2.99');
    });
    
    it('should add product to cart and update cart count', () => {
      // Wait for products to load
      cy.wait('@getProducts');
      
      // Click first product
      cy.get('[data-testid="product-item"], .product-card, .product')
        .first()
        .click();
      
      // Wait for product details
      cy.wait('@getProductDetails');
      
      // Add to cart
      cy.get('[data-testid="add-to-cart"], button:contains("Add to Cart"), .add-to-cart-btn')
        .click();
      
      // Wait for cart API response
      cy.wait('@addToCart');
      
      // Assert cart updates
      cy.get('[data-testid="cart-count"], .cart-badge, .cart-count')
        .should('contain', '1');
      
      // Verify success message
      cy.get('[data-testid="success-message"], .success, .alert-success')
        .should('contain.text', 'added to cart');
    });
    
    it('should handle empty state gracefully', () => {
      // Mock empty products response
      cy.intercept('GET', '**/api/v1/products*', {
        statusCode: 200,
        body: {
          success: true,
          data: []
        }
      }).as('emptyProducts');
      
      // Reload page
      cy.reload();
      cy.wait('@emptyProducts');
      
      // Verify empty state is displayed
      cy.get('[data-testid="empty-state"], .no-products, .empty-message')
        .should('be.visible')
        .and('contain.text', 'No products');
    });
    
    it('should handle loading state properly', () => {
      // Mock slow API response
      cy.intercept('GET', '**/api/v1/products*', {
        statusCode: 200,
        body: { success: true, data: [] },
        delay: 3000
      }).as('slowProducts');
      
      // Reload page
      cy.reload();
      
      // Verify loading state appears
      cy.get('[data-testid="loading"], .spinner, .loading-indicator')
        .should('be.visible');
      
      // Wait for response
      cy.wait('@slowProducts');
      
      // Verify loading state disappears
      cy.get('[data-testid="loading"], .spinner')
        .should('not.be.visible');
    });
  });
  
  // ==========================================
  // 3. QUICK VIEW MODAL TESTS
  // ==========================================
  
  describe('Quick View Modal', () => {
    beforeEach(() => {
      // Login and setup
      cy.login();
      cy.setupGroceriesIntercepts();
      cy.visit(`${BASE_URL}${GROCERIES_URL}`);
      cy.wait('@getProducts');
      
      // Open quick view
      cy.get('[data-testid="product-item"], .product-card, .product')
        .first()
        .click();
      cy.wait('@getProductDetails');
    });
    
    it('should ensure modal loads after click', () => {
      // Verify modal is visible
      cy.get('[data-testid="quick-view-modal"], .modal, .dialog')
        .should('be.visible');
      
      // Verify modal overlay
      cy.get('[data-testid="modal-overlay"], .modal-overlay, .backdrop')
        .should('be.visible');
    });
    
    it('should assert product details in modal', () => {
      // Verify product name
      cy.get('[data-testid="modal-title"], .modal-title, .product-name')
        .should('be.visible')
        .and('contain.text', 'Fresh Apples');
      
      // Verify product price
      cy.get('[data-testid="modal-price"], .modal-price, .price')
        .should('be.visible')
        .and('contain.text', '2.99');
      
      // Verify product image
      cy.get('[data-testid="modal-image"], .modal-image, .product-image')
        .should('be.visible');
      
      // Verify product description
      cy.get('[data-testid="modal-description"], .modal-description, .product-description')
        .should('contain.text', 'Fresh and crispy apples');
    });
    
    it('should increase quantity and add to cart', () => {
      // Find quantity selector
      cy.get('[data-testid="quantity-selector"], .quantity, .qty-selector')
        .then(($qty) => {
          if ($qty.length > 0) {
            // Increase quantity
            cy.get('[data-testid="quantity-increase"], button:contains("+"), .quantity-plus')
              .click();
            
            // Verify quantity increased
            cy.get('[data-testid="quantity-value"], .quantity-value, input[type="number"]')
              .should('have.value', '2');
          }
        });
      
      // Add to cart
      cy.get('[data-testid="add-to-cart"], button:contains("Add to Cart")')
        .click();
      
      // Wait for cart API
      cy.wait('@addToCart');
      
      // Verify cart updated
      cy.get('[data-testid="cart-count"], .cart-badge')
        .should('contain', '1');
    });
    
    it('should close modal properly', () => {
      // Close modal using close button
      cy.get('[data-testid="modal-close"], .modal-close, button:contains("Close"), button:contains("X")')
        .click();
      
      // Verify modal is closed
      cy.get('[data-testid="quick-view-modal"], .modal')
        .should('not.be.visible');
      
      // Verify overlay is removed
      cy.get('[data-testid="modal-overlay"], .modal-overlay')
        .should('not.exist');
    });
    
    it('should handle modal errors gracefully', () => {
      // Mock failed add to cart
      cy.intercept('POST', '**/api/v1/cart/add', {
        statusCode: 400,
        body: {
          success: false,
          message: 'Product out of stock'
        }
      }).as('addToCartFailed');
      
      // Try to add to cart
      cy.get('[data-testid="add-to-cart"], button:contains("Add to Cart")')
        .click();
      
      // Wait for failed response
      cy.wait('@addToCartFailed');
      
      // Verify error message appears in modal
      cy.get('[data-testid="modal-error"], .modal-error, .error')
        .should('be.visible')
        .and('contain.text', 'out of stock');
    });
  });
  
  // ==========================================
  // 4. ERROR HANDLING TESTS
  // ==========================================
  
  describe('Error Handling', () => {
    
    it('should handle API failures gracefully', () => {
      // Login first
      cy.login();
      
      // Mock API failure
      cy.intercept('GET', '**/api/v1/products*', {
        statusCode: 500,
        body: {
          success: false,
          message: 'Internal Server Error'
        }
      }).as('apiError');
      
      // Visit groceries page
      cy.visit(`${BASE_URL}${GROCERIES_URL}`);
      cy.wait('@apiError');
      
      // Verify error state is displayed
      cy.get('[data-testid="error-state"], .error-page, .server-error')
        .should('be.visible')
        .and('contain.text', 'Internal Server Error');
      
      // Verify retry button exists
      cy.get('[data-testid="retry-button"], button:contains("Retry"), .retry-btn')
        .should('exist');
    });
    
    it('should handle network timeouts', () => {
      // Login first
      cy.login();
      
      // Mock network timeout
      cy.intercept('GET', '**/api/v1/products*', {
        statusCode: 0,
        body: null,
        delay: 10000
      }).as('networkTimeout');
      
      // Visit groceries page
      cy.visit(`${BASE_URL}${GROCERIES_URL}`);
      
      // Verify timeout error handling
      cy.get('[data-testid="timeout-error"], .network-error, .timeout-message')
        .should('be.visible');
    });
    
    it('should handle missing elements with fallback selectors', () => {
      // Login and setup
      cy.login();
      cy.setupGroceriesIntercepts();
      cy.visit(`${BASE_URL}${GROCERIES_URL}`);
      cy.wait('@getProducts');
      
      // Try to find element with multiple fallback selectors
      cy.get('body').then(($body) => {
        // Try primary selector first
        if ($body.find('[data-testid="product-item"]').length > 0) {
          cy.get('[data-testid="product-item"]').first().click();
        }
        // Fallback to alternative selectors
        else if ($body.find('.product-card').length > 0) {
          cy.get('.product-card').first().click();
        }
        else if ($body.find('.product').length > 0) {
          cy.get('.product').first().click();
        }
        else {
          // Log that no products were found
          cy.log('No product elements found with any selector');
        }
      });
    });
  });
  
  // ==========================================
  // 5. RESPONSIVE DESIGN TESTS
  // ==========================================
  
  describe('Responsive Design', () => {
    
    it('should work on mobile devices', () => {
      cy.viewport('iphone-x');
      cy.login();
      cy.setupGroceriesIntercepts();
      cy.visit(`${BASE_URL}${GROCERIES_URL}`);
      cy.wait('@getProducts');
      
      // Verify mobile layout
      cy.get('body').should('be.visible');
      
      // Check for mobile-specific elements
      cy.get('body').then(($body) => {
        if ($body.find('[data-testid="mobile-menu"], .hamburger-menu, .mobile-nav').length > 0) {
          cy.get('[data-testid="mobile-menu"], .hamburger-menu')
            .should('be.visible');
        }
      });
    });
    
    it('should work on tablet devices', () => {
      cy.viewport('ipad-2');
      cy.login();
      cy.setupGroceriesIntercepts();
      cy.visit(`${BASE_URL}${GROCERIES_URL}`);
      cy.wait('@getProducts');
      
      // Verify tablet layout
      cy.get('body').should('be.visible');
      
      // Verify products are displayed
      cy.get('[data-testid="product-item"], .product-card')
        .should('have.length.at.least', 1);
    });
    
    it('should work on desktop devices', () => {
      cy.viewport(1920, 1080);
      cy.login();
      cy.setupGroceriesIntercepts();
      cy.visit(`${BASE_URL}${GROCERIES_URL}`);
      cy.wait('@getProducts');
      
      // Verify desktop layout
      cy.get('body').should('be.visible');
      
      // Verify all elements are properly displayed
      cy.get('[data-testid="product-list"], .product-grid')
        .should('exist');
    });
  });
});
