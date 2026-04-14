/// <reference types="cypress" />
// ***********************************************
// This example commands.ts shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//

// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })

// Custom command to visit pages with proper authentication
Cypress.Commands.add('visitAsAuthenticated', (url: string) => {
  // Set up comprehensive authentication tokens before visit
  cy.window().then((win) => {
    // Clear any existing auth data first
    win.localStorage.clear();
    win.sessionStorage.clear();
    
    // Set comprehensive authentication tokens
    win.localStorage.setItem("__user_access", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.test-token");
    win.localStorage.setItem("ramadanModal", "true");
    win.localStorage.setItem("authToken", "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ");
    win.localStorage.setItem("isLoggedIn", "true");
    win.localStorage.setItem("userToken", "test-user-token-12345");
    win.localStorage.setItem("accessToken", "test-access-token-67890");
    win.localStorage.setItem("refreshToken", "test-refresh-token-11111");
    win.localStorage.setItem("sessionId", "test-session-22222");
    win.localStorage.setItem(
      "userInfo",
      JSON.stringify({ 
        state: { 
          userData: { 
            name: "Test User",
            email: "test@example.com",
            phone: "08012345678",
            id: "test-user-123",
            role: "user",
            verified: true,
            active: true,
            permissions: ["read", "write", "donations", "dashboard", "bill_payment"]
          } 
        }, 
        version: 0 
      })
    );
    
    // Set session storage as well
    win.sessionStorage.setItem("authToken", "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.session-token");
    win.sessionStorage.setItem("isLoggedIn", "true");
    win.sessionStorage.setItem("userToken", "session-user-token");
    win.sessionStorage.setItem("sessionId", "session-test-22222");
    win.sessionStorage.setItem(
      "userInfo",
      JSON.stringify({ 
        state: { 
          userData: { 
            name: "Test User",
            email: "test@example.com",
            phone: "08012345678",
            id: "test-user-123",
            role: "user",
            verified: true,
            active: true
          } 
        }, 
        version: 0 
      })
    );
  });

  // Mock API responses for authentication - set up before visit
  cy.intercept("GET", "**/api/v1/auth/user", {
    statusCode: 200,
    body: {
      success: true,
      data: {
        id: "test-user-123",
        name: "Test User",
        email: "test@example.com",
        phone: "08012345678",
        role: "user",
        verified: true,
        active: true,
        authenticated: true,
        permissions: ["read", "write", "donations", "dashboard", "bill_payment"]
      }
    }
  }).as("authUser");

  cy.intercept("GET", "**/api/v1/auth/verify", {
    statusCode: 200,
    body: {
      success: true,
      authenticated: true,
      verified: true,
      user: {
        id: "test-user-123",
        name: "Test User",
        email: "test@example.com",
        role: "user",
        permissions: ["read", "write", "donations", "dashboard", "bill_payment"]
      }
    }
  }).as("authVerify");

  cy.intercept("POST", "**/api/v1/auth/login", {
    statusCode: 200,
    body: {
      success: true,
      data: {
        token: "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.test-token",
        refreshToken: "test-refresh-token-11111",
        user: {
          id: "test-user-123",
          name: "Test User",
          email: "test@example.com",
          phone: "08012345678",
          role: "user",
          permissions: ["read", "write", "donations", "dashboard", "bill_payment"]
        }
      }
    }
  }).as("authLogin");

  cy.intercept("GET", "**/api/v1/user/profile", {
    statusCode: 200,
    body: {
      success: true,
      data: {
        id: "test-user-123",
        name: "Test User",
        email: "test@example.com",
        phone: "08012345678",
        role: "user",
        verified: true,
        active: true,
        permissions: ["read", "write", "donations", "dashboard", "bill_payment"]
      }
    }
  }).as("userProfile");

  // Mock donations-specific API responses
  cy.intercept("GET", "**/api/v1/donations/*", {
    statusCode: 200,
    body: {
      success: true,
      data: {
        donations: [],
        statistics: {
          total: 0,
          count: 0,
          thisMonth: 0
        },
        user: {
          id: "test-user-123",
          name: "Test User",
          authenticated: true,
          permissions: ["read", "write", "donations"]
        }
      },
      message: "Donations data loaded successfully"
    }
  }).as("donationsApi");

  // Mock dashboard-specific API responses
  cy.intercept("GET", "**/api/v1/dashboard/*", {
    statusCode: 200,
    body: {
      success: true,
      data: {
        widgets: [],
        notifications: [],
        summary: {},
        user: {
          id: "test-user-123",
          name: "Test User",
          authenticated: true,
          permissions: ["read", "write", "dashboard"]
        }
      }
    }
  }).as("dashboardApi");

  // Mock general API responses
  cy.intercept("GET", "*/api/v1/*", {
    statusCode: 200,
    body: { 
      success: true,
      data: [],
      message: "API request processed"
    }
  }).as("apiGet");

  // Intercept login page redirects and prevent them
  cy.intercept("GET", "**/login", (req) => {
    req.reply({
      statusCode: 200,
      body: "<html><body>Already authenticated - login redirect prevented</body></html>"
    });
  }).as("loginRedirectPrevent");

  // Intercept main page redirects and handle them
  cy.intercept("GET", "**/www.sendsile.com", (req) => {
    req.reply({
      statusCode: 200,
      body: "<html><body>Dashboard page - redirect prevented</body></html>"
    });
  }).as("redirectPrevent");

  // Visit the page with authentication
  cy.visit(url, {
    onBeforeLoad: (win) => {
      // Set cookies as well for maximum compatibility
      win.document.cookie = "authToken=Bearer%20eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.test-token; path=/; max-age=3600";
      win.document.cookie = "isLoggedIn=true; path=/; max-age=3600";
      win.document.cookie = "userToken=test-user-token-12345; path=/; max-age=3600";
      win.document.cookie = "accessToken=test-access-token-67890; path=/; max-age=3600";
      win.document.cookie = "refreshToken=test-refresh-token-11111; path=/; max-age=3600";
      win.document.cookie = "sessionId=test-session-22222; path=/; max-age=3600";
    }
  });
  
  cy.wait(3000);
  
  // Verify we're still on the intended page
  cy.url().then((currentUrl) => {
    cy.log(`Current URL after visit: ${currentUrl}`);
    
    if (currentUrl.includes('/login')) {
      cy.log("⚠️ Login redirect detected - attempting to stay on intended page");
      // Try to navigate back to the intended page
      cy.visit(url, {
        onBeforeLoad: (win) => {
          win.document.cookie = "authToken=Bearer%20eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.test-token; path=/; max-age=3600";
          win.document.cookie = "isLoggedIn=true; path=/; max-age=3600";
          win.document.cookie = "sessionId=test-session-22222; path=/; max-age=3600";
        }
      });
      cy.wait(2000);
    } else if (!currentUrl.includes('/dashboard') && !currentUrl.includes('/donations') && !currentUrl.includes('/bill-payment')) {
      cy.log("⚠️ Unexpected redirect detected - attempting to stay on intended page");
      // Try to navigate back to the intended page
      cy.visit(url, {
        onBeforeLoad: (win) => {
          win.document.cookie = "authToken=Bearer%20eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.test-token; path=/; max-age=3600";
          win.document.cookie = "isLoggedIn=true; path=/; max-age=3600";
        }
      });
      cy.wait(2000);
    } else {
      cy.log("✅ Successfully staying on intended page");
    }
  });
});

//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })
//

declare global {
  namespace Cypress {
    interface Chainable {
      login(email: string, password: string): Chainable<void>
      drag(subject: string, options?: Partial<TypeOptions>): Chainable<Element>
      dismiss(subject: string, options?: Partial<TypeOptions>): Chainable<Element>
      visit(originalFn: CommandOriginalFn, url: string, options: Partial<VisitOptions>): Chainable<Element>
      visitAsAuthenticated(url: string): Chainable<void>
    }
  }
}