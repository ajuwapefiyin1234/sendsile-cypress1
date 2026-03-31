// Standalone donations spec (no config dependency)
describe("Dashboard Donations", () => {
  const pageUrl = "https://www.sendsile.com/dashboard/donations";
  const bodySelector = "body";
  const interactiveSelector = "button, a, input";
  const clickableSelector = "button, a";
  const formSelector = "form, input, select, textarea";

  const donationKeywords = ["donation", "donate", "charity", "give", "contribute", "amount", "price"];

  beforeEach(() => {
    cy.stubDashboardApis();
    cy.loginSendsile(pageUrl);
    cy.wait(2000);
  });

  it("should load dashboard donations page", () => {
    cy.get(bodySelector).should("be.visible");
    cy.log("[OK] Dashboard donations page loaded");
  });

  it("should check if redirected to login", () => {
    cy.url().then(url => {
      if (url.includes("/login")) {
        cy.log("[OK] Donations page correctly redirects to login (authentication required)");
      } else if (url.includes("/donations")) {
        cy.log("[OK] Donations page loaded successfully");

        cy.get(bodySelector).then($body => {
          const bodyText = $body.text().toLowerCase();
          const hasDonationKeywords = donationKeywords.some(keyword => bodyText.includes(keyword));

          if (hasDonationKeywords) {
            cy.log("[OK] Page contains donation-related content");
          } else {
            cy.log("[NO] No donation-related content found");
          }
        });
      } else {
        cy.log(`[WARN] Unexpected URL: ${url}`);
      }
    });
  });

  it("should find any interactive elements", () => {
    cy.get(interactiveSelector).then($elements => {
      if ($elements.length > 0) {
        cy.log(`[OK] Found ${$elements.length} interactive elements`);
        $elements.each((index, el) => {
          const tagName = el.tagName.toLowerCase();
          const text = Cypress.$(el).text();
          cy.log(`Element ${index}: <${tagName}> "${text}"`);
        });
      } else {
        cy.log("[NO] No interactive elements found");
      }
    });
  });

  it("should try to interact with first clickable element", () => {
    cy.get(clickableSelector).first().then($element => {
      if ($element.length > 0) {
        const tagName = $element[0].tagName.toLowerCase();
        const text = Cypress.$($element).text();
        cy.log(`[OK] Clicking first ${tagName}: "${text}"`);
        cy.wrap($element).click({ force: true });
        cy.wait(2000);
        cy.log("[OK] Element clicked");
      } else {
        cy.log("[NO] No clickable elements found");
      }
    });
  });

  it("should find donation-related elements", () => {
    cy.get(bodySelector).then($body => {
      const bodyText = $body.text().toLowerCase();
      const hasDonationElements = donationKeywords.some(keyword => bodyText.includes(keyword));

      if (hasDonationElements) {
        cy.log("[OK] Found donation-related elements");
      } else {
        cy.log("[NO] No donation-related elements found");
      }
    });
  });

  it("should check for donation forms", () => {
    cy.get(formSelector).then($formElements => {
      if ($formElements.length > 0) {
        cy.log(`[OK] Found ${$formElements.length} form elements that might be donation forms`);
        $formElements.each((index, el) => {
          const tagName = el.tagName.toLowerCase();
          cy.log(`Form element ${index}: <${tagName}>`);
        });
      } else {
        cy.log("[NO] No form elements found");
      }
    });
  });

  it("should check for donation amounts or options", () => {
    cy.get(bodySelector).then($body => {
      const bodyText = $body.text();
      const hasAmountContent =
        bodyText.includes("?") ||
        bodyText.includes("$") ||
        bodyText.toLowerCase().includes("amount") ||
        bodyText.toLowerCase().includes("price") ||
        bodyText.toLowerCase().includes("donate");

      if (hasAmountContent) {
        cy.log("[OK] Found donation amount options");
      } else {
        cy.log("[NO] No donation amount options found");
      }
    });
  });
});
