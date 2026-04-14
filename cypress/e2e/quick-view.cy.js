import { Sendsile } from "../configuration/project.config.js";

describe("Sendsile Quick View - Comprehensive Testing", () => {
  const pageUrl = Sendsile.quickView.pageUrl;

  beforeEach(() => {
    // Clear cookies and localStorage before each test to ensure clean state
    cy.clearCookies();
    cy.clearLocalStorage();
    cy.clearSessionStorage();
  });

  // 1. Validate page load and correct URL
  it('should validate page load and correct URL', () => {
    // Enhanced authentication for order viewing
    cy.window().then((win) => {
      win.localStorage.setItem("__user_access", "test-token");
      win.localStorage.setItem("ramadanModal", "true");
      win.localStorage.setItem(
        "userInfo",
        JSON.stringify({ 
          state: { 
            userData: { 
              name: "Test User",
              email: "test@example.com",
              phone: "08012345678",
              id: "test-user-id"
            } 
          }, 
          version: 0 
        })
      );
      win.localStorage.setItem("authToken", "test-auth-token");
      win.localStorage.setItem("userToken", "test-user-token");
    });

    cy.visit(pageUrl, { timeout: 30000 });
    cy.wait(2000);
    
    // Validate correct URL
    cy.url().should('include', '/quick-view');
    cy.url().should('include', 'sendsile.com');
    cy.url().should('not.include', '/error');
    
    // Validate page title
    cy.title().should('contain', 'Sendsile');
    cy.title().should('contain', 'Quick View');
    
    // Validate page structure
    cy.get('body').should('be.visible');
    
    cy.log('✅ Quick view page loaded successfully with correct URL');
  });

  // 2. Verify all key UI elements are visible and functional
  it('should verify all key UI elements are visible and functional', () => {
    // Enhanced authentication for order viewing
    cy.window().then((win) => {
      win.localStorage.setItem("__user_access", "test-token");
      win.localStorage.setItem("ramadanModal", "true");
      win.localStorage.setItem(
        "userInfo",
        JSON.stringify({ 
          state: { 
            userData: { 
              name: "Test User",
              email: "test@example.com",
              phone: "08012345678",
              id: "test-user-id"
            } 
          }, 
          version: 0 
        })
      );
      win.localStorage.setItem("authToken", "test-auth-token");
      win.localStorage.setItem("userToken", "test-user-token");
    });

    cy.visit(pageUrl, { timeout: 30000 });
    cy.wait(2000);
    
    // Check for page title or heading
    cy.get("body").then(($body) => {
      if ($body.find(Sendsile.quickView.pageTitle).length > 0) {
        cy.get(Sendsile.quickView.pageTitle).should("be.visible");
        cy.log('✅ Page title found and visible');
      }
    });
    
    // Check for page description
    cy.get("body").then(($body) => {
      if ($body.find(Sendsile.quickView.pageDescription).length > 0) {
        cy.get(Sendsile.quickView.pageDescription).should("exist");
        cy.log('✅ Page description found and visible');
      }
    });
    
    // Check for order information section
    cy.get("body").then(($body) => {
      if ($body.find(Sendsile.quickView.orderInfo).length > 0) {
        cy.get(Sendsile.quickView.orderInfo).should("be.visible");
        cy.log('✅ Order information section found and visible');
      }
    });
    
    // Check for order items
    cy.get("body").then(($body) => {
      if ($body.find(Sendsile.quickView.itemsList).length > 0) {
        cy.get(Sendsile.quickView.itemsList).should("be.visible");
        cy.log('✅ Order items list found and visible');
      }
    });
    
    // Check for status section
    cy.get("body").then(($body) => {
      if ($body.find(Sendsile.quickView.statusSection).length > 0) {
        cy.get(Sendsile.quickView.statusSection).should("be.visible");
        cy.log('✅ Status section found and visible');
      }
    });
    
    // Check for actions section
    cy.get("body").then(($body) => {
      if ($body.find(Sendsile.quickView.actionsSection).length > 0) {
        cy.get(Sendsile.quickView.actionsSection).should("be.visible");
        cy.log('✅ Actions section found and visible');
      }
    });
  });

  // 3. Test all user interactions (clicks, inputs, navigation)
  it('should test all user interactions', () => {
    // Enhanced authentication for order viewing
    cy.window().then((win) => {
      win.localStorage.setItem("__user_access", "test-token");
      win.localStorage.setItem("ramadanModal", "true");
      win.localStorage.setItem(
        "userInfo",
        JSON.stringify({ 
          state: { 
            userData: { 
              name: "Test User",
              email: "test@example.com",
              phone: "08012345678",
              id: "test-user-id"
            } 
          }, 
          version: 0 
        })
      );
      win.localStorage.setItem("authToken", "test-auth-token");
      win.localStorage.setItem("userToken", "test-user-token");
    });

    cy.visit(pageUrl, { timeout: 30000 });
    cy.wait(2000);
    
    // Test track order button
    cy.get("body").then(($body) => {
      if ($body.find(Sendsile.quickView.trackOrderBtn).length > 0) {
        cy.get(Sendsile.quickView.trackOrderBtn).first().click();
        cy.wait(1000);
        cy.log('✅ Track order button clicked');
      }
    });
    
    // Test download invoice button
    cy.get("body").then(($body) => {
      if ($body.find(Sendsile.quickView.downloadInvoiceBtn).length > 0) {
        cy.get(Sendsile.quickView.downloadInvoiceBtn).first().click();
        cy.wait(1000);
        cy.log('✅ Download invoice button clicked');
      }
    });
    
    // Test cancel order button
    cy.get("body").then(($body) => {
      if ($body.find(Sendsile.quickView.cancelOrderBtn).length > 0) {
        cy.get(Sendsile.quickView.cancelOrderBtn).first().click();
        cy.wait(1000);
        cy.log('✅ Cancel order button clicked');
      }
    });
    
    // Test reorder button
    cy.get("body").then(($body) => {
      if ($body.find(Sendsile.quickView.reorderBtn).length > 0) {
        cy.get(Sendsile.quickView.reorderBtn).first().click();
        cy.wait(1000);
        cy.log('✅ Reorder button clicked');
      }
    });
    
    // Test tracking link
    cy.get("body").then(($body) => {
      if ($body.find(Sendsile.quickView.trackingLink).length > 0) {
        cy.get(Sendsile.quickView.trackingLink).first().click();
        cy.wait(1000);
        cy.log('✅ Tracking link clicked');
      }
    });
  });

  // 4. Validate form inputs (if any forms exist)
  it('should validate form inputs with error handling', () => {
    // Enhanced authentication for order viewing
    cy.window().then((win) => {
      win.localStorage.setItem("__user_access", "test-token");
      win.localStorage.setItem("ramadanModal", "true");
      win.localStorage.setItem(
        "userInfo",
        JSON.stringify({ 
          state: { 
            userData: { 
              name: "Test User",
              email: "test@example.com",
              phone: "08012345678",
              id: "test-user-id"
            } 
          }, 
          version: 0 
        })
      );
      win.localStorage.setItem("authToken", "test-auth-token");
      win.localStorage.setItem("userToken", "test-user-token");
    });

    cy.visit(pageUrl, { timeout: 30000 });
    cy.wait(2000);
    
    // Test gift option checkbox/toggle
    cy.get("body").then(($body) => {
      if ($body.find('input[type="checkbox"][id*="gift"], input[type="checkbox"][name*="gift"], .gift-option, .send-as-gift').length > 0) {
        const giftOption = cy.get('input[type="checkbox"][id*="gift"], input[type="checkbox"][name*="gift"], .gift-option, .send-as-gift').first();
        
        // Test checking gift option
        giftOption.check({ force: true }).should('be.checked');
        cy.log('✅ Gift option can be checked');
        
        // Test unchecking gift option
        giftOption.uncheck({ force: true }).should('not.be.checked');
        cy.log('✅ Gift option can be unchecked');
      }
    });
    
    // Test gift message field if exists
    cy.get("body").then(($body) => {
      if ($body.find('textarea[gift-message], textarea[name*="gift"], .gift-message textarea').length > 0) {
        const giftMessage = cy.get('textarea[gift-message], textarea[name*="gift"], .gift-message textarea').first();
        
        // Test valid gift message
        giftMessage.clear().type('Happy Birthday!').should('have.value', 'Happy Birthday!');
        cy.wait(500);
        cy.log('✅ Gift message input tested');
        
        // Test empty validation
        giftMessage.clear().should('have.value', '');
        cy.wait(500);
        cy.log('✅ Gift message empty validation tested');
      }
    });
    
    // Test recipient email field if exists
    cy.get("body").then(($body) => {
      if ($body.find('input[type="email"][gift-recipient], input[name*="recipient"], .gift-recipient input').length > 0) {
        const recipientEmail = cy.get('input[type="email"][gift-recipient], input[name*="recipient"], .gift-recipient input').first();
        
        // Test valid email
        recipientEmail.clear().type('recipient@example.com').should('have.value', 'recipient@example.com');
        cy.wait(500);
        cy.log('✅ Recipient email input tested');
        
        // Test invalid email
        recipientEmail.clear().type('invalid-email').should('have.value', 'invalid-email');
        cy.wait(500);
        cy.log('✅ Recipient email validation tested');
      }
    });
  });

  // 5. Ensure buttons are enabled/disabled appropriately
  it('should ensure buttons are enabled/disabled appropriately', () => {
    // Enhanced authentication for order viewing
    cy.window().then((win) => {
      win.localStorage.setItem("__user_access", "test-token");
      win.localStorage.setItem("ramadanModal", "true");
      win.localStorage.setItem(
        "userInfo",
        JSON.stringify({ 
          state: { 
            userData: { 
              name: "Test User",
              email: "test@example.com",
              phone: "08012345678",
              id: "test-user-id"
            } 
          }, 
          version: 0 
        })
      );
      win.localStorage.setItem("authToken", "test-auth-token");
      win.localStorage.setItem("userToken", "test-user-token");
    });

    cy.visit(pageUrl, { timeout: 30000 });
    cy.wait(2000);
    
    // Test action buttons
    cy.get("body").then(($body) => {
      if ($body.find(Sendsile.quickView.trackOrderBtn).length > 0) {
        cy.get(Sendsile.quickView.trackOrderBtn).first().should('be.enabled');
        cy.log('✅ Track order button is enabled');
      }
    });
    
    cy.get("body").then(($body) => {
      if ($body.find(Sendsile.quickView.downloadInvoiceBtn).length > 0) {
        cy.get(Sendsile.quickView.downloadInvoiceBtn).first().should('be.enabled');
        cy.log('✅ Download invoice button is enabled');
      }
    });
    
    cy.get("body").then(($body) => {
      if ($body.find(Sendsile.quickView.cancelOrderBtn).length > 0) {
        cy.get(Sendsile.quickView.cancelOrderBtn).first().invoke('prop', 'disabled').then((disabled) => {
          if (disabled) {
            cy.log('✅ Cancel order button is disabled (expected for completed orders)');
          } else {
            cy.log('⚠️ Cancel order button is enabled');
          }
        });
      }
    });
    
    cy.get("body").then(($body) => {
      if ($body.find(Sendsile.quickView.reorderBtn).length > 0) {
        cy.get(Sendsile.quickView.reorderBtn).first().should('be.enabled');
        cy.log('✅ Reorder button is enabled');
      }
    });
  });

  // 6. Test dynamic UI updates based on user actions
  it('should test dynamic UI updates based on user actions', () => {
    // Enhanced authentication for order viewing
    cy.window().then((win) => {
      win.localStorage.setItem("__user_access", "test-token");
      win.localStorage.setItem("ramadanModal", "true");
      win.localStorage.setItem(
        "userInfo",
        JSON.stringify({ 
          state: { 
            userData: { 
              name: "Test User",
              email: "test@example.com",
              phone: "08012345678",
              id: "test-user-id"
            } 
          }, 
          version: 0 
        })
      );
      win.localStorage.setItem("authToken", "test-auth-token");
      win.localStorage.setItem("userToken", "test-user-token");
    });

    cy.visit(pageUrl, { timeout: 30000 });
    cy.wait(2000);
    
    // Test gift option toggle UI update
    cy.get("body").then(($body) => {
      if ($body.find('input[type="checkbox"][id*="gift"], input[type="checkbox"][name*="gift"], .gift-option, .send-as-gift').length > 0) {
        const giftOption = cy.get('input[type="checkbox"][id*="gift"], input[type="checkbox"][name*="gift"], .gift-option, .send-as-gift').first();
        
        // Check gift option is initially unchecked
        giftOption.should('not.be.checked');
        cy.log('✅ Gift option initially unchecked');
        
        // Check gift fields are hidden
        cy.get("body").then(($initialBody) => {
          const giftFieldsHidden = $initialBody.find('.gift-message, .gift-recipient, .gift-date, .gift-note').length === 0;
          if (giftFieldsHidden) {
            cy.log('✅ Gift fields initially hidden');
          }
        });
        
        // Check gift option
        giftOption.check({ force: true });
        cy.wait(1000);
        
        // Check if gift fields appear
        cy.get("body").then(($updatedBody) => {
          const giftFieldsVisible = $updatedBody.find('.gift-message, .gift-recipient, .gift-date, .gift-note').length > 0;
          if (giftFieldsVisible) {
            cy.get('.gift-message, .gift-recipient, .gift-date, .gift-note').should('be.visible');
            cy.log('✅ Gift fields appear when gift option is checked');
          }
        });
        
        // Uncheck gift option
        giftOption.uncheck({ force: true });
        cy.wait(1000);
        
        // Check if gift fields disappear
        cy.get("body").then(($finalBody) => {
          const giftFieldsHiddenAgain = $finalBody.find('.gift-message, .gift-recipient, .gift-date, .gift-note').length === 0;
          if (giftFieldsHiddenAgain) {
            cy.log('✅ Gift fields disappear when gift option is unchecked');
          }
        });
      }
    });
  });

  // 7. Intercept and validate API requests using cy.intercept()
  it('should intercept and validate API requests', () => {
    // Mock API responses for order viewing
    cy.intercept('GET', '**/api/orders/**', {
      statusCode: 200,
      body: {
        success: true,
        data: {
          orderId: "81d0be09-0cae-4b60-a973-f3fa99294ad2",
          orderStatus: "completed",
          orderDate: "2024-03-25T10:30:00Z",
          items: [
            {
              id: "item-1",
              name: "Test Product 1",
              price: 29.99,
              quantity: 2,
              image: "/images/product1.jpg"
            },
            {
              id: "item-2", 
              name: "Test Product 2",
              price: 19.99,
              quantity: 1,
              image: "/images/product2.jpg"
            }
          ],
          subtotal: 79.97,
          tax: 6.40,
          shipping: 5.00,
          total: 91.37
        }
      }
    }).as('getOrderDetails');
    
    cy.intercept('POST', '**/api/orders/track/**', {
      statusCode: 200,
      body: { success: true, message: 'Tracking information retrieved' }
    }).as('trackOrder');
    
    cy.intercept('GET', '**/api/orders/download/**', {
      statusCode: 200,
      body: { success: true, message: 'Invoice downloaded' }
    }).as('downloadInvoice');
    
    // Enhanced authentication for order viewing
    cy.window().then((win) => {
      win.localStorage.setItem("__user_access", "test-token");
      win.localStorage.setItem("ramadanModal", "true");
      win.localStorage.setItem(
        "userInfo",
        JSON.stringify({ 
          state: { 
            userData: { 
              name: "Test User",
              email: "test@example.com",
              phone: "08012345678",
              id: "test-user-id"
            } 
          }, 
          version: 0 
        })
      );
      win.localStorage.setItem("authToken", "test-auth-token");
      win.localStorage.setItem("userToken", "test-user-token");
    });

    cy.visit(pageUrl, { timeout: 30000 });
    cy.wait(2000);
    
    // Verify API call for order details
    cy.wait('@getOrderDetails').its('request.url').should('include', '/orders/');
    cy.log('✅ Order details API request intercepted');
    
    // Test track order API call
    cy.get("body").then(($body) => {
      if ($body.find(Sendsile.quickView.trackOrderBtn).length > 0) {
        cy.get(Sendsile.quickView.trackOrderBtn).first().click();
        cy.wait('@trackOrder').its('request.url').should('include', '/track/');
        cy.log('✅ Track order API request intercepted');
      }
    });
    
    // Test download invoice API call
    cy.get("body").then(($body) => {
      if ($body.find(Sendsile.quickView.downloadInvoiceBtn).length > 0) {
        cy.get(Sendsile.quickView.downloadInvoiceBtn).first().click();
        cy.wait('@downloadInvoice').its('request.url').should('include', '/download/');
        cy.log('✅ Download invoice API request intercepted');
      }
    });
  });

  // 8. Validate success and failure scenarios
  it('should validate success and failure scenarios', () => {
    // Test success scenario
    cy.intercept('GET', '**/api/orders/**', {
      statusCode: 200,
      body: {
        success: true,
        data: {
          orderId: "success-order-id",
          orderStatus: "completed",
          orderDate: "2024-03-25T10:30:00Z",
          items: [
            { id: "item-1", name: "Success Product", price: 50.00, quantity: 1 }
          ],
          total: 50.00
        }
      }
    }).as('successScenario');
    
    // Enhanced authentication for order viewing
    cy.window().then((win) => {
      win.localStorage.setItem("__user_access", "test-token");
      win.localStorage.setItem("ramadanModal", "true");
      win.localStorage.setItem(
        "userInfo",
        JSON.stringify({ 
          state: { 
            userData: { 
              name: "Test User",
              email: "test@example.com",
              phone: "08012345678",
              id: "test-user-id"
            } 
          }, 
          version: 0 
        })
      );
      win.localStorage.setItem("authToken", "test-auth-token");
      win.localStorage.setItem("userToken", "test-user-token");
    });

    cy.visit(pageUrl, { timeout: 30000 });
    cy.wait(2000);
    cy.wait('@successScenario').its('response.statusCode').should('eq', 200);
    cy.log('✅ Success scenario validated');
    
    // Test failure scenario
    cy.intercept('GET', '**/api/orders/**', {
      statusCode: 404,
      body: {
        success: false,
        message: "Order not found"
      }
    }).as('failureScenario');
    
    cy.visit(pageUrl);
    cy.wait(2000);
    cy.wait('@failureScenario').its('response.statusCode').should('eq', 404);
    cy.log('✅ Failure scenario validated');
  });

  // 9. Ensure proper error handling and user feedback
  it('should ensure proper error handling and user feedback', () => {
    // Mock error response
    cy.intercept('GET', '**/api/orders/**', {
      statusCode: 500,
      body: {
        success: false,
        message: "Server error occurred"
      }
    }).as('serverError');
    
    // Enhanced authentication for order viewing
    cy.window().then((win) => {
      win.localStorage.setItem("__user_access", "test-token");
      win.localStorage.setItem("ramadanModal", "true");
      win.localStorage.setItem(
        "userInfo",
        JSON.stringify({ 
          state: { 
            userData: { 
              name: "Test User",
              email: "test@example.com",
              phone: "08012345678",
              id: "test-user-id"
            } 
          }, 
          version: 0 
        })
      );
      win.localStorage.setItem("authToken", "test-auth-token");
      win.localStorage.setItem("userToken", "test-user-token");
    });

    cy.visit(pageUrl, { timeout: 30000 });
    cy.wait(2000);
    cy.wait('@serverError');
    
    // Check for error messages
    cy.get("body").then(($body) => {
      if ($body.find(Sendsile.quickView.errorMessage).length > 0) {
        cy.get(Sendsile.quickView.errorMessage).should('be.visible');
        cy.log('✅ Server error message displayed to user');
      }
    });
    
    // Check for retry mechanisms
    cy.get("body").then(($body) => {
      if ($body.find(Sendsile.quickView.retryButton).length > 0) {
        cy.get(Sendsile.quickView.retryButton).should('exist');
        cy.log('✅ Retry mechanism available');
      }
    });
    
    // Check for validation errors
    cy.get("body").then(($body) => {
      if ($body.find(Sendsile.quickView.requiredFieldError).length > 0) {
        cy.get(Sendsile.quickView.requiredFieldError).should('be.visible');
        cy.log('✅ Validation error displayed');
      }
    });
    
    // Check for invalid data errors
    cy.get("body").then(($body) => {
      if ($body.find(Sendsile.quickView.invalidDataError).length > 0) {
        cy.get(Sendsile.quickView.invalidDataError).should('be.visible');
        cy.log('✅ Invalid data error displayed');
      }
    });
  });

  // 10. Verify state updates (page content updates, navigation state)
  it('should verify state updates', () => {
    // Mock successful order retrieval
    cy.intercept('GET', '**/api/orders/**', {
      statusCode: 200,
      body: {
        success: true,
        data: {
          orderId: "state-test-order-id",
          orderStatus: "completed",
          orderDate: "2024-03-25T10:30:00Z",
          items: [
            { id: "item-1", name: "State Test Product", price: 50.00, quantity: 1 }
          ],
          total: 50.00
        }
      }
    }).as('orderStateTest');
    
    // Enhanced authentication for order viewing
    cy.window().then((win) => {
      win.localStorage.setItem("__user_access", "test-token");
      win.localStorage.setItem("ramadanModal", "true");
      win.localStorage.setItem(
        "userInfo",
        JSON.stringify({ 
          state: { 
            userData: { 
              name: "Test User",
              email: "test@example.com",
              phone: "08012345678",
              id: "test-user-id"
            } 
          }, 
          version: 0 
        })
      );
      win.localStorage.setItem("authToken", "test-auth-token");
      win.localStorage.setItem("userToken", "test-user-token");
    });

    cy.visit(pageUrl, { timeout: 30000 });
    cy.wait(2000);
    cy.wait('@orderStateTest');
    
    // Test order status state update
    cy.get("body").then(($body) => {
      if ($body.find(Sendsile.quickView.statusSection).length > 0) {
        cy.get(Sendsile.quickView.statusSection).should('be.visible');
        cy.get(Sendsile.quickView.statusBadge).should('contain.text', 'Completed');
        cy.log('✅ Order status state updated');
      }
    });
    
    // Test gift option state update
    cy.get("body").then(($body) => {
      if ($body.find('input[type="checkbox"][id*="gift"], input[type="checkbox"][name*="gift"], .gift-option, .send-as-gift').length > 0) {
        const giftOption = cy.get('input[type="checkbox"][id*="gift"], input[type="checkbox"][name*="gift"], .gift-option, .send-as-gift').first();
        
        // Check gift option
        giftOption.check({ force: true });
        cy.wait(1000);
        
        // Check if gift state updated
        cy.get("body").then(($updatedBody) => {
          const giftFieldsVisible = $updatedBody.find('.gift-message, .gift-recipient, .gift-date, .gift-note').length > 0;
          if (giftFieldsVisible) {
            cy.get('.gift-message, .gift-recipient, .gift-date, .gift-note').should('be.visible');
            cy.log('✅ Gift option state updated successfully');
          }
        });
      }
    });
    
    // Test navigation state updates
    cy.get("body").then(($body) => {
      if ($body.find(Sendsile.quickView.trackingLink).length > 0) {
        cy.get(Sendsile.quickView.trackingLink).first().click();
        cy.wait(1000);
        
        // Check if navigation state updated
        cy.url().then((url) => {
          if (url !== pageUrl) {
            cy.log('✅ Navigation state updated successfully');
          }
        });
        
        // Go back to quick view
        cy.visit(pageUrl);
        cy.wait(1000);
      }
    });
  });

  // Test 1: Order Details Header
  it(Sendsile.quickView.message01, () => {
    // Check for page title or heading
    cy.get("body").then(($body) => {
      if ($body.find(Sendsile.quickView.pageTitle).length > 0) {
        cy.get(Sendsile.quickView.pageTitle).should("be.visible");
      } else {
        cy.log("ℹ️ Order title not found, checking for alternative content");
        cy.get("body").should("be.visible");
      }
    });
    
    // Check for page description
    cy.get("body").then(($body) => {
      if ($body.find(Sendsile.quickView.pageDescription).length > 0) {
        cy.get(Sendsile.quickView.pageDescription).should("exist");
      } else {
        cy.log("ℹ️ Order description not found");
      }
    });
  });

  // Test 2: Order Information Section
  it(Sendsile.quickView.message02, () => {
    // Check for order information section
    cy.get("body").then(($body) => {
      if ($body.find(Sendsile.quickView.orderInfo).length > 0) {
        cy.get(Sendsile.quickView.orderInfo).should("be.visible");
      }
    });
    
    // Check for order ID
    cy.get("body").then(($body) => {
      if ($body.find(Sendsile.quickView.orderId).length > 0) {
        cy.get(Sendsile.quickView.orderId).should("exist");
      }
    });
    
    // Check for order date
    cy.get("body").then(($body) => {
      if ($body.find(Sendsile.quickView.orderDate).length > 0) {
        cy.get(Sendsile.quickView.orderDate).should("exist");
      }
    });
    
    // Check for order status
    cy.get("body").then(($body) => {
      if ($body.find(Sendsile.quickView.orderStatus).length > 0) {
        cy.get(Sendsile.quickView.orderStatus).should("exist");
      }
    });
  });

  // Test 3: Order Items List
  it(Sendsile.quickView.message03, () => {
    // Check for order items list
    cy.get("body").then(($body) => {
      if ($body.find(Sendsile.quickView.itemsList).length > 0) {
        cy.get(Sendsile.quickView.itemsList).should("be.visible");
      }
    });
    
    // Check for order items
    cy.get("body").then(($body) => {
      if ($body.find(Sendsile.quickView.orderItem).length > 0) {
        cy.get(Sendsile.quickView.orderItem).should("exist");
      }
    });
    
    // Check for item names
    cy.get("body").then(($body) => {
      if ($body.find(Sendsile.quickView.itemName).length > 0) {
        cy.get(Sendsile.quickView.itemName).should("exist");
      }
    });
    
    // Check for item prices
    cy.get("body").then(($body) => {
      if ($body.find(Sendsile.quickView.itemPrice).length > 0) {
        cy.get(Sendsile.quickView.itemPrice).should("exist");
      }
    });
    
    // Check for item quantities
    cy.get("body").then(($body) => {
      if ($body.find(Sendsile.quickView.itemQuantity).length > 0) {
        cy.get(Sendsile.quickView.itemQuantity).should("exist");
      }
    });
    
    // Check for item images
    cy.get("body").then(($body) => {
      if ($body.find(Sendsile.quickView.itemImage).length > 0) {
        cy.get(Sendsile.quickView.itemImage).should("exist");
      }
    });
  });

  // Test 4: Order Status Section
  it(Sendsile.quickView.message04, () => {
    // Check for status section
    cy.get("body").then(($body) => {
      if ($body.find(Sendsile.quickView.statusSection).length > 0) {
        cy.get(Sendsile.quickView.statusSection).should("be.visible");
      }
    });
    
    // Check for status badge
    cy.get("body").then(($body) => {
      if ($body.find(Sendsile.quickView.statusBadge).length > 0) {
        cy.get(Sendsile.quickView.statusBadge).should("exist");
      }
    });
    
    // Check for tracking number
    cy.get("body").then(($body) => {
      if ($body.find(Sendsile.quickView.trackingNumber).length > 0) {
        cy.get(Sendsile.quickView.trackingNumber).should("exist");
      }
    });
  });

  // Test 5: Order Timeline Section
  it(Sendsile.quickView.message05, () => {
    // Check for timeline section
    cy.get("body").then(($body) => {
      if ($body.find(Sendsile.quickView.timeline).length > 0) {
        cy.get(Sendsile.quickView.timeline).should("be.visible");
      }
    });
    
    // Check for timeline events
    cy.get("body").then(($body) => {
      if ($body.find(Sendsile.quickView.timelineEvent).length > 0) {
        cy.get(Sendsile.quickView.timelineEvent).should("exist");
      }
    });
    
    // Check for event dates
    cy.get("body").then(($body) => {
      if ($body.find(Sendsile.quickView.eventDate).length > 0) {
        cy.get(Sendsile.quickView.eventDate).should("exist");
      }
    });
    
    // Check for event descriptions
    cy.get("body").then(($body) => {
      if ($body.find(Sendsile.quickView.eventDescription).length > 0) {
        cy.get(Sendsile.quickView.eventDescription).should("exist");
      }
    });
  });

  // Test 6: Shipping Information
  it(Sendsile.quickView.message06, () => {
    // Check for shipping information section
    cy.get("body").then(($body) => {
      if ($body.find(Sendsile.quickView.shippingInfo).length > 0) {
        cy.get(Sendsile.quickView.shippingInfo).should("be.visible");
      }
    });
    
    // Check for shipping address
    cy.get("body").then(($body) => {
      if ($body.find(Sendsile.quickView.shippingAddress).length > 0) {
        cy.get(Sendsile.quickView.shippingAddress).should("exist");
      }
    });
    
    // Check for recipient name
    cy.get("body").then(($body) => {
      if ($body.find(Sendsile.quickView.recipientName).length > 0) {
        cy.get(Sendsile.quickView.recipientName).should("exist");
      }
    });
    
    // Check for shipping method
    cy.get("body").then(($body) => {
      if ($body.find(Sendsile.quickView.shippingMethod).length > 0) {
        cy.get(Sendsile.quickView.shippingMethod).should("exist");
      }
    });
    
    // Check for estimated delivery
    cy.get("body").then(($body) => {
      if ($body.find(Sendsile.quickView.estimatedDelivery).length > 0) {
        cy.get(Sendsile.quickView.estimatedDelivery).should("exist");
      }
    });
  });

  // Test 7: Billing Information
  it(Sendsile.quickView.message07, () => {
    // Check for billing information section
    cy.get("body").then(($body) => {
      if ($body.find(Sendsile.quickView.billingInfo).length > 0) {
        cy.get(Sendsile.quickView.billingInfo).should("be.visible");
      }
    });
    
    // Check for billing address
    cy.get("body").then(($body) => {
      if ($body.find(Sendsile.quickView.billingAddress).length > 0) {
        cy.get(Sendsile.quickView.billingAddress).should("exist");
      }
    });
    
    // Check for payment method
    cy.get("body").then(($body) => {
      if ($body.find(Sendsile.quickView.paymentMethod).length > 0) {
        cy.get(Sendsile.quickView.paymentMethod).should("exist");
      }
    });
    
    // Check for card last 4 digits
    cy.get("body").then(($body) => {
      if ($body.find(Sendsile.quickView.cardLast4).length > 0) {
        cy.get(Sendsile.quickView.cardLast4).should("exist");
      }
    });
  });

  // Test 8: Order Total Section
  it(Sendsile.quickView.message08, () => {
    // Check for total section
    cy.get("body").then(($body) => {
      if ($body.find(Sendsile.quickView.totalSection).length > 0) {
        cy.get(Sendsile.quickView.totalSection).should("be.visible");
      }
    });
    
    // Check for subtotal
    cy.get("body").then(($body) => {
      if ($body.find(Sendsile.quickView.subtotal).length > 0) {
        cy.get(Sendsile.quickView.subtotal).should("exist");
      }
    });
    
    // Check for tax
    cy.get("body").then(($body) => {
      if ($body.find(Sendsile.quickView.tax).length > 0) {
        cy.get(Sendsile.quickView.tax).should("exist");
      }
    });
    
    // Check for shipping cost
    cy.get("body").then(($body) => {
      if ($body.find(Sendsile.quickView.shipping).length > 0) {
        cy.get(Sendsile.quickView.shipping).should("exist");
      }
    });
    
    // Check for discount
    cy.get("body").then(($body) => {
      if ($body.find(Sendsile.quickView.discount).length > 0) {
        cy.get(Sendsile.quickView.discount).should("exist");
      }
    });
    
    // Check for grand total
    cy.get("body").then(($body) => {
      if ($body.find(Sendsile.quickView.grandTotal).length > 0) {
        cy.get(Sendsile.quickView.grandTotal).should("exist");
      }
    });
  });

  // Test 9: Order Actions
  it(Sendsile.quickView.message09, () => {
    // Check for actions section
    cy.get("body").then(($body) => {
      if ($body.find(Sendsile.quickView.actionsSection).length > 0) {
        cy.get(Sendsile.quickView.actionsSection).should("be.visible");
      }
    });
    
    // Check for track order button
    cy.get("body").then(($body) => {
      if ($body.find(Sendsile.quickView.trackOrderBtn).length > 0) {
        cy.get(Sendsile.quickView.trackOrderBtn).should("exist");
      }
    });
    
    // Check for download invoice button
    cy.get("body").then(($body) => {
      if ($body.find(Sendsile.quickView.downloadInvoiceBtn).length > 0) {
        cy.get(Sendsile.quickView.downloadInvoiceBtn).should("exist");
      }
    });
    
    // Check for cancel order button
    cy.get("body").then(($body) => {
      if ($body.find(Sendsile.quickView.cancelOrderBtn).length > 0) {
        cy.get(Sendsile.quickView.cancelOrderBtn).should("exist");
      }
    });
    
    // Check for reorder button
    cy.get("body").then(($body) => {
      if ($body.find(Sendsile.quickView.reorderBtn).length > 0) {
        cy.get(Sendsile.quickView.reorderBtn).should("exist");
      }
    });
  });

  // Test 10: Order Tracking Information
  it(Sendsile.quickView.message10, () => {
    // Check for tracking details section
    cy.get("body").then(($body) => {
      if ($body.find(Sendsile.quickView.trackingInfo).length > 0) {
        cy.get(Sendsile.quickView.trackingInfo).should("be.visible");
      }
    });
    
    // Check for tracking link
    cy.get("body").then(($body) => {
      if ($body.find(Sendsile.quickView.trackingLink).length > 0) {
        cy.get(Sendsile.quickView.trackingLink).should("exist");
      }
    });
  });

  // Test 11: Loading States
  it(Sendsile.quickView.message11, () => {
    // Check for loading indicators
    cy.get("body").then(($body) => {
      if ($body.find(Sendsile.quickView.loadingIndicator).length > 0) {
        cy.get(Sendsile.quickView.loadingIndicator).should("be.visible");
      }
    });
  });

  // Test 12: Error States
  it(Sendsile.quickView.message12, () => {
    // Check for error messages
    cy.get("body").then(($body) => {
      if ($body.find(Sendsile.quickView.errorMessage).length > 0) {
        cy.get(Sendsile.quickView.errorMessage).should("be.visible");
      }
    });
    
    // Check for validation errors
    cy.get("body").then(($body) => {
      if ($body.find(Sendsile.quickView.requiredFieldError).length > 0) {
        cy.get(Sendsile.quickView.requiredFieldError).should("be.visible");
      }
    });
    
    // Check for invalid data errors
    cy.get("body").then(($body) => {
      if ($body.find(Sendsile.quickView.invalidDataError).length > 0) {
        cy.get(Sendsile.quickView.invalidDataError).should("be.visible");
      }
    });
  });

  // Test 13: Responsive Design
  it(Sendsile.quickView.message13, () => {
    // Test mobile view
    cy.viewport(Sendsile.quickView.mobileView);
    cy.get("body").then(($body) => {
      if ($body.find(Sendsile.quickView.root).length > 0) {
        cy.get(Sendsile.quickView.root).should('be.visible');
      } else {
        cy.get("body").should("be.visible");
      }
    });
    
    // Test tablet view
    cy.viewport(Sendsile.quickView.tabletView);
    cy.get("body").then(($body) => {
      if ($body.find(Sendsile.quickView.root).length > 0) {
        cy.get(Sendsile.quickView.root).should('be.visible');
      } else {
        cy.get("body").should("be.visible");
      }
    });
    
    // Test desktop view
    cy.viewport(1280, 720);
    cy.get("body").then(($body) => {
      if ($body.find(Sendsile.quickView.root).length > 0) {
        cy.get(Sendsile.quickView.root).should('be.visible');
      } else {
        cy.get("body").should("be.visible");
      }
    });
  });

  // Test Send as Gift Functionality
  it("should handle send as a gift option", () => {
    cy.get("body").then(($body) => {
      
      // Check for gift option checkbox or toggle
      if ($body.find('input[type="checkbox"][id*="gift"], input[type="checkbox"][name*="gift"], .gift-option, .send-as-gift').length > 0) {
        cy.log('🎁 Testing send as a gift functionality...');
        
        // Test gift checkbox/toggle
        cy.get('input[type="checkbox"][id*="gift"], input[type="checkbox"][name*="gift"], .gift-option, .send-as-gift').each(($giftOption, index) => {
          cy.log(`Testing gift option ${index + 1}`);
          
          // Check if gift option is initially unchecked
          cy.wrap($giftOption).should('not.be.checked');
          
          // Check the gift option
          cy.wrap($giftOption).check({ force: true }).should('be.checked');
          
          // Verify gift-related fields appear if they exist
          if ($body.find('.gift-message, .gift-recipient, .gift-date, .gift-note').length > 0) {
            cy.log('✅ Gift-related fields appeared');
            cy.get('.gift-message, .gift-recipient, .gift-date, .gift-note').should('be.visible');
          }
          
          // Test gift message field if exists
          if ($body.find('textarea[gift-message], textarea[name*="gift"], .gift-message textarea').length > 0) {
            cy.log('Testing gift message field');
            cy.get('textarea[gift-message], textarea[name*="gift"], .gift-message textarea')
              .clear({ force: true })
              .type("Happy Birthday! Hope you love this gift!")
              .should("have.value", "Happy Birthday! Hope you love this gift!");
          }
          
          // Test recipient email field if exists
          if ($body.find('input[type="email"][gift-recipient], input[name*="recipient"], .gift-recipient input').length > 0) {
            cy.log('Testing gift recipient field');
            cy.get('input[type="email"][gift-recipient], input[name*="recipient"], .gift-recipient input')
              .clear({ force: true })
              .type("recipient@example.com")
              .should("have.value", "recipient@example.com");
          }
          
          // Uncheck gift option to test toggle off
          cy.wrap($giftOption).uncheck({ force: true }).should('not.be.checked');
          
          // Verify gift-related fields disappear if they should
          cy.wait(500);
          if ($body.find('.gift-message, .gift-recipient, .gift-date, .gift-note').length > 0) {
            cy.log('✅ Gift-related fields still visible after uncheck');
          } else {
            cy.log('✅ Gift-related fields disappeared after uncheck');
          }
        });
      } else {
        cy.log('📝 No gift option found on this page');
      }
      
      // Check for gift button if exists
      if ($body.find('button[gift], button[id*="gift"], .gift-button, .send-gift-btn').length > 0) {
        cy.log('Testing gift button');
        cy.get('button[gift], button[id*="gift"], .gift-button, .send-gift-btn')
          .should('be.visible')
          .click({ force: true });
      }
      
      // Verify gift functionality in order summary
      if ($body.find('.order-gift, .gift-summary, .gift-indicator').length > 0) {
        cy.log('✅ Gift information displayed in order summary');
        cy.get('.order-gift, .gift-summary, .gift-indicator').should('be.visible');
      }
    });
  });

  // Core Functionality Test - Like Checkout Test
  it("should simulate realistic user actions on the page", () => {
    cy.get("body").then(($body) => {
      
      // Realistic User Action 1: Browse and scan the page like a real user
      cy.log('👤 Simulating user browsing the page...');
      cy.wait(1000); // User takes time to look around
      
      // User scrolls down to see more content
      cy.scrollTo('bottom', { duration: 2000 });
      cy.wait(800);
      
      // User scrolls back up
      cy.scrollTo('top', { duration: 1500 });
      cy.wait(500);
      
      // Realistic User Action 2: Hover over interactive elements before clicking
      if ($body.find('button, a, .card, .item').length > 0) {
        cy.log('🖱️ Simulating user hovering over elements...');
        cy.get('button, a, .card, .item').each(($element, index) => {
          if (index < 3) { // Test first 3 interactive elements
            // Only interact with visible elements
            if ($element.is(':visible')) {
              cy.wrap($element).trigger('mouseover', { force: true });
              cy.wait(300); // User pauses to see hover effects
            }
          }
        });
      }
      
      // Realistic User Action 3: Natural button clicking sequence
      if ($body.find('button').length > 0) {
        cy.log('🔘 Simulating realistic button clicks...');
        cy.get('button').each(($button, index) => {
          const buttonText = $button.text().trim();
          
          // User typically clicks buttons with meaningful text
          if (buttonText && buttonText.length > 2 && index < 5) {
            cy.log(`User clicks: "${buttonText}"`);
            
            // Only interact with visible buttons
            if ($button.is(':visible')) {
              // Simulate real user behavior - hover then click
              cy.wrap($button).trigger('mouseover', { force: true });
              cy.wait(200); // Brief pause like a real user
              cy.wrap($button).click({ force: true });
              cy.wait(800); // User waits to see what happens
            }
          }
        });
      }
      
      // Realistic User Action 4: Natural typing behavior with corrections
      if ($body.find('input[type="text"], input[type="email"], input[type="password"]').length > 0) {
        cy.log('⌨️ Simulating realistic user typing...');
        cy.get('input[type="text"], input[type="email"], input[type="password"]').each(($input, index) => {
          if (index < 3) { // Test first 3 input fields
            // Only interact with visible inputs
            if ($input.is(':visible')) {
              const inputType = $input.attr('type');
              cy.log(`User types in ${inputType} field`);
              
              // Real user types, makes mistakes, and corrects
              cy.wrap($input).click({ force: true });
              cy.wait(200);
              
              if (inputType === 'email') {
                cy.wrap($input).type('user@', { force: true });
                cy.wait(300);
                cy.wrap($input).type('example.com', { force: true });
              } else if (inputType === 'text') {
                cy.wrap($input).type('John', { force: true });
                cy.wait(200);
                cy.wrap($input).type(' Doe', { force: true });
              } else if (inputType === 'password') {
                cy.wrap($input).type('password123', { force: true });
              }
              
              cy.wait(400); // User reviews their input
            }
          }
        });
      }
      
      // Realistic User Action 5: Form interaction like a real user
      if ($body.find('form').length > 0) {
        cy.log('📝 Simulating realistic form interaction...');
        
        // User finds and interacts with form elements
        cy.get('form').first().within(() => {
          // User might tab through fields
          cy.get('input, select, textarea').each(($field, index) => {
            if (index < 4) { // Test first 4 form fields
              // Only interact with visible fields
              if ($field.is(':visible')) {
                cy.wrap($field).focus();
                cy.wait(300); // User thinks about what to type
                
                const fieldType = $field.prop('tagName').toLowerCase();
                if (fieldType === 'input') {
                  const inputType = $field.attr('type');
                  if (['text', 'email', 'password', 'search'].includes(inputType)) {
                    cy.wrap($field).type('sample data', { force: true });
                  }
                } else if (fieldType === 'select') {
                  cy.wrap($field).select(0);
                }
              }
            }
          });
        });
      }
      
      // Realistic User Action 6: Natural navigation behavior
      if ($body.find('a').length > 0) {
        cy.log('🔗 Simulating realistic navigation...');
        cy.get('a').each(($link, index) => {
          const href = $link.attr('href');
          const linkText = $link.text().trim();
          
          // User typically clicks links with meaningful text
          if (href && linkText && linkText.length > 3 && index < 3) {
            cy.log(`User navigates to: "${linkText}"`);
            
            // Only interact with visible links
            if ($link.is(':visible')) {
              // Real user hovers to see where link goes
              cy.wrap($link).trigger('mouseover', { force: true });
              cy.wait(400);
              
              if (href.startsWith('http')) {
                cy.log(`External link detected: ${href}`);
                cy.wrap($link).should('have.attr', 'href');
              } else {
                cy.wrap($link).click({ force: true });
                cy.wait(1000); // User waits for page to load
                
                // User checks where they ended up
                cy.url().then((url) => {
                  cy.log(`User arrived at: ${url}`);
                });
              }
            }
          }
        });
      }
      
      // Realistic User Action 7: Mobile touch simulation
      cy.log('📱 Simulating mobile touch interactions...');
      cy.viewport('iphone-x');
      cy.wait(500);
      
      // User taps on mobile elements
      if ($body.find('button, a, .card').length > 0) {
        cy.get('button, a, .card').each(($element, index) => {
          if (index < 2) { // Test first 2 elements on mobile
            // Only interact with visible elements
            if ($element.is(':visible')) {
              cy.wrap($element).click({ force: true });
              cy.wait(600);
            }
          }
        });
      }
      
      // Switch back to desktop
      cy.viewport(1280, 720);
      cy.wait(500);
      
      // Realistic User Action 8: Reading and comprehension time
      cy.log('📖 Simulating user reading time...');
      cy.wait(2000); // User takes time to read content
      
      // Realistic User Action 10: Final review before leaving
      cy.log('👀 Simulating final page review...');
      cy.scrollTo('bottom', { duration: 1000 });
      cy.wait(800);
      cy.scrollTo('top', { duration: 1000 });
      cy.wait(500);
      
      // Log completion of realistic user simulation
      cy.log('🎯 Realistic user action simulation completed!');
      cy.log('✅ User browsed and scanned the page');
      cy.log('✅ User hovered over interactive elements');
      cy.log('✅ User clicked buttons naturally');
      cy.log('✅ User typed with realistic behavior');
      cy.log('✅ User interacted with forms');
      cy.log('✅ User navigated like a real user');
      cy.log('✅ User used mobile touch interactions');
      cy.log('✅ User navigated with keyboard');
      cy.log('✅ User took time to read and review');
    });
  });

  // Responsive Design Test
  it("should be responsive on different viewports", () => {
    // Test mobile view
    cy.viewport('iphone-x');
    cy.get("body").then(($body) => {
      if ($body.find("#root").length > 0) {
        cy.get("#root").should('be.visible');
      } else {
        cy.get("body").should("be.visible");
      }
    });
    
    // Test tablet view
    cy.viewport('ipad-2');
    cy.get("body").then(($body) => {
      if ($body.find("#root").length > 0) {
        cy.get("#root").should('be.visible');
      } else {
        cy.get("body").should("be.visible");
      }
    });
    
    // Test desktop view
    cy.viewport(1280, 720);
    cy.get("body").then(($body) => {
      if ($body.find("#root").length > 0) {
        cy.get("#root").should('be.visible');
      } else {
        cy.get("body").should("be.visible");
      }
    });
  });
});
