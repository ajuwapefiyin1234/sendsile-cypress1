describe("Simple Login Test - Debug Credentials", () => {
  const validEmail = "quayyumsavage@gmail.com";
  const validPassword = "Password";

  it("should test basic login functionality", () => {
    // Visit login page
    cy.visit("https://www.sendsile.com/login", { timeout: 60000 });
    cy.log("📍 Visiting login page");
    
    // Check if we're on login page
    cy.url().should("include", "/login");
    cy.log("✅ Confirmed on login page");
    
    // Take screenshot of login page
    cy.screenshot("login-page-before");
    
    // Fill credentials
    cy.get('input[type="email"]').should("be.visible").clear().type(validEmail);
    cy.log("✅ Email entered");
    
    cy.get('input[type="password"]').should("be.visible").clear().type(validPassword);
    cy.log("✅ Password entered");
    
    // Take screenshot after filling form
    cy.screenshot("login-page-filled");
    
    // Find all buttons and log their text
    cy.get('button').then(($buttons) => {
      cy.log(`🔍 Found ${$buttons.length} buttons`);
      $buttons.each((i, btn) => {
        cy.log(`Button ${i}: "${btn.textContent || 'no text'}" - type: ${btn.type || 'no type'}`);
      });
    });
    
    // Click the first button
    cy.get('button').first().click({ force: true });
    cy.log("✅ Clicked first button");
    
    // Wait for login to process
    cy.wait(10000);
    
    // Check current URL
    cy.url().then((url) => {
      cy.log(`🔍 Current URL after login: ${url}`);
      
      if (url.includes('/login')) {
        cy.log("❌ Still on login page - login failed");
        cy.screenshot("login-failed");
      } else {
        cy.log("✅ Login successful - redirected to: ${url}");
        cy.screenshot("login-success");
      }
    });
  });
});
