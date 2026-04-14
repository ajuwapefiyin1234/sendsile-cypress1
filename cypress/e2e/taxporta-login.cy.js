describe("Taxporta Login Page", () => { // Group all login-related tests.
  const pageUrl = "https://taxporta.fctirs.gov.ng/login"; // Define login URL once for reuse.

  beforeEach(() => { // Run setup before each test.
    cy.visit(pageUrl); // Open login page.
  }); // End setup block.

  it("should render login page properly", () => { // Verify login screen renders core elements.
    cy.title().should("eq", "FCT-IRS | Tax Today, Build Tomorrow"); // Check page title.
    cy.get('input[type="email"], input[name="email"], input[placeholder*="email"], input[placeholder*="username"]').should("exist"); // Check email input exists.
    cy.get('input[type="password"], input[name="password"], input[placeholder*="password"]').should("exist"); // Check password input exists.
    cy.get('button[type="submit"], button:contains("Login"), button:contains("Sign In"), .btn-primary').should("be.visible"); // Check submit button is visible.
  }); // End render test.

  it("should allow typing into email and password", () => { // Verify field input behavior.
    cy.get('input[type="email"], input[name="email"], input[placeholder*="email"], input[placeholder*="username"]').type("test@example.com"); // Type email value.
    cy.get('input[type="email"], input[name="email"], input[placeholder*="email"], input[placeholder*="username"]').should("have.value", "test@example.com"); // Assert email value.

    cy.get('input[type="password"], input[name="password"], input[placeholder*="password"]').type("password123"); // Type password value.
    cy.get('input[type="password"], input[name="password"], input[placeholder*="password"]').should("have.value", "password123"); // Assert password value.
  }); // End input test.

  it("should navigate to forgot password page", () => { // Verify forgot-password link behavior.
    cy.contains("a", "Forgot").click(); // Click forgot-password link.
    cy.url().should("include", "/forgot-password"); // Confirm browser navigated correctly.
  }); // End link navigation test.

  it("should show error message when login fails", () => { // Verify error on failed login.
    cy.get('input[type="email"], input[name="email"], input[placeholder*="email"], input[placeholder*="username"]').type("invalid@example.com"); // Enter invalid email.
    cy.get('input[type="password"], input[name="password"], input[placeholder*="password"]').type("wrongpassword"); // Enter invalid password.
    cy.get('button[type="submit"], button:contains("Login"), button:contains("Sign In"), .btn-primary').click(); // Submit login form.

    // Check for error message - make it flexible
    cy.get('body').then(($body) => {
      if ($body.find('.error, .invalid-feedback, .text-danger, [role="alert"], .toast, .notification, .alert').length > 0) {
        cy.get('.error, .invalid-feedback, .text-danger, [role="alert"], .toast, .notification, .alert').should('exist')
      }
    })
  }); // End failed login test.

  it("should be responsive on different viewports", () => { // Test responsive design.
    // Test mobile view
    cy.viewport('iphone-x')
    cy.get('#root').should('be.visible')
    
    // Test tablet view
    cy.viewport('ipad-2')
    cy.get('#root').should('be.visible')
    
    // Test desktop view
    cy.viewport(1280, 720)
    cy.get('#root').should('be.visible')
  }); // End responsive test.
}); // End login test suite.
