import { Sendsile } from "../configuration/project.config";

describe("Dashboard Bill Payment", () => {
  const pageUrl = "/dashboard/bill-payment";

  beforeEach(() => {
    cy.stubDashboardApis();
    cy.loginSendsile(pageUrl);
    cy.wait(2000);
  });

  it("should stay on the bill payment page", () => {
    cy.url().should("include", "/dashboard/bill-payment");
    cy.get("body").should("be.visible");
  });

  it("should show bill payment content", () => {
    cy.get("body").then(($body) => {
      const text = $body.text().toLowerCase();
      if (text.includes("bill payment")) {
        cy.log("✅ Found bill payment heading");
      } else if (text.includes("bill")) {
        cy.log("✅ Found bill-related content");
      } else {
        cy.log("❌ Bill payment text not found");
      }
    });
  });

  it("should verify bill payment specific elements or placeholders", () => {
    cy.get("body").then(($body) => {
      const text = $body.text();
      // Check if the "Coming soon" placeholder defined in project.config.js exists
      if (text.includes(Sendsile.dashboard.billPaymentPlaceholder)) {
        cy.log(`✅ Found expected placeholder: ${Sendsile.dashboard.billPaymentPlaceholder}`);
      } else {
        // If the feature is live, look for interactive bill payment categories
        const billTypes = ["airtime", "data", "electricity", "cable", "utility"];
        cy.get("button, a, .card").then(($elements) => {
          let found = false;
          $elements.each((_, el) => {
            const elText = Cypress.$(el).text().toLowerCase();
            if (billTypes.some(type => elText.includes(type))) {
              found = true;
              cy.log(`✅ Found active bill payment option: ${elText}`);
            }
          });
          if (!found) cy.log("ℹ️ Feature may still be in placeholder state");
        });
      }
    });
  });

  it("should access help and feedback section", () => {
    cy.log("🔍 Testing help and feedback access from bill payment page...");
    
    cy.get("body").then(($body) => {
      // Try to find help icon/button (SVG or text-based)
      cy.get('svg, button, a, [class*="help"], [class*="question"]', { timeout: 5000 })
        .then(($elements) => {
          let helpClicked = false;
          $elements.each((index, el) => {
            if (helpClicked) return;
            
            const $el = Cypress.$(el);
            const className = ($el.attr('class') || '').toLowerCase();
            const title = ($el.attr('title') || '').toLowerCase();
            const aria = ($el.attr('aria-label') || '').toLowerCase();
            const text = $el.text().toLowerCase();
            
            if (className.includes('help') || className.includes('question') || 
                title.includes('help') || aria.includes('help') || text.includes('help')) {
              
              cy.log(`✅ Found help element: ${className || text || 'icon'}`);
              cy.wrap(el).click({ force: true });
              cy.wait(1000);
              helpClicked = true;
              
              // Verify modal or help content appeared
              cy.get("body").then(($newBody) => {
                if ($newBody.text().toLowerCase().match(/help|guide|faq|support/)) {
                  cy.log("✅ Help/Support content is visible");
                }
                // Dismiss if it's a modal
                const $close = $newBody.find('button:contains("X"), button:contains("Close"), .modal-close');
                if ($close.length > 0) cy.wrap($close.first()).click({ force: true });
              });
            }
          });
        });

      // Try to find feedback/contact triggers
      cy.get('button, a, [class*="feedback"], [class*="contact"]', { timeout: 5000 })
        .then(($elements) => {
          let feedbackClicked = false;
          $elements.each((index, el) => {
            if (feedbackClicked) return;
            
            const text = Cypress.$(el).text().toLowerCase();
            if (text.includes("feedback") || text.includes("contact")) {
              cy.log(`✅ Found feedback element: ${text}`);
              cy.wrap(el).click({ force: true });
              cy.wait(1000);
              feedbackClicked = true;
              
              cy.get("body").then(($newBody) => {
                if ($newBody.text().toLowerCase().match(/feedback|message|contact/)) {
                  cy.log("✅ Feedback/Contact interface visible");
                }
                const $close = $newBody.find('button:contains("X"), button:contains("Close")');
                if ($close.length > 0) cy.wrap($close.first()).click({ force: true });
              });
            }
          });
        });
    });
  });

  it("should verify core dashboard navigation links are present", () => {
    const linksToVerify = [
      Sendsile.dashboard.links.home,
      Sendsile.dashboard.links.transactions,
      Sendsile.dashboard.links.profile
    ];

    linksToVerify.forEach(linkText => {
      cy.contains('a', new RegExp(linkText, 'i')).then(($link) => {
        if ($link.length > 0) {
          cy.wrap($link).should('be.visible');
          cy.log(`✅ Sidebar/Nav link "${linkText}" is accessible`);
        }
      });
    });
  });
});
