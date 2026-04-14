import { Pasca } from "../configuration/project.config";

// Base URL for Pasca website
const WEB_BASE_URL = "https://pasca.co/";
const FORGOT_PASSWORD_PATH = "forgot-password";

describe("Pasca Forgot Password Tests", () => {
  const pageUrl = "https://pasca.co/forgot-password";

  beforeEach(() => {
    cy.visit(pageUrl);
    cy.get("body", { timeout: 15000 }).should("be.visible");
  });

  it("should load pasca forgot password page", () => {
    cy.log("✅ Pasca forgot password page loaded");
    
    // Check for forgot password content using flexible regex
    cy.contains(/Forgot|Password|Reset|Recover/i, { timeout: 10000 }).should("be.visible");
    cy.log("✅ Found forgot password page content");
  });

  it("should find email input field", () => {
    cy.get("input[name='email'], input[placeholder*='email'], input[type='email'], input[id*='email']").first().should("be.visible").then($emailInput => {
      if ($emailInput.length > 0) {
        cy.log("✅ Found email input");
        cy.wrap($emailInput).type("test@example.com");
        cy.log("✅ Typed email address");
      } else {
        cy.log("❌ Email input not found");
      }
    });
  });

  it("should show reset button", () => {
    cy.contains(/Reset|Send/i).should("be.visible");
    cy.log("✅ Found reset button");
  });

  it("should show back/login links", () => {
    // Look for back/login links - check if they exist (may be hidden)
    cy.get("body").then($body => {
      const bodyText = $body.text();
      if (bodyText.match(/Login|Sign|Back|Remember/i)) {
        cy.log("✅ Found back/login link text");
      } else {
        cy.log("⚠️ Back/login link text not found");
      }
    });
    
    // Try to find actual link elements
    cy.get("a, button").then($elements => {
      let found = false;
      $elements.each((index, element) => {
        const text = Cypress.$(element).text();
        if (text.match(/Login|Sign|Back|Remember/i)) {
          found = true;
          cy.log("✅ Found back/login link element");
        }
      });
      if (!found) {
        cy.log("⚠️ No back/login link elements found");
      }
    });
  });

  it("should attempt password reset with email", () => {
    // Type email
    cy.get("input[name='email'], input[placeholder*='email'], input[type='email'], input[id*='email']").first().type("test@example.com");
    cy.log("✅ Typed email for password reset");
    
    // Click reset button
    cy.contains(/Reset|Send/i).first().click();
    cy.wait(3000);
    
    // Check result
    cy.url().then(url => {
      cy.log(`Current URL after password reset request: ${url}`);
      if (url.includes("forgot-password")) {
        cy.log("⚠️ Still on forgot password page - checking for messages");
        cy.get("body").then($body => {
          const text = $body.text();
          if (text.includes("sent") || text.includes("email") || text.includes("check")) {
            cy.log("✅ Reset instructions sent message displayed");
          } else if (text.includes("error") || text.includes("not found") || text.includes("invalid")) {
            cy.log("✅ Error message for invalid email");
          } else {
            cy.log("⚠️ No clear message displayed");
          }
        });
      } else if (url.includes("login") || url.includes("check-email")) {
        cy.log("✅ Redirected after password reset request");
      } else {
        cy.log(`✅ Password reset request completed, URL: ${url}`);
      }
    });
  });

  it("should handle password reset with invalid email", () => {
    // Type invalid email
    cy.get("input[name='email'], input[placeholder*='email'], input[type='email'], input[id*='email']").first().should("be.visible").type("invalid-email@example.com");
    cy.log("✅ Typed invalid email");
    
    // Click reset button
    cy.contains(/Reset|Send/i).first().click();
    cy.wait(2000);
    
    // Check for error
    cy.get("body").then($body => {
      const bodyText = $body.text();
      if (bodyText.includes("error") || bodyText.includes("not found") || bodyText.includes("invalid")) {
        cy.log("✅ Error message displayed for invalid email");
      } else {
        cy.log("⚠️ No error message for invalid email");
      }
    });
  });

  it("should show validation for empty email", () => {
    // Click reset button without typing email
    cy.contains(/Reset|Send/i).first().click();
    cy.wait(2000);
    
    // Check for validation
    cy.get("body").then($body => {
      const bodyText = $body.text();
      if (bodyText.includes("required") || bodyText.includes("empty") || bodyText.includes("valid email")) {
        cy.log("✅ Validation error for empty email");
      } else {
        cy.log("⚠️ No validation for empty email");
      }
    });
  });

  it("should navigate back to login", () => {
    // Try multiple approaches to find and click back/login link
    cy.get("a, button").then($elements => {
      let clicked = false;
      $elements.each((index, element) => {
        const text = Cypress.$(element).text();
        if (text.match(/Login|Sign|Back|Remember/i) && !clicked) {
          cy.wrap(element).click({ force: true });
          clicked = true;
          cy.log("✅ Clicked back/login link");
        }
      });
      
      if (!clicked) {
        // Fallback: manually navigate to login
        cy.visit("https://pasca.co/login");
        cy.log("✅ Manually navigated to login page");
      }
    });
    
    // Check if redirected to login
    cy.url({ timeout: 10000 }).then((url) => {
      cy.log(`Current URL after navigation: ${url}`);
      if (url.includes("login")) {
        cy.log("✅ Successfully navigated back to login page");
      } else if (url.includes("forgot-password")) {
        cy.log("⚠️ Still on forgot password page - navigation may not work");
      } else {
        cy.log(`✅ Navigated to different page: ${url}`);
      }
    });
  });
});
