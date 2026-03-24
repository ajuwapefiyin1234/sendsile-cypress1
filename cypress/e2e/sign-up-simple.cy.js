const WEB_BASE_URL = "https://taxporta.fctirs.gov.ng/";
const LOGIN_PATH = "login";
const CREATE_ACCOUNT_PATH = "create-account";

const openCreateAccountFromLogin = () => {
  cy.visit(`${WEB_BASE_URL}${LOGIN_PATH}`);
  cy.wait(3000);
  cy.contains("Create account").should("exist").click({ force: true });
  cy.url().should("include", `/${CREATE_ACCOUNT_PATH}`);
};

describe("Sign Up Page", () => {
  it("should open create account from login", () => {
    openCreateAccountFromLogin();
    cy.contains("Account Registration").should("exist");
    cy.log("Create account page opened from login");
  });

  it("should show taxpayer type dropdown and continue button", () => {
    openCreateAccountFromLogin();

    cy.contains("Taxpayer Type").should("exist");
    cy.get("select, [role='combobox']").should("have.length.at.least", 1);
    cy.contains("button", "Continue").should("exist");
    cy.log("Taxpayer type dropdown and continue button found");
  });

  it("should select individual taxpayer type and continue", () => {
    openCreateAccountFromLogin();
    
    // Step 1: Select Individual from dropdown (use first select)
    cy.get("select, [role='combobox']").first().select("Individual");
    cy.log("Selected Individual taxpayer type");
    
    // Click continue button
    cy.contains("button", "Continue").click();
    cy.wait(3000);
    
    // Step 2: Select National Identity Number (second dropdown if it appears)
    cy.get("select, [role='combobox']").then($selects => {
      if ($selects.length > 1) {
        // If there's a second dropdown, select from it
        cy.get("select, [role='combobox']").eq(1).select("National Identity Number");
        cy.log("Selected National Identity Number");
        
        // Click continue again
        cy.contains("button", "Continue").click();
        cy.wait(3000);
      }
    });
    
    // Check if we moved to next step (URL changed)
    cy.url().should("not.include", "/create-account");
    cy.log("Continued through all steps");
  });

  it("should select corporate taxpayer type and continue", () => {
    openCreateAccountFromLogin();
    
    // Step 1: Select Corporate from dropdown (use first select)
    cy.get("select, [role='combobox']").first().select("Corporate");
    cy.log("Selected Corporate taxpayer type");
    
    // Click continue button
    cy.contains("button", "Continue").click();
    cy.wait(3000);
    
    // Step 2: Select National Identity Number (second dropdown if it appears)
    cy.get("select, [role='combobox']").then($selects => {
      if ($selects.length > 1) {
        // If there's a second dropdown, select from it
        cy.get("select, [role='combobox']").eq(1).select("National Identity Number");
        cy.log("Selected National Identity Number");
        
        // Click continue again
        cy.contains("button", "Continue").click();
        cy.wait(3000);
      }
    });
    
    // Check if we moved to next step (URL changed)
    cy.url().should("not.include", "/create-account");
    cy.log("Continued through all steps");
  });

  it("should show validation when no taxpayer type selected", () => {
    openCreateAccountFromLogin();
    
    // Click continue without selecting anything
    cy.contains("button", "Continue").click();
    cy.wait(2000);
    
    // Should still be on same page (validation prevented)
    cy.url().should("include", "/create-account");
    cy.log("Validation works for no selection");
  });

});
