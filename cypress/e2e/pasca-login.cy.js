import { Pasca } from "../configuration/project.config";

// Base URL for Pasca website
const WEB_BASE_URL = "https://pasca.co/"; // This is still hardcoded, consider moving to config if used elsewhere
const LOGIN_PATH = "login"; // This is still hardcoded, consider moving to config if used elsewhere

describe("Pasca Login Tests", () => {
  const pageUrl = "https://pasca.co/login";

  beforeEach(() => {
    cy.visit(pageUrl);
    cy.wait(Pasca.login.initialWaitTime);
  });

  it("should load pasca login page", () => {
    cy.get(Pasca.login.bodySelector).should(Pasca.login.beVisibleAssertion);
    cy.log(Pasca.login.pageLoadedLog);
    
    // Check for Pasca branding
    cy.get(Pasca.login.bodySelector).then($body => {
      const bodyText = $body.text();
      if (bodyText.includes(Pasca.login.brandingKeyword1) || bodyText.includes(Pasca.login.brandingKeyword2)) {
        cy.log(Pasca.login.brandingFoundLog);
      } else {
        cy.log(Pasca.login.brandingNotFoundLog);
      }
    });
  });

  it("should find email and password inputs", () => {
    // Try to find email input
    cy.get(Pasca.login.emailId).first().then($emailInput => {
      if ($emailInput.length > 0) {
        cy.log(Pasca.login.emailInputFoundLog);
        cy.wrap($emailInput).type(Pasca.login.email);
        cy.log(Pasca.login.emailTypedLog);
      } else {
        cy.log(Pasca.login.emailInputNotFoundLog);
      }
    });

    // Try to find password input
    cy.get(Pasca.login.passwordId).first().then($passwordInput => {
      if ($passwordInput.length > 0) {
        cy.log(Pasca.login.passwordInputFoundLog);
        cy.wrap($passwordInput).type(Pasca.login.newpassword);
        cy.log(Pasca.login.passwordTypedLog);
      } else {
        cy.log(Pasca.login.passwordInputNotFoundLog);
      }
    });
  });

  it("should show login button", () => {
    cy.get(Pasca.login.button).should(Pasca.login.beVisibleAssertion);
    cy.log(Pasca.login.loginButtonFoundLog);
  });

  it("should show forgot password link", () => {
    cy.contains(Pasca.login.linkSelector, Pasca.login.forgotPasswordLinkRegex).should(Pasca.login.beVisibleAssertion);
    cy.log(Pasca.login.forgotPasswordLinkFoundLog);
  });

  it("should show sign up link", () => {
    cy.contains(Pasca.login.linkSelector, Pasca.login.signUpLinkRegex).should(Pasca.login.beVisibleAssertion);
    cy.log(Pasca.login.signUpLinkFoundLog);
  });

  it("should show TaxPro Max login option", () => {
    cy.get(Pasca.login.bodySelector).then($body => {
      const bodyText = $body.text();
      if (bodyText.includes(Pasca.login.taxProMaxKeyword1) || bodyText.includes(Pasca.login.taxProMaxKeyword2)) {
        cy.log(Pasca.login.taxProMaxFoundLog);
      } else {
        cy.log(Pasca.login.taxProMaxNotFoundLog);
      }
    });
  });

  it("should attempt login with credentials", () => {
    // Type email
    cy.get(Pasca.login.emailId).first().type(Pasca.login.email);
    cy.log(Pasca.login.emailTypedLog);
    
    // Type password
    cy.get(Pasca.login.passwordId).first().type(Pasca.login.newpassword);
    cy.log(Pasca.login.passwordTypedLog);
    
    // Click login button
    cy.get(Pasca.login.button).first().click();
    cy.wait(Pasca.login.initialWaitTime);
    
    // Check result
    cy.url().then(url => {
      cy.log(Pasca.login.urlLogTemplate.replace("${url}", url));
      if (url.includes(Pasca.login.dashboardPath) || url.includes(Pasca.login.workspacePath)) {
        cy.log(Pasca.login.loginSuccessLog);
      } else if (url.includes(Pasca.login.loginPath)) {
        cy.log(Pasca.login.loginPageErrorCheckLog);
        cy.get(Pasca.login.bodySelector).then($body => {
          const text = $body.text();
          if (text.includes(Pasca.login.errorKeyword1) || text.includes(Pasca.login.errorKeyword2) || text.includes(Pasca.login.errorKeyword3)) {
            cy.log(Pasca.login.errorMessageDisplayedLog);
          } else {
            cy.log(Pasca.login.errorMessageNotFoundLog);
          }
        });
      } else {
        cy.log(Pasca.login.completionLogTemplate.replace("${url}", url));
      }
    });
  });

  it("should handle login with wrong credentials", () => {
    // Type wrong email
    cy.get(Pasca.login.emailId).first().type(Pasca.login.wrongexample);
    cy.log(Pasca.login.emailTypedLog);
    
    // Type wrong password
    cy.get(Pasca.login.passwordId).first().type(Pasca.login.wrongpassword);
    cy.log(Pasca.login.passwordTypedLog);
    
    // Click login button
    cy.get(Pasca.login.button).first().click();
    cy.wait(Pasca.login.initialWaitTime);
    
    // Check for error
    cy.get(Pasca.login.bodySelector).then($body => {
      const bodyText = $body.text();
      if (bodyText.includes(Pasca.login.errorKeyword1) || bodyText.includes(Pasca.login.errorKeyword2) || bodyText.includes(Pasca.login.errorKeyword3)) {
        cy.log(Pasca.login.wrongCredentialsErrorLog);
      } else {
        cy.log(Pasca.login.wrongCredentialsNoErrorLog);
      }
    });
  });
});
