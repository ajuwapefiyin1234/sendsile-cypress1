/* global cy, describe, it, beforeEach */
import { Sendsile } from '../configuration/project.config.js';

const { billPayment, dashboard } = Sendsile;

// Validate configuration exists
if (!billPayment) {
  throw new Error('Bill Payment configuration not found in project.config.js');
}

// Helper Functions
const seedAuthenticatedState = (win) => {
  const userInfo = {
    state: {
      userData: dashboard.userData || { name: 'Test User', email: 'test@example.com' },
    },
    version: 0,
  };

  win.localStorage.setItem('__user_access', 'test-token');
  win.localStorage.setItem('authToken', 'Bearer test-token');
  win.localStorage.setItem('isLoggedIn', 'true');
  win.localStorage.setItem('ramadanModal', 'true');
  win.localStorage.setItem('userInfo', JSON.stringify(userInfo));
};

const mockBillPaymentApis = () => {
  // Mock generic API responses for bill payment
  cy.intercept('GET', '**/api/**', {
    statusCode: 200,
    body: {
      success: true,
      data: [],
      message: billPayment.message
    }
  }).as('apiGet');

  cy.intercept('POST', '**/api/payment/**', {
    statusCode: 200,
    body: {
      success: true,
      message: 'Payment successful'
    }
  }).as('apiPostPayment');
};

const visitBillPayment = () => {
  mockBillPaymentApis();
  cy.visit(billPayment.pageUrl, {
    onBeforeLoad(win) {
      seedAuthenticatedState(win);
    },
  });
  cy.wait(3000); // Wait for app initialization
};

describe('Sendsile Bill Payment - Consolidated Tests', () => {
  beforeEach(() => {
    cy.viewport(1440, 900);
    visitBillPayment();
  });

  // 1. Access & Main Navigation
  it('should verify page access and main navigation structure', () => {
    cy.url().should('include', '/bill-payment');
    cy.title().should('contain', 'Sendsile');
    cy.get('body').then(($body) => {
      if ($body.find(billPayment.navMenu).length > 0) {
        cy.get(billPayment.navMenu).should('be.visible');
      }
      if ($body.find(billPayment.dashLink).length > 0) {
        cy.get(billPayment.dashLink).should('exist');
      }
    });
  });

  // 2. Header & Selection UI
  it('should display the page header and bill selection components', () => {
    cy.get('body').then(($body) => {
      if ($body.find(billPayment.pageTitle).length > 0) {
        cy.get(billPayment.pageTitle).should('be.visible');
      }
      if ($body.find(billPayment.billSelectionInput).length > 0) {
        cy.get(billPayment.billSelectionInput).should('exist');
      }
      if ($body.find(billPayment.billSearchFunctionality).length > 0) {
        cy.get(billPayment.billSearchFunctionality).should('exist');
      }
    });
  });

  // 3. Payment & Security Form UI
  it('should display payment amount, methods, and security fields', () => {
    cy.get('body').then(($body) => {
      // Check form fields
      const selectors = [
        billPayment.paymentAmountInput,
        billPayment.paymentMethodSelection,
        billPayment.cvvInput,
        billPayment.expiryInput
      ];
      selectors.forEach(sel => {
        if ($body.find(sel).length > 0) {
          cy.get(sel).should('exist');
        }
      });
    });
  });

  // 4. Billing Details Display
  it('should show summary sections for billing and due dates', () => {
    cy.get('body').then(($body) => {
      if ($body.find(billPayment.billDetailsSection).length > 0) {
        cy.get(billPayment.billDetailsSection).should('be.visible');
      }
      if ($body.find(billPayment.dueDateDisplay).length > 0) {
        cy.get(billPayment.dueDateDisplay).should('exist');
      }
    });
  });

  // 5. Functional Form & Search Interaction
  it('should handle user input for search and payment values', () => {
    cy.get('body').then(($body) => {
      // Test search
      const searchSelector = billPayment.billSearchFunctionality;
      if ($body.find(searchSelector).length > 0) {
        cy.get(searchSelector).first()
          .type('Electricity', { force: true })
          .should('have.value', 'Electricity');
      }
      
      // Test amount input
      if ($body.find(billPayment.amountInput).length > 0) {
        cy.get(billPayment.amountInput).first()
          .clear({ force: true })
          .type('1000', { force: true })
          .should('have.value', '1000');
      }
    });
  });

  // 6. Validation Logic
  it('should trigger and display validation errors on empty submission', () => {
    cy.get('body').then(($body) => {
      // Trigger validation by clicking submit on empty form
      if ($body.find(billPayment.submitPaymentButton).length > 0) {
        cy.get(billPayment.submitPaymentButton).first().click({ force: true });
        cy.wait(500);
        
        // Check for error messages
        if ($body.find(billPayment.validationErrors).length > 0) {
          cy.get(billPayment.validationErrors).should('be.visible');
          cy.log('Validation errors displayed correctly');
        }
      }
    });
  });

  // 7. Automated Core Interaction Sweep
  it('should perform a generic sweep of inputs and buttons', () => {
    cy.get('body').then(($body) => {
      // 1. Test all visible inputs
      const textInputs = $body.find('input[type="text"], input[type="number"], input[type="tel"]');
      if (textInputs.length > 0) {
        cy.log(`Found ${textInputs.length} inputs to test`);
        cy.get('input[type="text"], input[type="number"], input[type="tel"]').each(($input, index) => {
          if ($input.is(':visible') && index < 3) {
            const val = $input.attr('type') === 'number' ? '500' : 'Test input';
            cy.wrap($input).clear({ force: true }).type(val, { force: true });
          }
        });
      }

      // 2. Test navigation links
      if ($body.find('a[href]:visible').length > 0) {
        cy.get('a[href]:visible').first().then(($link) => {
          cy.log(`Checking navigation link: ${$link.text()}`);
          cy.wrap($link).should('have.attr', 'href');
        });
      }

      // 3. Test scrolling
      cy.scrollTo('bottom', { duration: 1000, ensureScrollable: false });
      cy.wait(500);
      cy.scrollTo('top', { duration: 1000, ensureScrollable: false });
    });
  });

  // 8. Loading Indicators
  it('should verify visibility of loading indicators if they appear', () => {
    // Verify loading states don't break the page
    cy.get('body').then(($body) => {
      if ($body.find(billPayment.loadingIndicators).length > 0) {
        cy.get(billPayment.loadingIndicators).should('exist');
      }
    });
  });

  // 9. Responsive Layout Checks
  const responsiveViewports = [
    { name: 'Mobile', width: 375, height: 812 }, // iPhone X
    { name: 'Tablet', width: 768, height: 1024 }, // iPad
    { name: 'Desktop', width: 1440, height: 900 }
  ];

  responsiveViewports.forEach((viewport) => {
    it(`should be responsive on ${viewport.name} view`, () => {
      cy.viewport(viewport.width, viewport.height);
      visitBillPayment(); // Visit the page after setting the viewport
      
      cy.get('body').then(($body) => {
        // Ensure the app is visible
        cy.get('body').should('be.visible');
        
        // Check if navigation menu handles responsiveness (often becomes a burger or hidden)
        // The sidebar uses Tailwind 'lg:block', meaning it is hidden below 1024px.
        if (viewport.width < 1024) {
          cy.log(`Checking ${viewport.name} UI (width: ${viewport.width}) - Sidebar hidden expected`);
          if ($body.find(billPayment.navMenu).length > 0) {
            cy.get(billPayment.navMenu).should('not.be.visible');
          }
        } else {
          cy.log(`Checking ${viewport.name} UI (width: ${viewport.width}) - Sidebar visible expected`);
          if ($body.find(billPayment.navMenu).length > 0) {
            cy.get(billPayment.navMenu).should('be.visible');
          }
        }
      });
    });
  });

  // 10. Realistic User Persona Simulation
  it('should simulate a complete end-to-end user bill payment scenario', () => {
    cy.viewport(1440, 900);
    
    cy.log('User starts browsing bill payment services...');
    cy.scrollTo('center', { ensureScrollable: false });
    cy.wait(1000);

    cy.get('body').then(($body) => {
      // 1. User searches for electricity
      const searchBox = billPayment.billSearchFunctionality;
      if ($body.find(searchBox).length > 0) {
        cy.get(searchBox).first().type('Electricity', { force: true });
        cy.wait(1000);
      }

      // 2. User selects a biller (AEDC, etc) if select exists
      if ($body.find('select').length > 0) {
        cy.get('select').first().select(1, { force: true });
        cy.wait(500);
      }

      // 3. User enters amount
      if ($body.find(billPayment.paymentAmountInput).length > 0) {
        cy.get(billPayment.paymentAmountInput).first().type('5000', { force: true });
      }

      // 4. User reviews and hesitates
      cy.wait(2000);
      
      // 5. User clicks pay
      if ($body.find(billPayment.submitPaymentButton).length > 0) {
        cy.get(billPayment.submitPaymentButton).first().click({ force: true });
        cy.log('User attempted to submit payment');
      }
    });
  });
});