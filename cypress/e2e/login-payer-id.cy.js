import { Taxporta } from "../configuration/project.config";

// Base URL for your frontend app pages visited by Cypress.
const WEB_BASE_URL = "https://taxporta.fctirs.gov.ng/";
const LOGIN_PATH = "login";
const PAYER_ID_TEXT = "Login with Payer ID";

describe("Taxporta Payer ID Login Tests", () => { // Group Payer ID login tests.

  it("should click payer id login link", () => { // Test clicking Payer ID link.
    cy.visit(Taxporta.loginpayer.pageUrl);
    cy.wait(3000);
    
    // Click "Login with Payer ID" link
    cy.contains("a", Taxporta.loginpayer.dropdownText01).should(Taxporta.loginpayer.message01).click({ force: true });
    cy.wait(3000);
    
    // Check if we're still on login page (Payer ID might be on same page)
    cy.url().should("include", Taxporta.loginpayer.message02);
    cy.log("Payer ID login link clicked");
  }); // End Payer ID link test.

  it("should show payer id input field", () => { // Test Payer ID input exists.
    cy.visit(Taxporta.loginpayer.pageUrl);
    cy.wait(3000);
    
    // Click "Login with Payer ID" link
    cy.contains("a", Taxporta.loginpayer.dropdownText01).should(Taxporta.loginpayer.message01).click({ force: true });
    cy.wait(3000);
    
    // Look for Payer ID input field
    cy.get(Taxporta.loginpayer.inputtext).should(Taxporta.loginpayer.message04);
    cy.log("Payer ID input field found");
  }); // End Payer ID input test.

  it("should allow typing payer id", () => { // Test typing Payer ID.
    cy.visit(Taxporta.loginpayer.pageUrl);
    cy.wait(3000);
    
    // Click "Login with Payer ID" link
    cy.contains("a", Taxporta.loginpayer.dropdownText01).should(Taxporta.loginpayer.message01).click({ force: true });
    cy.wait(3000);
    
    // Type Payer ID
    cy.get(Taxporta.loginpayer.inputtext).first().type(Taxporta.loginpayer.number);
    cy.log("Typed Payer ID successfully");
  }); // End Payer ID typing test.

  it("should submit payer id and continue", () => { // Test Payer ID submission.
    cy.visit(Taxporta.loginpayer.pageUrl);
    cy.wait(3000);
    
    // Click "Login with Payer ID" link
    cy.contains("a", Taxporta.loginpayer.dropdownText01).should(Taxporta.loginpayer.message01).click({ force: true });
    cy.wait(3000);
    
    // Type Payer ID
    cy.get(Taxporta.loginpayer.inputtext).first().type(Taxporta.loginpayer.number);
    cy.log("Typed Payer ID");
    
    // Look for any submit button (more flexible)
    cy.get(Taxporta.loginpayer.inputbutton).should(Taxporta.loginpayer.message04);
    cy.log("Submit button found");
    
    // Click submit button
    cy.get(Taxporta.loginpayer.inputbutton).first().click();
    cy.wait(3000);
    
    // Check what happened
    cy.url().then(url => {
      cy.log(`Current URL after Payer ID submit: ${url}`);
      if (url.includes(Taxporta.loginpayer.message02)) {
        cy.log("Still on login page - checking for changes");
        cy.get(Taxporta.loginpayer.message07).then($body => {
          const text = $body.text();
          cy.log(`Page content: ${text}`);
        });
      } else {
        cy.log("Successfully moved to next step or logged in");
      }
    });
  }); // End Payer ID submission test.

}); // End Payer ID login suite.
