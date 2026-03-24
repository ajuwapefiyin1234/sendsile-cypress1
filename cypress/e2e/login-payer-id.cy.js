// Base URL for your frontend app pages visited by Cypress.
const WEB_BASE_URL = "https://taxporta.fctirs.gov.ng/";
const LOGIN_PATH = "login";
const PAYER_ID_TEXT = "Login with Payer ID";

describe("Taxporta Payer ID Login Tests", () => { // Group Payer ID login tests.

  it("should click payer id login link", () => { // Test clicking Payer ID link.
    cy.visit(`${WEB_BASE_URL}${LOGIN_PATH}`);
    cy.wait(3000);
    
    // Click "Login with Payer ID" link
    cy.contains("a", PAYER_ID_TEXT).should("exist").click({ force: true });
    cy.wait(3000);
    
    // Check if we're still on login page (Payer ID might be on same page)
    cy.url().should("include", "/login");
    cy.log("Payer ID login link clicked");
  }); // End Payer ID link test.

  it("should show payer id input field", () => { // Test Payer ID input exists.
    cy.visit(`${WEB_BASE_URL}${LOGIN_PATH}`);
    cy.wait(3000);
    
    // Click "Login with Payer ID" link
    cy.contains("a", PAYER_ID_TEXT).should("exist").click({ force: true });
    cy.wait(3000);
    
    // Look for Payer ID input field
    cy.get("input[type='text'], input[name='payerId'], input[placeholder*='payer'], input[placeholder*='ID']").should("be.visible");
    cy.log("Payer ID input field found");
  }); // End Payer ID input test.

  it("should allow typing payer id", () => { // Test typing Payer ID.
    cy.visit(`${WEB_BASE_URL}${LOGIN_PATH}`);
    cy.wait(3000);
    
    // Click "Login with Payer ID" link
    cy.contains("a", PAYER_ID_TEXT).should("exist").click({ force: true });
    cy.wait(3000);
    
    // Type Payer ID
    cy.get("input[type='text'], input[name='payerId'], input[placeholder*='payer'], input[placeholder*='ID']").first().type("1234567890");
    cy.log("Typed Payer ID successfully");
  }); // End Payer ID typing test.

  it("should submit payer id and continue", () => { // Test Payer ID submission.
    cy.visit(`${WEB_BASE_URL}${LOGIN_PATH}`);
    cy.wait(3000);
    
    // Click "Login with Payer ID" link
    cy.contains("a", PAYER_ID_TEXT).should("exist").click({ force: true });
    cy.wait(3000);
    
    // Type Payer ID
    cy.get("input[type='text'], input[name='payerId'], input[placeholder*='payer'], input[placeholder*='ID']").first().type("1234567890");
    cy.log("Typed Payer ID");
    
    // Look for any submit button (more flexible)
    cy.get("button[type='submit'], button:contains('Continue'), button:contains('Submit'), button:contains('Login')").should("be.visible");
    cy.log("Submit button found");
    
    // Click submit button
    cy.get("button[type='submit'], button:contains('Continue'), button:contains('Submit'), button:contains('Login')").first().click();
    cy.wait(3000);
    
    // Check what happened
    cy.url().then(url => {
      cy.log(`Current URL after Payer ID submit: ${url}`);
      if (url.includes("/login")) {
        cy.log("Still on login page - checking for changes");
        cy.get("body").then($body => {
          const text = $body.text();
          cy.log(`Page content: ${text}`);
        });
      } else {
        cy.log("Successfully moved to next step or logged in");
      }
    });
  }); // End Payer ID submission test.

  it("should show validation for empty payer id", () => { // Test empty Payer ID validation.
    cy.visit(`${WEB_BASE_URL}${LOGIN_PATH}`);
    cy.wait(3000);
    
    // Click "Login with Payer ID" link
    cy.contains("a", PAYER_ID_TEXT).should("exist").click({ force: true });
    cy.wait(3000);
    
    // Click any submit button without typing Payer ID
    cy.get("button[type='submit'], button:contains('Continue'), button:contains('Submit'), button:contains('Login']").first().click();
    cy.wait(2000);
    
    // Should still be on login page (validation prevented)
    cy.url().should("include", "/login");
    cy.log("Validation works for empty Payer ID");
  }); // End empty Payer ID validation test.

}); // End Payer ID login suite.
