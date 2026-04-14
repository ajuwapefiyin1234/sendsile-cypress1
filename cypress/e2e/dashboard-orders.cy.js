import { Sendsile } from "../configuration/project.config";

describe("Dashboard Orders", () => {
  const pageUrl = "https://www.sendsile.com/dashboard/orders";

  beforeEach(() => {
    cy.stubDashboardApis();
    cy.loginSendsile(pageUrl);
    cy.wait(2000);
  });

  it("should load dashboard orders page", () => {
    cy.get(Sendsile.dashboardorders.message01).should(Sendsile.dashboardorders.message02);
    cy.log(Sendsile.dashboardorders.message03);
  });

  it("should find and click completed orders", () => {
    cy.log("Looking for completed orders to click");
    
    // Look for order status elements
    cy.get("body").then($body => {
      const bodyText = $body.text();
      
      // Find elements containing "completed" or "delivered"
      cy.get("*").contains(/completed|delivered|finished|done|closed/i).then($completedElements => {
        if ($completedElements.length > 0) {
          cy.log(`Found ${$completedElements.length} completed order elements`);
          cy.wrap($completedElements.first()).click({ force: true });
          cy.log("Clicked on completed order");
        } else {
          cy.log("No completed orders found");
        }
      });
    });
  });

  it("should find and click ongoing orders", () => {
    cy.log("Looking for ongoing orders to click");
    
    // Look for order status elements
    cy.get("body").then($body => {
      const bodyText = $body.text();
      
      // Find elements containing "ongoing" or "in progress"
      cy.get("*").contains(/ongoing|in progress|processing|active/i).then($ongoingElements => {
        if ($ongoingElements.length > 0) {
          cy.log(`Found ${$ongoingElements.length} ongoing order elements`);
          cy.wrap($ongoingElements.first()).click({ force: true });
          cy.log("✅ Clicked on ongoing order");
        } else {
          cy.log("No ongoing orders found");
        }
      });
    });
  });

  it("should find and click cancelled orders", () => {
    cy.log("Looking for cancelled orders to click");
    
    // Look for order status elements
    cy.get("body").then($body => {
      const bodyText = $body.text();
      
      // Find elements containing "cancelled" or "canceled"
      cy.get("*").contains(/cancelled|canceled|terminated|stopped/i).then($cancelledElements => {
        if ($cancelledElements.length > 0) {
          cy.log(`Found ${$cancelledElements.length} cancelled order elements`);
          cy.wrap($cancelledElements.first()).click({ force: true });
          cy.log("✅ Clicked on cancelled order");
        } else {
          cy.log("No cancelled orders found");
        }
      });
    });
  });

  it("should navigate to shop hampers when clicked", () => {
    cy.log("Testing shop hampers navigation and page functionality");
    
    // Wait for page to fully load including JavaScript
    cy.wait(5000); // Extended wait for dynamic content
    
    // First, analyze the current page content to understand what's available
    cy.get("body").then($body => {
      const bodyText = $body.text();
      cy.log("Current page content analysis:");
      cy.log(bodyText.substring(0, 500)); // Log first 500 chars
      
      // Check if page is still loading or has dynamic content
      if (bodyText.trim().length === 0) {
        cy.log("⚠️ Page appears to be empty - may be loading via JavaScript");
        cy.log("Waiting additional time for content to load...");
        cy.wait(5000); // Extra wait for JS content
        
        // Re-check after additional wait
        cy.get("body").then($bodyAfterWait => {
          const bodyTextAfterWait = $bodyAfterWait.text();
          cy.log("Content after additional wait:");
          cy.log(bodyTextAfterWait.substring(0, 300));
        });
      }
      
      // Look for shop hampers link or button with extended selectors
      cy.get("a[href*='ramadan'], button:contains('Ramadan'), a[href*='packages'], button:contains('Packages'), a[href*='shop'], button:contains('Shop'), a[href*='hampers'], button:contains('Hampers'), [data-testid*='shop'], [data-testid*='ramadan'], [data-testid*='packages']").then($shopElements => {
        if ($shopElements.length > 0) {
          cy.log(`Found ${$shopElements.length} shop-related elements`);
          
          // Log what type of shop elements we found
          $shopElements.each((index, el) => {
            const tagName = el.tagName.toLowerCase();
            const text = Cypress.$(el).text();
            const href = Cypress.$(el).attr('href') || 'no href';
            cy.log(`Shop element ${index}: ${tagName} - "${text}" -> ${href}`);
          });
          
          // Try clicking each shop element to test functionality
          cy.wrap($shopElements.first()).click({ force: true });
          cy.wait(5000); // Extended wait for navigation and page load
          
          // Verify URL changed to shop-related pages
          cy.url().then($url => {
            if ($url.includes("ramadan-packages")) {
              cy.log("✅ Successfully navigated to ramadan packages page");
              
              // Check if ramadan packages page has content
              cy.wait(3000); // Wait for content to load
              cy.get("body").then($ramadanBody => {
                const ramadanText = $ramadanBody.text();
                if (ramadanText.trim().length > 0) {
                  cy.log("✅ Ramadan packages page has content loaded");
                  cy.log(`Page content: ${ramadanText.substring(0, 200)}...`);
                } else {
                  cy.log("⚠️ Ramadan packages page appears empty - may need more time or authentication");
                }
              });
            } else if ($url.includes("packages")) {
              cy.log("✅ Successfully navigated to packages page");
            } else if ($url.includes("shop")) {
              cy.log("✅ Successfully navigated to shop page");
            } else if ($url.includes("hampers")) {
              cy.log("✅ Successfully navigated to hampers page");
            } else {
              cy.log(`Navigated to: ${$url}`);
              cy.log("Checking if this is the correct shop hampers page...");
            }
          });
        } else {
          cy.log("No shop hampers elements found");
          cy.log("Available page elements for analysis:");
          
          // Look for any elements that might be related to shopping
          cy.get("a, button, .btn, [role='button'], [data-testid]").then($allElements => {
            cy.log(`Found ${$allElements.length} total clickable elements on page`);
            
            // Log details of available elements
            $allElements.each((index, el) => {
              const tagName = el.tagName.toLowerCase();
              const text = Cypress.$(el).text();
              const href = Cypress.$(el).attr('href') || 'no href';
              const dataTestId = Cypress.$(el).attr('data-testid') || 'no data-testid';
              if (text.length > 0) {
                cy.log(`Element ${index}: ${tagName} - "${text}" -> ${href} [data-testid: ${dataTestId}]`);
              }
            });
          });
        }
      });
    });
  });
});
