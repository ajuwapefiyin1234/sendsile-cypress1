// Base URL for your frontend app pages visited by Cypress.
const WEB_BASE_URL = "https://taxporta.fctirs.gov.ng/";
const LOGIN_PATH = "login";
const TEST_EMAIL = "user@example.com";
const TEST_PASSWORD = "Password123";
const ACCOUNT_LOGIN_HEADING = "Account Login";
const PAYER_ID_TEXT = "Login with Payer ID";
const FORGOT_PASSWORD_TEXT = "Forgot password";
const CREATE_ACCOUNT_TEXT = "Create account";

// Helper: find an input by its visible label text.
// 1) Find the <label> that matches the text.
// 2) If the label has a "for" attribute, use it to get the input by id.
// 3) Otherwise, look for an input near the label (same parent).
const getInputByLabel = (labelText) =>
  cy.contains("label", labelText).then(($label) => {
    const forId = $label.attr("for");
    if (forId) {
      return cy.get(`#${forId}`);
    }
    return cy.wrap($label).parent().find("input");
  });

describe("Taxporta Login Tests", () => { // Group login tests.

  it("should load login page", () => { // Verify login page loads.
    cy.visit(`${WEB_BASE_URL}${LOGIN_PATH}`); // Visit login page
    cy.wait(3000); // Wait for SPA to load
    
    // Check for login-related content (using simpler pattern)
    cy.contains(/account login/i).should("exist");
    cy.log("Login page loaded successfully");
  }); // End login page test.

  it("should show login form elements", () => { // Check form elements exist.
    cy.visit(`${WEB_BASE_URL}${LOGIN_PATH}`);
    cy.wait(3000);
    
    // Look for key form elements by visible text
    getInputByLabel(/email address/i).should("exist");
    getInputByLabel(/password/i).should("exist");
    cy.contains("button", /continue/i).should("exist");
    cy.contains("a", /login with payer id/i).should("exist");
    cy.contains("a", /forgot password/i).should("exist");
    cy.contains("a", /create account/i).should("exist");
    cy.log("Login form elements found");
  }); // End form elements test.

  it("should allow typing in login fields", () => { // Test form input functionality.
    cy.visit(`${WEB_BASE_URL}${LOGIN_PATH}`);
    cy.wait(3000);
    
    // Try to type in available input fields (handle opacity issues)
    getInputByLabel(/email address/i).type(TEST_EMAIL, { force: true });
    getInputByLabel(/password/i).type(TEST_PASSWORD, { force: true });
    
    cy.log("Successfully typed in login form fields");
  }); // End form typing test.

  it("should show forgot password link", () => { // Check for forgot password functionality.
    cy.visit(`${WEB_BASE_URL}${LOGIN_PATH}`);
    cy.wait(3000);
    
    // Look for forgot password link (handle visibility issues)
    cy.contains("a", FORGOT_PASSWORD_TEXT).should("exist");
    cy.log("Forgot password link found");
  }); // End forgot password test.

  it("should show login links and header text", () => { // Check core visible text from the UI.
    cy.visit(`${WEB_BASE_URL}${LOGIN_PATH}`);
    cy.wait(3000);

    cy.contains(ACCOUNT_LOGIN_HEADING).should("exist");
    cy.contains("a", PAYER_ID_TEXT).should("exist");
    cy.contains("a", CREATE_ACCOUNT_TEXT).should("exist");
    cy.log("Login page text links found");
  }); // End text links test.
}); // End login suite.
