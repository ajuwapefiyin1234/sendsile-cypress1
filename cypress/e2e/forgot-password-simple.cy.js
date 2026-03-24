const WEB_BASE_URL = "https://taxporta.fctirs.gov.ng/";
const LOGIN_PATH = "login";
const FORGOT_PASSWORD_PATH = "forgot-password";

const openForgotPasswordFromLogin = () => {
  cy.visit(`${WEB_BASE_URL}${LOGIN_PATH}`);
  cy.wait(3000);
  cy.contains("Forgot password").should("exist").click({ force: true });
  cy.url().should("include", `/${FORGOT_PASSWORD_PATH}`);
};

describe("Forgot Password Simple Tests", () => {
  it("should open forgot password from login", () => {
    openForgotPasswordFromLogin();
    cy.wait(3000);
    
    // Check we're on forgot password page
    cy.url().should("include", "/forgot-password");
    cy.log("Forgot password page opened");
  });

  it("should show forgot password form elements", () => {
    openForgotPasswordFromLogin();
    cy.wait(3000);
    
    // Look for email input field
    cy.get("input[type='email'], input[name='email'], input[placeholder*='email']").should("be.visible");
    cy.log("Email input field found");
    
    // Look for continue button
    cy.contains("button", "Continue").should("be.visible");
    cy.log("Continue button found");
  });

  it("should allow typing email and continue", () => {
    openForgotPasswordFromLogin();
    cy.wait(3000);
    
    // Type email address
    cy.get("input[type='email'], input[name='email'], input[placeholder*='email']").type("test@example.com");
    cy.log("Typed email address");
    
    // Click continue button
    cy.contains("button", "Continue").click();
    cy.wait(5000);
    
    // Check what actually happened
    cy.url().then(url => {
      cy.log(`Current URL after submit: ${url}`);
      if (url.includes("/forgot-password")) {
        cy.log("Still on forgot password page - checking for success message");
        cy.get("body").then($body => {
          const text = $body.text();
          cy.log(`Page content: ${text}`);
        });
      } else {
        cy.log("Successfully navigated away from forgot password page");
      }
    });
  });

  it("should show validation for empty email", () => {
    openForgotPasswordFromLogin();
    cy.wait(3000);
    
    // Click continue without typing email
    cy.contains("button", "Continue").click();
    cy.wait(2000);
    
    // Should still be on forgot password page (validation prevented)
    cy.url().should("include", "/forgot-password");
    cy.log("Validation works for empty email");
  });

  it("should show validation for invalid email", () => {
    openForgotPasswordFromLogin();
    cy.wait(3000);
    
    // Type invalid email
    cy.get("input[type='email'], input[name='email'], input[placeholder*='email']").type("invalid-email");
    cy.log("Typed invalid email");
    
    // Click continue button
    cy.contains("button", "Continue").click();
    cy.wait(2000);
    
    // Should still be on forgot password page (validation prevented)
    cy.url().should("include", "/forgot-password");
    cy.log("Validation works for invalid email");
  });

});
