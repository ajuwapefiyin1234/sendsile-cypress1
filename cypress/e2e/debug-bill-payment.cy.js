describe("Debug Bill Payment Page", () => {
  it("should check bill payment page access", () => {
    const pageUrl = "https://www.sendsile.com/dashboard/bill-payment";
    
    // Try to visit the page directly first
    cy.visit(pageUrl, { timeout: 30000, failOnStatusCode: false });
    
    // Check current URL
    cy.url().then((url) => {
      cy.log(`Current URL after visit: ${url}`);
      
      if (url.includes('/login')) {
        cy.log('Redirected to login - need to authenticate');
        
        // Perform login
        cy.visit('https://www.sendsile.com/login', { timeout: 30000 });
        cy.get('input[type="email"]').should('be.visible').clear().type('quayyumsavage@gmail.com');
        cy.get('input[type="password"]').should('be.visible').clear().type('Password');
        cy.get('button').first().click({ force: true });
        
        // Wait for login to complete
        cy.wait(5000);
        
        // Check URL after login
        cy.url().then((loginUrl) => {
          cy.log(`URL after login: ${loginUrl}`);
        });
        
        // Now try to visit bill payment page again
        cy.visit(pageUrl, { timeout: 30000 });
        
        // Final check
        cy.url().then((finalUrl) => {
          cy.log(`Final URL: ${finalUrl}`);
          if (finalUrl.includes('/login')) {
            cy.log('ERROR: Still on login page!');
          } else if (finalUrl.includes('bill-payment')) {
            cy.log('SUCCESS: On bill payment page!');
          } else {
            cy.log(`Unexpected URL: ${finalUrl}`);
          }
        });
      } else if (url.includes('bill-payment')) {
        cy.log('SUCCESS: Directly accessed bill payment page!');
      } else {
        cy.log(`Unexpected URL: ${url}`);
      }
    });
    
    // Take a screenshot to see what's actually displayed
    cy.screenshot('bill-payment-debug');
  });
});
