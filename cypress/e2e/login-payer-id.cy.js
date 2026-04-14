import { Taxporta } from "../configuration/project.config";

// Base URL for your frontend app pages visited by Cypress.
const WEB_BASE_URL = "https://taxporta.fctirs.gov.ng/";
const LOGIN_PATH = "login";
const PAYER_ID_TEXT = "Login with Payer ID";

describe("Taxporta Payer ID Login Tests", () => { // Group Payer ID login tests.

  it("should click payer id login link", () => { // Test clicking Payer ID link.
    cy.visit(Taxporta.loginPayerId.pageUrl);
    cy.wait(3000);
    
    // Click "Login with Payer ID" link
    cy.contains("a", Taxporta.loginPayerId.payerIdLinkRegex).should("be.visible").click({ force: true });
    cy.wait(3000);
    
    // Check if we're still on login page (Payer ID might be on same page)
    cy.url().should("include", "/login");
    cy.log(Taxporta.loginPayerId.linkClickedLog);
  }); // End Payer ID link test.

  it("should show payer id input field", () => { // Test Payer ID input exists.
    cy.visit(Taxporta.loginPayerId.pageUrl);
    cy.wait(3000);
    
    // Click "Login with Payer ID" link
    cy.contains("a", Taxporta.loginPayerId.payerIdLinkRegex).should("be.visible").click({ force: true });
    cy.wait(3000);
    
    // Look for Payer ID input field
    cy.get(Taxporta.loginPayerId.payerIdInput).should("be.visible");
    cy.log(Taxporta.loginPayerId.inputFoundLog);
  }); // End Payer ID input test.

  it("should allow typing payer id", () => { // Test typing Payer ID.
    cy.visit(Taxporta.loginPayerId.pageUrl);
    cy.wait(3000);
    
    // Click "Login with Payer ID" link
    cy.contains("a", Taxporta.loginPayerId.payerIdLinkRegex).should("be.visible").click({ force: true });
    cy.wait(3000);
    
    // Type Payer ID
    cy.get(Taxporta.loginPayerId.payerIdInput).first().type(Taxporta.loginPayerId.testPayerId);
    cy.log(Taxporta.loginPayerId.typedLog);
  }); // End Payer ID typing test.

  it("should submit payer id and continue", () => { // Test Payer ID submission.
    cy.visit(Taxporta.loginPayerId.pageUrl);
    cy.wait(3000);
    
    // Click "Login with Payer ID" link
    cy.contains("a", Taxporta.loginPayerId.payerIdLinkRegex).should("be.visible").click({ force: true });
    cy.wait(3000);
    
    // Type Payer ID
    cy.get(Taxporta.loginPayerId.payerIdInput).first().type(Taxporta.loginPayerId.testPayerId);
    cy.log("Typed Payer ID");
    
    // Look for any submit button (more flexible)
    cy.get(Taxporta.loginPayerId.submitButton).should("be.visible");
    cy.log(Taxporta.loginPayerId.buttonFoundLog);
    
    // Click submit button
    cy.get(Taxporta.loginPayerId.submitButton).first().click();
    cy.wait(3000);
    
    // Check what happened
    cy.url().then(url => {
      cy.log(`Current URL after Payer ID submit: ${url}`);
      if (url.includes("/login")) {
        cy.log(Taxporta.loginPayerId.loginPageCheckLog);
        cy.get("body").then($body => {
          const text = $body.text();
          cy.log(`Page content: ${text}`);
        });
      } else {
        cy.log(Taxporta.loginPayerId.successLog);
      }
    });
  }); // End Payer ID submission test.

}); // End Payer ID login suite.
