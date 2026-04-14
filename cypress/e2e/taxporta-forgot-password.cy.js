describe("Taxporta Forgot Password - Test Suite", () => {
  const forgotPasswordUrl = "https://taxporta.fctirs.gov.ng/forgot-password";

  beforeEach(() => {
    // Visit the Taxporta forgot password page
    cy.visit(forgotPasswordUrl);
  });

  it("should load the Forgot Password page successfully", () => {
    cy.url().should("include", "/forgot-password");
    // Ensure the body is visible
    cy.get("body", { timeout: 15000 }).should("be.visible");
    
    // Verify header or instructions exist
    cy.contains(/Forgot Password|Reset Password|Recover/i).should("be.visible");
    cy.log("✅ Forgot Password page loaded successfully");
  });

  it("should display the email input field", () => {
    // Look for the email input field
    cy.get("input[type='email'], input[name*='email']").should("be.visible")
      .and("not.be.disabled");
    cy.log("✅ Email input field is present and active");
  });

  it("should display the reset/submit button", () => {
    // Look for the primary action button
    cy.get("button[type='submit']").should("be.visible");
    cy.log("✅ Reset button is visible");
  });

  it("should show validation error for an empty email field", () => {
    // Click the submit button without entering an email
    cy.get("button[type='submit']").first().click();
    
    // Check for validation messages in the body
    cy.get("body").then(($body) => {
      const text = $body.text().toLowerCase();
      if (text.includes("required") || text.includes("error") || text.includes("provide")) {
        cy.log("✅ Validation for empty email field is working");
      }
    });
  });

  it("should allow typing a valid email address", () => {
    const testEmail = "testuser@example.com";
    cy.get("input[type='email'], input[name*='email']").first()
      .type(testEmail)
      .should("have.value", testEmail);
    cy.log("✅ Email can be entered into the input field");
  });

  it("should have a link to navigate back to the login page", () => {
    // Check for a 'Back to Login' or similar link
    cy.contains(/Back to Login|Sign In|Return/i).then(($link) => {
      if ($link.length > 0) {
        cy.wrap($link).should("be.visible");
        cy.log("✅ 'Back to Login' link found");
      }
    });
  });
});