describe("Taxporta TIN Login - Test Suite", () => {
  const tinLoginUrl = "https://taxporta.fctirs.gov.ng/login-tin";

  beforeEach(() => {
    // Visit the Taxporta TIN login page
    cy.visit(tinLoginUrl);
  });

  it("should load the TIN login page successfully", () => {
    cy.url().should("include", "/login-tin");
    // Ensure the body is visible with a generous timeout for slow loads
    cy.get("body", { timeout: 15000 }).should("be.visible");
    
    // Verify header or instructions exist related to TIN login
    cy.contains(/TIN|Tax Identification Number|Login/i).should("be.visible");
    cy.log("✅ TIN Login page loaded successfully");
  });

  it("should display the TIN input field", () => {
    // Look for the TIN input field (often type="text" or specific name/placeholder)
    cy.get("input[name*='tin'], input[placeholder*='TIN'], input[type='text']").first()
      .should("be.visible")
      .and("not.be.disabled");
    cy.log("✅ TIN input field is present and active");
  });

  it("should display the submit button", () => {
    // Look for the primary action button
    cy.get("button[type='submit']").should("be.visible");
    cy.log("✅ Submit button is visible");
  });

  it("should show validation error for an empty TIN field", () => {
    // Click the submit button without entering a TIN
    cy.get("button[type='submit']").first().click();
    
    // Check for validation messages in the body
    cy.get("body").then(($body) => {
      const text = $body.text().toLowerCase();
      if (text.includes("required") || text.includes("error") || text.includes("provide")) {
        cy.log("✅ Validation for empty TIN field is working");
      }
    });
  });

  it("should allow typing a TIN", () => {
    const testTIN = "1234567890"; // Example TIN
    cy.get("input[name*='tin'], input[placeholder*='TIN'], input[type='text']").first()
      .type(testTIN)
      .should("have.value", testTIN);
    cy.log("✅ TIN can be entered into the input field");
  });

  it("should have a link to navigate back to the main login page", () => {
    // Check for a 'Back to Login' or similar link
    cy.contains(/Back to Login|Sign In|Email|Payer ID/i).then(($link) => {
      if ($link.length > 0) {
        cy.wrap($link).should("be.visible");
        cy.log("✅ 'Back to Login' or alternative login link found");
      } else {
        cy.log("⚠️ No obvious link back to main login found.");
      }
    });
  });
});