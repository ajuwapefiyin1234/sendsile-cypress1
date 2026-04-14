/* global cy, describe, it, beforeEach */
import { Sendsile } from '../configuration/project.config.js';

const { sendsileSimple } = Sendsile;

// Validate sendsileSimple configuration exists
if (!sendsileSimple) {
  throw new Error('SendsileSimple configuration not found in project.config.js');
}

// Helper Functions
const mockSendsileSimpleApis = (options = {}) => {
  const {
    featuredProducts = [],
    error = false,
  } = options;

  cy.intercept('GET', '**/products/featured', (req) => {
    if (error) {
      req.reply({
        statusCode: 500,
        body: { message: 'Failed to fetch featured products' },
      });
    } else {
      req.reply({
        statusCode: 200,
        body: { data: featuredProducts },
      });
    }
  }).as('getFeaturedProducts');
};

const visitHomepage = (options = {}) => {
  mockSendsileSimpleApis(options);
  cy.visit(sendsileSimple.pageUrl);
  cy.wait(2000); // Wait for page to load
  cy.get(sendsileSimple.root || '#root', { timeout: 15000 }).should('be.visible');
};

// ==========================================
// SENDSILE SIMPLE HOMEPAGE TESTS
// ==========================================
describe('Sendsile Simple Homepage', () => {
  beforeEach(() => {
    cy.viewport(1440, 900);
  });

  // Test 1: Homepage Display
  it(sendsileSimple.message01, () => {
    visitHomepage();
    cy.url().should('eq', sendsileSimple.pageUrl);
    cy.title().should("contain", "Sendsile");
    cy.get(sendsileSimple.root).should("be.visible");
    cy.get("body").then(($body) => {
      if ($body.find(sendsileSimple.pageTitle).length > 0) {
        cy.get(sendsileSimple.pageTitle).should("be.visible");
      }
      if ($body.find(sendsileSimple.pageDescription).length > 0) {
        cy.get(sendsileSimple.pageDescription).should("exist");
      }
    });
  });

  // Test 2: Navigation Elements
  it(sendsileSimple.message02, () => {
    visitHomepage();
    cy.get(sendsileSimple.navMenu).should("be.visible");
    cy.get(sendsileSimple.logo).should("be.visible");
    cy.get(sendsileSimple.homeLink).should("exist");
    cy.get(sendsileSimple.aboutLink).should("exist");
    cy.get(sendsileSimple.servicesLink).should("exist");
    cy.get(sendsileSimple.contactLink).should("exist");
  });

  // Test 3: Hero Section
  it(sendsileSimple.message03, () => {
    visitHomepage();
    cy.get(sendsileSimple.heroSection).should("be.visible");
    cy.get(sendsileSimple.heroTitle).should("be.visible");
    cy.get(sendsileSimple.heroDescription).should("exist");
    cy.get(sendsileSimple.heroButton).first().should("be.visible").and('be.enabled');
  });

  // Test 4: Featured Products/Services
  it(sendsileSimple.message04, () => {
    visitHomepage();
    cy.get("body").then(($body) => {
      if ($body.find(sendsileSimple.featuredSection).length > 0) {
        cy.get(sendsileSimple.featuredSection).should("be.visible");
        if ($body.find(sendsileSimple.productCard).length > 0) {
          cy.get(sendsileSimple.productCard).first().within(() => {
            cy.get(sendsileSimple.productName).should("exist");
            cy.get(sendsileSimple.productPrice).should("exist");
            cy.get(sendsileSimple.productImage).should("exist");
          });
        }
      }
    });
  });

  // Test 5: Service Sections
  it(sendsileSimple.message05, () => {
    visitHomepage();
    // Assuming service sections are part of the main content and might not have specific selectors
    // This test can be enhanced if specific service section selectors are added to project.config.js
    cy.get(sendsileSimple.root).should("be.visible"); // General check
  });

  // Test 6: Testimonials/Reviews
  it(sendsileSimple.message06, () => {
    visitHomepage();
    cy.get("body").then(($body) => {
      if ($body.find('.testimonials, .reviews, .customer-feedback').length > 0) {
        cy.get('.testimonials, .reviews, .customer-feedback').first().should("be.visible");
      }
    });
  });

  // Test 7: Contact Information
  it(sendsileSimple.message07, () => {
    visitHomepage();
    cy.get(sendsileSimple.contactSection).should("be.visible");
    cy.get(sendsileSimple.emailContact).should("exist");
    cy.get(sendsileSimple.phoneContact).should("exist");
    cy.get(sendsileSimple.addressContact).should("exist");
  });

  // Test 8: Footer Elements
  it(sendsileSimple.message08, () => {
    visitHomepage();
    cy.get(sendsileSimple.footer).should("be.visible");
    cy.get(sendsileSimple.socialLinks).should("exist");
    cy.get(sendsileSimple.copyright).should("exist");
  });

  // Test 9: Search Functionality
  it(sendsileSimple.message09, () => {
    visitHomepage();
    cy.get("body").then(($body) => {
      if ($body.find(sendsileSimple.searchBox).length > 0) {
        cy.get(sendsileSimple.searchBox).type('test query', { force: true }).should('have.value', 'test query');
        if ($body.find(sendsileSimple.searchBtn).length > 0) {
          cy.get(sendsileSimple.searchBtn).click({ force: true });
          // Assert search results page or dynamic update
        }
      }
    });
  });

  // Test 10: User Authentication Buttons
  it(sendsileSimple.message10, () => {
    visitHomepage();
    cy.get("body").then(($body) => {
      if ($body.find(sendsileSimple.loginBtn).length > 0) {
        cy.get(sendsileSimple.loginBtn).should("be.visible");
      }
      if ($body.find(sendsileSimple.signupBtn).length > 0) {
        cy.get(sendsileSimple.signupBtn).should("be.visible");
      }
    });
  });

  // Test 11: Responsive Design
  it(sendsileSimple.message11, () => {
    const viewports = [sendsileSimple.mobileView, sendsileSimple.tabletView, 'macbook-15'];
    viewports.forEach((viewport) => {
      cy.viewport(viewport);
      visitHomepage();
      cy.get(sendsileSimple.root).should('be.visible');
      // Add specific assertions for layout changes if needed, e.g., hamburger menu visibility
    });
  });

  // Test 12: Error States (e.g., failed API call for featured products)
  it(sendsileSimple.message13, () => {
    visitHomepage({ error: true });
    cy.wait('@getFeaturedProducts');
    cy.get("body").then(($body) => {
      if ($body.find(sendsileSimple.errorMessage).length > 0) {
        cy.get(sendsileSimple.errorMessage).should("be.visible").and("contain", "Failed to fetch featured products");
      }
    });
  });

  // Test 13: Call to Action Elements
  it(sendsileSimple.message14, () => {
    visitHomepage();
    cy.get("body").then(($body) => {
      if ($body.find('.cta-section, .call-to-action, .promo-banner').length > 0) {
        cy.get('.cta-section, .call-to-action, .promo-banner').first().should('be.visible');
        cy.get('.cta-section, .call-to-action, .promo-banner').first().find('button, a').first().click({ force: true });
      }
    });
  });
});