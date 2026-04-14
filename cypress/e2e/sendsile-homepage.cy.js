import { Sendsile } from '../configuration/project.config.js';

const { homepage } = Sendsile;

// Validate homepage configuration exists
if (!homepage) {
  throw new Error('Homepage configuration not found in project.config.js');
}

// Helper Functions
const mockHomepageApis = () => {
  // Mock API calls that homepage might make
  cy.intercept('GET', '**/api/v1/categories', {
    statusCode: 200,
    body: {
      data: homepage.categories || [
        { id: 1, name: 'Groceries', icon: 'grocery' },
        { id: 2, name: 'Bills', icon: 'bill' },
        { id: 3, name: 'Donations', icon: 'donation' }
      ]
    }
  }).as('getCategories');

  cy.intercept('GET', '**/api/**', {
    statusCode: 200,
    body: {
      data: [],
      message: "API request processed"
    }
  }).as('apiGet');
};

const visitHomepage = () => {
  mockHomepageApis();
  
  cy.visit(homepage.pageUrl, {
    timeout: 30000,
    failOnStatusCode: false,
    onBeforeLoad: (win) => {
      // Clear any existing auth state for homepage testing
      win.localStorage.clear();
      win.sessionStorage.clear();
    }
  });
  
  // Wait for page to load
  cy.wait(2000);
  cy.get('body').should('be.visible');
};

const findAndClickElement = (selectors, description) => {
  return cy.get('body').then(($body) => {
    let elementFound = false;
    
    selectors.forEach(selector => {
      if ($body.find(selector).length > 0 && !elementFound) {
        // Element exists in DOM, use the found element directly
        const $element = $body.find(selector).first();
        
        if ($element.length > 0) {
          if ($element.is(':visible') || $element.css('display') !== 'none') {
            cy.get($element).click({ force: true });
            cy.log(`Found and clicked ${description}: ${selector}`);
            elementFound = true;
          } else {
            cy.log(`Found ${description} but it's hidden: ${selector}`);
            elementFound = true; // Mark as found even if hidden
          }
        } else {
          cy.log(`Selector ${selector} found in DOM but returned empty element`);
        }
      }
    });
    
    if (!elementFound) {
      cy.log(`No ${description} found with provided selectors`);
    }
    
    // Return a resolved promise with the result
    return cy.wrap(elementFound);
  });
};

describe('Sendsile Homepage - Interactive & Functional Tests', () => {
  const homepageUrl = homepage.pageUrl;

  beforeEach(() => {
    // Clear cookies and local storage before each test
    cy.clearCookies();
    cy.clearLocalStorage();
    cy.viewport(1440, 900); // Set consistent viewport
  });

  // Test 1: Page Load and Basic Navigation
  it(homepage.message01, () => {
    visitHomepage();
    
    // Verify page loaded
    cy.url().should('include', 'sendsile.com');
    cy.get('body').should('be.visible');
    
    // Try to find and click login button
    const loginSelectors = homepage.loginSelectors;
    
    findAndClickElement(loginSelectors, 'login button').then((loginFound) => {
      if (loginFound) {
        cy.wait(2000);
        
        // Verify navigation to login page
        cy.url().then((url) => {
          if (url.includes('/login') || url.includes('/signin')) {
            cy.log('Successfully navigated to login page');
            cy.url().should('match', /(login|signin)/);
          } else {
            cy.log('Login button clicked but did not navigate to login page');
          }
        });
      } else {
        // Try mobile menu approach
        cy.log('Login not found, trying mobile menu approach');
        
        const mobileMenuSelectors = [
          '.mobile-menu-toggle',
          '.hamburger',
          '.menu-toggle',
          '.sidebar-toggle'
        ];
        
        findAndClickElement(mobileMenuSelectors, 'mobile menu toggle').then((menuOpened) => {
          if (menuOpened) {
            cy.wait(1000);
            
            // Look for login in mobile menu
            findAndClickElement(loginSelectors, 'login button in mobile menu').then((mobileLoginFound) => {
              if (mobileLoginFound) {
                cy.wait(2000);
                cy.url().should('match', /(login|signin)/);
              } else {
                cy.log('Login not found in mobile menu either');
              }
            });
          } else {
            cy.log('Mobile menu not found - login may not be available on homepage');
          }
        });
      }
    });
  });

  // Test 2: Signup Navigation
  it(homepage.message02, () => {
    visitHomepage();
    
    // Try to find and click signup button
    const signupSelectors = homepage.signupSelectors;
    
    findAndClickElement(signupSelectors, 'signup button').then((signupFound) => {
      if (signupFound) {
        cy.wait(2000);
        
        // Verify navigation away from homepage
        cy.url().then((url) => {
          if (url !== homepageUrl) {
            cy.log('Successfully navigated away from homepage');
            cy.url().should('not.equal', homepageUrl);
          } else {
            cy.log('Signup button clicked but did not navigate away from homepage');
          }
        });
      } else {
        cy.log('No signup button found on homepage - this may be expected');
      }
    });
  });

  // Test 3: Navigation Menu Links
  it(homepage.message03, () => {
    visitHomepage();
    
    // Find and click navigation links with re-query to avoid DOM detachment
    cy.get(homepage.navigationLinks).then(($links) => {
      if ($links.length > 0) {
        // Test first few links
        const linksToTest = Math.min(3, $links.length);
        
        for (let i = 0; i < linksToTest; i++) {
          visitHomepage(); // Ensure we're on homepage
          cy.wait(1000);
          
          // Re-query links each time to avoid DOM detachment
          cy.get('nav a, .navbar a, header a').eq(i).then(($link) => {
            const href = $link.attr('href');
            if (href && !href.includes('#') && !href.startsWith('mailto') && !href.startsWith('tel')) {
              cy.get($link).click({ force: true });
              cy.wait(1000);
              cy.log(`Clicked navigation link: ${href}`);
            }
          });
        }
      } else {
        cy.log('No navigation links found');
      }
    });
  });

  // Test 4: Hero Section CTA Buttons
  it(homepage.message04, () => {
    visitHomepage();
    
    // Find hero section and test buttons
    const heroSelectors = homepage.heroSelectors;
    
    cy.get('body').then(($body) => {
      let heroFound = false;
      
      heroSelectors.forEach(selector => {
        if ($body.find(selector).length > 0 && !heroFound) {
          cy.log(`Found hero section: ${selector}`);
          
          cy.get(selector).find('button, a').then(($buttons) => {
            if ($buttons.length > 0) {
              // Test first few buttons
              const buttonsToTest = Math.min(2, $buttons.length);
              
              for (let i = 0; i < buttonsToTest; i++) {
                visitHomepage(); // Ensure we're on homepage
                cy.wait(1000);
                
                // Re-query buttons each time
                cy.get(selector).find('button, a').eq(i).then(($btn) => {
                  cy.get($btn).click({ force: true });
                  cy.wait(1000);
                  cy.log(`Clicked hero button: ${$btn.text().trim()}`);
                });
              }
              
              heroFound = true;
            } else {
              cy.log(`No buttons found in hero section: ${selector}`);
            }
          });
        }
      });
      
      if (!heroFound) {
        cy.log('No hero section found');
      }
    });
  });

  // Test 5: Search Functionality
  it(homepage.message05, () => {
    visitHomepage();
    
    // Find search input and test it
    const searchSelectors = homepage.searchSelectors;
    
    cy.get('body').then(($body) => {
      let searchFound = false;
      
      searchSelectors.forEach(selector => {
        if ($body.find(selector).length > 0 && !searchFound) {
          cy.get(selector).first().type('test search', { force: true });
          cy.wait(500);
          cy.log(`Typed in search: ${selector}`);
          
          // Try to submit search if there's a button
          const searchBtnSelectors = homepage.searchBtnSelectors;
          
          findAndClickElement(searchBtnSelectors, 'search submit button').then((btnFound) => {
            if (btnFound) {
              cy.wait(1000);
              cy.log('Search form submitted');
            }
          });
          
          searchFound = true;
        }
      });
      
      if (!searchFound) {
        cy.log('No search input found on homepage');
      }
    });
  });

  // Test 6: Footer Links Interaction
  it(homepage.message06, () => {
    visitHomepage();
    cy.scrollTo('bottom');
    
    // Find and click footer links with re-query to avoid DOM detachment
    cy.get(homepage.footerLinks).then(($links) => {
      if ($links.length > 0) {
        // Test first few links
        const linksToTest = Math.min(3, $links.length);
        
        for (let i = 0; i < linksToTest; i++) {
          visitHomepage(); // Ensure we're on homepage
          cy.scrollTo('bottom');
          cy.wait(1000);
          
          // Re-query links each time to avoid DOM detachment
          cy.get(homepage.footerLinks).eq(i).then(($link) => {
            const href = $link.attr('href');
            if (href && !href.includes('#') && !href.startsWith('mailto')) {
              cy.get($link).click({ force: true });
              cy.wait(1000);
              cy.log(`Clicked footer link: ${href}`);
            }
          });
        }
      } else {
        cy.log('No footer links found');
      }
    });
  });

  // Test 7: Social Media Links
  it('should interact with social media links', () => {
    cy.visit(homepageUrl);
    
    // Find social media links
    cy.get('body').then(($body) => {
      const socialSelectors = [
        'a[href*="facebook.com"]',
        'a[href*="twitter.com"]',
        'a[href*="linkedin.com"]',
        'a[href*="instagram.com"]',
        '.social-icons a',
        '.social-media a'
      ];
      
      socialSelectors.forEach(selector => {
        if ($body.find(selector).length > 0) {
          cy.get(selector).first().should('have.attr', 'href');
          cy.log(`Found social link: ${selector}`);
        }
      });
    });
  });

  // Test 8: Mobile Menu Interaction
  it('should interact with mobile navigation menu', () => {
    cy.viewport('iphone-6');
    cy.visit(homepageUrl);
    
    // Look for mobile menu toggle
    cy.get('body').then(($body) => {
      const mobileMenuSelectors = [
        '.mobile-menu-toggle',
        '.hamburger',
        '.menu-toggle',
        '.sidebar-toggle'
      ];
      
      mobileMenuSelectors.forEach(selector => {
        if ($body.find(selector).length > 0) {
          cy.get(selector).first().click({ force: true });
          cy.wait(500);
          cy.log(`Opened mobile menu: ${selector}`);
          
          // Try to click a menu item
          const $menuItems = $body.find('.mobile-menu a, .sidebar a');
          if ($menuItems.length > 0) {
            cy.get($menuItems[0]).click({ force: true });
            cy.wait(1000);
          }
          return false;
        }
      });
    });
  });

  // Test 9: Form Interactions
  it('should interact with homepage forms', () => {
    cy.visit(homepageUrl);
    
    // Find and interact with forms
    cy.get('body').then(($body) => {
      const $forms = $body.find('form');
      if ($forms.length > 0) {
        cy.get('form').each(($form, index) => {
          if (index < 2) { // Test first 2 forms
            // Fill form inputs
            cy.wrap($form).find('input[type="text"], input[type="email"]').each(($input) => {
              cy.wrap($input).type('test input');
            });
            
            // Try to submit form
            cy.wrap($form).find('button[type="submit"], input[type="submit"]').then(($submitButtons) => {
              $submitButtons.each((index, $btn) => {
                cy.get($btn).click({ force: true });
                cy.wait(1000);
              });
            });
            
            cy.log(`Interacted with form ${index + 1}`);
          }
        });
      } else {
        cy.log('No forms found on homepage');
      }
    });
  });

  // Test 10: Dropdown and Select Interactions
  it('should interact with dropdowns and selects', () => {
    cy.visit(homepageUrl);
    
    // Find and interact with dropdowns
    cy.get('body').then(($body) => {
      const $dropdowns = $body.find('select, .dropdown, .select-field');
      if ($dropdowns.length > 0) {
        cy.get('select, .dropdown, .select-field').each(($dropdown, index) => {
          if (index < 3) { // Test first 3 dropdowns
            if ($dropdown.prop('tagName') === 'SELECT') {
              cy.wrap($dropdown).select(0);
            } else {
              cy.get($dropdown).click({ force: true });
              cy.wait(500);
            }
            cy.log(`Interacted with dropdown ${index + 1}`);
          }
        });
      } else {
        cy.log('No dropdown elements found on homepage');
      }
    });
  });

  // Test 11: Image and Link Interactions
  it('should click on linked images', () => {
    cy.visit(homepageUrl);
    
    // Find clickable images
    cy.get('body').then(($body) => {
      const $linkedImages = $body.find('a img');
      if ($linkedImages.length > 0) {
        cy.get('a img').then(($images) => {
          const $visibleImages = $images.slice(0, 3); // Get first 3 linked images
          $visibleImages.each((index, $img) => {
            cy.get($img.parentElement).click({ force: true });
            cy.wait(1000);
            cy.log(`Clicked linked image ${index + 1}`);
            cy.visit(homepageUrl);
          });
        });
      } else {
        cy.log('No linked images found on homepage');
      }
    });
  });

  // Test 12: Tab and Accordion Interactions
  it('should interact with tabs and accordions', () => {
    cy.visit(homepageUrl);
    
    // Find and interact with tabs
    cy.get('body').then(($body) => {
      const $tabs = $body.find('.tab, .tab-button, [role="tab"]');
      if ($tabs.length > 0) {
        cy.get('.tab, .tab-button, [role="tab"]').then(($tabElements) => {
          const $visibleTabs = $tabElements.slice(0, 3); // Get first 3 tabs
          $visibleTabs.each((index, $tab) => {
            cy.get($tab).click({ force: true });
            cy.wait(500);
            cy.log(`Clicked tab ${index + 1}`);
          });
        });
      } else {
        cy.log('No tab elements found on homepage');
      }
    });
    
    // Find and interact with accordions
    cy.get('body').then(($body) => {
      const $accordions = $body.find('.accordion-header, .accordion-toggle');
      if ($accordions.length > 0) {
        cy.get('.accordion-header, .accordion-toggle').then(($accordionElements) => {
          const $visibleAccordions = $accordionElements.slice(0, 2); // Get first 2 accordions
          $visibleAccordions.each((index, $accordion) => {
            cy.get($accordion).click({ force: true });
            cy.wait(500);
            cy.log(`Clicked accordion ${index + 1}`);
          });
        });
      } else {
        cy.log('No accordion elements found on homepage');
      }
    });
  });

  // Test 13: Modal and Popup Interactions
  it('should interact with modals and popups', () => {
    cy.visit(homepageUrl);
    
    // Look for modal triggers
    cy.get('body').then(($body) => {
      const modalSelectors = [
        '[data-toggle="modal"]',
        '.modal-trigger',
        '.popup-trigger',
        'button:contains("Contact")',
        'button:contains("Subscribe")'
      ];
      
      modalSelectors.forEach(selector => {
        if ($body.find(selector).length > 0) {
          cy.get(selector).first().click({ force: true });
          cy.wait(1000);
          
          // Try to close modal if it opens
          const $closeBtn = $body.find('.modal-close, .close, button:contains("Close")');
          if ($closeBtn.length > 0) {
            cy.get($closeBtn[0]).click({ force: true });
            cy.wait(500);
          }
          
          cy.log(`Interacted with modal trigger: ${selector}`);
          return false;
        }
      });
    });
  });

  // Test 14: Newsletter Signup
  it('should interact with newsletter signup', () => {
    cy.visit(homepageUrl);
    
    // Find newsletter form
    cy.get('body').then(($body) => {
      const newsletterSelectors = [
        '.newsletter-form',
        '.subscribe-form',
        'input[placeholder*="email"]',
        'input[name*="newsletter"]'
      ];
      
      newsletterSelectors.forEach(selector => {
        if ($body.find(selector).length > 0) {
          // Find email input and submit button
          const $emailInput = $body.find('input[type="email"], input[placeholder*="email"]').first();
          const $submitBtn = $body.find('button:contains("Subscribe"), button:contains("Sign Up")').first();
          
          if ($emailInput.length > 0) {
            cy.wrap($emailInput).type('test@example.com');
          }
          
          if ($submitBtn.length > 0) {
            cy.get($submitBtn[0]).click({ force: true });
            cy.wait(1000);
            cy.log('Submitted newsletter form');
          }
          
          return false;
        }
      });
    });
  });

  // Test 15: Responsive Interaction Testing
  it('should test interactions across different viewports', () => {
    const viewports = ['iphone-6', 'ipad-2', [1280, 720]];
    
    viewports.forEach(viewport => {
      if (Array.isArray(viewport)) {
        cy.viewport(viewport[0], viewport[1]);
      } else {
        cy.viewport(viewport);
      }
      
      cy.visit(homepageUrl);
      
      // Test basic interactions in each viewport
      cy.get('body').then(($body) => {
        // Test a button click
        const $button = $body.find('button, a').first();
        if ($button.length > 0) {
          cy.get($button[0]).click({ force: true });
          cy.wait(500);
          cy.visit(homepageUrl);
        }
      });
      
      cy.log(`Tested interactions in viewport: ${Array.isArray(viewport) ? `${viewport[0]}x${viewport[1]}` : viewport}`);
    });
  });
});
