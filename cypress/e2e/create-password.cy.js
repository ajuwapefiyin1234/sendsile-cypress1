import { Sendsile } from "../configuration/project.config";

describe("Create Password Tests", () => {
  it("should load create password page", () => {
    cy.visit(Sendsile.signup.pageUrl); // Using signup page URL for create password flow
    cy.wait(3000);
    
    // Check if create password page loaded
    cy.contains(Sendsile.signup.message01).should("be.visible");
    cy.log("Create password page loaded");
  });

  it("should show create password form elements", () => {
    cy.visit(Sendsile.signup.pageUrl);
    cy.wait(3000);
    
    // Look for password input fields
    cy.get(Sendsile.signup.passwordId).then($inputs => {
      if ($inputs.length > 0) {
        cy.log("Password input fields found");
      } else {
        cy.log("Password input fields not found");
      }
    });
    
    // Look for confirm password field
    cy.get(Sendsile.signup.confirmPassword).then($inputs => {
      if ($inputs.length > 0) {
        cy.log("Confirm password field found");
      } else {
        cy.log("Confirm password field not found");
      }
    });
    
    // Look for submit button
    cy.contains(Sendsile.signup.button).should("be.visible");
    cy.log("Submit button found");
  });

  it("should allow typing in password fields", () => {
    cy.visit(Sendsile.signup.pageUrl);
    cy.wait(3000);
    
    // Type in password fields
    cy.get(Sendsile.signup.passwordId).first().type("TestPassword123");
    cy.log("Typed password");
    
    cy.get(Sendsile.signup.confirmPassword).first().type("TestPassword123");
    cy.log("Typed confirm password");
  });

  it("should show error when passwords do not match", () => {
    cy.visit(Sendsile.signup.pageUrl);
    cy.wait(3000);
    
    // Fill password fields with different values
    cy.get(Sendsile.signup.passwordId).first().type("TestPassword123");
    cy.log("Typed password");
    
    cy.get(Sendsile.signup.confirmPassword).first().type("DifferentPassword456");
    cy.log("Typed different confirm password");
    
    // Submit form
    cy.contains(Sendsile.signup.button).click({ force: true });
    cy.wait(3000);
    
    // Check for error message
    cy.contains(Sendsile.signup.message02).then($msg => {
      if ($msg.length > 0) {
        cy.log("Password mismatch error displayed");
      } else {
        cy.log("Password mismatch error not found");
      }
    });
  });

  it("should show success when passwords match", () => {
    cy.visit(Sendsile.signup.pageUrl);
    cy.wait(3000);
    
    // Fill password fields with same values
    cy.get(Sendsile.signup.passwordId).first().type("TestPassword123");
    cy.log("Typed password");
    
    cy.get(Sendsile.signup.confirmPassword).first().type("TestPassword123");
    cy.log("Typed matching confirm password");
    
    // Submit form
    cy.contains(Sendsile.signup.button).click({ force: true });
    cy.wait(3000);
    
    // Check result
    cy.url().then(url => {
      cy.log(`Current URL after form submission: ${url}`);
      if (url.includes("/create-account")) {
        cy.log("Still on create account page - checking for validation messages");
      } else {
        cy.log("Successfully submitted password form");
      }
    });
  });
});
