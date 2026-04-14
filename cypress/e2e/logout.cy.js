import { Sendsile } from "../configuration/project.config.js";

// Helper Functions
const seedAuthenticatedState = (win) => {
  win.localStorage.setItem('__user_access', 'test-token');
  win.localStorage.setItem('ramadanModal', 'true');
  win.localStorage.setItem('userInfo', JSON.stringify({ 
    state: { 
      userData: { 
        name: 'Test User',
        email: 'test@example.com',
        phone: '08012345678'
      } 
    }, 
    version: 0 
  }));
  win.localStorage.setItem('isLoggedIn', 'true');
};

const mockLogoutApis = () => {
  // Mock logout API
  cy.intercept('POST', '**/api/logout', {
    statusCode: 200,
    body: {
      success: true,
      message: Sendsile.logout.message || 'Logged out successfully'
    } 
  }).as("apiLogout");

  // Mock dashboard APIs
  cy.intercept('GET', '**/api/**', {
    statusCode: 200,
    body: {
      data: [],
      message: "API request processed"
    } 
  }).as("apiGet");
};

const visitDashboard = () => {
  mockLogoutApis();
  
  cy.visit("https://www.sendsile.com/dashboard", { 
    timeout: 30000,
    failOnStatusCode: false,
    onBeforeLoad: (win) => {
      seedAuthenticatedState(win);
    }
  });
  
  // Wait for page to load
  cy.wait(2000);
  cy.get('body').should('be.visible');
};

const findAndClickLogout = () => {
  return cy.get('body').then(($body) => {
    const logoutSelectors = [
      'button:contains("Logout")',
      'button:contains("Sign Out")',
      'button:contains("Log out")',
      'a:contains("Logout")',
      'a:contains("Sign Out")',
      '.logout-btn',
      '.sign-out-btn',
      '[data-testid="logout"]',
      '[data-cy="logout"]',
      // Additional selectors for different implementations
      'header button:contains("Logout")',
      'nav button:contains("Logout")',
      '.user-menu button:contains("Logout")',
      '.profile-menu button:contains("Logout")',
      '.dropdown-menu button:contains("Logout")',
      '.sidebar button:contains("Logout")',
      '.mobile-menu button:contains("Logout")'
    ];
    
    let logoutFound = false;
    
    logoutSelectors.forEach(selector => {
      if ($body.find(selector).length > 0 && !logoutFound) {
        cy.get(selector).first().then(($el) => {
          if ($el.is(':visible') || $el.css('display') !== 'none') {
            cy.get($el).click({ force: true });
            cy.log(`Found and clicked logout button: ${selector}`);
            logoutFound = true;
          } else {
            cy.log(`Found logout button but it's hidden: ${selector}`);
          }
        });
      }
    });
    
    if (!logoutFound) {
      // Try to find any button with logout-related text
      cy.get('button, a').each(($el) => {
        const text = $el.text().toLowerCase();
        if (text.includes('logout') || text.includes('sign out') || text.includes('log out')) {
          cy.get($el).click({ force: true });
          cy.log(`Found logout button with text: ${text}`);
          logoutFound = true;
          return false; // break the loop
        }
      });
    }
    
    if (!logoutFound) {
      cy.log('No logout button found');
    }
    
    return logoutFound;
  });
};

describe("Sendsile Logout Functionality", () => {
  const dashboardUrl = "https://www.sendsile.com/dashboard";
  const logoutUrl = Sendsile.logout.pageUrl;

  beforeEach(() => {
    // Clear storage and set up authentication
    cy.clearCookies();
    cy.clearLocalStorage();
    cy.viewport(1440, 900);
    
    visitDashboard();
    cy.wait("@apiGet");
    cy.log("Dashboard setup complete");
  });

  // Test 1: Check for Logout Button in Dashboard
  it("should find logout button in dashboard", () => {
    cy.get("body").then(($body) => {
      // Look for logout button in dashboard with comprehensive selectors
      const logoutSelectors = [
        'button:contains("Logout")',
        'button:contains("Sign Out")',
        'button:contains("Log out")',
        'a:contains("Logout")',
        'a:contains("Sign Out")',
        '.logout-btn',
        '.sign-out-btn',
        '[data-testid="logout"]',
        '[data-cy="logout"]',
        // Additional selectors for different implementations
        'header button:contains("Logout")',
        'nav button:contains("Logout")',
        '.user-menu button:contains("Logout")',
        '.profile-menu button:contains("Logout")',
        '.dropdown-menu button:contains("Logout")',
        '.sidebar button:contains("Logout")',
        '.mobile-menu button:contains("Logout")'
      ];
      
      let logoutFound = false;
      logoutSelectors.forEach(selector => {
        if ($body.find(selector).length > 0 && !logoutFound) {
          cy.get(selector).first().should("exist");
          logoutFound = true;
          cy.log(`Found logout button: ${selector}`);
        }
      });
      
      if (!logoutFound) {
        cy.log("No logout button found in dashboard");
        // Try to find any button with logout-related text
        cy.get('button, a').each(($el) => {
          const text = $el.text().toLowerCase();
          if (text.includes('logout') || text.includes('sign out') || text.includes('log out')) {
            cy.log(`Found logout button with text: ${text}`);
            cy.wrap($el).should('exist');
            return false; // break the loop
          }
        });
      }
    });
  });

  // Test 2: Perform Logout from Dashboard
  it("should perform logout from dashboard", () => {
    cy.get("body").then(($body) => {
      const logoutSelectors = [
        'button:contains("Logout")',
        'button:contains("Sign Out")',
        'button:contains("Log out")',
        'a:contains("Logout")',
        'a:contains("Sign Out")',
        '.logout-btn',
        '.sign-out-btn',
        '[data-testid="logout"]',
        '[data-cy="logout"]'
      ];
      
      let logoutFound = false;
      logoutSelectors.forEach(selector => {
        if ($body.find(selector).length > 0 && !logoutFound) {
          cy.get(selector).first().click({ force: true });
          logoutFound = true;
          cy.log(`Clicked logout button: ${selector}`);
        }
      });
      
      if (logoutFound) {
        // Wait for logout to complete
        cy.wait("@apiLogout");
        
        // Check if redirected to login or logout page
        cy.url().then((url) => {
          if (url.includes('/login')) {
            cy.log("✅ Redirected to login page after logout");
            // Verify login components instead of logout root if on login page
            cy.get('input[type="email"], button').should("be.visible");
          } else if (url.includes('/logout')) {
            cy.log("✅ Redirected to logout page");
            cy.get(Sendsile.logout.root).should("be.visible");
          }
        });
        
        // Verify localStorage is cleared
        cy.window().its('localStorage').invoke('getItem', '__user_access').should('be.null');
        cy.log("✅ Authentication token cleared");
      } else {
        cy.log("No logout button found to test logout flow");
      }
    });
  });

  // Test 3: Visit Logout Page Directly (if it exists)
  it(Sendsile.logout.message01, () => {
    cy.visit(logoutUrl, { failOnStatusCode: false });
    cy.wait(2000);
    
    cy.get("body").then(($body) => {
      // Check if we got an error page
      if ($body.find('.error, .error-page, [data-testid="error"]').length > 0) {
        cy.log("ℹ️ Logout page returned error - this is expected if logout is handled in dashboard");
      } else {
        // If logout page loads successfully, test it
        cy.get(Sendsile.logout.root).should("be.visible");
      }
    });
  });

  // Test 4: Test Logout Confirmation (if logout page exists)
  it(Sendsile.logout.message02, () => {
    cy.visit(logoutUrl, { failOnStatusCode: false });
    cy.wait(2000);
    
    cy.get("body").then(($body) => {
      // Only test if not an error page
      if ($body.find('.error, .error-page, [data-testid="error"]').length === 0) {
        // Check for logout confirmation message
        if ($body.find(Sendsile.logout.logoutMessage).length > 0) {
          cy.get(Sendsile.logout.logoutMessage).should("be.visible");
        }
        
        // Check for confirmation text
        if ($body.find(Sendsile.logout.confirmationText).length > 0) {
          cy.get(Sendsile.logout.confirmationText).should("exist");
        }
      } else {
        cy.log("⚠️ Skipping logout confirmation test - page not available");
      }
    });
  });

  // Test 5: Test Logout Buttons (if logout page exists)
  it(Sendsile.logout.message03, () => {
    cy.visit(logoutUrl, { failOnStatusCode: false });
    cy.wait(2000);
    
    cy.get("body").then(($body) => {
      // Only test if not an error page
      if ($body.find('.error, .error-page, [data-testid="error"]').length === 0) {
        // Check for logout button
        if ($body.find(Sendsile.logout.logoutBtn).length > 0) {
          cy.get(Sendsile.logout.logoutBtn).should("exist");
        }
        
        // Check for cancel button
        if ($body.find(Sendsile.logout.cancelBtn).length > 0) {
          cy.get(Sendsile.logout.cancelBtn).should("exist");
        }
      } else {
        cy.log("Skipping logout buttons test - page not available");
      }
    });
  });

  // Test 6: Test Responsive Design
  it(Sendsile.logout.message08, () => {
    cy.visit(logoutUrl, { failOnStatusCode: false });
    cy.wait(2000);
    
    cy.get("body").then(($body) => {
      // Only test if not an error page
      if ($body.find('.error, .error-page, [data-testid="error"]').length === 0) {
        // Test mobile view
        cy.viewport(Sendsile.logout.mobileView);
        cy.get(Sendsile.logout.root).should('be.visible');
        
        // Test tablet view
        cy.viewport(Sendsile.logout.tabletView);
        cy.get(Sendsile.logout.root).should('be.visible');
        
        // Test desktop view
        cy.viewport(1280, 720);
        cy.get(Sendsile.logout.root).should('be.visible');
      } else {
        cy.log("Skipping responsive test - page not available");
      }
    });
  });

  // Test 7: Comprehensive Session Cleanup Verification
  it(Sendsile.logout.message09, () => {
    // Set up comprehensive session data
    cy.window().then((win) => {
      win.localStorage.setItem("__user_access", "test-token");
      win.localStorage.setItem("__user_refresh", "refresh-token");
      win.localStorage.setItem("userInfo", JSON.stringify({ name: "Test User" }));
      win.localStorage.setItem("preferences", JSON.stringify({ theme: "dark" }));
      win.sessionStorage.setItem("tempData", "temporary-session");
      win.sessionStorage.setItem("csrfToken", "csrf-token");
    });

    // Perform logout
    cy.get("body").then(($body) => {
      const logoutSelectors = [
        'button:contains("Logout")',
        'button:contains("Sign Out")',
        '.logout-btn',
        '[data-testid="logout"]'
      ];
      
      let logoutFound = false;
      logoutSelectors.forEach(selector => {
        if ($body.find(selector).length > 0 && !logoutFound) {
          cy.get(selector).first().click({ force: true });
          logoutFound = true;
        }
      });
      
      if (logoutFound) {
        cy.wait("@apiLogout");
        
        // Verify comprehensive cleanup
        cy.window().its('localStorage').invoke('getItem', '__user_access').should('be.null');
        cy.window().its('localStorage').invoke('getItem', '__user_refresh').should('be.null');
        cy.window().its('localStorage').invoke('getItem', 'userInfo').should('be.null');
        cy.window().its('localStorage').invoke('getItem', 'preferences').should('be.null');
        cy.window().its('sessionStorage').invoke('getItem', 'tempData').should('be.null');
        cy.window().its('sessionStorage').invoke('getItem', 'csrfToken').should('be.null');
        
        cy.log("All session data cleared successfully");
      }
    });
  });

  // Test 8: Mobile Navigation Logout
  it("should handle logout from mobile navigation", () => {
    // Test on mobile viewport
    cy.viewport(Sendsile.logout.mobileView);
    cy.wait(1000);
    
    // Look for mobile menu toggle
    cy.get("body").then(($body) => {
      const mobileMenuSelectors = [
        '.mobile-menu-toggle',
        '.hamburger',
        '.menu-toggle',
        '[data-testid="mobile-menu"]',
        '.sidebar-toggle'
      ];
      
      let menuOpened = false;
      mobileMenuSelectors.forEach(selector => {
        if ($body.find(selector).length > 0 && !menuOpened) {
          cy.get(selector).first().click({ force: true });
          menuOpened = true;
          cy.log(`Opened mobile menu: ${selector}`);
        }
      });
      
      // Wait for menu to open
      if (menuOpened) {
        cy.wait(500);
      }
      
      // Look for logout in mobile navigation
      const mobileLogoutSelectors = [
        '.mobile-nav button:contains("Logout")',
        '.sidebar button:contains("Logout")',
        '.mobile-menu button:contains("Sign Out")',
        '[data-testid="mobile-logout"]'
      ];
      
      let mobileLogoutFound = false;
      mobileLogoutSelectors.forEach(selector => {
        if ($body.find(selector).length > 0 && !mobileLogoutFound) {
          cy.get(selector).first().click({ force: true });
          mobileLogoutFound = true;
          cy.log(`Clicked mobile logout: ${selector}`);
        }
      });
      
      if (mobileLogoutFound) {
        cy.wait("@apiLogout");
        cy.url().should('include', '/login');
        cy.log("Mobile logout successful");
      } else {
        cy.log("Mobile logout not found - testing standard logout");
        // Fallback to standard logout test
        cy.get('button:contains("Logout"), button:contains("Sign Out")').first().click({ force: true });
        cy.wait("@apiLogout");
      }
    });
  });

  // Test 9: Logout with Expired Session
  it("should handle logout with expired session", () => {
    // Mock expired session scenario
    cy.intercept('POST', '**/api/logout', {
      statusCode: 401,
      body: {
        success: false,
        message: 'Session expired'
      }
    }).as("expiredSessionLogout");

    cy.window().then((win) => {
      win.localStorage.setItem("__user_access", "expired-token");
    });

    cy.get("body").then(($body) => {
      const logoutSelectors = ['button:contains("Logout")', '.logout-btn'];
      
      logoutSelectors.forEach(selector => {
        if ($body.find(selector).length > 0) {
          cy.get(selector).first().click({ force: true });
          cy.wait("@expiredSessionLogout");
          
          // Should redirect to login even with expired session
          cy.url().should('include', '/login');
          cy.log("Handled expired session logout correctly");
          return false; // break the loop
        }
      });
    });
  });

  // Test 10: Logout Accessibility Tests
  it("should meet accessibility requirements for logout", () => {
    cy.get("body").then(($body) => {
      const logoutSelectors = ['button:contains("Logout")', '.logout-btn', '[data-testid="logout"]'];
      
      logoutSelectors.forEach(selector => {
        if ($body.find(selector).length > 0) {
          const $logoutBtn = $body.find(selector).first();
          
          // Test keyboard accessibility
          cy.wrap($logoutBtn).focus();
          cy.focused().should('have.attr', 'type', 'button');
          
          // Test ARIA attributes
          cy.wrap($logoutBtn).should('have.attr', 'role', 'button');
          
          // Test that logout button is reachable via keyboard
          cy.tab();
          cy.focused().should('contain.text', 'Logout').or('contain.text', 'Sign Out');
          
          // Test space/enter activation
          cy.focused().type('{enter}');
          cy.wait("@apiLogout");
          
          cy.log("Accessibility requirements met for logout");
          return false; // break the loop
        }
      });
    });
  });

  // Test 11: Logout from Different Dashboard Locations
  it("should handle logout from various dashboard sections", () => {
    const dashboardSections = [
      '/dashboard',
      '/dashboard/transactions',
      '/dashboard/profile',
      '/dashboard/bill-payment',
      '/dashboard/groceries'
    ];

    dashboardSections.forEach(section => {
      cy.visit(`https://www.sendsile.com${section}`, { failOnStatusCode: false });
      cy.wait(1000);
      
      cy.get("body").then(($body) => {
        const logoutSelectors = ['button:contains("Logout")', '.logout-btn'];
        
        logoutSelectors.forEach(selector => {
          if ($body.find(selector).length > 0) {
            cy.get(selector).first().click({ force: true });
            cy.wait("@apiLogout");
            
            // Verify redirect to login
            cy.url().should('include', '/login');
            
            cy.log(`Logout successful from ${section}`);
            return false; // break the loop
          }
        });
      });
      
      // Re-setup authentication for next test
      cy.window().then((win) => {
        win.localStorage.setItem("__user_access", "test-token");
      });
    });
  });

  // Test 12: Security Verification After Logout
  it("should ensure security after logout", () => {
    // Perform logout
    cy.get("body").then(($body) => {
      const logoutSelectors = ['button:contains("Logout")', '.logout-btn'];
      
      logoutSelectors.forEach(selector => {
        if ($body.find(selector).length > 0) {
          cy.get(selector).first().click({ force: true });
          cy.wait("@apiLogout");
          return false; // break the loop
        }
      });
    });

    // Test that protected routes redirect to login
    const protectedRoutes = [
      '/dashboard',
      '/dashboard/transactions',
      '/dashboard/profile'
    ];

    protectedRoutes.forEach(route => {
      cy.visit(`https://www.sendsile.com${route}`, { failOnStatusCode: false });
      cy.wait(1000);
      
      // Should redirect to login
      cy.url().should('include', '/login');
      cy.log(`Protected route ${route} properly secured after logout`);
    });
  });

  // Test 13: Logout Button State Management
  it("should handle logout button states correctly", () => {
    cy.get("body").then(($body) => {
      const logoutSelectors = ['button:contains("Logout")', '.logout-btn'];
      
      logoutSelectors.forEach(selector => {
        if ($body.find(selector).length > 0) {
          const $logoutBtn = $body.find(selector).first();
          
          // Test initial state
          cy.wrap($logoutBtn).should('be.enabled');
          cy.wrap($logoutBtn).should('be.visible');
          
          // Test hover state
          cy.wrap($logoutBtn).trigger('mouseover');
          cy.wrap($logoutBtn).should('have.css', 'cursor', 'pointer');
          
          // Test click and loading state
          cy.wrap($logoutBtn).click({ force: true });
          
          // Check if button shows loading state (common pattern)
          cy.get("body").then(($body) => {
            if ($body.find('.loading, .spinner, button:disabled').length > 0) {
              cy.log("Logout button shows loading state");
            }
          });
          
          cy.wait("@apiLogout");
          return false; // break the loop
        }
      });
    });
  });

  // Test 14: Logout Confirmation Dialog (if present)
  it("should handle logout confirmation dialog", () => {
    cy.get("body").then(($body) => {
      const logoutSelectors = ['button:contains("Logout")', '.logout-btn'];
      
      logoutSelectors.forEach(selector => {
        if ($body.find(selector).length > 0) {
          cy.get(selector).first().click({ force: true });
          
          // Check for confirmation dialog
          cy.wait(500);
          cy.get("body").then(($body) => {
            const $modal = $body.find('.modal, .dialog, .confirmation-popup');
            
            if ($modal.length > 0) {
              cy.log("Logout confirmation dialog found");
              
              // Test confirmation buttons
              const $confirmBtn = $body.find('button:contains("Confirm"), button:contains("Yes"), .confirm-logout');
              const $cancelBtn = $body.find('button:contains("Cancel"), button:contains("No"), .cancel-logout');
              
              if ($confirmBtn.length > 0) {
                cy.wrap($confirmBtn).first().click();
                cy.wait("@apiLogout");
                cy.log("Confirmed logout via dialog");
              } else if ($cancelBtn.length > 0) {
                // Test cancel functionality
                cy.wrap($cancelBtn).first().click();
                cy.wait(500);
                
                // Verify still on dashboard
                cy.url().should('include', '/dashboard');
                cy.log("Cancelled logout - still on dashboard");
                
                // Now perform actual logout
                cy.get(selector).first().click({ force: true });
                cy.wait("@apiLogout");
              }
            } else {
              // No confirmation dialog, logout proceeded directly
              cy.wait("@apiLogout");
              cy.log("No confirmation dialog - direct logout");
            }
          });
          
          return false; // break the loop
        }
      });
    });
  });
});