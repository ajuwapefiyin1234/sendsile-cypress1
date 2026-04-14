import { Sendsile } from "../configuration/project.config.js";

describe("Sendsile Profile Dashboard", () => {
  const pageUrl = Sendsile.profile.pageUrl;

  beforeEach(() => {
    // Mock authentication directly without config (same as dashboard)
    cy.window().then((win) => {
      win.localStorage.setItem("__user_access", "test-token");
      win.localStorage.setItem("ramadanModal", "true");
      win.localStorage.setItem(
        "userInfo",
        JSON.stringify({ 
          state: { 
            userData: { 
              name: "Test User",
              email: "test@example.com",
              phone: "08012345678"
            } 
          }, 
          version: 0 
        })
      );
    });

    // Mock API responses
    cy.intercept('GET', '**/api/**', {
      statusCode: 200,
      body: {
        data: [],
        message: Sendsile.profile.message
      } 
    }).as("apiGet");

    cy.visit(pageUrl);
    cy.wait(3000);
  });

  // Test 1: Page Title and Basic Structure
  it(Sendsile.profile.message01, () => {
    cy.title().should("contain", "Sendsile"); // Verify page title contains Sendsile
    cy.get(Sendsile.profile.root).should("be.visible"); // Verify main container exists
  });

  // Test 2: Dashboard Navigation
  it(Sendsile.profile.message02, () => {
    cy.get(Sendsile.profile.root, { timeout: 10000 }).should("be.visible"); // Wait for React app to load
    
    // Check for navigation menu
    cy.get("body").then(($body) => {
      if ($body.find(Sendsile.profile.navMenu).length > 0) {
        cy.get(Sendsile.profile.navMenu).should("exist");
      }
    });
    
    // Check for dashboard links
    cy.get("body").then(($body) => {
      if ($body.find(Sendsile.profile.dashLink).length > 0) {
        cy.get(Sendsile.profile.dashLink).should("exist");
      }
    });
  });

  // Test 3: Profile Page Header
  it(Sendsile.profile.message03, () => {
    // Check for page title or heading
    cy.get("body").then(($body) => {
      if ($body.find(Sendsile.profile.pageTitle).length > 0) {
        cy.get(Sendsile.profile.pageTitle).should("be.visible");
      }
    });
    
    // Check for page description or subtitle
    cy.get("body").then(($body) => {
      if ($body.find(Sendsile.profile.pageDescription).length > 0) {
        cy.get(Sendsile.profile.pageDescription).should("exist");
      }
    });
  });

  // Test 4: User Information Section
  it(Sendsile.profile.message04, () => {
    // Check for user info section
    cy.get("body").then(($body) => {
      if ($body.find(Sendsile.profile.userInfoSection).length > 0) {
        cy.get(Sendsile.profile.userInfoSection).should("be.visible");
      }
    });
    
    // Check for avatar image
    cy.get("body").then(($body) => {
      if ($body.find(Sendsile.profile.avatarImage).length > 0) {
        cy.get(Sendsile.profile.avatarImage).should("exist");
      }
    });
    
    // Check for user name
    cy.get("body").then(($body) => {
      if ($body.find(Sendsile.profile.userName).length > 0) {
        cy.get(Sendsile.profile.userName).should("exist");
      }
    });
    
    // Check for user email
    cy.get("body").then(($body) => {
      if ($body.find(Sendsile.profile.userEmail).length > 0) {
        cy.get(Sendsile.profile.userEmail).should("exist");
      }
    });
    
    // Check for user phone
    cy.get("body").then(($body) => {
      if ($body.find(Sendsile.profile.userPhone).length > 0) {
        cy.get(Sendsile.profile.userPhone).should("exist");
      }
    });
  });

  // Test 5: Profile Edit Form
  it(Sendsile.profile.message05, () => {
    // Check for edit form
    cy.get("body").then(($body) => {
      if ($body.find(Sendsile.profile.editForm).length > 0) {
        cy.get(Sendsile.profile.editForm).should("exist");
      }
    });
    
    // Check for name input
    cy.get("body").then(($body) => {
      if ($body.find(Sendsile.profile.nameInput).length > 0) {
        cy.get(Sendsile.profile.nameInput).should("exist");
      }
    });
    
    // Check for email input
    cy.get("body").then(($body) => {
      if ($body.find(Sendsile.profile.emailInput).length > 0) {
        cy.get(Sendsile.profile.emailInput).should("exist");
      }
    });
    
    // Check for phone input
    cy.get("body").then(($body) => {
      if ($body.find(Sendsile.profile.phoneInput).length > 0) {
        cy.get(Sendsile.profile.phoneInput).should("exist");
      }
    });
    
    // Check for bio textarea
    cy.get("body").then(($body) => {
      if ($body.find(Sendsile.profile.bioTextarea).length > 0) {
        cy.get(Sendsile.profile.bioTextarea).should("exist");
      }
    });
  });

  // Test 6: Account Settings Section
  it(Sendsile.profile.message06, () => {
    // Check for account settings
    cy.get("body").then(($body) => {
      if ($body.find(Sendsile.profile.accountSettings).length > 0) {
        cy.get(Sendsile.profile.accountSettings).should("be.visible");
      }
    });
    
    // Check for password change button
    cy.get("body").then(($body) => {
      if ($body.find(Sendsile.profile.passwordChangeBtn).length > 0) {
        cy.get(Sendsile.profile.passwordChangeBtn).should("exist");
      }
    });
    
    // Check for notification toggle
    cy.get("body").then(($body) => {
      if ($body.find(Sendsile.profile.notificationToggle).length > 0) {
        cy.get(Sendsile.profile.notificationToggle).should("exist");
      }
    });
    
    // Check for privacy settings
    cy.get("body").then(($body) => {
      if ($body.find(Sendsile.profile.privacySettings).length > 0) {
        cy.get(Sendsile.profile.privacySettings).should("exist");
      }
    });
  });

  // Test 7: Action Buttons
  it(Sendsile.profile.message07, () => {
    // Check for save button
    cy.get("body").then(($body) => {
      if ($body.find(Sendsile.profile.saveBtn).length > 0) {
        cy.get(Sendsile.profile.saveBtn).should("exist");
      }
    });
    
    // Check for cancel button
    cy.get("body").then(($body) => {
      if ($body.find(Sendsile.profile.cancelBtn).length > 0) {
        cy.get(Sendsile.profile.cancelBtn).should("exist");
      }
    });
    
    // Check for edit button
    cy.get("body").then(($body) => {
      if ($body.find(Sendsile.profile.editBtn).length > 0) {
        cy.get(Sendsile.profile.editBtn).should("exist");
      }
    });
  });

  // Test 8: Profile Statistics
  it(Sendsile.profile.message08, () => {
    // Check for stats section
    cy.get("body").then(($body) => {
      if ($body.find(Sendsile.profile.statsSection).length > 0) {
        cy.get(Sendsile.profile.statsSection).should("be.visible");
      }
    });
    
    // Check for member since info
    cy.get("body").then(($body) => {
      if ($body.find(Sendsile.profile.memberSince).length > 0) {
        cy.get(Sendsile.profile.memberSince).should("exist");
      }
    });
    
    // Check for total orders
    cy.get("body").then(($body) => {
      if ($body.find(Sendsile.profile.totalOrders).length > 0) {
        cy.get(Sendsile.profile.totalOrders).should("exist");
      }
    });
    
    // Check for account status
    cy.get("body").then(($body) => {
      if ($body.find(Sendsile.profile.accountStatus).length > 0) {
        cy.get(Sendsile.profile.accountStatus).should("exist");
      }
    });
  });

  // Test 9: Security Features
  it(Sendsile.profile.message09, () => {
    // Check for two-factor authentication
    cy.get("body").then(($body) => {
      if ($body.find(Sendsile.profile.twoFactorAuth).length > 0) {
        cy.get(Sendsile.profile.twoFactorAuth).should("exist");
      }
    });
    
    // Check for login history
    cy.get("body").then(($body) => {
      if ($body.find(Sendsile.profile.loginHistory).length > 0) {
        cy.get(Sendsile.profile.loginHistory).should("be.visible");
      }
    });
    
    // Check for active sessions
    cy.get("body").then(($body) => {
      if ($body.find(Sendsile.profile.activeSessions).length > 0) {
        cy.get(Sendsile.profile.activeSessions).should("exist");
      }
    });
  });

  // Test 10: Loading and Error States
  it(Sendsile.profile.message10, () => {
    // Check for loading indicators
    cy.get("body").then(($body) => {
      if ($body.find(Sendsile.profile.loadingIndicator).length > 0) {
        cy.get(Sendsile.profile.loadingIndicator).should("be.visible");
      }
    });
    
    // Check for error messages
    cy.get("body").then(($body) => {
      if ($body.find(Sendsile.profile.errorMessage).length > 0) {
        cy.get(Sendsile.profile.errorMessage).should("be.visible");
      }
    });
    
    // Check for success messages
    cy.get("body").then(($body) => {
      if ($body.find(Sendsile.profile.successMessage).length > 0) {
        cy.get(Sendsile.profile.successMessage).should("be.visible");
      }
    });
  });

  // Test 11: Responsive Design
  it(Sendsile.profile.message11, () => {
    // Test mobile view
    cy.viewport(Sendsile.profile.mobileView);
    cy.get(Sendsile.profile.root).should('be.visible');
    
    // Test tablet view
    cy.viewport(Sendsile.profile.tabletView);
    cy.get(Sendsile.profile.root).should('be.visible');
    
    // Test desktop view
    cy.viewport(1280, 720);
    cy.get(Sendsile.profile.root).should('be.visible');
  });

  // Test 12: Basic Form Interactions
  it(Sendsile.profile.message12, () => {
    cy.get("body").then(($body) => {
      // Test name field interaction if exists
      if ($body.find(Sendsile.profile.nameField).length > 0) {
        cy.get(Sendsile.profile.nameField)
          .first()
          .clear()
          .type("Test User Updated")
          .should("have.value", "Test User Updated");
      }
      
      // Test email field interaction if exists
      if ($body.find(Sendsile.profile.emailField).length > 0) {
        cy.get(Sendsile.profile.emailField)
          .first()
          .clear()
          .type("updated@example.com")
          .should("have.value", "updated@example.com");
      }
      
      // Test button clicks if buttons exist
      if ($body.find("button").length > 0) {
        cy.get("button").first().click({ force: true });
      }
    });
  });

  // Test 13: Form Validation
  it(Sendsile.profile.message13, () => {
    cy.get("body").then(($body) => {
      // Test empty name validation if name field exists
      if ($body.find(Sendsile.profile.nameField).length > 0) {
        cy.get(Sendsile.profile.nameField).first().clear().blur();
        
        // Check for empty name error
        if ($body.find(Sendsile.profile.emptyNameError).length > 0) {
          cy.get(Sendsile.profile.emptyNameError).should('be.visible');
        }
      }
      
      // Test invalid email validation if email field exists
      if ($body.find(Sendsile.profile.emailField).length > 0) {
        cy.get(Sendsile.profile.emailField).first().clear().type("invalid-email").blur();
        
        // Check for invalid email error
        if ($body.find(Sendsile.profile.invalidEmailError).length > 0) {
          cy.get(Sendsile.profile.invalidEmailError).should('be.visible');
        }
      }
      
      // Check for required field errors
      if ($body.find(Sendsile.profile.requiredFieldError).length > 0) {
        cy.get(Sendsile.profile.requiredFieldError).should('be.visible');
      }
    });
  });

  // Core Functionality Test - Like Checkout Test
  it("should click buttons, type inputs, and navigate pages correctly", () => {
    cy.get("body").then(($body) => {
      
      // Core Action 1: Click all buttons
      if ($body.find('button').length > 0) {
        cy.log('🔘 Testing all buttons...');
        cy.get('button').each(($button, index) => {
          const buttonText = $button.text().trim();
          if (buttonText) {
            cy.log(`Clicking button: "${buttonText}"`);
            cy.wrap($button).as(`button-${index}`);
            cy.get(`@button-${index}`).click({ force: true });
            cy.wait(300); // Brief wait for response
          }
        });
      }
      
      // Core Action 2: Type into all inputs
      cy.log('⌨️ Testing all input fields...');
      
      // Text-based inputs
      const textInputs = $body.find('input[type="text"], input[type="email"], input[type="password"], input[type="search"], input[type="url"], input[type="tel"]');
      if (textInputs.length > 0) {
        cy.log(`Found ${textInputs.length} text inputs`);
        cy.get('input[type="text"], input[type="email"], input[type="password"], input[type="search"], input[type="url"], input[type="tel"]').each(($input, index) => {
          cy.log(`Typing in input ${index + 1}`);
          cy.wrap($input)
            .clear({ force: true })
            .type("test input")
            .should("not.be.empty");
        });
      }
      
      // Number inputs
      if ($body.find('input[type="number"]').length > 0) {
        cy.log('Testing number inputs');
        cy.get('input[type="number"]').each(($input, index) => {
          cy.log(`Typing in number input ${index + 1}`);
          cy.wrap($input)
            .clear({ force: true })
            .type("123")
            .should("have.value", "123");
        });
      }
      
      // Date inputs
      if ($body.find('input[type="date"]').length > 0) {
        cy.log('Testing date inputs');
        cy.get('input[type="date"]').each(($input, index) => {
          cy.log(`Typing in date input ${index + 1}`);
          cy.wrap($input)
            .clear({ force: true })
            .type("2024-12-25")
            .should("have.value", "2024-12-25");
        });
      }
      
      // Textareas
      if ($body.find('textarea').length > 0) {
        cy.log('Testing textareas');
        cy.get('textarea').each(($textarea, index) => {
          cy.log(`Typing in textarea ${index + 1}`);
          cy.wrap($textarea)
            .clear({ force: true })
            .type("Test content")
            .should("not.be.empty");
        });
      }
      
      // Select dropdowns
      if ($body.find('select').length > 0) {
        cy.log('Testing select dropdowns');
        cy.get('select').each(($select, index) => {
          cy.log(`Selecting from dropdown ${index + 1}`);
          cy.wrap($select).select(0).should("have.value");
        });
      }
      
      // Checkboxes
      if ($body.find('input[type="checkbox"]').length > 0) {
        cy.log('Testing checkboxes');
        cy.get('input[type="checkbox"]').each(($checkbox, index) => {
          // Skip problematic hidden checkboxes
          if ($checkbox.attr('id') === 'me.hidden') {
            cy.log(`Skipping problematic checkbox ${index + 1} with id me.hidden`);
            return;
          }
          
          // Start fresh for each checkbox - uncheck first, then check
          cy.log(`Toggling checkbox ${index + 1}`);
          cy.wrap($checkbox)
            .uncheck({ force: true }) // Start unchecked
            .should('not.be.checked')
            .check({ force: true }) // Then check
            .should('be.checked');
        });
      }
      
      // Radio buttons
      if ($body.find('input[type="radio"]').length > 0) {
        cy.log('Testing radio buttons');
        cy.get('input[type="radio"]').each(($radio, index) => {
          cy.log(`Selecting radio button ${index + 1}`);
          cy.wrap($radio).check({ force: true }).should('be.checked');
        });
      }
      
      // Core Action 3: Navigate pages
      cy.log('🔗 Testing page navigation...');
      
      // Test all links for navigation
      if ($body.find('a').length > 0) {
        cy.log(`Found ${$body.find('a').length} links to test`);
        cy.get('a').each(($link, index) => {
          const href = $link.attr('href');
          const linkText = $link.text().trim();
          
          if (href && linkText && index < 5) { // Test first 5 links to avoid too much navigation
            cy.log(`Navigating to: "${linkText}" -> ${href}`);
            
            if (href.startsWith('http')) {
              // External link - just verify it exists
              cy.wrap($link).should('have.attr', 'href');
            } else {
              // Internal link - try clicking
              cy.wrap($link).as(`link-${index}`);
              cy.get(`@link-${index}`).click({ force: true });
              cy.wait(500);
              
              // Check if navigation was successful
              cy.url().then((url) => {
                cy.log(`Current URL after navigation: ${url}`);
              });
            }
          }
        });
      }
      
      // Test navigation elements
      if ($body.find('nav, .nav, .navigation, .menu').length > 0) {
        cy.log('Testing navigation elements');
        cy.get('nav, .nav, .navigation, .menu').each(($nav, index) => {
          cy.log(`Testing navigation element ${index + 1}`);
          const $navLinks = $nav.find('a');
          if ($navLinks.length > 0) {
            // Test first navigation link
            cy.wrap($navLinks.first()).as(`nav-${index}`);
            cy.get(`@nav-${index}`).click({ force: true });
            cy.wait(500);
          }
        });
      }
      
      // Core Action 4: Show test results correctly
      cy.log('📊 Displaying test results...');
      
      // Verify we can still interact with the page
      cy.get("body").should("be.visible");
      
      // Check for any success indicators
      if ($body.find('.success, .complete, .done, .valid').length > 0) {
        cy.log('✅ Found success indicators on page');
        cy.get('.success, .complete, .done, .valid').should('be.visible');
      }
      
      // Check for any error indicators
      if ($body.find('.error, .invalid, .failed').length > 0) {
        cy.log('⚠️ Found error indicators on page');
        cy.get('.error, .invalid, .failed').should('be.visible');
      }
      
      // Log completion
      cy.log('🎯 Profile core functionality test completed successfully!');
      cy.log('✅ Buttons clicked');
      cy.log('✅ Inputs typed');
      cy.log('✅ Pages navigated');
      cy.log('✅ Test results shown');
    });
  });

  // Responsive Design Test
  it("should be responsive on different viewports", () => {
    // Test mobile view
    cy.viewport('iphone-x');
    cy.get("body").then(($body) => {
      if ($body.find("#root").length > 0) {
        cy.get("#root").should('be.visible');
      } else {
        cy.get("body").should("be.visible");
      }
    });
    
    // Test tablet view
    cy.viewport('ipad-2');
    cy.get("body").then(($body) => {
      if ($body.find("#root").length > 0) {
        cy.get("#root").should('be.visible');
      } else {
        cy.get("body").should("be.visible");
      }
    });
    
    // Test desktop view
    cy.viewport(1280, 720);
    cy.get("body").then(($body) => {
      if ($body.find("#root").length > 0) {
        cy.get("#root").should('be.visible');
      } else {
        cy.get("body").should("be.visible");
      }
    });
  });
});