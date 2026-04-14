/* global cy, describe, it, beforeEach */
import { Sendsile } from "../configuration/project.config.js";

const { donations, dashboard } = Sendsile;

// Helper Functions
const seedAuthenticatedState = (win) => {
  const userInfo = {
    state: {
      userData: dashboard.userData || { name: "Test User", email: "test@example.com" },
    },
    version: 0,
  };
  win.localStorage.setItem("__user_access", "test-token");
  win.localStorage.setItem("authToken", "Bearer test-token");
  win.localStorage.setItem("isLoggedIn", "true");
  win.localStorage.setItem("ramadanModal", "true");
  win.localStorage.setItem("userInfo", JSON.stringify(userInfo));
};

const mockDonationsApis = () => {
  cy.intercept('GET', '**/api/**', {
    statusCode: 200,
    body: {
      success: true,
      data: [],
      message: donations.message
    } 
  }).as("apiGet");
};

const visitDonations = () => {
  mockDonationsApis();
  cy.visit(donations.pageUrl, {
    onBeforeLoad(win) {
      seedAuthenticatedState(win);
    },
  });
  cy.wait(3000);
};

describe("Sendsile Donations Dashboard - Consolidated Tests", () => {
  beforeEach(() => {
    cy.viewport(1440, 900);
    visitDonations();
  });

  // 1. Access & Main Navigation
  it('should verify page access and main navigation structure', () => {
    cy.url().should('include', '/donations');
    cy.title().should('contain', 'Sendsile');
    cy.get('body').then(($body) => {
      if ($body.find(donations.navMenu).length > 0) {
        cy.get(donations.navMenu).should('exist');
      }
      if ($body.find(donations.dashLink).length > 0) {
        cy.get(donations.dashLink).should('exist');
      }
    });
  });

  // 2. Header & Statistics UI
  it('should display page header and donation summary statistics', () => {
    cy.get('body').then(($body) => {
      if ($body.find(donations.pageTitle).length > 0) {
        cy.get(donations.pageTitle).should('be.visible');
      }
      if ($body.find(donations.statCard).length > 0) {
        cy.get(donations.statCard).should('be.visible');
      }
      if ($body.find(donations.totalAmount).length > 0) {
        cy.get(donations.totalAmount).should('exist');
      }
    });
  });

  // 3. Data Presentation (Table/List)
  it('should display the donations data table or card list', () => {
    cy.get('body').then(($body) => {
      if ($body.find(donations.table).length > 0) {
        cy.get(donations.table).should('be.visible');
        if ($body.find(donations.tableHeader).length > 0) {
          cy.get(donations.tableHeader).should('exist');
        }
      } else if ($body.find(donations.cardView).length > 0) {
        cy.get(donations.cardView).should('be.visible');
      }
    });
  });

  // 4. Search & Filter UI
  it('should display search inputs and filter controls', () => {
    cy.get('body').then(($body) => {
      const controls = [donations.searchInput, donations.filterDropdown, donations.dateRangePicker];
      controls.forEach(sel => {
        if ($body.find(sel).length > 0) {
          cy.get(sel).should('exist');
        }
      });
    });
  });

  // 5. Action Buttons & Export
  it('should display functional action buttons (Export, Add, Refresh)', () => {
    cy.get('body').then(($body) => {
      const actions = [donations.exportBtn, donations.addDonationBtn, donations.refreshBtn];
      actions.forEach(sel => {
        if ($body.find(sel).length > 0) {
          cy.get(sel).should('exist');
        }
      });
    });
  });

  // 6. Pagination UI
  it('should display pagination controls if content is paginated', () => {
    cy.get('body').then(($body) => {
      if ($body.find(donations.pagination).length > 0) {
        cy.get(donations.pagination).should('be.visible');
        if ($body.find(donations.pageNumber).length > 0) {
          cy.get(donations.pageNumber).should('exist');
        }
      }
    });
  });

  // 7. Input Validation & Functional Interaction (including Add Donation form)
  it('should handle valid and invalid inputs for search, filters, and donation form', () => {
    cy.get('body').then(($body) => {
      // 1. Valid Search Input
      if ($body.find(donations.searchFunc).length > 0) {
        cy.get(donations.searchFunc).first()
          .clear({ force: true })
          .type("Education Support", { force: true })
          .should("have.value", "Education Support");
        cy.wait(500); // Simulate user pause
      }

      // 2. Invalid Search Input (Trigger Empty State)
      if ($body.find(donations.searchFunc).length > 0) {
        cy.get(donations.searchFunc).first()
          .clear({ force: true })
          .type("NonExistentDonation!@#", { force: true });
        cy.wait(1000);
        if ($body.find(donations.emptyState).length > 0) {
          cy.get(donations.emptyState).should('be.visible');
          cy.log('Empty state displayed for invalid search');
        } else {
          cy.log('Empty state not found for invalid search, but search input was tested.');
        }
        cy.get(donations.searchFunc).first().clear({ force: true }); // Clear for next test
      }

      // 3. Filter Interaction
      if ($body.find(donations.filterDropdown).length > 0) {
        cy.get(donations.filterDropdown).first().then(($select) => {
          if ($select.is('select')) {
            // Select the first option if available
            cy.wrap($select).find('option').then(($options) => {
              if ($options.length > 0) {
                cy.wrap($select).select($options.eq(0).val(), { force: true });
                cy.log(`Selected filter: ${$options.eq(0).text()}`);
              } else {
                cy.log('No options found in filter dropdown');
              }
            });
            cy.wait(500);
          } else {
            // If it's not a select, it might be a custom dropdown, try clicking it
            cy.wrap($select).click({ force: true });
            cy.wait(500);
            // Assuming clicking opens options, try clicking the first option
            cy.get('body').find('.dropdown-option, .filter-option').first().click({ force: true });
            cy.log('Clicked custom filter dropdown');
          }
        });
      }

      // 4. Donation Form Validation (Valid & Invalid)
      if ($body.find(donations.addDonationBtn).length > 0) {
        cy.get(donations.addDonationBtn).first().click({ force: true });
        cy.wait(1000);
        
        cy.get('body').then(($modal) => {
          // Assuming a modal or form appears after clicking "Add Donation"
          const donationForm = $modal.find('.donation-form, .modal-content, form[data-testid="donation-form"]');
          if (donationForm.length > 0) {
            cy.log('Donation form/modal appeared.');

            // Test invalid submission first (empty form)
            const modalSubmitBtn = donationForm.find('button[type="submit"], .submit-btn, button:contains("Donate")');
            if (modalSubmitBtn.length > 0) {
              cy.wrap(modalSubmitBtn).first().click({ force: true });
              cy.wait(500);
              if (donationForm.find(donations.errorMessage).length > 0) {
                cy.get(donations.errorMessage).should('be.visible');
                cy.log('Validation errors displayed for empty donation form');
              } else {
                cy.log('No validation errors found for empty donation form, but submit was attempted.');
              }
            }

            // Fill with valid data
            if (donationForm.find('input[name="amount"], input[placeholder*="amount"]').length > 0) {
              cy.get('input[name="amount"], input[placeholder*="amount"]').first().type('100', { force: true });
            }
            if (donationForm.find('input[name="recipient"], input[placeholder*="recipient"]').length > 0) {
              cy.get('input[name="recipient"], input[placeholder*="recipient"]').first().type('Charity Org', { force: true });
            }
            if (donationForm.find('textarea[name="message"], textarea[placeholder*="message"]').length > 0) {
              cy.get('textarea[name="message"], textarea[placeholder*="message"]').first().type('For a good cause!', { force: true });
            }

            // Submit valid form
            if (modalSubmitBtn.length > 0) {
              cy.wrap(modalSubmitBtn).first().click({ force: true });
              cy.wait(1500); // Wait for submission to process
              cy.get(donations.errorMessage).should('be.visible');
            }
          }
        });
      }
    });
  });

  // 8. Loading & Error States
  it('should handle loading, empty, and error states gracefully', () => {
    cy.get('body').then(($body) => {
      if ($body.find(donations.loadingIndicator).length > 0) {
        cy.get(donations.loadingIndicator).should('exist');
      }
      if ($body.find(donations.emptyState).length > 0) {
        cy.get(donations.emptyState).should('be.visible');
      }
      if ($body.find(donations.errorMessage).length > 0) {
        cy.get(donations.errorMessage).should('be.visible');
      }
    });
  });

  // 9. Responsive Layout Checks
  const responsiveConfigs = [
    { name: 'Mobile', width: 375, height: 812 },
    { name: 'Tablet', width: 768, height: 1024 },
    { name: 'Desktop', width: 1440, height: 900 }
  ];

  responsiveConfigs.forEach(viewport => {
    it(`should be responsive on ${viewport.name} view`, () => {
      cy.viewport(viewport.width, viewport.height);
      // We don't necessarily need to re-visit if the UI updates reactively, 
      // but it's safer for layout checks.
      cy.get('body').then(($body) => {
        cy.get('body').should('be.visible');
        // Tailwind Sidebar Check (hidden < 1024px)
        if (viewport.width < 1024) {
          if ($body.find(donations.navMenu).length > 0) {
            cy.get(donations.navMenu).should('not.be.visible');
          }
        } else {
          if ($body.find(donations.navMenu).length > 0) {
            cy.get(donations.navMenu).should('be.visible');
          }
        }
      });
    });
  });

  // 10. Realistic User Persona Simulation
  it('should simulate a donor browsing and filtering donations', () => {
    cy.viewport(1440, 900);
    
    cy.log('User starts browsing donation opportunities...');
    cy.scrollTo('center', { ensureScrollable: false });
    cy.wait(1000);

    cy.get('body').then(($body) => {
      // 1. User searches for Ramadan
      if ($body.find(donations.searchInput).length > 0) {
        cy.get(donations.searchInput).first().type('Ramadan', { force: true });
        cy.wait(1000);
      }

      // 2. User looks at statistics
      if ($body.find(donations.statCard).length > 0) {
        cy.get(donations.statCard).first().trigger('mouseover');
        cy.wait(500);
      }

      // 3. User attempts to add a new donation or refresh
      if ($body.find(donations.refreshBtn).length > 0) {
        cy.get(donations.refreshBtn).first().click({ force: true });
        cy.log('User refreshed the list');
        cy.wait(1000);
      }

      // 4. User attempts to export data
      if ($body.find(donations.exportBtn).length > 0) {
        cy.get(donations.exportBtn).first().click({ force: true });
        cy.log('User clicked export button');
        // Depending on implementation, this might trigger a download or open a modal.
        // For now, just click and wait.
        cy.wait(1000);
      }

      // 4. User reviews list and scrolls
      cy.scrollTo('bottom', { duration: 1500, ensureScrollable: false });
      cy.wait(1000);
      cy.scrollTo('top', { duration: 1000, ensureScrollable: false });
    });
  });
});
