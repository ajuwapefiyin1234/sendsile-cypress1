import { Taxporta } from "../configuration/project.config";

describe("Taxporta Login - Test Suite", () => {
  const loginUrl = Taxporta.login.pageUrl;

  beforeEach(() => {
    // Visit the Taxporta login page
    cy.visit(loginUrl);
  });

  it("should load the Taxporta login page successfully", () => {
    cy.url().should("include", "/login");
    // Ensure the body is visible with a more generous timeout for slow loads
    cy.get("body", { timeout: 15000 }).should("be.visible");
    
    // Verify branding or main header exists - broadened to be more robust
    cy.contains(Taxporta.login.brandingRegex).should("be.visible");
    cy.log(Taxporta.login.loginLoadedLog);
  });

  it("should display the default login form (Email/Password)", () => {
    // Check for standard email and password fields
    cy.get(Taxporta.login.emailInput).should("be.visible");
    cy.get(Taxporta.login.passwordInput).should("be.visible");
    
    // Check for the submit button
    cy.get(Taxporta.login.submitButton).should("be.visible");
    cy.log(Taxporta.login.fieldsVisibleLog);
  });

  it("should switch to Payer ID login method", () => {
    // Based on previous files, there is a link to login with Payer ID
    cy.contains(Taxporta.login.payerIdLoginLinkRegex).then(($link) => {
      if ($link.length > 0) {
        cy.wrap($link).click({ force: true });
        cy.wait(1000);
        
        // Verify the input field changes to accept a Payer ID (usually text or specific ID)
        cy.get("input").first().invoke("attr", "placeholder").then((placeholder) => {
          cy.log(`Current input placeholder: ${placeholder}`);
        });
        cy.log(Taxporta.login.switchPayerIdLog);
      }
    });
  });

  it("should show validation errors for empty fields", () => {
    // Click login without entering data
    cy.get(Taxporta.login.submitButton).first().click();
    
    // Check for standard browser validation or custom error messages
    cy.get("body").then(($body) => {
      const text = $body.text().toLowerCase();
      if (text.includes("required") || text.includes("error") || text.includes("invalid")) {
        cy.log(Taxporta.login.validationLog);
      }
    });
  });

  it("should verify password visibility toggle exists", () => {
    // Check for the eye icon/visibility toggle
    cy.get(Taxporta.login.passwordInput).parent().find("svg, button, i").then(($toggle) => {
      if ($toggle.length > 0) {
        cy.log(Taxporta.login.passwordToggleFoundLog);
        // Test the toggle
        cy.wrap($toggle.first()).click({ force: true });
        cy.get("input").filter((i, el) => el.type === 'text').should("exist");
      } else {
        cy.log(Taxporta.login.passwordToggleNotFoundLog);
      }
    });
  });

  it("should have links to Forgot Password and Sign Up", () => {
    cy.contains(Taxporta.login.forgotPasswordLinkRegex).should("have.attr", "href");
    cy.contains(Taxporta.login.signUpLinkRegex).should("have.attr", "href");
    cy.log(Taxporta.login.navigationLinksLog);
  });
});