const WEB_BASE_URL = "https://taxporta.fctirs.gov.ng/";
const LOGIN_PATH = "login";
const CREATE_ACCOUNT_PATH = "create-account";

const openCreateAccountFromLogin = () => {
  cy.visit(`${WEB_BASE_URL}${LOGIN_PATH}`);
  cy.wait(3000);
  cy.contains("Create account").should("exist").click({ force: true });
  cy.url().should("include", `/${CREATE_ACCOUNT_PATH}`);
};

describe("Individual Sign Up Flow", () => {
  it("should complete individual sign up flow", () => {
    openCreateAccountFromLogin();
    cy.wait(3000);
    
    // Step 1: Select Individual taxpayer type
    cy.get("select, [role='combobox']").first().select("Individual");
    cy.log("Selected Individual taxpayer type");
    
    cy.contains("button", "Continue").click();
    cy.wait(3000);
    
    // Step 2: Select National Identity Number
    cy.get("select, [role='combobox']").then($selects => {
      if ($selects.length > 1) {
        cy.get("select, [role='combobox']").eq(1).select("National Identity Number");
        cy.log("Selected National Identity Number");
        
        cy.contains("button", "Continue").click();
        cy.wait(3000);
      }
    });
    
    // Step 3: Fill personal information
    cy.get("input[type='text'], input[type='email'], input[type='tel']").then($inputs => {
      if ($inputs.length >= 4) {
        cy.get("input[type='text']").eq(0).type("John");
        cy.log("Typed first name");
        
        cy.get("input[type='text']").eq(1).type("Doe");
        cy.log("Typed last name");
        
        cy.get("input[type='email']").type("john.doe@example.com");
        cy.log("Typed email");
        
        cy.get("input[type='tel']").type("08012345678");
        cy.log("Typed phone number");
      }
    });
    
    cy.contains("button", "Continue").click();
    cy.wait(3000);
    
    // Step 4: Create password
    cy.get("input[type='password']").then($passwords => {
      if ($passwords.length >= 2) {
        cy.get("input[type='password']").eq(0).type("Password123!");
        cy.log("Typed password");
        
        cy.get("input[type='password']").eq(1).type("Password123!");
        cy.log("Typed confirm password");
      }
    });
    
    // Create account
    cy.contains("button", "Create").click();
    cy.wait(3000);
    
    // Verify completion
    cy.url().should("not.include", "/create-account");
    cy.log("Individual sign up completed successfully");
  });

  it("should show validation when no individual type selected", () => {
    openCreateAccountFromLogin();
    cy.wait(3000);
    
    // Click continue without selecting Individual
    cy.contains("button", "Continue").click();
    cy.wait(2000);
    
    // Should still be on create account page
    cy.url().should("include", "/create-account");
    cy.log("Validation works for no selection");
  });

  it("should show validation when passwords don't match", () => {
    openCreateAccountFromLogin();
    cy.wait(3000);
    
    // Quick navigation to password step
    cy.get("select, [role='combobox']").first().select("Individual");
    cy.contains("button", "Continue").click();
    cy.wait(3000);
    
    cy.get("select, [role='combobox']").then($selects => {
      if ($selects.length > 1) {
        cy.get("select, [role='combobox']").eq(1).select("National Identity Number");
        cy.contains("button", "Continue").click();
        cy.wait(3000);
      }
    });
    
    // Fill personal details
    cy.get("input[type='text']").eq(0).type("John");
    cy.get("input[type='text']").eq(1).type("Doe");
    cy.get("input[type='email']").type("john.doe@example.com");
    cy.get("input[type='tel']").type("08012345678");
    cy.contains("button", "Continue").click();
    cy.wait(3000);
    
    // Fill mismatching passwords
    cy.get("input[type='password']").eq(0).type("Password123!");
    cy.get("input[type='password']").eq(1).type("DifferentPassword!");
    cy.log("Typed mismatching passwords");
    
    // Try to create account
    cy.contains("button", "Create").click();
    cy.wait(2000);
    
    // Should still be on create account page
    cy.url().should("include", "/create-account");
    cy.log("Password validation works for mismatching passwords");
  });

  it("should show validation for empty password fields", () => {
    openCreateAccountFromLogin();
    cy.wait(3000);
    
    // Quick navigation to password step
    cy.get("select, [role='combobox']").first().select("Individual");
    cy.contains("button", "Continue").click();
    cy.wait(3000);
    
    cy.get("select, [role='combobox']").then($selects => {
      if ($selects.length > 1) {
        cy.get("select, [role='combobox']").eq(1).select("National Identity Number");
        cy.contains("button", "Continue").click();
        cy.wait(3000);
      }
    });
    
    // Fill personal details
    cy.get("input[type='text']").eq(0).type("John");
    cy.get("input[type='text']").eq(1).type("Doe");
    cy.get("input[type='email']").type("john.doe@example.com");
    cy.get("input[type='tel']").type("08012345678");
    cy.contains("button", "Continue").click();
    cy.wait(3000);
    
    // Try to create account without passwords
    cy.contains("button", "Create").click();
    cy.wait(2000);
    
    // Should still be on create account page
    cy.url().should("include", "/create-account");
    cy.log("Password validation works for empty passwords");
  });

});
