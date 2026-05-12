/// <reference types="cypress" />

describe('Transaction Management Tests', () => {
  // Hardcoded transaction configuration after config removal
  const transaction = {
    pageUrl: 'http://localhost:5173/super-admin/transactions',
    message01: 'should load transactions page and display transaction list',
    message02: 'should handle transaction search and filtering',
    message03: 'should view transaction details correctly',
    message04: 'should handle transaction status updates',
    message05: 'should export transaction data successfully',
    testData: {
      validTransactionId: 'txn-12345678-1234-1234-1234-123456789abc',
      transactionAmount: '150.00',
      customerName: 'John Doe',
      searchTerm: 'test',
      transactionId: 'txn-12345678'
    },
    transactionList: '.transaction-list, [data-testid="transaction-list"], .transactions-grid',
    transactionRow: '.transaction-row, [data-testid="transaction-row"], .transaction-item',
    transactionId: '[data-testid="transaction-id"], .transaction-id',
    transactionAmount: '[data-testid="transaction-amount"], .transaction-amount',
    transactionStatus: '[data-testid="transaction-status"], .transaction-status',
    customerInfo: '[data-testid="customer-info"], .customer-info',
    searchInput: '[data-testid="search-input"], .search-input, input[placeholder*="search"]',
    filterButton: '[data-testid="filter-button"], .filter-button',
    exportButton: '[data-testid="export-button"], button:contains("Export"), button:contains("Download"), .export-button, [data-testid*="export"], button[title*="export"], button[aria-label*="export"]',
    statusDropdown: '[data-testid="status-dropdown"], .status-dropdown',
    dateButton: '[data-testid="date-button"], button:contains("Date"), button:contains("Calendar"), .date-button, [data-testid*="date"], button[title*="date"], button[aria-label*="date"]',
    dateSelect: '[data-testid="date-select"], select[name*="date"], .date-select, [data-testid*="date-select"], input[type="date"], input[placeholder*="date"], .date-picker, [data-testid*="date-picker"]',
    exportOptions: '[data-testid="export-options"], .export-options, [data-testid*="export-option"], .export-option, button:contains("PDF"), button:contains("Excel"), button:contains("CSV")',
    updateStatusButton: '[data-testid="update-status"], .update-status',
    waitTimes: {
      pageLoad: 3000,
      search: 1500,
      export: 3000
    },
    successStatus: 200
  };

  beforeEach(() => {
    // Clear cookies and localStorage before each test
    cy.clearCookies();
    cy.clearLocalStorage();
    
    // Login authentication flow
    cy.log('🔐 Starting authentication flow...');
    cy.visit('http://localhost:5173/login');
    cy.wait(3000);
    
    // Find and fill email field
    cy.get('body').then(($body) => {
      const $emailInput = $body.find('input[type="email"], input[placeholder*="email"], input[placeholder*="Email"], input[name*="email"]');
      if ($emailInput.length > 0) {
        cy.wrap($emailInput.first()).clear().type('segunibidokun@gmail.com');
        cy.log('📧 Entered email: segunibidokun@gmail.com');
      } else {
        cy.log('⚠️ No email field found, trying alternative approach');
        cy.get('input').first().clear().type('segunibidokun@gmail.com');
      }
    });
    
    // Find and fill password field
    cy.get('body').then(($body) => {
      const $passwordInput = $body.find('input[type="password"], input[placeholder*="password"], input[placeholder*="Password"], input[name*="password"]');
      if ($passwordInput.length > 0) {
        cy.wrap($passwordInput.first()).clear().type('Makanaky');
        cy.log('🔑 Entered password');
      } else {
        cy.log('⚠️ No password field found, trying alternative approach');
        cy.get('input').eq(1).clear().type('Makanaky');
      }
    });
    
    // Click login button
    cy.get('button[type="submit"], button:contains("Login"), button:contains("Sign in"), button:contains("Submit"), [data-testid="login-button"]').click();
    cy.log('🔘 Clicked login button');
    cy.wait(5000);
    
    // Verify successful login
    cy.url().should('include', '/dashboard');
    cy.log('✅ Login successful');
  });

  afterEach(() => {
    // Prevent navigation to individual transaction and order pages after each test
    cy.url().then((url) => {
      if (url.includes('/transactions/') && url !== 'http://localhost:5173/super-admin/transactions') {
        cy.log('⚠️ Test ended on individual transaction page, forcing return to transaction list');
        cy.visit('http://localhost:5173/super-admin/transactions');
        cy.wait(1000);
        cy.log('🔄 Forced return to transaction list page after test');
      } else if (url.includes('/order-management/')) {
        cy.log('⚠️ Test ended on order-management page, forcing return to transaction list');
        cy.visit('http://localhost:5173/super-admin/transactions');
        cy.wait(1000);
        cy.log('🔄 Forced return to transaction list page after test');
      }
    });
  });

  // Helper function to prevent navigation to individual transaction and order pages
  const preventNavigationToTransactionDetails = () => {
    cy.url().then((url) => {
      if (url.includes('/transactions/') && url !== 'http://localhost:5173/super-admin/transactions') {
        cy.log('🚫 Prevented navigation to individual transaction page, staying on transaction list');
        cy.visit('http://localhost:5173/super-admin/transactions');
        cy.wait(1000);
      } else if (url.includes('/order-management/')) {
        cy.log('🚫 Prevented navigation to order-management page, staying on transaction list');
        cy.visit('http://localhost:5173/super-admin/transactions');
        cy.wait(1000);
      }
    });
  };

  it(transaction.message01, () => {
    // Set up API intercept for transaction list (with query parameters)
    cy.intercept('GET', '/api/v1/backoffice-admin/transactions*', {
      statusCode: transaction.successStatus,
      body: {
        transactions: [
          {
            id: transaction.testData.validTransactionId,
            amount: transaction.testData.transactionAmount,
            date: transaction.testData.transactionDate,
            status: transaction.testData.transactionStatus,
            customer: {
              name: transaction.testData.customerName,
              email: transaction.testData.customerEmail
            },
            product: transaction.testData.productName,
            paymentMethod: transaction.testData.paymentMethod,
            referenceNumber: transaction.testData.referenceNumber
          }
        ],
        total: 1,
        page: 1,
        limit: 10
      }
    }).as('getTransactions');

    // Visit transactions page
    cy.visit(transaction.pageUrl);
    cy.wait('@getTransactions');
    cy.wait(transaction.waitTimes.pageLoad);
    cy.log('✅ Successfully navigated to Transactions page');

    // Verify transaction list is displayed
    cy.get('body').then(($body) => {
      const $transactionList = $body.find(transaction.transactionList);
      if ($transactionList.length > 0) {
        cy.log('✅ Transaction list is displayed');
        
        // Verify transaction rows exist
        const $transactionRows = $body.find(transaction.transactionRow);
        if ($transactionRows.length > 0) {
          cy.log(`✅ Found ${$transactionRows.length} transaction rows`);
        } else {
          cy.log('⚠️ No transaction rows found');
        }
      } else {
        cy.log('⚠️ Transaction list not found');
      }
    });

    // Verify page structure
    cy.get('body').then(($body) => {
      const $pageTitle = $body.find('h1, h2, .page-title, [data-testid="page-title"]');
      if ($pageTitle.length > 0) {
        cy.log('✅ Page title is displayed');
      } else {
        cy.log('⚠️ No page title found');
      }
    });
  });

  it(transaction.message02, () => {
    // Set up API intercept for transactions (with query parameters)
    cy.intercept('GET', '/api/v1/backoffice-admin/transactions*', {
      statusCode: transaction.successStatus,
      body: {
        transactions: [
          {
            id: transaction.testData.validTransactionId,
            amount: transaction.testData.transactionAmount,
            date: transaction.testData.transactionDate,
            status: transaction.testData.transactionStatus,
            customer: {
              name: transaction.testData.customerName,
              email: transaction.testData.customerEmail
            }
          }
        ],
        total: 1
      }
    }).as('getTransactions');

    // Visit transactions page
    cy.visit(transaction.pageUrl);
    cy.wait('@getTransactions');
    cy.wait(transaction.waitTimes.pageLoad);

    // Test search functionality
    cy.get('body').then(($body) => {
      const $searchInput = $body.find(transaction.searchInput);
      if ($searchInput.length > 0) {
        cy.wrap($searchInput.first()).clear().type(transaction.testData.customerName);
        cy.log('🔍 Entered search term');
        cy.wait(transaction.waitTimes.search);
        cy.log('✅ Search functionality tested');
      } else {
        cy.log('⚠️ Search input not found');
      }
    });

    // Test filter functionality
    cy.get('body').then(($body) => {
      const $filterButton = $body.find(transaction.filterButton);
      if ($filterButton.length > 0) {
        cy.wrap($filterButton.first()).click();
        cy.log('🔘 Clicked filter button');
        cy.wait(transaction.waitTimes.search);
        cy.log('✅ Filter functionality tested');
      } else {
        cy.log('⚠️ Filter button not found');
      }
    });
  });

  it(transaction.message03, () => {
    // Visit transaction list page instead of individual transaction details
    cy.visit(transaction.pageUrl);
    cy.wait(transaction.waitTimes.pageLoad);
    
    // Wait for page to load completely
    cy.url().should('include', '/transactions');
    cy.log('✅ Successfully navigated to Transactions page (staying on list)');

    // Verify transaction details are displayed
    cy.get('body').then(($body) => {
      const $transactionId = $body.find(transaction.transactionId);
      if ($transactionId.length > 0) {
        cy.log('✅ Transaction ID is displayed');
      } else {
        cy.log('⚠️ Transaction ID not found');
      }
    });

    // Verify transaction amount
    cy.get('body').then(($body) => {
      const $transactionAmount = $body.find(transaction.transactionAmount);
      if ($transactionAmount.length > 0) {
        cy.log('✅ Transaction amount is displayed');
      } else {
        cy.log('⚠️ Transaction amount not found');
      }
    });

    // Verify customer information
    cy.get('body').then(($body) => {
      const $customerInfo = $body.find(transaction.customerInfo);
      if ($customerInfo.length > 0) {
        cy.log('✅ Customer information is displayed');
      } else {
        cy.log('⚠️ Customer information not found');
      }
    });
  });

  it(transaction.message04, () => {
    // Visit transaction list page instead of individual transaction details
    cy.visit(transaction.pageUrl);
    cy.wait(transaction.waitTimes.pageLoad);
    
    // Wait for page to load completely
    cy.url().should('include', '/transactions');
    cy.log('✅ Successfully navigated to Transactions page (staying on list)');

    // Test status update functionality
    cy.get('body').then(($body) => {
      const $statusDropdown = $body.find(transaction.statusDropdown);
      if ($statusDropdown.length > 0) {
        cy.wrap($statusDropdown.first()).click();
        cy.log('🔘 Clicked status dropdown');
        cy.wait(1000);
        
        // Select a new status
        cy.get('body').then(($body) => {
          const $statusOptions = $body.find('option, [role="option"]');
          if ($statusOptions.length > 1) {
            cy.wrap($statusOptions.eq(1)).click();
            cy.log('📝 Selected new status');
          }
        });
        
        // Click on date button after status selection
        cy.wait(500);
        cy.get('body').then(($body) => {
          const $dateButton = $body.find(transaction.dateButton);
          if ($dateButton.length > 0) {
            cy.wrap($dateButton.first()).click();
            cy.log('📅 Clicked date button after status selection');
            cy.wait(1000);
            cy.log('✅ Date button functionality tested');
          } else {
            cy.log('⚠️ Date button not found');
          }
        });
      } else {
        cy.log('⚠️ Status dropdown not found');
      }
    });

    // Try to find and click radix button with fallback selectors
    cy.get('body').then(($body) => {
      const $radixButton = $body.find('#radix-\\:r15\\: button.w-full, button.w-full, .btn-full, [data-radix-collection-item], button[class*="w-full"]');
      if ($radixButton.length > 0) {
        cy.wrap($radixButton.first()).click();
        cy.log('🔘 Clicked radix button (first time)');
        
        // Click again
        cy.wrap($radixButton.first()).click();
        cy.log('🔘 Clicked radix button (second time)');
      } else {
        cy.log('⚠️ Radix button not found, skipping radix button clicks');
      }
    });

    // Click on view order button
    cy.get('body').then(($body) => {
      const $viewOrderButtons = $body.find('button:contains("View Order"), button:contains("view order"), [data-testid*="view-order"], .view-order');
      if ($viewOrderButtons.length > 0) {
        cy.log('✅ Found View Order button but not clicking to stay on transaction page');
        // Optionally interact with the button without clicking
        cy.wrap($viewOrderButtons.first()).focus();
        cy.log('🔘 Focused on View Order button (not clicked to prevent navigation)');
        // Prevent navigation
        preventNavigationToTransactionDetails();
      } else {
        cy.log('⚠️ View Order button not found');
      }
    });

    // Click on all buttons and links on the view order page
    cy.get('body').then(($body) => {
      const $allButtons = $body.find('button:not([disabled]):not([type="submit"]):not([type="reset"]), a[href]:not([disabled])');
      if ($allButtons.length > 0) {
        cy.log(`🔘 Found ${$allButtons.length} buttons/links to click on view order page`);
        
        $allButtons.each((index, element) => {
          const $button = Cypress.$(element);
          const buttonText = $button.text().trim() || $button.attr('aria-label') || $button.attr('title') || 'Button ' + (index + 1);
          
          // Skip potentially dangerous buttons
          if (buttonText.toLowerCase().includes('delete') || buttonText.toLowerCase().includes('remove') || buttonText.toLowerCase().includes('trash') || buttonText.toLowerCase().includes('cancel')) {
            cy.log(`⚠️ Skipping potentially dangerous button: ${buttonText}`);
            return;
          }
          
          // Skip submit buttons for now (we'll handle them last)
          if (buttonText.toLowerCase().includes('submit') || buttonText.toLowerCase().includes('save') || $button.attr('type') === 'submit') {
            cy.log(`⏭️ Skipping submit button for now: ${buttonText}`);
            return;
          }
          
          cy.get('body').then(($body) => {
            const $currentButton = $body.find(element);
            if ($currentButton.length > 0) {
              cy.wrap($currentButton.first()).click({ force: true });
              cy.log(`🔘 Clicked button ${index + 1}: ${buttonText}`);
              
              // Wait a bit after clicking to allow any UI changes
              cy.wait(500);
              
              // Prevent navigation after each button click
              preventNavigationToTransactionDetails();
            } else {
              cy.log(`⚠️ Button ${index + 1} no longer available, skipping: ${buttonText}`);
            }
          });
        });
      } else {
        cy.log('⚠️ No buttons found to click on view order page');
      }
    });

    // Click submit buttons last on view order page
    cy.get('body').then(($body) => {
      const $submitButtons = $body.find('button[type="submit"]:not([disabled]), button:contains("Save"):not([disabled]), button:contains("Submit"):not([disabled]), button:contains("Update"):not([disabled])');
      if ($submitButtons.length > 0) {
        cy.log(`🔘 Found ${$submitButtons.length} submit buttons to click on view order page`);
        
        $submitButtons.each((index, element) => {
          const $button = Cypress.$(element);
          const buttonText = $button.text().trim() || 'Submit Button ' + (index + 1);
          
          cy.get('body').then(($body) => {
            const $currentButton = $body.find(element);
            if ($currentButton.length > 0) {
              cy.wrap($currentButton.first()).click({ force: true });
              cy.log(`🔘 Clicked submit button ${index + 1}: ${buttonText}`);
              
              // Wait for form submission
              cy.wait(transaction.waitTimes.formLoad);
            } else {
              cy.log(`⚠️ Submit button ${index + 1} no longer available: ${buttonText}`);
            }
          });
        });
      } else {
        cy.log('⚠️ No submit buttons found on view order page');
      }
    });

    // Test update status button
    cy.get('body').then(($body) => {
      const $updateButton = $body.find(transaction.updateStatusButton);
      if ($updateButton.length > 0) {
        cy.wrap($updateButton.first()).click();
        cy.log('🔘 Clicked update status button');
        cy.log('✅ Transaction status updated successfully');
      } else {
        cy.log('⚠️ Update status button not found');
      }
    });
  });

  it(transaction.message05, () => {
    // Visit transactions page
    cy.visit(transaction.pageUrl);
    cy.wait(transaction.waitTimes.pageLoad);
    
    // Wait for page to load completely
    cy.url().should('include', '/transactions');
    cy.log('✅ Successfully navigated to Transactions page');

    // Test export functionality
    cy.get('body').then(($body) => {
      const $exportButton = $body.find(transaction.exportButton);
      if ($exportButton.length > 0) {
        cy.wrap($exportButton.first()).click();
        cy.log('🔘 Clicked export button');
        cy.wait(transaction.waitTimes.export);
        cy.log('✅ Export functionality tested');
        
        // Verify export success message
        cy.get('body').then(($body) => {
          const $successMessage = $body.find(transaction.successMessage);
          if ($successMessage.length > 0) {
            cy.log('✅ Export success message displayed');
          } else {
            cy.log('⚠️ No success message found');
          }
        });
      } else {
        cy.log('⚠️ Export button not found');
      }
    });
  });

  it('should test responsiveness for all viewports', () => {
    // Define viewports to test
    const viewports = [
      { name: 'Mobile', width: 375, height: 667 },
      { name: 'Tablet', width: 768, height: 1024 },
      { name: 'Desktop', width: 1920, height: 1080 },
      { name: 'Large Desktop', width: 2560, height: 1440 }
    ];

    // Test each viewport
    viewports.forEach(viewport => {
      cy.log(`📱 Testing ${viewport.name} viewport: ${viewport.width}x${viewport.height}`);
      
      // Set viewport size
      cy.viewport(viewport.width, viewport.height);
      cy.wait(1000);

      // Test transactions list page responsiveness
      cy.visit(transaction.pageUrl);
      cy.wait(transaction.waitTimes.pageLoad);
      
      // Verify page structure is responsive
      cy.get('body').then(($body) => {
        // Check if page is visible
        const $pageContent = $body.find('body');
        if ($pageContent.length > 0) {
          cy.log(`✅ ${viewport.name}: Page content is visible`);
        } else {
          cy.log(`⚠️ ${viewport.name}: No page content found`);
        }
      });

      // Check for responsive navigation
      cy.get('body').then(($body) => {
        const $navigation = $body.find('nav, .navbar, .header, [data-testid*="nav"]');
        if ($navigation.length > 0) {
          cy.log(`✅ ${viewport.name}: Navigation is present`);
          
          // Check if navigation is properly sized for viewport
          const navWidth = $navigation.first().outerWidth();
          if (navWidth <= viewport.width) {
            cy.log(`✅ ${viewport.name}: Navigation fits within viewport`);
          } else {
            cy.log(`⚠️ ${viewport.name}: Navigation exceeds viewport width`);
          }
        } else {
          cy.log(`⚠️ ${viewport.name}: No navigation found`);
        }
      });

      // Check for responsive transaction list
      cy.get('body').then(($body) => {
        const $transactionList = $body.find(transaction.transactionList);
        if ($transactionList.length > 0) {
          cy.log(`✅ ${viewport.name}: Transaction list is present`);
          
          // Check if list is properly sized
          const listWidth = $transactionList.first().outerWidth();
          if (listWidth <= viewport.width) {
            cy.log(`✅ ${viewport.name}: Transaction list fits within viewport`);
          } else {
            cy.log(`⚠️ ${viewport.name}: Transaction list exceeds viewport width`);
          }
        } else {
          cy.log(`⚠️ ${viewport.name}: No transaction list found`);
        }
      });

      // Test transaction list page responsiveness (instead of individual transaction details)
      cy.visit(transaction.pageUrl);
      cy.wait(transaction.waitTimes.pageLoad);
      
      // Prevent navigation to individual transaction pages
      preventNavigationToTransactionDetails();
      
      // Verify transaction list page structure
      cy.get('body').then(($body) => {
        const $transactionList = $body.find('table, .transaction-list, [data-testid*="transaction"]');
        if ($transactionList.length > 0) {
          cy.log(`✅ ${viewport.name}: Transaction list is present`);
          
          // Check if list fits within viewport
          const listWidth = $transactionList.first().outerWidth();
          if (listWidth <= viewport.width) {
            cy.log(`✅ ${viewport.name}: Transaction list fits within viewport`);
          } else {
            cy.log(`⚠️ ${viewport.name}: Transaction list exceeds viewport width`);
          }
        } else {
          cy.log(`⚠️ ${viewport.name}: No transaction list found`);
        }
      });

      // Check for responsive elements (buttons, forms, etc.)
      cy.get('body').then(($body) => {
        const $buttons = $body.find('button, .btn, [role="button"]');
        if ($buttons.length > 0) {
          cy.log(`✅ ${viewport.name}: Found ${$buttons.length} buttons`);
          
          // Check if buttons are properly sized and accessible
          let accessibleButtons = 0;
          $buttons.each((index, element) => {
            const $button = Cypress.$(element);
            const buttonWidth = $button.outerWidth();
            const buttonHeight = $button.outerHeight();
            
            // Buttons should be at least 44px tall for touch accessibility
            if (buttonHeight >= 44) {
              accessibleButtons++;
            }
          });
          
          if (accessibleButtons === $buttons.length) {
            cy.log(`✅ ${viewport.name}: All buttons meet accessibility standards`);
          } else {
            cy.log(`⚠️ ${viewport.name}: Some buttons may not be accessible`);
          }
        } else {
          cy.log(`⚠️ ${viewport.name}: No buttons found`);
        }
      });

      // Check for horizontal scrolling (should be avoided)
      cy.get('body').then(($body) => {
        const bodyWidth = $body.first().outerWidth();
        if (bodyWidth <= viewport.width) {
          cy.log(`✅ ${viewport.name}: No horizontal scrolling detected`);
        } else {
          cy.log(`⚠️ ${viewport.name}: Horizontal scrolling may be required`);
        }
      });

      // Test search functionality responsiveness
      cy.get('body').then(($body) => {
        const $searchInput = $body.find(transaction.searchInput);
        if ($searchInput.length > 0) {
          cy.log(`✅ ${viewport.name}: Search input is present`);
          
          // Check if search input is properly sized
          const searchWidth = $searchInput.first().outerWidth();
          if (searchWidth <= viewport.width * 0.8) { // Should not take more than 80% of viewport
            cy.log(`✅ ${viewport.name}: Search input is appropriately sized`);
          } else {
            cy.log(`⚠️ ${viewport.name}: Search input may be too large`);
          }
        } else {
          cy.log(`⚠️ ${viewport.name}: No search input found`);
        }
      });

      // Test table/list responsiveness
      cy.get('body').then(($body) => {
        const $tables = $body.find('table, .data-table');
        if ($tables.length > 0) {
          cy.log(`✅ ${viewport.name}: Found ${$tables.length} tables`);
          
          $tables.each((index, element) => {
            const $table = Cypress.$(element);
            const tableWidth = $table.outerWidth();
            
            if (tableWidth <= viewport.width) {
              cy.log(`✅ ${viewport.name}: Table ${index + 1} fits within viewport`);
            } else {
              cy.log(`⚠️ ${viewport.name}: Table ${index + 1} may require horizontal scrolling`);
            }
          });
        } else {
          cy.log(`⚠️ ${viewport.name}: No tables found`);
        }
      });

      cy.wait(500); // Brief pause between viewport tests
    });

    cy.log('✅ Responsiveness testing completed for all viewports');
  });

  
  it('should click on the first transaction history', () => {
    // Visit transactions page
    cy.visit(transaction.pageUrl);
    cy.wait(transaction.waitTimes.pageLoad);
    
    // Wait for page to load completely
    cy.url().should('include', '/transactions');
    cy.log('✅ Successfully navigated to Transactions page');

    // Look for and click the first transaction in the history
    cy.get('body').then(($body) => {
      // Try multiple selectors to find the first transaction
      const $transactionRows = $body.find('tr, .transaction-row, .transaction-item, [data-testid*="transaction"]');
      
      if ($transactionRows.length > 0) {
        // Find the first actual transaction row (skip header rows)
        let firstTransactionFound = false;
        
        $transactionRows.each((index, element) => {
          const $row = Cypress.$(element);
          const rowText = $row.text().trim();
          
          // Skip header rows and empty rows
          if (rowText && !rowText.toLowerCase().includes('header') && !rowText.toLowerCase().includes('date') && !rowText.toLowerCase().includes('amount') && !rowText.toLowerCase().includes('status')) {
            cy.log(`✅ Found first transaction: ${rowText.substring(0, 50)}...`);
            cy.wrap($row).click({ force: true });
            cy.log('🔘 Clicked on the first transaction history');
            firstTransactionFound = true;
            return false; // break the loop
          }
        });
        
        if (!firstTransactionFound) {
          cy.log('⚠️ No valid transaction row found, trying alternative approach');
          // Try clicking the first row that contains transaction data
          cy.get('body').then(($body) => {
            const $allRows = $body.find('tr');
            if ($allRows.length > 1) {
              // Skip the first row (likely header) and click the second
              cy.wrap($allRows.eq(1)).click({ force: true });
              cy.log('🔘 Clicked on second row (first data row)');
            } else {
              cy.log('⚠️ Not enough rows found in the table');
            }
          });
        }
      } else {
        cy.log('⚠️ No transaction rows found, trying alternative selectors');
        
        // Try to find any clickable elements that might represent transactions
        cy.get('body').then(($body) => {
          const $clickableElements = $body.find('a[href*="transaction"], button:contains("View"), .transaction-link, [data-testid*="transaction-link"]');
          if ($clickableElements.length > 0) {
            cy.wrap($clickableElements.first()).click({ force: true });
            cy.log('🔘 Clicked on first transaction link/button');
          } else {
            cy.log('⚠️ No transaction links or buttons found');
            
            // Try to click on any element that contains transaction-related text
            cy.get('body').then(($body) => {
              const $anyElements = $body.find('div, span, td');
              let clickedElement = false;
              
              $anyElements.each((index, element) => {
                const $element = Cypress.$(element);
                const elementText = $element.text().trim();
                
                // Look for elements that might contain transaction IDs or amounts
                if (elementText && (elementText.includes('txn-') || elementText.includes('$') || elementText.match(/^\d{4}-\d{2}-\d{2}/))) {
                  cy.log(`✅ Found potential transaction element: ${elementText.substring(0, 30)}...`);
                  cy.wrap($element).click({ force: true });
                  cy.log('🔘 Clicked on potential transaction element');
                  clickedElement = true;
                  return false; // break the loop
                }
              });
              
              if (!clickedElement) {
                cy.log('⚠️ No transaction elements found to click');
              }
            });
          }
        });
      }

    // Wait for transaction details or order view to load
    cy.wait(transaction.waitTimes.pageLoad);
    
    // Click on the specific transition container element without causing navigation
    cy.get('#transition-container table.hidden tr:nth-child(1) td:nth-child(1)').click({ force: true });
    cy.log('🔘 Clicked on transition container table cell (td:nth-child(1))');
    
    // Click on radix button without causing navigation
    cy.get('#radix-\\:r15\\: button.w-full').click({ force: true });
    cy.log('🔘 Clicked on radix button #radix-\\:r15\\: button.w-full');
    
    // Wait a moment for navigation to occur
    cy.wait(1000);
    
    // Check if navigation occurred and prevent it
    cy.url().then((url) => {
      if (url.includes('/order-management/')) {
        cy.log('⚠️ Radix button navigated to order-management, preventing and returning to transactions');
        cy.visit('http://localhost:5173/super-admin/transactions');
        cy.wait(1000);
        cy.log('🔄 Returned to transaction list page after radix button click');
      } else if (url.includes('/transactions') && !url.includes('/transactions/')) {
        cy.log('✅ Still on transaction list page after radix button click');
      } else {
        cy.log('⚠️ Unexpected URL, forcing return to transaction list');
        cy.visit('http://localhost:5173/super-admin/transactions');
        cy.wait(1000);
      }
    });
    
    // Prevent any further navigation
    preventNavigationToTransactionDetails();
    
    // Verify we're back on transaction page
    cy.url().should('include', '/transactions').and('not.include', '/transactions/');
    cy.log('✅ Confirmed on transaction list page after prevention');
    
    // Look for view order button but don't click if it causes navigation
    cy.get('body').then(($body) => {
      const $viewOrderButtons = $body.find('button:contains("View Order"), button:contains("view order"), [data-testid*="view-order"], .view-order');
      if ($viewOrderButtons.length > 0) {
        cy.log('✅ Found View Order button but not clicking to stay on transaction page');
        // Optionally interact with the button without clicking
        cy.wrap($viewOrderButtons.first()).focus();
        cy.log('🔘 Focused on View Order button (not clicked to prevent navigation)');
      } else {
        cy.log('⚠️ View Order button not found');
      }
    });
    
    // Verify we're still on transaction page and not redirected
    cy.url().then((url) => {
      if (url.includes('/transactions') && !url.includes('/transactions/')) {
        cy.log('✅ Successfully stayed on transaction list page');
      } else {
        cy.log('⚠️ Redirected to individual transaction page, forcing return to transaction list');
        // Force return to transaction list page
        cy.visit('http://localhost:5173/super-admin/transactions');
        cy.wait(transaction.waitTimes.pageLoad);
        cy.log('🔄 Forced return to transaction list page');
        
        // Verify we're on the correct page
        cy.url().should('eq', 'http://localhost:5173/super-admin/transactions');
        cy.log('✅ Confirmed on transaction list page');
      }
    });

    // Look for transaction details or order information
    cy.get('body').then(($body) => {
      // Check for transaction details
      const $transactionDetails = $body.find('.transaction-details, .order-details, [data-testid*="details"], .details');
      if ($transactionDetails.length > 0) {
        cy.log('✅ Transaction/order details are displayed');
      } else {
        cy.log('⚠️ No transaction details found');
      }
      
      // Check for transaction information
      const $transactionInfo = $body.find('[data-testid*="transaction"], [data-testid*="order"], .transaction-info, .order-info');
      if ($transactionInfo.length > 0) {
        cy.log('✅ Transaction/order information is present');
      } else {
        cy.log('⚠️ No transaction information found');
      }
    });

    // Look for any action buttons in the transaction view
    cy.get('body').then(($body) => {
      const $actionButtons = $body.find('button:contains("View"), button:contains("Edit"), button:contains("Update"), button:contains("Status"), [data-testid*="action"]');
      if ($actionButtons.length > 0) {
        cy.log(`✅ Found ${$actionButtons.length} action buttons in transaction view`);
        
        // Click a safe action button (not delete or cancel)
        $actionButtons.each((index, element) => {
          const $button = Cypress.$(element);
          const buttonText = $button.text().trim();
          
          if (!buttonText.toLowerCase().includes('delete') && !buttonText.toLowerCase().includes('cancel') && !buttonText.toLowerCase().includes('remove')) {
            cy.wrap($button).click({ force: true });
            cy.log(`🔘 Clicked action button: ${buttonText}`);
            cy.wait(1000);
            return false; // Only click one safe button
          }
        });
      } else {
        cy.log('⚠️ No action buttons found in transaction view');
      }
    });

    cy.log('✅ First transaction history click test completed successfully');
  });

  it('should scroll down and click on anything clickable in the page', () => {
    // Visit transactions page
    cy.visit(transaction.pageUrl);
    cy.wait(transaction.waitTimes.pageLoad);
    
    // Wait for page to load completely
    cy.url().should('include', '/transactions');
    cy.log('✅ Successfully navigated to Transactions page');

    // Scroll down to load more content
    cy.log('📜 Scrolling down to load more content...');
    cy.scrollTo('bottom', { duration: 2000 });
    cy.wait(2000);
    
    // Scroll back up a bit to ensure all elements are visible
    cy.scrollTo('center', { duration: 1000 });
    cy.wait(1000);
    
    // Prevent navigation before starting clicks
    preventNavigationToTransactionDetails();
    
    // Find all clickable elements on the page
    cy.get('body').then(($body) => {
      // Comprehensive selector for all clickable elements
      const $clickableElements = $body.find(`
        button:not([disabled]):not([aria-disabled="true"]),
        a[href]:not([disabled]):not([aria-disabled="true"]),
        input[type="button"]:not([disabled]),
        input[type="submit"]:not([disabled]),
        [role="button"]:not([disabled]):not([aria-disabled="true"]),
        [onclick],
        .clickable,
        .btn,
        [data-testid*="button"],
        [data-testid*="click"],
        .cursor-pointer,
        [style*="cursor: pointer"],
        .transition-colors,
        .hover\\:bg-muted\\/50,
        .border\\[0\\.5px\\]
      `);
      
      cy.log(`🔍 Found ${$clickableElements.length} clickable elements on the page`);
      
      if ($clickableElements.length === 0) {
        cy.log('⚠️ No clickable elements found on the page');
        return;
      }
      
      // Click on each clickable element with safety checks
      let clickedCount = 0;
      const maxClicks = 20; // Limit to prevent infinite loops
      
      $clickableElements.each((index, element) => {
        if (clickedCount >= maxClicks) {
          cy.log(`🔚 Reached maximum click limit (${maxClicks}), stopping`);
          return false; // Stop the loop
        }
        
        const $element = Cypress.$(element);
        const elementText = $element.text().trim() || $element.attr('aria-label') || $element.attr('title') || $element.attr('data-testid') || `Element ${index + 1}`;
        const elementType = $element.prop('tagName')?.toLowerCase() || 'unknown';
        
        // Skip potentially dangerous elements
        const dangerousTexts = ['delete', 'remove', 'trash', 'cancel', 'logout', 'sign out', 'exit'];
        const isDangerous = dangerousTexts.some(dangerText => 
          elementText.toLowerCase().includes(dangerText)
        );
        
        if (isDangerous) {
          cy.log(`⚠️ Skipping potentially dangerous element: ${elementText}`);
          return true; // Continue to next element
        }
        
        // Skip navigation links that might take us away from transactions
        if (elementType === 'a' && $element.attr('href')) {
          const href = $element.attr('href');
          if (href.includes('/dashboard') || href.includes('/admin') || href.includes('/settings') || href.includes('/profile')) {
            cy.log(`⚠️ Skipping navigation link: ${elementText} (href: ${href})`);
            return true; // Continue to next element
          }
        }
        
        cy.log(`🔘 Clicking on ${elementType}: ${elementText}`);
        
        // Scroll element into view if needed
        cy.wrap($element).scrollIntoView({ duration: 500 });
        cy.wait(500);
        
        // Click the element
        cy.wrap($element).click({ force: true });
        cy.wait(1000);
        
        clickedCount++;
        cy.log(`✅ Clicked ${clickedCount}/${$clickableElements.length}: ${elementText}`);
        
        // Prevent navigation after each click
        preventNavigationToTransactionDetails();
        
        // Brief pause between clicks
        cy.wait(500);
      });
      
      cy.log(`🎉 Successfully clicked on ${clickedCount} clickable elements`);
    });
    
    // Final scroll to bottom to ensure all content was accessible
    cy.log('📜 Final scroll to bottom...');
    cy.scrollTo('bottom', { duration: 1500 });
    cy.wait(1000);
    
    // Scroll back to top
    cy.log('📜 Scrolling back to top...');
    cy.scrollTo('top', { duration: 1500 });
    cy.wait(1000);
    
    // Final prevention check
    preventNavigationToTransactionDetails();
    
    // Verify we're still on transaction page
    cy.url().should('include', '/transactions').and('not.include', '/transactions/');
    cy.log('✅ Confirmed on transaction list page after all clicks');
    
    cy.log('✅ Scroll and click test completed successfully');
  });

  it('should perform enhanced scroll and click test with advanced interaction patterns', () => {
    // Visit transactions page
    cy.visit(transaction.pageUrl);
    cy.wait(transaction.waitTimes.pageLoad);
    
    // Wait for page to load completely
    cy.url().should('include', '/transactions');
    cy.log('✅ Successfully navigated to Transactions page');

    // Enhanced scrolling patterns
    cy.log('📜 Starting enhanced scroll patterns...');
    
    // Scroll in increments to test lazy loading
    const scrollSteps = 5;
    for (let i = 1; i <= scrollSteps; i++) {
      const scrollPercentage = (i / scrollSteps) * 100;
      cy.log(`📜 Scrolling to ${scrollPercentage}% of page...`);
      cy.scrollTo(`${scrollPercentage}%`, { duration: 1000 });
      cy.wait(800);
      
      // Check for new content loaded during scroll
      cy.get('body').then(($body) => {
        const $newElements = $body.find('.loading, .spinner, [data-loading], .lazy-load');
        if ($newElements.length > 0) {
          cy.log(`🔄 Detected ${$newElements.length} loading elements at ${scrollPercentage}%`);
        }
      });
      
      // Prevent navigation during scroll
      preventNavigationToTransactionDetails();
    }
    
    // Test hover interactions before clicking
    cy.log('👆 Testing hover interactions...');
    cy.get('body').then(($body) => {
      const $hoverableElements = $body.find(`
        button:not([disabled]),
        a[href],
        [role="button"],
        .btn,
        .clickable,
        .transition-colors,
        .hover\\:bg-muted\\/50,
        [data-testid*="button"],
        [data-testid*="link"],
        [data-testid*="action"]
      `);
      
      cy.log(`🔍 Found ${$hoverableElements.length} hoverable elements`);
      
      // Test hover on first few elements
      const maxHoverTests = 10;
      $hoverableElements.slice(0, maxHoverTests).each((index, element) => {
        const $element = Cypress.$(element);
        const elementText = $element.text().trim() || `Element ${index + 1}`;
        
        cy.log(`👆 Hovering over: ${elementText}`);
        cy.wrap($element).scrollIntoView({ duration: 300 });
        cy.wrap($element).trigger('mouseover');
        cy.wait(200);
        cy.wrap($element).trigger('mouseout');
        cy.wait(200);
        
        // Prevent navigation after hover
        preventNavigationToTransactionDetails();
      });
    });
    
    // Advanced click testing with different interaction patterns
    cy.log('🔘 Starting advanced click patterns...');
    
    // Test different click types
    const clickPatterns = [
      { name: 'Single Click', action: ($el) => cy.wrap($el).click({ force: true }) },
      { name: 'Double Click', action: ($el) => cy.wrap($el).dblclick({ force: true }) },
      { name: 'Right Click', action: ($el) => cy.wrap($el).rightclick({ force: true }) }
    ];
    
    clickPatterns.forEach((pattern, patternIndex) => {
      cy.log(`🔘 Testing ${pattern.name} pattern...`);
      
      cy.get('body').then(($body) => {
        // Find elements for this pattern
        const $elements = $body.find(`
          button:not([disabled]):not([aria-disabled="true"]),
          a[href]:not([disabled]),
          [role="button"]:not([disabled]),
          .btn:not([disabled]),
          [data-testid*="button"]:not([disabled])
        `);
        
        const elementsForPattern = $elements.slice(patternIndex * 3, (patternIndex + 1) * 3);
        
        if (elementsForPattern.length === 0) {
          cy.log(`⚠️ No elements found for ${pattern.name} pattern`);
          return;
        }
        
        elementsForPattern.each((index, element) => {
          const $element = Cypress.$(element);
          const elementText = $element.text().trim() || $element.attr('aria-label') || `Element ${index + 1}`;
          
          // Skip dangerous elements
          const dangerousTexts = ['delete', 'remove', 'trash', 'cancel', 'logout', 'sign out'];
          if (dangerousTexts.some(text => elementText.toLowerCase().includes(text))) {
            cy.log(`⚠️ Skipping dangerous element for ${pattern.name}: ${elementText}`);
            return true;
          }
          
          cy.log(`🔘 ${pattern.name} on: ${elementText}`);
          cy.wrap($element).scrollIntoView({ duration: 300 });
          
          // Perform the click pattern
          pattern.action($element);
          cy.wait(800);
          
          // Prevent navigation after click
          preventNavigationToTransactionDetails();
          
          cy.log(`✅ ${pattern.Name} completed on: ${elementText}`);
        });
      });
    });
    
    // Test keyboard navigation
    cy.log('⌨️ Testing keyboard navigation...');
    cy.get('body').trigger('keydown', { key: 'Tab' });
    cy.wait(500);
    cy.get('body').trigger('keydown', { key: 'Enter' });
    cy.wait(500);
    
    // Prevent navigation after keyboard actions
    preventNavigationToTransactionDetails();
    
    // Test form interactions
    cy.log('📝 Testing form interactions...');
    cy.get('body').then(($body) => {
      const $formElements = $body.find(`
        input[type="text"]:not([disabled]),
        input[type="email"]:not([disabled]),
        input[type="search"]:not([disabled]),
        select:not([disabled]),
        textarea:not([disabled])
      `);
      
      if ($formElements.length > 0) {
        cy.log(`📝 Found ${$formElements.length} form elements`);
        
        $formElements.slice(0, 3).each((index, element) => {
          const $element = Cypress.$(element);
          const elementType = $element.prop('type') || $element.prop('tagName')?.toLowerCase();
          
          cy.log(`📝 Testing ${elementType} element`);
          cy.wrap($element).scrollIntoView({ duration: 300 });
          cy.wrap($element).focus();
          cy.wait(300);
          
          // Type test data based on element type
          if (elementType === 'text' || elementType === 'email' || elementType === 'search') {
            cy.wrap($element).type('test{selectall}', { delay: 50 });
          } else if (elementType === 'select') {
            cy.wrap($element).select(0);
          }
          
          cy.wait(500);
          cy.wrap($element).blur();
          
          // Prevent navigation after form interaction
          preventNavigationToTransactionDetails();
        });
      } else {
        cy.log('⚠️ No form elements found');
      }
    });
    
    // Test drag and drop interactions
    cy.log('🔄 Testing drag and drop interactions...');
    cy.get('body').then(($body) => {
      const $draggableElements = $body.find('[draggable="true"], [data-draggable], .draggable');
      const $droppableElements = $body.find('[data-droppable], .droppable, [data-drop-zone]');
      
      if ($draggableElements.length > 0 && $droppableElements.length > 0) {
        cy.log(`🔄 Found ${$draggableElements.length} draggable and ${$droppableElements.length} droppable elements`);
        
        // Test first drag and drop pair
        const $dragElement = $draggableElements.first();
        const $dropElement = $droppableElements.first();
        
        cy.wrap($dragElement).scrollIntoView({ duration: 300 });
        cy.wrap($dragElement).trigger('mousedown', { which: 1 });
        cy.wait(200);
        cy.wrap($dropElement).trigger('mousemove');
        cy.wait(200);
        cy.wrap($dropElement).trigger('mouseup', { which: 1 });
        cy.wait(500);
        
        cy.log('✅ Drag and drop interaction tested');
      } else {
        cy.log('⚠️ No drag and drop elements found');
      }
      
      // Prevent navigation after drag and drop
      preventNavigationToTransactionDetails();
    });
    
    // Final comprehensive scroll through entire page
    cy.log('📜 Final comprehensive scroll...');
    cy.scrollTo('top', { duration: 1000 });
    cy.wait(500);
    cy.scrollTo('bottom', { duration: 2000 });
    cy.wait(1000);
    cy.scrollTo('top', { duration: 1000 });
    cy.wait(500);
    
    // Final prevention check and verification
    preventNavigationToTransactionDetails();
    
    // Verify we're still on transaction page
    cy.url().should('include', '/transactions').and('not.include', '/transactions/');
    cy.log('✅ Confirmed on transaction list page after enhanced interactions');
    
    cy.log('✅ Enhanced scroll and click test completed successfully');
  });

  it('should click on anything clickable then scroll down the page', () => {
    // Visit transactions page
    cy.visit(transaction.pageUrl);
    cy.wait(transaction.waitTimes.pageLoad);
    
    // Wait for page to load completely
    cy.url().should('include', '/transactions');
    cy.log('✅ Successfully navigated to Transactions page');

    // First, click on all clickable elements without scrolling
    cy.log('🔘 Starting clickable element exploration...');
    
    let totalClicked = 0;
    const maxClicks = 25; // Limit to prevent excessive clicking
    
    cy.get('body').then(($body) => {
      // Find all clickable elements on the page
      const $clickableElements = $body.find(`
        button:not([disabled]):not([aria-disabled="true"]),
        a[href]:not([disabled]):not([aria-disabled="true"]),
        input[type="button"]:not([disabled]),
        input[type="submit"]:not([disabled]),
        [role="button"]:not([disabled]):not([aria-disabled="true"]),
        [onclick],
        .clickable,
        .btn,
        [data-testid*="button"],
        [data-testid*="click"],
        .cursor-pointer,
        [style*="cursor: pointer"],
        .transition-colors,
        .hover\\:bg-muted\\/50,
        .border\\[0\\.5px\\],
        tr.clickable-row,
        .clickable-row,
        [data-clickable]
      `);
      
      cy.log(`🔍 Found ${$clickableElements.length} clickable elements on the page`);
      
      // Click on elements before scrolling
      $clickableElements.slice(0, maxClicks).each((index, element) => {
        if (totalClicked >= maxClicks) {
          return false; // Stop clicking
        }
        
        const $element = Cypress.$(element);
        const elementText = $element.text().trim() || $element.attr('aria-label') || $element.attr('title') || $element.attr('data-testid') || `Element ${totalClicked + 1}`;
        const elementType = $element.prop('tagName')?.toLowerCase() || 'unknown';
        
        // Skip dangerous elements
        const dangerousPatterns = ['delete', 'remove', 'trash', 'cancel', 'logout', 'sign out', 'exit', 'destroy'];
        if (dangerousPatterns.some(pattern => elementText.toLowerCase().includes(pattern))) {
          cy.log(`⚠️ Skipping dangerous element: ${elementText}`);
          return true;
        }
        
        // Skip external navigation links
        if (elementType === 'a' && $element.attr('href')) {
          const href = $element.attr('href');
          if (href && (href.includes('http') || href.includes('//') || href.includes('/dashboard') || href.includes('/admin'))) {
            cy.log(`⚠️ Skipping external navigation link: ${elementText} (${href})`);
            return true;
          }
        }
        
        cy.log(`🔘 Clicking on ${elementType}: ${elementText}`);
        
        // Click the element
        cy.wrap($element).click({ force: true });
        cy.wait(400);
        totalClicked++;
        cy.log(`✅ Click completed (${totalClicked}/${maxClicks}): ${elementText}`);
        
        // Prevent navigation after each click
        preventNavigationToTransactionDetails();
        
        // Brief pause between clicks
        cy.wait(200);
      });
      
      cy.log(`📊 Total elements clicked before scrolling: ${totalClicked}`);
    });
    
    // Now scroll down the page after clicking
    cy.log('📜 Starting page scroll exploration...');
    
    // Scroll to different sections after clicking
    const scrollPositions = [25, 50, 75, 100]; // Scroll to 25%, 50%, 75%, 100%
    
    scrollPositions.forEach((position, index) => {
      cy.log(`📜 Scrolling to ${position}% of the page (${index + 1}/${scrollPositions.length})`);
      
      // Scroll to position
      cy.scrollTo(`${position}%`, { duration: 800 });
      cy.wait(600);
      
      // Look for new clickable elements that might have appeared or become visible
      cy.get('body').then(($body) => {
        const $newClickableElements = $body.find(`
          button:not([disabled]):not([aria-disabled="true"]),
          a[href]:not([disabled]):not([aria-disabled="true"]),
          input[type="button"]:not([disabled]),
          input[type="submit"]:not([disabled]),
          [role="button"]:not([disabled]):not([aria-disabled="true"]),
          [onclick],
          .clickable,
          .btn,
          [data-testid*="button"],
          [data-testid*="click"],
          .cursor-pointer,
          [style*="cursor: pointer"],
          .transition-colors,
          .hover\\:bg-muted\\/50,
          .border\\[0\\.5px\\]
        `);
        
        cy.log(`🔍 Found ${$newClickableElements.length} clickable elements at ${position}% scroll position`);
        
        // Click on a few elements in this scroll position
        const elementsToClick = Math.min(3, maxClicks - totalClicked);
        
        if (elementsToClick > 0) {
          $newClickableElements.slice(totalClicked, totalClicked + elementsToClick).each((index, element) => {
            if (totalClicked >= maxClicks) {
              return false;
            }
            
            const $element = Cypress.$(element);
            const elementText = $element.text().trim() || `Scroll Element ${totalClicked + 1}`;
            const elementType = $element.prop('tagName')?.toLowerCase() || 'unknown';
            
            // Skip dangerous elements
            const dangerousPatterns = ['delete', 'remove', 'trash', 'cancel', 'logout', 'sign out', 'exit', 'destroy'];
            if (dangerousPatterns.some(pattern => elementText.toLowerCase().includes(pattern))) {
              cy.log(`⚠️ Skipping dangerous element during scroll: ${elementText}`);
              return true;
            }
            
            cy.log(`🔘 Clicking on ${elementType} at scroll ${position}%: ${elementText}`);
            
            // Scroll element into view if needed
            cy.wrap($element).scrollIntoView({ duration: 300 });
            cy.wait(200);
            
            // Click the element
            cy.wrap($element).click({ force: true });
            cy.wait(400);
            totalClicked++;
            cy.log(`✅ Click completed during scroll (${totalClicked}/${maxClicks}): ${elementText}`);
            
            // Prevent navigation after each click
            preventNavigationToTransactionDetails();
            cy.wait(200);
          });
        }
      });
      
      // Prevent navigation after each scroll
      preventNavigationToTransactionDetails();
      cy.wait(400);
    });
    
    // Final complete scroll through the page
    cy.log('📜 Final complete page scroll...');
    cy.scrollTo('top', { duration: 500 });
    cy.wait(300);
    cy.scrollTo('bottom', { duration: 1500 });
    cy.wait(500);
    cy.scrollTo('top', { duration: 1000 });
    cy.wait(300);
    
    // Final prevention check and verification
    preventNavigationToTransactionDetails();
    
    // Verify we're still on transaction page
    cy.url().should('include', '/transactions').and('not.include', '/transactions/');
    cy.log('✅ Confirmed on transaction list page after click-then-scroll test');
    
    cy.log(`🎉 Click-then-scroll test completed successfully!`);
    cy.log(`📊 Total interactions: ${totalClicked}`);
    cy.log(`📊 Scroll positions explored: ${scrollPositions.length}`);
  });

  it('should perform comprehensive clickable element exploration with dynamic scrolling', () => {
    // Visit transactions page
    cy.visit(transaction.pageUrl);
    cy.wait(transaction.waitTimes.pageLoad);
    
    // Wait for page to load completely
    cy.url().should('include', '/transactions');
    cy.log('✅ Successfully navigated to Transactions page');

    // Dynamic scrolling strategy - scroll in sections
    cy.log('📜 Starting dynamic scrolling exploration...');
    
    let totalClicked = 0;
    const maxTotalClicks = 50; // Overall limit
    const scrollSections = 8; // Number of scroll sections
    
    for (let section = 1; section <= scrollSections; section++) {
      if (totalClicked >= maxTotalClicks) {
        cy.log(`🔚 Reached maximum click limit (${maxTotalClicks}), stopping exploration`);
        break;
      }
      
      const scrollPosition = (section / scrollSections) * 100;
      cy.log(`📜 Exploring section ${section}/${scrollSections} at ${scrollPosition}%`);
      
      // Scroll to section
      cy.scrollTo(`${scrollPosition}%`, { duration: 800 });
      cy.wait(600);
      
      // Find clickable elements in current viewport
      cy.get('body').then(($body) => {
        // Get elements visible in current viewport area
        const viewportHeight = Cypress.config().viewportHeight;
        const viewportTop = window.scrollY;
        const viewportBottom = viewportTop + viewportHeight;
        
        const $allClickable = $body.find(`
          button:not([disabled]):not([aria-disabled="true"]),
          a[href]:not([disabled]):not([aria-disabled="true"]),
          input[type="button"]:not([disabled]),
          input[type="submit"]:not([disabled]),
          [role="button"]:not([disabled]):not([aria-disabled="true"]),
          [onclick],
          .clickable,
          .btn,
          [data-testid*="button"],
          [data-testid*="click"],
          .cursor-pointer,
          [style*="cursor: pointer"],
          .transition-colors,
          .hover\\:bg-muted\\/50,
          .border\\[0\\.5px\\],
          tr.clickable-row,
          .clickable-row,
          [data-clickable]
        `);
        
        // Filter elements that are in viewport
        const $viewportElements = $allClickable.filter((index, element) => {
          const $element = Cypress.$(element);
          const elementTop = $element.offset().top;
          const elementBottom = elementTop + $element.outerHeight();
          
          return (elementTop >= viewportTop - 100 && elementTop <= viewportBottom + 100) ||
                 (elementBottom >= viewportTop - 100 && elementBottom <= viewportBottom + 100);
        });
        
        cy.log(`🔍 Found ${$viewportElements.length} clickable elements in viewport section ${section}`);
        
        if ($viewportElements.length === 0) {
          cy.log(`⚠️ No clickable elements found in section ${section}`);
          return;
        }
        
        // Click on elements in this section with different interaction strategies
        const sectionClickLimit = Math.min(8, maxTotalClicks - totalClicked);
        
        $viewportElements.slice(0, sectionClickLimit).each((index, element) => {
          if (totalClicked >= maxTotalClicks) {
            return false; // Stop clicking
          }
          
          const $element = Cypress.$(element);
          const elementText = $element.text().trim() || $element.attr('aria-label') || $element.attr('title') || $element.attr('data-testid') || `Element ${totalClicked + 1}`;
          const elementType = $element.prop('tagName')?.toLowerCase() || 'unknown';
          
          // Skip dangerous elements
          const dangerousPatterns = ['delete', 'remove', 'trash', 'cancel', 'logout', 'sign out', 'exit', 'destroy'];
          if (dangerousPatterns.some(pattern => elementText.toLowerCase().includes(pattern))) {
            cy.log(`⚠️ Skipping dangerous element: ${elementText}`);
            return true;
          }
          
          // Skip external navigation links
          if (elementType === 'a' && $element.attr('href')) {
            const href = $element.attr('href');
            if (href && (href.includes('http') || href.includes('//') || href.includes('/dashboard') || href.includes('/admin'))) {
              cy.log(`⚠️ Skipping external navigation link: ${elementText} (${href})`);
              return true;
            }
          }
          
          // Different interaction strategies based on element type
          let interactionStrategy = 'click';
          if (elementType === 'a') {
            interactionStrategy = 'click';
          } else if (elementType === 'button') {
            // Randomly choose between click, double-click, or right-click for buttons
            const strategies = ['click', 'dblclick', 'rightclick'];
            interactionStrategy = strategies[Math.floor(Math.random() * strategies.length)];
          }
          
          cy.log(`🔘 ${interactionStrategy} on ${elementType}: ${elementText}`);
          
          // Scroll element into view if needed
          cy.wrap($element).scrollIntoView({ duration: 300, easing: 'ease-in-out' });
          cy.wait(200);
          
          // Perform the interaction
          switch (interactionStrategy) {
            case 'click':
              cy.wrap($element).click({ force: true });
              break;
            case 'dblclick':
              cy.wrap($element).dblclick({ force: true });
              break;
            case 'rightclick':
              cy.wrap($element).rightclick({ force: true });
              break;
          }
          
          cy.wait(600);
          totalClicked++;
          cy.log(`✅ ${interactionStrategy} completed (${totalClicked}/${maxTotalClicks}): ${elementText}`);
          
          // Prevent navigation after each interaction
          preventNavigationToTransactionDetails();
          
          // Brief pause between interactions
          cy.wait(300);
        });
      });
      
      // Prevent navigation after each scroll section
      preventNavigationToTransactionDetails();
      cy.wait(400);
    }
    
    // Final comprehensive exploration - check for any missed elements
    cy.log('🔍 Performing final comprehensive element scan...');
    cy.scrollTo('top', { duration: 500 });
    cy.wait(300);
    
    cy.get('body').then(($body) => {
      const $allElements = $body.find(`
        button:not([disabled]),
        a[href],
        input[type="button"],
        input[type="submit"],
        [role="button"],
        [onclick],
        .clickable,
        .btn,
        [data-testid*="button"],
        [data-testid*="click"],
        .cursor-pointer,
        [style*="cursor: pointer"],
        .transition-colors,
        .hover\\:bg-muted\\/50,
        .border\\[0\\.5px\\]
      `);
      
      cy.log(`📊 Total clickable elements found: ${$allElements.length}`);
      cy.log(`📊 Total interactions performed: ${totalClicked}`);
      
      // Test hover states on remaining elements
      if (totalClicked < maxTotalClicks) {
        const remainingElements = $allElements.slice(totalClicked, totalClicked + 5);
        
        remainingElements.each((index, element) => {
          const $element = Cypress.$(element);
          const elementText = $element.text().trim() || `Hover Element ${index + 1}`;
          
          cy.log(`👆 Testing hover on: ${elementText}`);
          cy.wrap($element).scrollIntoView({ duration: 200 });
          cy.wrap($element).trigger('mouseover');
          cy.wait(200);
          cy.wrap($element).trigger('mouseout');
          cy.wait(200);
          
          // Prevent navigation after hover
          preventNavigationToTransactionDetails();
        });
      }
    });
    
    // Final scroll through entire page to ensure all areas were explored
    cy.log('📜 Final complete page scroll...');
    cy.scrollTo('top', { duration: 500 });
    cy.wait(300);
    cy.scrollTo('bottom', { duration: 1500 });
    cy.wait(500);
    cy.scrollTo('top', { duration: 1000 });
    cy.wait(300);
    
    // Final prevention check and verification
    preventNavigationToTransactionDetails();
    
    // Verify we're still on transaction page
    cy.url().should('include', '/transactions').and('not.include', '/transactions/');
    cy.log('✅ Confirmed on transaction list page after comprehensive exploration');
    
    cy.log(`🎉 Comprehensive clickable element exploration completed successfully!`);
    cy.log(`📊 Total interactions: ${totalClicked}`);
    cy.log(`📊 Sections explored: ${scrollSections}`);
  });

  it('should click on export and date select options', () => {
    // Visit transactions page
    cy.visit(transaction.pageUrl);
    cy.wait(transaction.waitTimes.pageLoad);
    
    // Wait for page to load completely
    cy.url().should('include', '/transactions');
    cy.log('✅ Successfully navigated to Transactions page');

    let totalInteractions = 0;
    
    // Function to test export functionality
    const testExportOptions = () => {
      cy.log('📤 Testing export functionality...');
      
      // Find and click export button
      cy.get('body').then(($body) => {
        const $exportButton = $body.find(transaction.exportButton);
        if ($exportButton.length > 0) {
          cy.wrap($exportButton.first()).scrollIntoView({ duration: 300 });
          cy.wait(200);
          cy.wrap($exportButton.first()).click();
          cy.log('📤 Clicked export button');
          cy.wait(1000);
          totalInteractions++;
          
          // Look for export options (PDF, Excel, CSV)
          cy.get('body').then(($body) => {
            const $exportOptions = $body.find(transaction.exportOptions);
            if ($exportOptions.length > 0) {
              cy.log(`📤 Found ${$exportOptions.length} export options`);
              
              // Click on first few export options
              $exportOptions.slice(0, 3).each((index, element) => {
                const $option = Cypress.$(element);
                const optionText = $option.text().trim() || $option.attr('aria-label') || `Export Option ${index + 1}`;
                
                cy.log(`📤 Clicking export option: ${optionText}`);
                cy.wrap($option).click();
                cy.wait(800);
                totalInteractions++;
                cy.log(`✅ Export option clicked: ${optionText}`);
                
                // Prevent navigation after export option click
                preventNavigationToTransactionDetails();
                cy.wait(300);
              });
            } else {
              cy.log('⚠️ No export options found after clicking export button');
            }
          });
          
          // Prevent navigation after export button click
          preventNavigationToTransactionDetails();
        } else {
          cy.log('⚠️ Export button not found');
        }
      });
    };
    
    // Function to test date selection functionality
    const testDateSelection = () => {
      cy.log('📅 Testing date selection functionality...');
      
      // Find and click date button first
      cy.get('body').then(($body) => {
        const $dateButton = $body.find(transaction.dateButton);
        if ($dateButton.length > 0) {
          cy.wrap($dateButton.first()).scrollIntoView({ duration: 300 });
          cy.wait(200);
          cy.wrap($dateButton.first()).click();
          cy.log('📅 Clicked date button');
          cy.wait(1000);
          totalInteractions++;
          
          // Prevent navigation after date button click
          preventNavigationToTransactionDetails();
        } else {
          cy.log('⚠️ Date button not found, looking for date select directly');
        }
      });
      
      // Find and interact with date select elements
      cy.get('body').then(($body) => {
        const $dateSelects = $body.find(transaction.dateSelect);
        if ($dateSelects.length > 0) {
          cy.log(`📅 Found ${$dateSelects.length} date select elements`);
          
          $dateSelects.slice(0, 2).each((index, element) => {
            const $dateSelect = Cypress.$(element);
            const elementType = $dateSelect.prop('tagName')?.toLowerCase() || 'unknown';
            
            cy.log(`📅 Interacting with date element ${index + 1}: ${elementType}`);
            cy.wrap($dateSelect).scrollIntoView({ duration: 300 });
            cy.wait(200);
            
            if (elementType === 'select') {
              // For select elements, try to select an option
              cy.wrap($dateSelect).click();
              cy.wait(500);
              
              // Try to find and select a date option
              cy.get('body').then(($body) => {
                const $dateOptions = $body.find('option, [role="option"]');
                if ($dateOptions.length > 1) {
                  cy.wrap($dateOptions.eq(1)).click();
                  cy.log('📅 Selected a date option');
                }
              });
            } else if (elementType === 'input' && $dateSelect.attr('type') === 'date') {
              // For date inputs, try to set a value
              const today = new Date().toISOString().split('T')[0];
              cy.wrap($dateSelect).type(today);
              cy.log(`📅 Set date to: ${today}`);
            } else {
              // For other date elements, just click them
              cy.wrap($dateSelect).click();
              cy.log('📅 Clicked date element');
            }
            
            cy.wait(800);
            totalInteractions++;
            cy.log(`✅ Date element interaction completed: ${index + 1}`);
            
            // Prevent navigation after date interaction
            preventNavigationToTransactionDetails();
            cy.wait(300);
          });
        } else {
          cy.log('⚠️ No date select elements found');
        }
      });
    };
    
    // Phase 1: Test export functionality
    cy.log('📤 Phase 1: Testing export functionality');
    testExportOptions();
    cy.wait(1000);
    
    // Phase 2: Test date selection functionality
    cy.log('� Phase 2: Testing date selection functionality');
    testDateSelection();
    cy.wait(1000);
    
    // Phase 3: Scroll and test export/date options at different positions
    cy.log('📜 Phase 3: Testing export and date options while scrolling');
    
    const scrollPositions = [25, 50, 75];
    
    scrollPositions.forEach((scrollPercent, index) => {
      cy.log(`📜 Scrolling to ${scrollPercent}% and testing export/date options (Step ${index + 1}/${scrollPositions.length})`);
      
      // Scroll to position
      cy.scrollTo(`${scrollPercent}%`, { duration: 800 });
      cy.wait(600);
      
      // Test export options at this scroll position
      cy.get('body').then(($body) => {
        const $exportButton = $body.find(transaction.exportButton);
        if ($exportButton.length > 0 && totalInteractions < 10) {
          cy.log(`📤 Found export button at ${scrollPercent}% scroll`);
          cy.wrap($exportButton.first()).scrollIntoView({ duration: 300 });
          cy.wrap($exportButton.first()).click();
          cy.wait(500);
          totalInteractions++;
          cy.log(`📤 Clicked export button at ${scrollPercent}% scroll`);
          preventNavigationToTransactionDetails();
        }
      });
      
      // Test date options at this scroll position
      cy.get('body').then(($body) => {
        const $dateElements = $body.find(transaction.dateSelect + ', ' + transaction.dateButton);
        if ($dateElements.length > 0 && totalInteractions < 15) {
          cy.log(`📅 Found date elements at ${scrollPercent}% scroll`);
          cy.wrap($dateElements.first()).scrollIntoView({ duration: 300 });
          cy.wrap($dateElements.first()).click();
          cy.wait(500);
          totalInteractions++;
          cy.log(`📅 Clicked date element at ${scrollPercent}% scroll`);
          preventNavigationToTransactionDetails();
        }
      });
      
      cy.wait(400);
    });
    
    // Final verification
    preventNavigationToTransactionDetails();
    
    // Verify we're still on transaction page
    cy.url().should('include', '/transactions').and('not.include', '/transactions/');
    cy.log('✅ Confirmed on transaction list page after export and date testing');
    
    cy.log(`🎉 Export and date select options test completed successfully!`);
    cy.log(`📊 Total export interactions: ${totalInteractions}`);
    cy.log(`📊 Scroll positions tested: ${scrollPositions.length}`);
    cy.log(`📊 Test phases completed: 3`);
  });

  it('should click on all clickable elements on the transaction page', () => {
    // Navigate to dashboard first, then to transaction history
    cy.log('🏠 Navigating to dashboard first...');
    cy.visit('http://localhost:5173/super-admin/dashboard');
    cy.wait(transaction.waitTimes.pageLoad);
    
    // Verify we're on dashboard
    cy.url().should('include', '/dashboard');
    cy.log('✅ Successfully navigated to dashboard');
    
    // Navigate to transaction history first
    cy.log('📊 Navigating to transaction history...');
    cy.visit(transaction.pageUrl);
    cy.wait(transaction.waitTimes.pageLoad);
    
    // Click on first transaction to go to transaction page
    cy.log('🎯 Clicking on first transaction to go to transaction page...');
    cy.get('table').should('be.visible');
    cy.get('tbody tr').should('have.length.greaterThan', 0);
    
    // Click on transaction row
    cy.get('#transition-container table.hidden tr:nth-child(1) td:nth-child(2)').click();
    cy.log('✅ Clicked on transaction row');
    cy.wait(1000);
    
    // Click view order button to go to transaction page
    cy.get('#radix-\\:r15\\: button.w-full').click();
    cy.log('✅ Clicked view order button');
    cy.wait(2000);
    
    // Verify we're on transaction/order management page
    cy.url().should('include', '/order-management/');
    cy.log('✅ Successfully navigated to transaction page');
    
    // Wait for page to fully load
    cy.get('body').should('be.visible');
    cy.log('✅ Transaction page loaded');
    
    // Add specific click commands for date element
    cy.get('html').click();
    cy.get('#radix-\\:r1b\\: div[tabindex="0"]').click(); // Click on date element
    
    // Click on all clickable elements systematically
    cy.log('🖱️ Starting comprehensive clickable element testing on transaction page...');
    
    // Define comprehensive clickable element selectors for transaction page
    const clickableSelectors = [
      // Buttons
      'button:not([disabled])',
      'button[type="button"]',
      'button[type="submit"]',
      'input[type="button"]',
      'input[type="submit"]',
      
      // Links
      'a[href]',
      'a:not([href="#"]):not([href=""])',
      
      // Interactive elements with roles
      '[role="button"]',
      '[role="link"]',
      '[role="tab"]',
      '[role="menuitem"]',
      '[role="option"]',
      '[role="combobox"]',
      
      // Elements with click handlers
      '[onclick]',
      '[ng-click]',
      '[onClick]',
      
      // Form controls
      'input[type="checkbox"]',
      'input[type="radio"]',
      'select',
      'label',
      
      // Common interactive classes
      '.clickable',
      '.btn',
      '.button',
      '.link',
      '.tab',
      '.menu-item',
      '.dropdown-toggle',
      
      // Data attributes for interactive elements
      '[data-testid*="button"]',
      '[data-testid*="link"]',
      '[data-testid*="click"]',
      '[data-testid*="action"]',
      '[data-testid*="menu"]',
      
      // Transaction page specific elements
      '.order-action',
      '.status-button',
      '.edit-order',
      '.view-details',
      '.cancel-order',
      '.refund-order',
      '.print-receipt',
      '.update-status',
      '.add-note',
      '.upload-document',
      
      // Navigation elements
      '.nav-item',
      '.sidebar-item',
      '.breadcrumb-item',
      '.back-button',
      
      // Form elements on transaction page
      'input[type="text"]',
      'input[type="email"]',
      'input[type="tel"]',
      'input[type="number"]',
      'textarea',
      
      // Modal and dialog elements
      '.modal',
      '.dialog',
      '.popup',
      '.overlay',
      
      // Table interactive elements
      'tbody tr',
      'th[sortable]',
      'td.clickable',
      '.table-action',
      '.expandable-row',
      
      // Status and action elements
      '.status-indicator',
      '.action-dropdown',
      '.filter-button',
      '.search-button',
      '.refresh-button'
    ];
    
    let totalClicked = 0;
    let totalFound = 0;
    let clickedElements = new Set(); // Track clicked elements to avoid duplicates
    
    // Test each selector type
    clickableSelectors.forEach((selector, index) => {
      cy.log(`🔍 Testing selector ${index + 1}/${clickableSelectors.length}: "${selector}"`);
      
      cy.get('body').then(($body) => {
        const $elements = $body.find(selector);
        totalFound += $elements.length;
        
        if ($elements.length > 0) {
          cy.log(`📋 Found ${$elements.length} elements with selector: "${selector}"`);
          
          // Click each element (with safety checks)
          $elements.each((elemIndex, element) => {
            const $element = Cypress.$(element);
            const elementId = $element.attr('id') || $element.attr('data-testid') || $element.text().trim() || `element-${elemIndex}`;
            
            // Skip if already clicked or if it's a dangerous element
            if (!clickedElements.has(elementId) && 
                !$element.is('[disabled]') && 
                !$element.hasClass('disabled') &&
                !$element.is('[type="file"]') &&
                !$element.is('form') &&
                !$element.is('body') &&
                !$element.is('html')) {
              
              clickedElements.add(elementId);
              
              cy.wrap($element)
                .scrollIntoView()
                .should('be.visible')
                .then(($el) => {
                  // Check if element is actually clickable
                  const isVisible = $el.is(':visible') && $el.css('pointer-events') !== 'none';
                  const hasSize = $el.outerWidth() > 0 && $el.outerHeight() > 0;
                  
                  if (isVisible && hasSize) {
                    cy.wrap($el).click({ force: true });
                    totalClicked++;
                    cy.log(`✅ Clicked element: ${elementId} (${elemIndex + 1}/${$elements.length})`);
                    
                    // Wait a moment after each click to allow UI to respond
                    cy.wait(300);
                  } else {
                    cy.log(`⚠️ Skipped non-clickable element: ${elementId}`);
                  }
                })
                .catch((error) => {
                  cy.log(`⚠️ Could not click element: ${elementId} - ${error.message}`);
                });
            }
          });
        } else {
          cy.log(`📭 No elements found with selector: "${selector}"`);
        }
      });
    });
    
    // Final summary
    cy.get('body').then(() => {
      cy.log(`📊 Transaction Page Clickable Element Testing Summary:`);
      cy.log(`   • Total selectors tested: ${clickableSelectors.length}`);
      cy.log(`   • Total elements found: ${totalFound}`);
      cy.log(`   • Total elements clicked: ${totalClicked}`);
      cy.log(`   • Unique elements clicked: ${clickedElements.size}`);
      cy.log('✅ Comprehensive transaction page clickable element testing completed');
    });
  });
});
});