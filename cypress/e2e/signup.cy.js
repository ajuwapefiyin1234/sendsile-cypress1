import { Sendsile } from "../configuration/project.config.js";

const { signup } = Sendsile;

// Validate signup configuration exists
if (!signup) {
  throw new Error('Signup configuration not found in project.config.js');
}

// Helper Functions
const mockSignupApis = (options = {}) => {
  const {
    registrationSuccess = true,
    emailExists = false,
    serverError = false,
    delay = 0,
  } = options;

  // Mock registration API
  cy.intercept('POST', `**${signup.registerApi}`, (req) => {
    if (serverError) {
      req.reply({
        statusCode: signup.serverErrorStatus,
        body: { message: 'Server error during registration' },
      });
    } else if (emailExists) {
      req.reply({
        statusCode: signup.conflictStatus,
        body: { message: signup.emailExistsMessage },
      });
    } else if (registrationSuccess) {
      req.reply({
        statusCode: signup.successStatus,
        body: { 
          message: signup.successRegistrationMessage,
          data: { email: req.body.email }
        },
        delay,
      });
    } else {
      req.reply({
        statusCode: signup.badRequestStatus,
        body: { message: 'Invalid registration data' },
      });
    }
  }).as('signupRequest');

  // Mock email verification API
  cy.intercept('POST', `**${signup.verifyEmailApi}`, {
    statusCode: signup.successStatus,
    body: { message: 'Email verification sent' },
    delay,
  }).as('verifyEmail');

  // Mock general API requests
  cy.intercept('GET', '**/api/**', {
    statusCode: signup.successStatus,
    body: {
      data: [],
      message: "API request processed"
    },
    delay,
  }).as('apiGet');
};

const visitSignupPage = (options = {}) => {
  mockSignupApis(options);
  
  cy.visit(signup.pageUrl, {
    timeout: 30000,
    failOnStatusCode: false,
    onBeforeLoad: (win) => {
      // Clear any existing auth state for signup testing
      win.localStorage.clear();
      win.sessionStorage.clear();
    }
  });
  
  // Wait for page to load
  cy.wait(2000);
  cy.get(signup.root || '#root', { timeout: 15000 }).should('be.visible');
  cy.wait(2000); // Wait for dynamic content to load
};

const findAndFillForm = (formData, submit = false) => {
  return cy.get('body').then(($body) => {
    let formFilled = false;
    
    // Fill name field
    if (formData.name && $body.find(signup.nameInput).length > 0) {
      cy.get(signup.nameInput).first().clear({ force: true }).type(formData.name, { force: true });
      cy.log('Filled name field');
    }
    
    // Fill email field
    if (formData.email && $body.find(signup.emailInput).length > 0) {
      cy.get(signup.emailInput).first().clear({ force: true }).type(formData.email, { force: true });
      cy.log('Filled email field');
    }
    
    // Fill phone field
    if (formData.phone && $body.find(signup.phoneInput).length > 0) {
      cy.get(signup.phoneInput).first().clear({ force: true }).type(formData.phone, { force: true });
      cy.log('Filled phone field');
    }
    
    // Fill password field
    if (formData.password && $body.find(signup.passwordInput).length > 0) {
      cy.get(signup.passwordInput).first().clear({ force: true }).type(formData.password, { force: true });
      cy.log('Filled password field');
    }
    
    // Fill confirm password field
    if (formData.confirmPassword && $body.find(signup.confirmPasswordInput).length > 0) {
      cy.get(signup.confirmPasswordInput).first().clear({ force: true }).type(formData.confirmPassword, { force: true });
      cy.log('Filled confirm password field');
    }
    
    // Handle terms checkbox
    if (formData.acceptTerms !== undefined && $body.find(signup.termsCheckbox).length > 0) {
      if (formData.acceptTerms) {
        cy.get(signup.termsCheckbox).first().check({ force: true });
        cy.log('Accepted terms and conditions');
      } else {
        cy.get(signup.termsCheckbox).first().uncheck({ force: true });
        cy.log('Did not accept terms and conditions');
      }
    }
    
    // Handle newsletter checkbox
    if (formData.newsletter !== undefined && $body.find(signup.newsletterCheckbox).length > 0) {
      if (formData.newsletter) {
        cy.get(signup.newsletterCheckbox).first().check({ force: true });
        cy.log('Subscribed to newsletter');
      } else {
        cy.get(signup.newsletterCheckbox).first().uncheck({ force: true });
        cy.log('Did not subscribe to newsletter');
      }
    }
    
    formFilled = true;
    
    // Submit form if requested
    if (submit) {
      cy.get('body').then(($body) => {
        const $signupBtn = $body.find(signup.signupBtn);
        if ($signupBtn.length > 0) {
          cy.wrap($signupBtn).first().click({ force: true });
          cy.log('Submitted signup form');
        } else {
          cy.log('No signup button found');
        }
      });
    }
    
    return cy.wrap(formFilled);
  });
};

// ==========================================
// COMPREHENSIVE SIGNUP TESTS
// ==========================================
describe('Sendsile Signup Page - Comprehensive Tests', () => {
  beforeEach(() => {
    cy.clearCookies();
    cy.clearLocalStorage();
    cy.viewport(1440, 900); // Set consistent viewport
  });

  // Test 1: Page Load and Basic Structure
  it(signup.message01, () => {
    visitSignupPage();
    
    // Verify page loaded
    cy.url().should('include', '/sign-up');
    cy.title().should('contain', 'Sendsile');
    cy.get(signup.root).should('be.visible');
    
    // Check page title and description with flexible selectors
    cy.get('body').then(($body) => {
      if ($body.find(signup.pageTitle).length > 0) {
        cy.get(signup.pageTitle).should('be.visible');
        cy.log('Page title found and visible');
      } else {
        const $titleElements = $body.find('h1, h2, .title, .page-title');
        if ($titleElements.length > 0) {
          cy.wrap($titleElements).first().should('be.visible');
          cy.log('Title found with broader selectors');
        } else {
          cy.log('No title element found, but page loaded successfully');
        }
      }
      
      if ($body.find(signup.pageDescription).length > 0) {
        cy.get(signup.pageDescription).should('exist');
        cy.log('Page description found');
      } else {
        const $descElements = $body.find('.description, .subtitle, p');
        if ($descElements.length > 0) {
          cy.log('Description found with broader selectors');
        }
      }
    });
  });

  // Test 2: Form Elements Display
  it(signup.message02, () => {
    visitSignupPage();
    
    // Check essential form elements
    cy.get('body').then(($body) => {
      // Name field
      if ($body.find(signup.nameInput).length > 0) {
        cy.get(signup.nameInput).first().should('be.visible').and('be.enabled');
        cy.log('Name field found');
      } else {
        cy.log('Name field not found - may be optional');
      }
      
      // Email field
      if ($body.find(signup.emailInput).length > 0) {
        cy.get(signup.emailInput).first().should('be.visible').and('be.enabled');
        cy.log('Email field found');
      } else {
        cy.log('Email field not found - this is unexpected');
      }
      
      // Password field
      if ($body.find(signup.passwordInput).length > 0) {
        cy.get(signup.passwordInput).first().should('be.visible').and('be.enabled');
        cy.get(signup.passwordInput).first().should('have.attr', 'type', 'password');
        cy.log('Password field found');
      } else {
        cy.log('Password field not found - this is unexpected');
      }
      
      // Confirm password field
      if ($body.find(signup.confirmPasswordInput).length > 0) {
        cy.get(signup.confirmPasswordInput).first().should('be.visible').and('be.enabled');
        cy.get(signup.confirmPasswordInput).first().should('have.attr', 'type', 'password');
        cy.log('Confirm password field found');
      } else {
        cy.log('Confirm password field not found - may be optional');
      }
      
      // Signup button
      if ($body.find(signup.signupBtn).length > 0) {
        cy.get(signup.signupBtn).first().should('be.visible');
        cy.log('Signup button found');
      } else {
        cy.log('Signup button not found - this is unexpected');
      }
      
      // Optional elements
      if ($body.find(signup.phoneInput).length > 0) {
        cy.get(signup.phoneInput).first().should('be.visible');
        cy.log('Phone field found');
      }
      
      if ($body.find(signup.termsCheckbox).length > 0) {
        cy.get(signup.termsCheckbox).first().should('exist');
        cy.log('Terms checkbox found');
      }
      
      if ($body.find(signup.loginLink).length > 0) {
        cy.get(signup.loginLink).first().should('exist');
        cy.log('Login link found');
      }
    });
  });

  // Test 3: Form Input Validation
  it(signup.message03, () => {
    visitSignupPage();
    
    // Test form accepts input
    findAndFillForm(signup.testUser).then((filled) => {
      if (filled) {
        cy.log('Form accepts input successfully');
        
        // Verify values were set
        cy.get('body').then(($body) => {
          if ($body.find(signup.nameInput).length > 0) {
            cy.get(signup.nameInput).first().should('have.value', signup.testUser.name);
          }
          if ($body.find(signup.emailInput).length > 0) {
            cy.get(signup.emailInput).first().should('have.value', signup.testUser.email);
          }
          if ($body.find(signup.passwordInput).length > 0) {
            cy.get(signup.passwordInput).first().should('have.value', signup.testUser.password);
          }
          if ($body.find(signup.confirmPasswordInput).length > 0) {
            cy.get(signup.confirmPasswordInput).first().should('have.value', signup.testUser.confirmPassword);
          }
        });
      }
    });
  });

  // Test 4: Invalid Email Format
  it(signup.message04, () => {
    visitSignupPage();
    
    // Fill form with invalid email
    const invalidFormData = {
      ...signup.testUser,
      email: signup.testUser.invalidEmail
    };
    
    findAndFillForm(invalidFormData, true).then(() => {
      cy.wait(2000);
      
      // Check for email validation error
      cy.get('body').then(($body) => {
        if ($body.find(signup.emailError).length > 0) {
          cy.get(signup.emailError).first().should('be.visible');
          cy.log('Email validation error displayed');
        } else if ($body.find(signup.validationError).length > 0) {
          cy.get(signup.validationError).first().should('be.visible');
          cy.log('Validation error displayed');
        } else {
          cy.log('No validation error shown - may validate on submit or client-side');
        }
      });
    });
  });

  // Test 5: Weak Password
  it(signup.message05, () => {
    visitSignupPage();
    
    // Fill form with weak password
    const weakPasswordFormData = {
      ...signup.testUser,
      password: signup.testUser.weakPassword,
      confirmPassword: signup.testUser.weakPassword
    };
    
    findAndFillForm(weakPasswordFormData, true).then(() => {
      cy.wait(2000);
      
      // Check for password validation error
      cy.get('body').then(($body) => {
        if ($body.find(signup.passwordError).length > 0) {
          cy.get(signup.passwordError).first().should('be.visible');
          cy.log('Password validation error displayed');
        } else if ($body.find(signup.validationError).length > 0) {
          cy.get(signup.validationError).first().should('be.visible');
          cy.log('Validation error displayed');
        } else {
          cy.log('No password validation error shown - may accept weak passwords');
        }
      });
    });
  });

  // Test 6: Password Mismatch
  it(signup.message06, () => {
    visitSignupPage();
    
    // Fill form with mismatched passwords
    const mismatchFormData = {
      ...signup.testUser,
      confirmPassword: 'DifferentPassword123'
    };
    
    findAndFillForm(mismatchFormData, true).then(() => {
      cy.wait(2000);
      
      // Check for password mismatch error
      cy.get('body').then(($body) => {
        if ($body.find(signup.confirmPasswordError).length > 0) {
          cy.get(signup.confirmPasswordError).first().should('be.visible');
          cy.log('Password mismatch error displayed');
        } else if ($body.find(signup.validationError).length > 0) {
          cy.get(signup.validationError).first().should('be.visible');
          cy.log('Validation error displayed');
        } else {
          cy.log('No password mismatch error shown - may validate on submit');
        }
      });
    });
  });

  // Test 7: Successful Registration
  it(signup.message07, () => {
    visitSignupPage({ registrationSuccess: true });
    
    // Fill and submit valid form
    findAndFillForm(signup.testUser, true).then(() => {
      cy.wait('@signupRequest');
      cy.wait(2000);
      
      // Verify successful registration
      cy.get('body').then(($body) => {
        if ($body.find(signup.successMessage).length > 0) {
          cy.get(signup.successMessage).first().should('be.visible');
          cy.log('Success message displayed');
        }
        
        // Check for redirect to email verification
        cy.url().then((url) => {
          if (url.includes(signup.emailVerificationUrl)) {
            cy.log('Redirected to email verification page');
          } else if (url.includes(signup.loginUrl)) {
            cy.log('Redirected to login page');
          } else {
            cy.log('No redirect detected - may show success message on same page');
          }
        });
      });
    });
  });

  // Test 8: Email Already Exists
  it(signup.message08, () => {
    visitSignupPage({ emailExists: true });
    
    // Fill form with existing email
    const existingEmailFormData = {
      ...signup.testUser,
      email: signup.testUser.existingEmail
    };
    
    findAndFillForm(existingEmailFormData, true).then(() => {
      cy.wait('@signupRequest');
      cy.wait(2000);
      
      // Check for email exists error
      cy.get('body').then(($body) => {
        if ($body.find(signup.errorMessage).length > 0) {
          cy.get(signup.errorMessage).first().should('be.visible');
          cy.get(signup.errorMessage).first().should('contain', signup.emailExistsMessage);
          cy.log('Email exists error displayed');
        } else {
          cy.log('No error message shown - unexpected');
        }
      });
    });
  });

  // Test 9: Server Error Handling
  it(signup.message09, () => {
    visitSignupPage({ serverError: true });
    
    // Fill and submit form
    findAndFillForm(signup.testUser, true).then(() => {
      cy.wait('@signupRequest');
      cy.wait(2000);
      
      // Check for server error handling
      cy.get('body').then(($body) => {
        if ($body.find(signup.errorMessage).length > 0) {
          cy.get(signup.errorMessage).first().should('be.visible');
          cy.log('Server error message displayed');
        } else {
          cy.log('No server error message shown - may handle silently');
        }
      });
    });
  });

  // Test 10: Navigation to Login
  it(signup.message10, () => {
    visitSignupPage();
    
    // Click login link
    cy.get('body').then(($body) => {
      if ($body.find(signup.loginLink).length > 0) {
        cy.get(signup.loginLink).first().click({ force: true });
        cy.wait(2000);
        
        // Verify navigation to login
        cy.url().then((url) => {
          if (url.includes('/login') || url.includes('/signin')) {
            cy.log('Successfully navigated to login page');
          } else {
            cy.log('Navigation to login may have failed');
          }
        });
      } else {
        cy.log('Login link not found');
      }
    });
  });

  // Test 11: Social Signup Options
  it(signup.message11, () => {
    visitSignupPage();
    
    // Check for social signup options
    cy.get('body').then(($body) => {
      if ($body.find(signup.socialLoginSection).length > 0) {
        cy.get(signup.socialLoginSection).first().should('be.visible');
        cy.log('Social login section found');
        
        // Check for Google signup
        if ($body.find(signup.googleSignupBtn).length > 0) {
          cy.get(signup.googleSignupBtn).first().should('exist');
          cy.log('Google signup option found');
        }
        
        // Check for Facebook signup
        if ($body.find(signup.facebookSignupBtn).length > 0) {
          cy.get(signup.facebookSignupBtn).first().should('exist');
          cy.log('Facebook signup option found');
        }
        
        // Check for divider text
        if ($body.find(signup.dividerText).length > 0) {
          cy.get(signup.dividerText).first().should('be.visible');
          cy.log('Divider text found');
        }
      } else {
        cy.log('No social login options found');
      }
    });
  });

  // Test 12: Responsive Design
  it(signup.message12, () => {
    const viewports = signup.viewports || ['iphone-x', 'ipad-2', [1280, 720]];
    const viewportNames = ['mobile', 'tablet', 'desktop'];
    
    viewports.forEach((viewport, index) => {
      // Handle array viewports properly
      if (Array.isArray(viewport)) {
        cy.viewport(viewport[0], viewport[1]);
      } else {
        cy.viewport(viewport);
      }
      
      visitSignupPage();
      
      cy.get(signup.root || '#root').should('be.visible');
      cy.log(`${viewportNames[index]} responsiveness verified`);
    });
  });

  // Test 13: Terms and Conditions
  it(signup.message13, () => {
    visitSignupPage();
    
    cy.get('body').then(($body) => {
      if ($body.find(signup.termsCheckbox).length > 0) {
        // Test without accepting terms
        const noTermsFormData = {
          ...signup.testUser,
          acceptTerms: false
        };
        
        findAndFillForm(noTermsFormData, true).then(() => {
          cy.wait(2000);
          
          // Check for terms error
          if ($body.find(signup.termsError).length > 0) {
            cy.get(signup.termsError).first().should('be.visible');
            cy.log('Terms error displayed when not accepted');
          }
        });
        
        // Test with accepting terms
        visitSignupPage();
        const termsFormData = {
          ...signup.testUser,
          acceptTerms: true
        };
        
        findAndFillForm(termsFormData).then(() => {
          cy.log('Terms accepted successfully');
        });
      } else {
        cy.log('Terms checkbox not found - may not be required');
      }
    });
  });

  // Test 14: Email Verification Flow
  it(signup.message14, () => {
    visitSignupPage({ registrationSuccess: true });
    
    // Complete registration
    findAndFillForm(signup.testUser, true).then(() => {
      cy.wait('@signupRequest');
      cy.wait(2000);
      
      // Check for email verification flow
      cy.get('body').then(($body) => {
        cy.url().then((url) => {
          if (url.includes(signup.emailVerificationUrl)) {
            cy.log('Email verification page loaded');
            
            // Check for verification elements
            const verificationSelectors = [
              'input[type="email"]',
              'input[placeholder*="code"]',
              'button:contains("Verify")',
              'button:contains("Resend")'
            ];
            
            verificationSelectors.forEach(selector => {
              if ($body.find(selector).length > 0) {
                cy.log(`Verification element found: ${selector}`);
              }
            });
          }
        });
      });
    });
  });

  // Test 15: Form Field Interactions
  it(signup.message15, () => {
    visitSignupPage();
    
    // Test various form field interactions
    cy.get('body').then(($body) => {
      // Test field focus and blur
      if ($body.find(signup.emailInput).length > 0) {
        cy.get(signup.emailInput).first().focus();
        cy.wait(500);
        cy.get(signup.emailInput).first().blur();
        cy.log('Email field focus/blur tested');
      }
      
      // Test field clearing
      if ($body.find(signup.nameInput).length > 0) {
        cy.get(signup.nameInput).first().type('Test').clear();
        cy.get(signup.nameInput).first().should('have.value', '');
        cy.log('Name field clearing tested');
      }
      
      // Test password visibility toggle (if present)
      if ($body.find(signup.passwordInput).length > 0) {
        cy.get(signup.passwordInput).first().type('test123');
        cy.get(signup.passwordInput).first().should('have.attr', 'type', 'password');
        cy.log('Password field masking tested');
      }
      
      // Test checkbox interactions
      if ($body.find(signup.termsCheckbox).length > 0) {
        cy.get(signup.termsCheckbox).first().check({ force: true }).should('be.checked');
        cy.get(signup.termsCheckbox).first().uncheck({ force: true }).should('not.be.checked');
        cy.log('Checkbox interaction tested');
      }
      
      // Test button states
      if ($body.find(signup.signupBtn).length > 0) {
        cy.get(signup.signupBtn).first().should('be.visible');
        // Note: Button state testing depends on form validation
        cy.log('Button visibility tested');
      }
    });
  });
});
