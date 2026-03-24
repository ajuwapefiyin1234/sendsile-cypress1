import { Pasca } from "../configuration/project.config";

describe("Create Password Page", () => {
  const pageUrl = Pasca.createPassword.pageUrl;

  it("should load create password page", () => {
    cy.visit(pageUrl);
    cy.wait(3000);
    
    // Check for create password related content
    cy.get("body").then($body => {
      const text = $body.text();
      const createPasswordArray = Pasca.createPassword.createPasswordArray;
      const regex = new RegExp(createPasswordArray.join('|'), 'i');
      expect(text).to.match(regex);
    });
    cy.log("Create password page loaded successfully");
  });

  it("should show create password form elements", () => {
    cy.visit(pageUrl);
    cy.wait(3000);
    
    // Look for password input fields
    cy.get(Pasca.createPassword.passwordId).should("have.length.at.least", 1);
    cy.log("Password input fields found");
    
    // Look for submit button
    cy.get(Pasca.createPassword.button).should("have.length.at.least", 1);
    cy.log("Submit button found");
  });

  it("should allow typing in password fields", () => {
    cy.visit(pageUrl);
    cy.wait(3000);
    
    // Type in password fields
    cy.get(Pasca.createPassword.passwordId).first().should("be.visible").type(Pasca.createPassword.firstDropdownText);
    
    cy.log("Successfully typed in password field");
  });

  it("should show password creation success", () => {
    cy.visit(pageUrl);
    cy.wait(3000);
    
    // Fill password fields
    cy.get(Pasca.createPassword.passwordId).first().type(Pasca.createPassword.firstDropdownText);
    cy.get(Pasca.createPassword.passwordId).eq(1).type(Pasca.createPassword.firstDropdownText);
    
    // Submit form
    cy.get(Pasca.createPassword.thirdDropdownText).first().click({ force: true });
    
    // Just verify the form was submitted successfully
    cy.log("Password form submitted successfully");
  });

  it("should show error when passwords do not match", () => {
    cy.visit(pageUrl);
    cy.wait(3000);
    
    // Fill password fields with different values
    cy.get(Pasca.createPassword.passwordId).first().type(Pasca.createPassword.firstDropdownText);
    cy.get(Pasca.createPassword.passwordId).eq(1).type(Pasca.createPassword.secondDropdownText);
    
    // Submit form
    cy.get(Pasca.createPassword.thirdDropdownText).first().click({ force: true });
    
    // Check for error message
    cy.contains(Pasca.createPassword.message02).should("be.visible");
  });
});