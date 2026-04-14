import { Sendsile } from "../configuration/project.config";

describe("Dashboard Donations - Test Suite", () => {
  const donationsUrl = "https://www.sendsile.com/dashboard/donations";

  beforeEach(() => {
    cy.stubDashboardApis();
    cy.visit(donationsUrl, { failOnStatusCode: false });
    cy.wait(2000);
  });

  it("should load dashboard donations page", () => {
    cy.get("body").should("be.visible");
    cy.log("✅ Dashboard donations page loaded successfully");
  });

  it("should check if redirected to login", () => {
    cy.url().then(url => {
      if (url.includes("login")) {
        cy.log("✅ Redirected to login as expected");
      } else if (url.includes("donations")) {
        cy.log("✅ Successfully on donations page");
        
        // Try to find donation-related content
        cy.get("body").then($body => {
          const bodyText = $body.text();
          cy.log("Available page content:", bodyText.substring(0, 200));
          
          // Check for donation-related keywords
          const hasDonationKeywords = bodyText.toLowerCase().includes("donation") || 
                                 bodyText.toLowerCase().includes("charity") || 
                                 bodyText.toLowerCase().includes("give") ||
                                 bodyText.toLowerCase().includes("contribute") ||
                                 bodyText.toLowerCase().includes("support");
          
          if (hasDonationKeywords) {
            cy.log("✅ Found donation-related content");
          } else {
            cy.log("⚠️ No donation-related content found");
          }
        });
      } else {
        cy.log(`⚠️ Unexpected URL: ${url}`);
      }
    });
  });

  it("should find any interactive elements", () => {
    cy.get("button, a, .btn, [role='button']").then($elements => {
      if ($elements.length > 0) {
        cy.log(`✅ Found ${$elements.length} interactive elements`);
        
        // Log details of found elements
        $elements.each((index, el) => {
          const tagName = el.tagName.toLowerCase();
          const text = Cypress.$(el).text().substring(0, 50);
          const href = Cypress.$(el).attr('href') || 'no href';
          cy.log(`Element ${index}: ${tagName} - "${text}" -> ${href}`);
        });
      } else {
        cy.log("⚠️ No interactive elements found");
      }
    });
  });

  it("should try to interact with first clickable element", () => {
    cy.get("button, a, .btn, [role='button']").first().then($element => {
      if ($element.length > 0) {
        const tagName = $element[0].tagName.toLowerCase();
        const text = Cypress.$($element).text().substring(0, 50);
        cy.log(`✅ Testing first element: ${tagName} - "${text}"`);
        
        cy.wrap($element).click({ force: true });
        cy.wait(2000);
        cy.log("✅ Successfully clicked first interactive element");
      } else {
        cy.log("⚠️ No clickable elements found");
      }
    });
  });

  it("should find and test donation-related buttons", () => {
    cy.log("Looking for donation-related buttons and links");
    
    // Look for donation-specific elements
    cy.get("button:contains('Donate'), button:contains('Give'), button:contains('Support'), button:contains('Contribute'), a:contains('Donate'), a:contains('Give'), a:contains('Support'), a:contains('Contribute')").then($donationElements => {
      if ($donationElements.length > 0) {
        cy.log(`✅ Found ${$donationElements.length} donation-related elements`);
        
        // Test each donation element
        $donationElements.each((index, el) => {
          const tagName = el.tagName.toLowerCase();
          const text = Cypress.$(el).text();
          cy.log(`Donation element ${index}: ${tagName} - "${text}"`);
          
          // Click each donation element
          cy.wrap(el).click({ force: true });
          cy.wait(2000);
          cy.log(`✅ Clicked donation element ${index}`);
          
          // Go back to donations page for next test
          cy.visit(donationsUrl);
          cy.wait(1000);
        });
      } else {
        cy.log("⚠️ No donation-specific buttons or links found");
      }
    });
  });

  it("should test scrolling functionality", () => {
    cy.log("Testing scrolling functionality on donations page");
    
    // Test scrolling to different positions
    const scrollPositions = ['top', 'center', 'bottom'];
    
    scrollPositions.forEach((position) => {
      cy.log(`Scrolling to ${position} position`);
      cy.scrollTo(position);
      cy.wait(1000);
      
      // Check what's visible after scrolling
      cy.get("body").then($body => {
        const bodyText = $body.text();
        cy.log(`Content visible at ${position}:`, bodyText.substring(0, 100));
        
        // Check for any elements that become visible after scrolling
        cy.get("button, a, .btn, [role='button']").then($elements => {
          if ($elements.length > 0) {
            cy.log(`✅ Found ${$elements.length} interactive elements at ${position}`);
          } else {
            cy.log(`⚠️ No interactive elements visible at ${position}`);
          }
        });
      });
    });
    
    // Scroll back to top
    cy.log("Scrolling back to top position");
    cy.scrollTo('top');
    cy.wait(1000);
    cy.log("✅ Scrolling functionality test completed");
  });

  it("should test responsive design", () => {
    cy.log("Testing responsive design on donations page");
    
    // Test mobile view
    cy.viewport('iphone-x');
    cy.get("body").should("be.visible");
    cy.log("✅ Page loads correctly on mobile view");
    
    // Test tablet view
    cy.viewport('ipad-2');
    cy.get("body").should("be.visible");
    cy.log("✅ Page loads correctly on tablet view");
    
    // Test desktop view
    cy.viewport(1440, 900);
    cy.get("body").should("be.visible");
    cy.log("✅ Page loads correctly on desktop view");
  });

  it("should analyze page content and structure", () => {
    cy.log("Analyzing donations page content and structure");
    
    cy.get("body").then($body => {
      const bodyText = $body.text();
      const bodyHtml = $body.html();
      
      cy.log("Page title:", Cypress.$(document).find('title').text());
      cy.log("Page content preview:", bodyText.substring(0, 300));
      
      // Check for common donation page elements
      const hasDonationForm = bodyText.toLowerCase().includes("donate") || 
                              bodyText.toLowerCase().includes("give") || 
                              bodyText.toLowerCase().includes("contribute");
      
      const hasAmountSelection = bodyText.toLowerCase().includes("$") || 
                               bodyText.toLowerCase().includes("₦") || 
                               bodyText.toLowerCase().includes("amount");
      
      const hasPaymentOptions = bodyText.toLowerCase().includes("card") || 
                               bodyText.toLowerCase().includes("bank") || 
                               bodyText.toLowerCase().includes("payment");
      
      cy.log(`Donation form found: ${hasDonationForm}`);
      cy.log(`Amount selection found: ${hasAmountSelection}`);
      cy.log(`Payment options found: ${hasPaymentOptions}`);
      
      // Look for specific elements
      cy.get("h1, h2, h3, .title, .heading").then($headings => {
        cy.log(`Found ${$headings.length} headings`);
        $headings.each((index, el) => {
          cy.log(`Heading ${index}: ${Cypress.$(el).text()}`);
        });
      });
      
      cy.get("form, .form, .donation-form").then($forms => {
        cy.log(`Found ${$forms.length} forms`);
      });
      
      cy.get("input").then($inputs => {
        cy.log(`Found ${$inputs.length} input fields`);
      });
      
      cy.get("button").then($buttons => {
        cy.log(`Found ${$buttons.length} buttons`);
      });
    });
  });
});
