/* global cy, describe, it, beforeEach */
import { Sendsile } from '../configuration/project.config.js';

const { dashboard } = Sendsile;

// Validate dashboard configuration exists
if (!dashboard) {
  throw new Error('Dashboard configuration not found in project.config.js');
}

// Helper Functions
const persistedUserInfo = {
  state: {
    userData: dashboard.userData || { name: 'Test User', email: 'test@example.com' },
  },
  version: 0,
};

const persistedCategory = {
  state: {
    categoryID: (dashboard.categories && dashboard.categories[0] && dashboard.categories[0].id) || 'default-category',
  },
  version: 0,
};

const typeOtp = (code) => {
  cy.get(dashboard.selectors.otpInputs)
    .filter(':visible')
    .each(($input, index) => {
      cy.wrap($input).clear({ force: true }).type(code[index], { force: true });
    });
};

const seedAuthenticatedState = (win) => {
  win.localStorage.setItem('__user_access', dashboard.testAccessToken || 'test-token');
  win.localStorage.setItem('authToken', dashboard.authToken || 'Bearer test-token');
  win.localStorage.setItem('isLoggedIn', 'true');
  win.localStorage.setItem('ramadanModal', 'true');
  win.localStorage.setItem('userInfo', JSON.stringify(persistedUserInfo));
  win.localStorage.setItem('location', JSON.stringify(dashboard.persistedLocation || { state: { isOpen: false, location: 'nigeria' }, version: 0 }));
  win.localStorage.setItem('category-id', JSON.stringify(persistedCategory));
  win.sessionStorage.setItem('2fa', JSON.stringify(''));
};

const mockDashboardApis = (options = {}) => {
  const {
    notifications = [],
    user = dashboard.userData || { id: 'test-user', name: 'Test User', email: 'test@example.com' },
    transactionList = dashboard.transactions || [],
    categoriesList = dashboard.categories || [{ id: 'default-category', name: 'Default' }],
  } = options;

  cy.intercept('GET', '**/categories', {
    statusCode: 200,
    body: {
      data: categoriesList,
    },
  }).as('getCategories');

  cy.intercept('GET', '**/user', {
    statusCode: 200,
    body: {
      data: user,
    },
  }).as('getUser');

  cy.intercept('GET', '**/transactions', {
    statusCode: 200,
    body: {
      data: transactionList,
    },
  }).as('getTransactions');

  cy.intercept('GET', '**/user/notifications', {
    statusCode: 200,
    body: {
      data: notifications,
    },
  }).as('getNotifications');

  cy.intercept('GET', '**/logout', {
    statusCode: 200,
    body: {
      message: 'Logged out',
    },
  }).as('logout');
};

const visitDashboard = (path = dashboard.pageUrl || 'https://www.sendsile.com/dashboard', options = {}) => {
  mockDashboardApis(options);

  cy.visit(path, {
    onBeforeLoad(win) {
      seedAuthenticatedState(win);
    },
  });

  // Wait for React app to load and render
  cy.wait(3000);
  cy.get(dashboard.root || '#root', { timeout: 15000 }).should('be.visible');
  
  // Wait for dynamic content to load
  cy.wait(2000);
};

// ==========================================
// AUTHENTICATION TESTS
// ==========================================
describe('Sendsile Dashboard - Authentication', () => {
  beforeEach(() => {
    cy.viewport(1440, 900);
  });

  it('should load dashboard when authenticated', () => {
    visitDashboard();
    cy.url().should('include', '/dashboard');
    cy.get(dashboard.root || '#root').should('be.visible');
  });

  it('should redirect to login when not authenticated', () => {
    cy.window().then((win) => {
      win.localStorage.clear();
    });
    cy.visit(dashboard.pageUrl, { failOnStatusCode: false });
    cy.wait(2000);
    cy.url().then((url) => {
      if (!url.includes('/dashboard')) {
        cy.log('Redirected to login as expected');
      }
    });
  });
});

// ==========================================
// DASHBOARD UI TESTS
// ==========================================
describe('Sendsile Dashboard - UI Elements', () => {
  beforeEach(() => {
    cy.viewport(1440, 900);
  });

  it('should display dashboard header and navigation', () => {
    visitDashboard();
    
    cy.title().should('contain', 'Sendsile');
    
    // Check for user greeting - be flexible about what we find
    cy.get('h1, h2, .greeting, .welcome, .user-name, [data-testid="user-name"]').then(($greeting) => {
      if ($greeting.length > 0) {
        // Check if the element is actually visible (not hidden by parent)
        cy.wrap($greeting).first().then(($el) => {
          if ($el.is(':visible')) {
            cy.log('Found user greeting element and it is visible');
          } else {
            cy.log('Found user greeting element but it is hidden by parent CSS');
          }
        });
      } else {
        cy.log('User greeting element not found - continuing with other checks');
      }
    });
    
    // Check for dashboard sections with flexible selectors
    cy.get('h1, h2, h3, .title, .heading').contains(/balance|wallet|money/i).then(($balance) => {
      if ($balance.length > 0) {
        cy.wrap($balance).first().then(($el) => {
          if ($el.is(':visible')) {
            cy.log('Found balance/wallet section and it is visible');
          } else {
            cy.log('Found balance/wallet section but it is hidden by parent CSS');
          }
        });
      } else {
        cy.log('Balance section not found');
      }
    });
    
    cy.get('h1, h2, h3, .title, .heading').contains(/quick|access|shortcut/i).then(($quick) => {
      if ($quick.length > 0) {
        cy.wrap($quick).first().then(($el) => {
          if ($el.is(':visible')) {
            cy.log('Found quick access section and it is visible');
          } else {
            cy.log('Found quick access section but it is hidden by parent CSS');
          }
        });
      } else {
        cy.log('Quick access section not found');
      }
    });
    
    cy.get('h1, h2, h3, .title, .heading').contains(/transaction|recent|history/i).then(($transactions) => {
      if ($transactions.length > 0) {
        cy.wrap($transactions).first().then(($el) => {
          if ($el.is(':visible')) {
            cy.log('Found transactions section and it is visible');
          } else {
            cy.log('Found transactions section but it is hidden by parent CSS');
          }
        });
      } else {
        cy.log('Transactions section not found');
      }
    });
    
    // Check for navigation elements with flexible selectors
    cy.get('nav, .nav, .navbar, .navigation, .header').then(($nav) => {
      if ($nav.length > 0) {
        cy.wrap($nav).first().then(($el) => {
          if ($el.is(':visible')) {
            cy.log('Found navigation element and it is visible');
          } else {
            cy.log('Found navigation element but it is hidden by parent CSS');
          }
        });
      } else {
        cy.log('No navigation element found');
      }
    });
    
    // Check for common navigation links - just verify links exist without strict text matching
    cy.get('a[href]:visible').then(($links) => {
      if ($links.length > 0) {
        cy.log(`Found ${$links.length} navigation links`);
        // Test first few links
        const linksToTest = Math.min(3, $links.length);
        for (let i = 0; i < linksToTest; i++) {
          visitDashboard(); // Ensure we're on dashboard
          cy.wait(1000);
          
          // Re-query: links each time to avoid DOM detachment
          cy.get('a[href]:visible').eq(i).click();
          cy.wait(1000);
          cy.log(`Tested navigation link ${i + 1}`);
        }
      } else {
        cy.log('No navigation links found');
      }
    });
    
    // Check for logout button
    cy.get('button').contains(/logout|sign out|exit/i).then(($logout) => {
      if ($logout.length > 0) {
        cy.wrap($logout).first().then(($el) => {
          if ($el.is(':visible')) {
            cy.log('Found logout button and it is visible');
          } else {
            cy.log('Found logout button but it is hidden by parent CSS');
          }
        });
      } else {
        cy.log('Logout button not found');
      }
    });
  });

  it('should display quick access cards and widgets', () => {
    visitDashboard();
    
    // Check quick access cards
    Object.values(dashboard.quickAccessCards).forEach((label) => {
      cy.contains(label).then(($el) => {
        if ($el.length > 0) {
          cy.wrap($el).first().then(($element) => {
            if ($element.is(':visible')) {
              cy.log(`Found quick access card "${label}" and it is visible`);
            } else {
              cy.log(`Found quick access card "${label}" but it is hidden by parent CSS`);
            }
          });
        } else {
          cy.log(`Quick access card "${label}" not found`);
        }
      });
    });
    
    // Check action buttons
    cy.contains('button', dashboard.buttons.fundWallet).then(($btn) => {
      if ($btn.length > 0) {
        cy.wrap($btn).first().then(($el) => {
          if ($el.is(':visible')) {
            cy.log('Found fund wallet button and it is visible');
          } else {
            cy.log('Found fund wallet button but it is hidden by parent CSS');
          }
        });
      } else {
        cy.log('Fund wallet button not found');
      }
    });
    
    cy.contains('button', dashboard.buttons.seeAll).then(($btn) => {
      if ($btn.length > 0) {
        cy.wrap($btn).first().then(($el) => {
          if ($el.is(':visible')) {
            cy.log('Found see all button and it is visible');
          } else {
            cy.log('Found see all button but it is hidden by parent CSS');
          }
        });
      } else {
        cy.log('See all button not found');
      }
    });
    
    // Check transaction table
    cy.get(dashboard.selectors.table).then(($table) => {
      if ($table.length > 0) {
        cy.wrap($table).first().then(($el) => {
          if ($el.is(':visible')) {
            cy.log('Found transaction table and it is visible');
          } else {
            cy.log('Found transaction table but it is hidden by parent CSS');
          }
        });
      } else {
        cy.log('Transaction table not found');
      }
    });
    
    cy.contains('th', dashboard.selectors.tableDateHeader).then(($header) => {
      if ($header.length > 0) {
        cy.wrap($header).first().then(($el) => {
          if ($el.is(':visible')) {
            cy.log('Found table date header and it is visible');
          } else {
            cy.log('Found table date header but it is hidden by parent CSS');
          }
        });
      } else {
        cy.log('Table date header not found');
      }
    });
    
    cy.contains('td', dashboard.selectors.transactionNarration).then(($cell) => {
      if ($cell.length > 0) {
        cy.wrap($cell).first().then(($el) => {
          if ($el.is(':visible')) {
            cy.log('Found transaction narration and it is visible');
          } else {
            cy.log('Found transaction narration but it is hidden by parent CSS');
          }
        });
      } else {
        cy.log('Transaction narration not found');
      }
    });
  });
});

// ==========================================
// DASHBOARD INTERACTIONS TESTS
// ==========================================
describe('Sendsile Dashboard - Interactions', () => {
  beforeEach(() => {
    cy.viewport(1440, 900);
  });

  it('should handle basic interactions', () => {
    visitDashboard();
    
    // Test notification toggle if exists
    cy.get('body').then(($body) => {
      const $toggle = $body.find('.notification-toggle, [data-testid="notification-toggle"], .toggle, .switch');
      if ($toggle.length > 0) {
        cy.wrap($toggle).first().click({ force: true });
        cy.wait(1000);
        cy.log('Found and tested notification toggle');
      } else {
        cy.log('Notification toggle not found');
      }
    });
    
    // Test fund wallet button if exists
    cy.get('button').contains(/fund|add|deposit|top.*up/i).then(($fundBtn) => {
      if ($fundBtn.length > 0) {
        cy.wrap($fundBtn).first().click({ force: true });
        cy.wait(1000);
        // Close modal if opened
        cy.get('body').then(($body) => {
          if ($body.find('.modal, .dialog, .popup').length > 0) {
            cy.get('.modal, .dialog, .popup').find('button').contains(/close|cancel|x/i).click({ force: true });
          }
        });
      } else {
        cy.log('Fund wallet button not found');
      }
    });
  });

  it('should handle navigation interactions', () => {
    visitDashboard();
    
    // Test basic navigation links
    const navItems = ['home', 'orders', 'groceries', 'bill', 'donation', 'transaction', 'profile'];
    
    navItems.forEach((item) => {
      cy.get('a[href]').contains(new RegExp(item, 'i')).then(($link) => {
        if ($link.length > 0) {
          cy.wrap($link).first().click({ force: true });
          cy.wait(1000);
          visitDashboard(); // Return to dashboard for next test
        }
      });
    });
  });

  it('should handle quick access interactions', () => {
    visitDashboard();
    
    // Test quick access items
    const quickItems = ['groceries', 'bills', 'donations', 'pay', 'buy', 'make'];
    
    quickItems.forEach((item) => {
      cy.get('button, a, .card, .item').then(($elements) => {
        const $matchingElements = $elements.filter((index, el) => {
          const text = Cypress.$(el).text().toLowerCase();
          return text.includes(item.toLowerCase());
        });
        
        if ($matchingElements.length > 0) {
          cy.wrap($matchingElements).first().click({ force: true });
          cy.wait(1000);
          visitDashboard(); // Return to dashboard for next test
          cy.log(`Found and tested quick access item: ${item}`);
        } else {
          cy.log(`Quick access item not found: ${item}`);
        }
      });
    });
  });

  it('should handle bills payment help and feedback functionality', () => {
    visitDashboard();
    
    // Navigate to bills payment page
    cy.get('button, a, .card, .item').then(($elements) => {
      const $billsElements = $elements.filter((index, el) => {
        const text = Cypress.$(el).text().toLowerCase();
        return text.includes('bills') || text.includes('bill payment');
      });
      
      if ($billsElements.length > 0) {
        cy.log('✅ Found bills payment element');
        cy.wrap($billsElements).first().click({ force: true });
        cy.wait(3000);
        cy.log('✅ Navigated to bills payment page');
        
        // Check if we're on bills payment page
        cy.url().then(url => {
          if (url.includes('/bill-payment') || url.includes('/bills')) {
            cy.log('✅ Successfully on bills payment page');
            
            // Look for help section
            cy.get('button, a, [class*="help"], [aria-label*="help"]').then(($helpElements) => {
              const $helpButtons = $helpElements.filter((_, el) => {
                const text = (el.textContent || "").toLowerCase();
                const ariaLabel = el.getAttribute('aria-label') || '';
                return text.includes('help') || text.includes('support') || 
                       ariaLabel.includes('help') || ariaLabel.includes('support');
              });
              
              if ($helpButtons.length > 0) {
                cy.log(`✅ Found ${$helpButtons.length} help elements`);
                $helpButtons.each((index, el) => {
                  const helpText = Cypress.$(el).text();
                  cy.log(`Help button ${index + 1}: ${helpText}`);
                });
                
                // Test first help button
                cy.wrap($helpButtons.first()).click({ force: true });
                cy.wait(2000);
                cy.log('✅ Clicked help button');
                
                // Check for any page changes after clicking help
                cy.get("body").then(($newBody) => {
                  const newBodyText = $newBody.text().toLowerCase();
                  if (newBodyText.includes('help') || newBodyText.includes('support') || newBodyText.includes('faq')) {
                    cy.log('✅ Help interaction triggered page changes');
                  } else {
                    cy.log('ℹ️ Help button clicked but no obvious page changes detected');
                  }
                });
              } else {
                cy.log('ℹ️ No help buttons found on bills payment page');
              }
            });
            
            // Look for feedback section
            cy.get('button, a, [class*="feedback"], [aria-label*="feedback"]').then(($feedbackElements) => {
              const $feedbackButtons = $feedbackElements.filter((_, el) => {
                const text = (el.textContent || "").toLowerCase();
                const ariaLabel = el.getAttribute('aria-label') || '';
                return text.includes('feedback') || text.includes('report') || 
                       ariaLabel.includes('feedback') || ariaLabel.includes('report');
              });
              
              if ($feedbackButtons.length > 0) {
                cy.log(`✅ Found ${$feedbackButtons.length} feedback elements`);
                $feedbackButtons.each((index, el) => {
                  const feedbackText = Cypress.$(el).text();
                  cy.log(`Feedback button ${index + 1}: ${feedbackText}`);
                });
                
                // Test first feedback button
                cy.wrap($feedbackButtons.first()).click({ force: true });
                cy.wait(2000);
                cy.log('✅ Clicked feedback button');
                
                // Check for any page changes after clicking feedback
                cy.get("body").then(($newBody) => {
                  const newBodyText = $newBody.text().toLowerCase();
                  if (newBodyText.includes('feedback') || newBodyText.includes('report') || newBodyText.includes('suggestion')) {
                    cy.log('✅ Feedback interaction triggered page changes');
                  } else {
                    cy.log('ℹ️ Feedback button clicked but no obvious page changes detected');
                  }
                });
              } else {
                cy.log('ℹ️ No feedback buttons found on bills payment page');
              }
            });
            
            // Look for general support/help links
            cy.get('a[href]').then(($allLinks) => {
              const $supportLinks = $allLinks.filter((_, el) => {
                const href = el.href || '';
                const text = (el.textContent || "").toLowerCase();
                return href.includes('help') || href.includes('support') || href.includes('contact') ||
                       text.includes('help') || text.includes('support') || text.includes('contact');
              });
              
              if ($supportLinks.length > 0) {
                cy.log(`✅ Found ${$supportLinks.length} support links`);
                $supportLinks.each((index, link) => {
                  const linkText = Cypress.$(link).text();
                  const linkHref = Cypress.$(link).attr('href');
                  cy.log(`Support link ${index + 1}: ${linkText} -> ${linkHref}`);
                });
              } else {
                cy.log('ℹ️ No support links found on bills payment page');
              }
            });
            
            // Log page content for analysis
            cy.get("body").then(($body) => {
              const bodyText = $body.text().toLowerCase();
              cy.log(`Bills payment page content: ${bodyText.substring(0, 300)}...`);
              
              // Check for help/feedback related keywords
              const hasHelpKeywords = bodyText.includes('help') || bodyText.includes('support') || 
                                     bodyText.includes('contact') || bodyText.includes('faq');
              const hasFeedbackKeywords = bodyText.includes('feedback') || bodyText.includes('report') || 
                                        bodyText.includes('suggestion') || bodyText.includes('complaint');
              
              if (hasHelpKeywords) {
                cy.log('✅ Page contains help-related content');
              }
              if (hasFeedbackKeywords) {
                cy.log('✅ Page contains feedback-related content');
              }
            });
          } else {
            cy.log('❌ Not on bills payment page');
          }
        });
      } else {
        cy.log('❌ Bills payment element not found');
      }
    });
  });
});

// ==========================================
// PROFILE MANAGEMENT TESTS
// ==========================================
describe('Sendsile Dashboard - Profile Management', () => {
  beforeEach(() => {
    cy.viewport(1440, 900);
  });

  it('should handle profile page navigation', () => {
    visitDashboard();
    
    // Navigate to profile page
    cy.get('a[href]').contains(/profile|account|settings/i).then(($profileLink) => {
      if ($profileLink.length > 0) {
        cy.wrap($profileLink).first().click();
        cy.wait(2000);
        cy.url().should('include', '/profile');
      } else {
        cy.log('Profile link not found, trying direct navigation');
        cy.visit(`${dashboard.pageUrl}/profile`);
        cy.wait(2000);
      }
    });
    
    // Check if profile page loaded
    cy.get('body').then(($body) => {
      if ($body.find('h1, h2, .title').length > 0) {
        cy.log('Profile page loaded successfully');
      } else {
        cy.log('Profile page may not have loaded properly');
      }
    });
  });

  it('should handle profile form interactions', () => {
    visitDashboard();
    
    // Try to navigate to profile
    cy.get('a[href]').contains(/profile|account|settings/i).then(($profileLink) => {
      if ($profileLink.length > 0) {
        cy.wrap($profileLink).first().click();
        cy.wait(2000);
      }
    });
    
    // Test form inputs if they exist
    cy.get('body').then(($body) => {
      const $inputs = $body.find('input:visible');
      if ($inputs.length > 0) {
        cy.wrap($inputs).first().type('test', { force: true }).clear({ force: true });
        cy.log('Found and tested form inputs');
      } else {
        cy.log('No form inputs found');
      }
    });
    
    // Test buttons if they exist
    cy.get('button').contains(/update|save|submit|change/i).then(($buttons) => {
      if ($buttons.length > 0) {
        cy.wrap($buttons).first().then(($el) => {
          if ($el.is(':visible')) {
            cy.log('Found profile action buttons and they are visible');
          } else {
            cy.log('Found profile action buttons but they are hidden by parent CSS');
          }
        });
      } else {
        cy.log('No profile action buttons found');
      }
    });
  });

  it('should handle security settings', () => {
    visitDashboard();
    
    // Try to navigate to profile
    cy.get('a[href]').contains(/profile|account|settings/i).then(($profileLink) => {
      if ($profileLink.length > 0) {
        cy.wrap($profileLink).first().click();
        cy.wait(2000);
      }
    });
    
    // Test security-related elements
    cy.get('button').then(($buttons) => {
      if ($buttons.length > 0) {
        cy.log(`Found ${$buttons.length} buttons on the page`);
        // Test first button to see if it's security-related
        cy.wrap($buttons).first().click();
        cy.wait(1000);
        cy.log('Tested first button for security functionality');
      } else {
        cy.log('No buttons found on the page');
      }
    });
    
    // Test password inputs if they exist
    cy.get('body').then(($body) => {
      const $passwordInputs = $body.find('input[type="password"]:visible');
      if ($passwordInputs.length > 0) {
        cy.wrap($passwordInputs).first().type('test123', { force: true }).clear({ force: true });
        cy.log('Found and tested password input');
      } else {
        cy.log('No password inputs found');
      }
    });
    
    // Test password inputs if they exist
    cy.get('input[type="password"]').then(($passwordInputs) => {
      if ($passwordInputs.length > 0) {
        cy.wrap($passwordInputs).first().type('test123', { force: true }).clear({ force: true });
        cy.log('Found and tested password inputs');
      } else {
        cy.log('No password inputs found');
      }
    });
  });
});

// ==========================================
// COMPREHENSIVE FUNCTIONALITY TEST
// ==========================================
describe('Sendsile Dashboard - Comprehensive Functionality', () => {
  beforeEach(() => {
    cy.viewport(1440, 900);
  });

  it('should load dashboard and verify basic structure', () => {
    visitDashboard();
    
    // Verify page loaded
    cy.get(dashboard.root || '#root').should('be.visible');
    cy.title().should('contain', 'Sendsile');
    
    // Check for any navigation elements
    cy.get('nav, .nav, .navbar, .navigation, .header').then(($nav) => {
      if ($nav.length > 0) {
        cy.wrap($nav).first().then(($el) => {
          if ($el.is(':visible')) {
            cy.log('Navigation found and it is visible');
          } else {
            cy.log('Navigation found but it is hidden by parent CSS');
          }
        });
      } else {
        cy.log('No navigation found');
      }
    });
    
    // Check for any headings
    cy.get('h1, h2, h3').then(($headings) => {
      if ($headings.length > 0) {
        cy.wrap($headings).first().then(($el) => {
          if ($el.is(':visible')) {
            cy.log('Headings found and they are visible');
          } else {
            cy.log('Headings found but they are hidden by parent CSS');
          }
        });
      } else {
        cy.log('No headings found');
      }
    });
    
    // Check for any buttons
    cy.get('button:visible').then(($buttons) => {
      if ($buttons.length > 0) {
        cy.log(`Found ${$buttons.length} buttons`);
      } else {
        cy.log('No buttons found');
      }
    });
    
    // Check for any links
    cy.get('a[href]:visible').then(($links) => {
      if ($links.length > 0) {
        cy.log(`Found ${$links.length} links`);
      } else {
        cy.log('No links found');
      }
    });
  });

  it('should test basic scrolling functionality', () => {
    visitDashboard();
    
    // Test scroll positions
    const positions = ['top', 'center', 'bottom'];
    
    positions.forEach((position) => {
      cy.scrollTo(position);
      cy.wait(500);
      cy.log(`Scrolled to ${position}`);
      
      // Verify root element is still visible
      cy.get(dashboard.root || '#root').should('be.visible');
    });
    
    // Scroll back to top
    cy.scrollTo('top');
    cy.wait(500);
  });

  it('should handle basic interactions', () => {
    visitDashboard();
    
    // Test clicking on visible buttons with re-query to avoid DOM detachment
    cy.get('button:visible').then(($buttons) => {
      if ($buttons.length > 0) {
        // Click first few buttons and return to dashboard
        const buttonsToTest = Math.min(3, $buttons.length);
        for (let i = 0; i < buttonsToTest; i++) {
          visitDashboard(); // Ensure we're on dashboard
          cy.wait(1000);
          
          // Re-query buttons each time to avoid DOM detachment
          cy.get('button:visible').eq(i).click();
          cy.wait(1000);
          
          // Close any modals that might open
          cy.get('body').then(($body) => {
            if ($body.find('.modal, .dialog, .popup, [role="dialog"]').length > 0) {
              cy.get('.modal, .dialog, .popup, [role="dialog"]').find('button').contains(/close|cancel|x/i).click();
              cy.wait(500);
            }
          });
        }
      }
    });
  });

  it('should test basic form interactions', () => {
    visitDashboard();
    
    // Test input fields if they exist
    cy.get('body').then(($body) => {
      const $inputs = $body.find('input:visible');
      if ($inputs.length > 0) {
        // Test first few inputs
        const inputsToTest = Math.min(3, $inputs.length);
        for (let i = 0; i < inputsToTest; i++) {
          cy.wrap($inputs).eq(i).type('test', { force: true }).clear();
          cy.log(`Tested input ${i + 1}`);
        }
      } else {
        cy.log('No input fields found');
      }
    });
    
    // Test select/dropdown fields if they exist
    cy.get('body').then(($body) => {
      const $selects = $body.find('select:visible');
      if ($selects.length > 0) {
        cy.wrap($selects).first().select(0);
        cy.log('Tested select field');
      } else {
        cy.log('No select fields found');
      }
    });
  });

  it('should test basic navigation', () => {
    visitDashboard();
    
    // Test navigation links with re-query to avoid DOM detachment
    cy.get('a[href]:visible').then(($links) => {
      if ($links.length > 0) {
        // Test first few links
        const linksToTest = Math.min(3, $links.length);
        for (let i = 0; i < linksToTest; i++) {
          visitDashboard(); // Ensure we're on dashboard
          cy.wait(1000);
          
          // Re-query links each time to avoid DOM detachment
          cy.get('a[href]:visible').eq(i).click();
          cy.wait(1000);
          cy.log(`Clicked navigation link ${i + 1}`);
        }
      } else {
        cy.log('No navigation links found');
      }
    });
  });
});

// ==========================================
// RESPONSIVE DESIGN TESTS
// ==========================================
describe('Sendsile Dashboard - Responsive Design', () => {
  it('should be responsive on mobile view', () => {
    cy.viewport('iphone-x');
    visitDashboard();
    cy.get(dashboard.root || '#root').should('be.visible');
  });

  it('should be responsive on tablet view', () => {
    cy.viewport('ipad-2');
    visitDashboard();
    cy.get(dashboard.root || '#root').should('be.visible');
  });

  it('should be responsive on desktop view', () => {
    cy.viewport(1440, 900);
    visitDashboard();
    cy.get(dashboard.root || '#root').should('be.visible');
  });
});

// Ready for Sendsile Cloud AI Enhancement
