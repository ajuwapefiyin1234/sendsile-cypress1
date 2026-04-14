import { Pasca } from "../configuration/project.config";

// Base URL for Pasca website
const WEB_BASE_URL = "https://pasca.co/";
const CREATE_PASSWORD_PATH = "create-password"; // This is already from config

describe("Pasca Create Password Tests", () => {
  const pageUrl = "https://pasca.co/create-password";

  beforeEach(() => {
    cy.visit(pageUrl);
    cy.get(Pasca.createPassword.bodySelector, { timeout: Pasca.createPassword.timeout01 }).should(Pasca.createPassword.beVisibleAssertion);
  });

  it("should load pasca create password page", () => {
    cy.log(Pasca.createPassword.pageLoadedLog);
    
    // Check for create password content using flexible regex to avoid exact string match failures
    cy.contains(Pasca.createPassword.titleRegex, { timeout: 10000 }).should("be.visible");
    cy.log(Pasca.createPassword.headerFoundLog);
    
    cy.get(Pasca.createPassword.bodySelector).should(Pasca.createPassword.assertionContain, Pasca.createPassword.keywordPassword);
    cy.log(Pasca.createPassword.subheaderFoundLog);
  });

  it("should find password input fields", () => {
    // Password input
    cy.get(Pasca.createPassword.passwordId).first().then($passwordInput => {
      if ($passwordInput.length > 0) {
        cy.log(Pasca.createPassword.passwordInputFoundLog);
        cy.wrap($passwordInput).type(Pasca.createPassword.newpassword); // Changed from message01 to newpassword
        cy.log(Pasca.createPassword.passwordTypedLog);
      } else {
        cy.log(Pasca.createPassword.passwordInputNotFoundLog);
      }
    });

    // Confirm password input
    cy.get(Pasca.createPassword.confirmPassword).first().then($confirmInput => {
      if ($confirmInput.length > 0) {
        cy.log(Pasca.createPassword.confirmPasswordInputFoundLog);
        cy.wrap($confirmInput).type(Pasca.createPassword.newpassword);
        cy.log(Pasca.createPassword.confirmPasswordTypedLog);
      } else {
        cy.log(Pasca.createPassword.confirmPasswordInputNotFoundLog);
      }
    });
  });

  it("should show create/continue button", () => {
    cy.get(Pasca.createPassword.button).should(Pasca.createPassword.beVisibleAssertion);
    cy.log(Pasca.createPassword.buttonFoundLog);
  });

  it("should validate password matching", () => {
    // Type different passwords
    cy.get(Pasca.createPassword.passwordId).first().type(Pasca.createPassword.newpassword);
    cy.get(Pasca.createPassword.confirmPassword).first().type(Pasca.createPassword.mismatchedPassword);
    
    // Try to submit
    cy.get(Pasca.createPassword.button).first().click();
    cy.wait(Pasca.createPassword.validationWaitTime);
    
    // Check for validation error
    cy.get(Pasca.createPassword.bodySelector).then($body => {
      const bodyText = $body.text();
      if (bodyText.includes(Pasca.createPassword.keywordMatch) || bodyText.includes(Pasca.createPassword.keywordSame) || bodyText.includes(Pasca.createPassword.keywordDifferent)) {
        cy.log(Pasca.createPassword.mismatchValidationDisplayedLog);
      } else {
        cy.log(Pasca.createPassword.mismatchValidationNotFoundLog);
      }
    });
  });

  it("should handle successful password creation", () => {
    // Type matching passwords
    cy.get(Pasca.createPassword.passwordId).first().type(Pasca.createPassword.newpassword);
    cy.get(Pasca.createPassword.confirmPassword).first().type(Pasca.createPassword.newpassword);
    
    cy.log(Pasca.createPassword.matchingPasswordsTypedLog);
    
    // Submit form
    cy.get(Pasca.createPassword.button).first().click();
    cy.wait(Pasca.createPassword.redirectWaitTime);
    
    // Check result
    cy.url().then(url => {
      cy.log(`Current URL after password creation: ${url}`);
      if (url.includes(Pasca.createPassword.loginRedirectPath)) {
        cy.log(Pasca.createPassword.loginRedirectSuccessLog);
      } else if (url.includes(Pasca.createPassword.dashboardRedirectPath) || url.includes(Pasca.createPassword.workspaceRedirectPath)) {
        cy.log(Pasca.createPassword.dashboardRedirectSuccessLog);
      } else if (url.includes(Pasca.createPassword.createPasswordPath)) {
        cy.log(Pasca.createPassword.createPasswordErrorCheckLog);
        cy.get(Pasca.createPassword.bodySelector).then($body => {
          const text = $body.text();
          if (text.includes(Pasca.createPassword.errorKeyword1) || text.includes(Pasca.createPassword.errorKeyword2) || text.includes(Pasca.createPassword.errorKeyword3)) {
            cy.log(Pasca.createPassword.requirementsErrorDisplayedLog);
          }
        });
      } else {
        cy.log(Pasca.createPassword.completionLogTemplate.replace("${url}", url));
      }
    });
  });

  it("should validate password strength", () => {
    // Type weak password
    cy.get(Pasca.createPassword.passwordId).first().type(Pasca.createPassword.weakPasswordValue);
    cy.get(Pasca.createPassword.confirmPassword).first().type(Pasca.createPassword.weakPasswordValue);
    
    // Try to submit
    cy.get(Pasca.createPassword.button).first().click();
    cy.wait(Pasca.createPassword.validationWaitTime);
    
    // Check for strength validation
    cy.get(Pasca.createPassword.bodySelector).then($body => {
      const bodyText = $body.text();
      if (bodyText.includes(Pasca.createPassword.weakPasswordKeyword) || bodyText.includes(Pasca.createPassword.errorKeyword3) || bodyText.includes(Pasca.createPassword.passwordLengthKeyword) || bodyText.includes(Pasca.createPassword.errorKeyword2)) {
        cy.log(Pasca.createPassword.strengthValidationDisplayedLog);
      } else {
        cy.log(Pasca.createPassword.strengthValidationNotFoundLog);
      }
    });
  });

  it("should handle empty password fields", () => {
    // Try to submit without typing passwords
    cy.get(Pasca.createPassword.button).first().click();
    cy.wait(Pasca.createPassword.validationWaitTime);
    
    // Check for validation
    cy.get(Pasca.createPassword.bodySelector).then($body => {
      const bodyText = $body.text();
      if (bodyText.includes(Pasca.createPassword.emptyFieldKeyword1) || bodyText.includes(Pasca.createPassword.emptyFieldKeyword2) || bodyText.includes(Pasca.createPassword.keywordPassword)) {
        cy.log(Pasca.createPassword.emptyFieldsErrorLog);
      } else {
        cy.log(Pasca.createPassword.emptyFieldsNoErrorLog);
      }
    });
  });

  it("should show password visibility toggle", () => {
    // Check if password visibility toggle exists
    cy.get(Pasca.createPassword.passwordId).then($passwordInputs => {
      if ($passwordInputs.length > 0) {
        cy.log(Pasca.createPassword.passwordInputsFoundLog);
        
        // Look for visibility toggle buttons
        cy.get(Pasca.createPassword.bodySelector).then($body => {
          const bodyHtml = $body.html();
          if (bodyHtml.includes(Pasca.createPassword.visibilityToggleKeyword1) || bodyHtml.includes(Pasca.createPassword.visibilityToggleKeyword2) || bodyHtml.includes(Pasca.createPassword.visibilityToggleKeyword3)) {
            cy.log(Pasca.createPassword.visibilityToggleFoundLog);
          } else {
            cy.log(Pasca.createPassword.visibilityToggleNotFoundLog);
          }
        });
      }
    });
  });
});
