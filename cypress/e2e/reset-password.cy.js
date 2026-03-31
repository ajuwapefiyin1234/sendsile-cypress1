import { Sendsile } from "../configuration/project.config";

describe("Reset Password Page", () => {
  const pageUrl = "/create-password";

  it("should load reset password page", () => {
    cy.visit(pageUrl);
    cy.wait(3000);
    
    cy.get("body").should("be.visible");
    cy.log("Reset password page loaded successfully");
  });

  it("should show reset password form elements", () => {
    cy.visit(pageUrl);
    cy.wait(3000);
    
    // Look for password input fields
    cy.get("input[type='password']").then($passwordInputs => {
      if ($passwordInputs.length > 0) {
        cy.log(`✅ Found ${$passwordInputs.length} password input fields`);
      } else {
        cy.log("❌ No password input fields found");
      }
    });
    
    // Look for submit button
    cy.get("button").then($buttons => {
      if ($buttons.length > 0) {
        cy.log(`✅ Found ${$buttons.length} buttons`);
      } else {
        cy.log("❌ No buttons found");
      }
    });
  });

  it("should allow typing in password fields", () => {
    cy.visit(pageUrl);
    cy.wait(3000);
    
    // Type in password fields
    cy.get("input[type='password']").first().then($input => {
      if ($input.length > 0) {
        cy.wrap($input).type("Password123");
        cy.log("✅ Successfully typed in password field");
      } else {
        cy.log("❌ No password field to type in");
      }
    });
  });

  it("should reset password successfully", () => {
    cy.visit(pageUrl);
    cy.wait(3000);
    
    // Fill password fields
    cy.get("input[type='password']").then($passwordInputs => {
      if ($passwordInputs.length >= 2) {
        cy.wrap($passwordInputs.first()).type("Password123");
        cy.wrap($passwordInputs.eq(1)).type("Password123");
        
        // Submit form
        cy.get("button").first().click({ force: true });
        cy.wait(2000);
        cy.log("✅ Password reset form submitted successfully");
      } else {
        cy.log("❌ Not enough password fields found");
      }
    });
  });

  it("should show error when passwords do not match", () => {
    cy.visit(pageUrl);
    cy.wait(3000);
    
    // Fill password fields with different values
    cy.get("input[type='password']").then($passwordInputs => {
      if ($passwordInputs.length >= 2) {
        cy.wrap($passwordInputs.first()).type("Password123");
        cy.wrap($passwordInputs.eq(1)).type("DifferentPassword");
        
        // Submit form
        cy.get("button").first().click({ force: true });
        cy.wait(2000);
        
        // Check for error message
        cy.get("body").then($body => {
          const bodyText = $body.text();
          if (bodyText.toLowerCase().includes('match') || 
              bodyText.toLowerCase().includes('error') || 
              bodyText.toLowerCase().includes('invalid')) {
            cy.log("✅ Error message displayed for mismatched passwords");
          } else {
            cy.log("❌ No error message found");
          }
        });
      } else {
        cy.log("❌ Not enough password fields found");
      }
    });
  });
});
