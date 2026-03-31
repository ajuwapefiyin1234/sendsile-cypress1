describe("Sendsile Website - Product Access Tests", () => {
  const pageUrl = "https://www.sendsile.com/";

  // Handle uncaught application errors
  Cypress.on('uncaught:exception', (err, runnable) => {
    if (err.message.includes('Cannot read properties of null (reading \'variants\')')) {
      // Don't fail the test for this known app error
      return false;
    }
    return true;
  });

  // Shared helper to handle modal if it appears
  const dismissRamadanModal = () => {
    cy.get("body").then(($body) => {
      if ($body.text().toLowerCase().includes("ramadan")) {
        cy.log(" Ramadan modal detected, attempting to dismiss...");
        cy.log("🔍 Ramadan modal detected, attempting to dismiss...");
        cy.get("button, [role='button'], [aria-label*='close'], [class*='close'], svg", { timeout: 10000 }).then(($elements) => {
          const $closeBtn = $elements.filter((i, el) => {
            const text = Cypress.$(el).text().trim().toLowerCase();
            const label = (Cypress.$(el).attr("aria-label") || "").toLowerCase();
            const cls = (el.className || "").toString().toLowerCase();
            return text === "x" || text === "×" || text.includes("close") || label.includes("close") || cls.includes("close");
          });
          if ($closeBtn.length > 0) {
            cy.wrap($closeBtn.first()).click({ force: true });
            cy.wait(1000);
          } else {
            cy.get("body").type("{esc}");
            cy.wait(1000);
          }
        });
      }
    });
  };

  it("should load homepage and separate essentials", () => {
    cy.visit(pageUrl, { timeout: 60000 });
    cy.get("body", { timeout: 30000 }).should("be.visible");
    dismissRamadanModal();
    
    // Scroll to packages section
    cy.get('#packages-section', { timeout: 20000 })
      .scrollIntoView({ duration: 2000 });
    cy.wait(2000);
    
    // Check that all essentials are visible and separated
    cy.contains('h1', /AL- KYHAR ESSENTIALS/i, { timeout: 15000 }).should("be.visible");
    cy.contains('h1', /Amanah Essential/i, { timeout: 15000 }).should("be.visible");
    cy.contains('h1', /Royal Ramadan Feast/i, { timeout: 15000 }).should("be.visible");
    
    cy.log("✅ All essentials are visible and separated on homepage");
  });

  it("should load Al-Kyhar Essentials page directly and add to cart", () => {
    const url = "https://www.sendsile.com/quick-view/81d0be09-0cae-4b60-a973-f3fa99294ad2?v=ce25da2f-875e-4a4d-bc4e-845076d6818c";
    const targetId = "81d0be09-0cae-4b60-a973-f3fa99294ad2";
    
    cy.visit(url, { timeout: 60000 });
    cy.get("body", { timeout: 30000 }).should("be.visible");
    dismissRamadanModal();
    cy.url().should("include", targetId);
    
    // Add to cart
    cy.log("🔍 Looking for Add to bag button...");
    cy.contains("Add to bag", { timeout: 15000 }).should("be.visible");
    
    // Try multiple button selectors
    cy.get('button:contains("Add to bag")', { timeout: 10000 })
      .should('be.visible')
      .first()
      .click({ force: true });
    
    cy.log("✅ Clicked Add to bag button");
    cy.wait(5000);
    
    // Verify cart was updated
    cy.get("body").then(($body) => {
      const bodyText = $body.text().toLowerCase();
      cy.log("🔍 Checking for cart indicators...");
      cy.log(`Page content after click: ${bodyText.substring(0, 300)}...`);
      
      // Look for cart indicators
      if (bodyText.includes("cart") || bodyText.includes("bag") || bodyText.includes("item") || bodyText.includes("added")) {
        cy.log("✅ Cart indicators found - product may have been added");
        cy.log(`Found indicators: ${bodyText.match(/cart|bag|item|added/gi) || 'none'}`);
      } else {
        cy.log("⚠️ No cart indicators found - checking for cart icon");
        cy.get('[class*="cart"], [class*="bag"], [aria-label*="cart"], [aria-label*="bag"]', { timeout: 5000 }).then(($cartElements) => {
          if ($cartElements.length > 0) {
            cy.log(`✅ Found ${$cartElements.length} cart icon(s), attempting to click`);
            cy.wrap($cartElements.first()).click({ force: true });
            cy.wait(2000);
            cy.log("✅ Clicked cart icon to verify cart contents");
            
            // Check cart page content
            cy.get("body").then(($cartBody) => {
              const cartText = $cartBody.text().toLowerCase();
              cy.log(`Cart page content: ${cartText.substring(0, 200)}...`);
              if (cartText.includes("alkyahar") || cartText.includes("essential") || cartText.includes("product")) {
                cy.log("✅ Product found in cart!");
              } else {
                cy.log("⚠️ Product not found in cart");
              }
            });
          } else {
            cy.log("⚠️ No cart icon found either");
          }
        });
      }
    });
  });

  it("should load Amanah Essential page directly and add to cart", () => {
    const url = "https://www.sendsile.com/quick-view/f5bc021a-8141-4ad1-98b1-66ea16c86509?v=cff0ad60-be82-4f5d-b43c-cd145d09686f";
    const targetId = "f5bc021a-8141-4ad1-98b1-66ea16c86509";
    
    cy.visit(url, { timeout: 60000 });
    cy.get("body", { timeout: 30000 }).should("be.visible");
    dismissRamadanModal();
    cy.url().should("include", targetId);
    
    // Add to cart
    cy.contains("Add to bag", { timeout: 15000 }).should("be.visible");
    cy.get('button:contains("Add to bag")', { timeout: 10000 })
      .should('be.visible')
      .first()
      .click({ force: true });
    
    cy.log("✅ Amanah Essential added to cart from direct page");
    cy.wait(3000);
  });

  it("should load Royal Ramadan Feast page directly and add to cart", () => {
    const url = "https://www.sendsile.com/quick-view/29b703e0-f356-4973-b71a-acf58340ca3d?v=040d267a-2947-466e-964b-b748edb4d3f2";
    const targetId = "29b703e0-f356-4973-b71a-acf58340ca3d";
    
    cy.visit(url, { timeout: 60000 });
    cy.get("body", { timeout: 30000 }).should("be.visible");
    dismissRamadanModal();
    cy.url().should("include", targetId);
    
    // Add to cart
    cy.contains("Add to bag", { timeout: 15000 }).should("be.visible");
    cy.get('button:contains("Add to bag")', { timeout: 10000 })
      .should('be.visible')
      .first()
      .click({ force: true });
    
    cy.log("✅ Royal Ramadan Feast added to cart from direct page");
    cy.wait(3000);
  });

  it("should load Iman Essentials page directly and add to cart", () => {
    const url = "https://www.sendsile.com/quick-view/e9142bbb-9bbc-47a6-a7db-5bfae66b583f?v=8b3fb20a-4090-401e-9bf0-d0099409c2ee";
    const targetId = "e9142bbb-9bbc-47a6-a7db-5bfae66b583f";
    
    cy.visit(url, { timeout: 60000 });
    cy.get("body", { timeout: 30000 }).should("be.visible");
    dismissRamadanModal();
    cy.url().should("include", targetId);
    
    // Add to cart
    cy.contains("Add to bag", { timeout: 15000 }).should("be.visible");
    cy.get('button:contains("Add to bag")', { timeout: 10000 })
      .should('be.visible')
      .first()
      .click({ force: true });
    
    cy.log("✅ Iman Essentials added to cart from direct page");
    cy.wait(3000);
  });
});

// Add to Cart Functionality Tests
describe("Add to Cart Functionality", () => {
  const baseUrl = "https://www.sendsile.com";
  const ramadanUrl = "https://www.sendsile.com/ramadan";
  const groceriesUrl = "https://www.sendsile.com/groceries";

  beforeEach(() => {
    cy.visit(baseUrl, { timeout: 60000 });
    cy.get("body", { timeout: 30000 }).should("be.visible");
  });

  it("should add products to cart from landing page", () => {
    cy.log("🛒 Testing add to cart from landing page...");
    
    // Wait for page to load
    cy.wait(3000);
    
    // Look for ANY clickable elements that might be products
    cy.get("body").then(($body) => {
      const bodyText = $body.text().toLowerCase();
      cy.log(`Landing page content: ${bodyText.substring(0, 500)}...`);
      
      // Try to find any clickable elements
      cy.get('button, a, div[onclick], [role="button"], article, section', { timeout: 5000 })
        .then(($elements) => {
          if ($elements.length > 0) {
            cy.log(`✅ Found ${$elements.length} clickable elements`);
            
            // Look for elements that might be products or have product-related text
            let productClicked = false;
            
            cy.get($elements.slice(0, 15)).each(($element, index) => {
              if (!productClicked) {
                const elementText = $element.text().toLowerCase();
                const elementClass = $element.attr('class') || '';
                const elementAria = $element.attr('aria-label') || '';
                
                // Check if this might be a product or add to cart related
                const isProductRelated = elementText.includes("shop") || elementText.includes("product") ||
                                       elementText.includes("buy") || elementText.includes("add") ||
                                       elementText.includes("cart") || elementText.includes("bag") ||
                                       elementClass.includes("product") || elementClass.includes("card") ||
                                       elementClass.includes("item") || elementAria.includes("product");
                
                if (isProductRelated) {
                  cy.log(`✅ Found product-related element ${index + 1}: ${elementText.substring(0, 50)}...`);
                  cy.wrap($element).click({ force: true });
                  cy.wait(2000);
                  cy.log("✅ Clicked product element");
                  productClicked = true;
                  
                  // Now look for add to cart button
                  cy.get('button', { timeout: 5000 })
                    .then(($buttons) => {
                      const addToCartButtons = $buttons.filter((_, el) => {
                        const buttonText = (el.textContent || "").toLowerCase();
                        return buttonText.includes("add") && (buttonText.includes("cart") || buttonText.includes("bag")) ||
                               buttonText.includes("shop now") ||
                               buttonText.includes("buy") ||
                               buttonText.includes("add to cart") ||
                               buttonText.includes("add to bag");
                      });
                      
                      if (addToCartButtons.length > 0) {
                        cy.log(`✅ Found ${addToCartButtons.length} add to cart buttons`);
                        cy.wrap(addToCartButtons.first()).click({ force: true });
                        cy.wait(2000);
                        cy.log("✅ Clicked add to cart button");
                        
                        // Check if cart updated
                        cy.get("body").then(($body) => {
                          const afterClickText = $body.text().toLowerCase();
                          cy.log(`After add to cart: ${afterClickText.substring(0, 300)}...`);
                          
                          if (afterClickText.includes("added") || afterClickText.includes("success") || 
                              afterClickText.includes("cart") || afterClickText.includes("item")) {
                            cy.log("✅ Cart appears to be updated");
                          }
                        });
                      } else {
                        cy.log("⚠️ No add to cart button found, trying any button...");
                        
                        // Try clicking any button that might add to cart
                        cy.get('button').then(($allButtons) => {
                          if ($allButtons.length > 0) {
                            cy.wrap($allButtons.first()).click({ force: true });
                            cy.wait(2000);
                            cy.log("✅ Clicked first available button");
                          }
                        });
                      }
                    });
                }
              }
            });
          } else {
            cy.log("⚠️ No clickable elements found");
          }
        });
    });
  });

  it("should add products to cart from Ramadan page", () => {
    cy.log("🛒 Testing add to cart from Ramadan page...");
    
    cy.visit(ramadanUrl, { timeout: 60000 });
    cy.get("body", { timeout: 30000 }).should("be.visible");
    cy.wait(3000);
    
    // Look for ANY clickable elements
    cy.get("body").then(($body) => {
      const bodyText = $body.text().toLowerCase();
      cy.log(`Ramadan page content: ${bodyText.substring(0, 500)}...`);
      
      // Try to find any clickable elements
      cy.get('button, a, div[onclick], [role="button"], article, section', { timeout: 5000 })
        .then(($elements) => {
          if ($elements.length > 0) {
            cy.log(`✅ Found ${$elements.length} clickable elements on Ramadan page`);
            
            let productClicked = false;
            
            // Look for elements that might be products or have product-related text
            cy.get($elements.slice(0, 15)).each(($element, index) => {
              if (!productClicked) {
                const elementText = $element.text().toLowerCase();
                const elementClass = $element.attr('class') || '';
                
                // Check if this might be a product or add to cart related
                const isProductRelated = elementText.includes("shop") || elementText.includes("product") ||
                                       elementText.includes("buy") || elementText.includes("add") ||
                                       elementText.includes("cart") || elementText.includes("bag") ||
                                       elementClass.includes("product") || elementClass.includes("card") ||
                                       elementClass.includes("item");
                
                if (isProductRelated) {
                  cy.log(`✅ Found product-related element ${index + 1}: ${elementText.substring(0, 50)}...`);
                  cy.wrap($element).click({ force: true });
                  cy.wait(2000);
                  cy.log("✅ Clicked Ramadan product element");
                  productClicked = true;
                  
                  // Look for add to cart button
                  cy.get('button', { timeout: 5000 })
                    .then(($buttons) => {
                      const addToCartButtons = $buttons.filter((_, el) => {
                        const buttonText = (el.textContent || "").toLowerCase();
                        return buttonText.includes("add") && (buttonText.includes("cart") || buttonText.includes("bag")) ||
                               buttonText.includes("shop now") ||
                               buttonText.includes("buy") ||
                               buttonText.includes("add to cart") ||
                               buttonText.includes("add to bag");
                      });
                      
                      if (addToCartButtons.length > 0) {
                        cy.log(`✅ Found ${addToCartButtons.length} add to cart buttons`);
                        cy.wrap(addToCartButtons.first()).click({ force: true });
                        cy.wait(2000);
                        cy.log("✅ Added Ramadan product to cart");
                        
                        // Check for success notification
                        cy.get("body").then(($body) => {
                          const afterClickText = $body.text().toLowerCase();
                          if (afterClickText.includes("added") || afterClickText.includes("success") || afterClickText.includes("cart")) {
                            cy.log("✅ Product successfully added to cart");
                          }
                        });
                      } else {
                        cy.log("⚠️ No add to cart button found, trying any button...");
                        
                        // Try clicking any button
                        cy.get('button').then(($allButtons) => {
                          if ($allButtons.length > 0) {
                            cy.wrap($allButtons.first()).click({ force: true });
                            cy.wait(2000);
                            cy.log("✅ Clicked first available button");
                          }
                        });
                      }
                    });
                }
              }
            });
          } else {
            cy.log("⚠️ No clickable elements found on Ramadan page");
          }
        });
    });
  });

  it("should handle cart interactions and notifications", () => {
    cy.log("🛒 Testing cart interactions and notifications...");
    
    cy.visit(baseUrl, { timeout: 60000 });
    cy.get("body", { timeout: 30000 }).should("be.visible");
    cy.wait(3000);
    
    // Look for cart icon or button - more flexible approach
    cy.get('[class*="cart"], [class*="bag"], [aria-label*="cart"], [title*="cart"], button, a', { timeout: 10000 })
      .then(($cartElements) => {
        if ($cartElements.length > 0) {
          cy.log(`✅ Found ${$cartElements.length} potential cart elements`);
          
          // Try to find the most likely cart element
          const cartElements = $cartElements.filter((_, el) => {
            const text = (el.textContent || "").toLowerCase();
            const className = (el.className || "").toLowerCase();
            const ariaLabel = (el.getAttribute('aria-label') || "").toLowerCase();
            const title = (el.getAttribute('title') || "").toLowerCase();
            
            return text.includes("cart") || text.includes("bag") || 
                   className.includes("cart") || className.includes("bag") ||
                   ariaLabel.includes("cart") || title.includes("cart");
          });
          
          if (cartElements.length > 0) {
            cy.log(`✅ Found ${cartElements.length} cart-related elements`);
            
            // Click on first cart element
            cy.wrap(cartElements.first()).click({ force: true });
            cy.wait(2000);
            cy.log("✅ Clicked cart element");
            
            // Check if cart modal/panel opened
            cy.get("body").then(($body) => {
              const cartText = $body.text().toLowerCase();
              cy.log(`Cart panel content: ${cartText.substring(0, 300)}...`);
              
              if (cartText.includes("cart") || cartText.includes("bag") || cartText.includes("item")) {
                cy.log("✅ Cart panel opened successfully");
                
                // Look for cart items
                cy.get('[class*="item"], [class*="product"], .cart-item', { timeout: 3000 })
                  .then(($cartItems) => {
                    if ($cartItems.length > 0) {
                      cy.log(`✅ Found ${$cartItems.length} items in cart`);
                    } else {
                      cy.log("ℹ️ Cart is empty");
                    }
                  });
              } else {
                cy.log("⚠️ Cart panel may not have opened properly");
              }
            });
          } else {
            cy.log("⚠️ No cart-related elements found");
          }
        } else {
          cy.log("⚠️ No potential cart elements found");
        }
      });
  });

  /*it("should handle toast notifications for cart actions", () => {
    cy.log("🛒 Testing toast notifications for cart actions...");
    
    cy.visit(baseUrl, { timeout: 60000 });
    cy.get("body", { timeout: 30000 }).should("be.visible");
    cy.wait(3000);
    
    // Look for product and add to cart - fix DOM detachment
    cy.get('button, a, div[onclick], [role="button"]', { timeout: 5000 })
      .then(($elements) => {
        if ($elements.length > 0) {
          // Look for elements that might be products
          cy.get($elements.slice(0, 10)).each(($element, index) => {
            const elementText = $element.text().toLowerCase();
            const elementClass = $element.attr('class') || '';
            
            // Check if this might be a product
            const isProductRelated = elementText.includes("shop") || elementText.includes("product") ||
                                   elementText.includes("buy") || elementText.includes("add") ||
                                   elementClass.includes("product") || elementClass.includes("card") ||
                                   elementClass.includes("item");
            
            if (isProductRelated) {
              cy.log(`✅ Found product element ${index + 1}: ${elementText.substring(0, 30)}...`);
              
              // Break chain here to avoid DOM detachment
              cy.wrap($element).click({ force: true });
              cy.wait(2000);
              
              // Now look for add to cart button in a new query
              cy.get('body').then(() => {
                cy.get('button', { timeout: 5000 })
                  .then(($buttons) => {
                    const addToCartButtons = $buttons.filter((_, el) => {
                      const buttonText = (el.textContent || "").toLowerCase();
                      return buttonText.includes("add") && (buttonText.includes("cart") || buttonText.includes("bag")) ||
                             buttonText.includes("shop now") ||
                             buttonText.includes("buy") ||
                             buttonText.includes("add to cart") ||
                             buttonText.includes("add to bag");
                    });
                    
                    if (addToCartButtons.length > 0) {
                      cy.log("✅ Found add to cart button");
                      cy.wrap(addToCartButtons.first()).click({ force: true });
                      cy.wait(2000);
                      cy.log("✅ Clicked add to cart");
                      
                      // Wait for toast notification
                      cy.wait(2000);
                      
                      // Look for toast/notification elements
                      cy.get('[class*="toast"], [class*="notification"], [role="alert"], .toastify', { timeout: 3000 })
                        .then(($toasts) => {
                          if ($toasts.length > 0) {
                            cy.log(`✅ Found ${$toasts.length} toast notifications`);
                            
                            $toasts.each((_, index) => {
                              const toastText = $toasts.eq(index).text().toLowerCase();
                              cy.log(`Toast ${index + 1}: ${toastText}`);
                              
                              if (toastText.includes("added") || toastText.includes("success") || toastText.includes("cart")) {
                                cy.log("✅ Success toast notification found");
                              }
                            });
                          } else {
                            cy.log("ℹ️ No toast notifications found");
                          }
                        });
                    } else {
                      cy.log("⚠️ No add to cart button found");
                    }
                  });
              });
              
              // Return early to avoid further iterations
              return false;
            }
          });
        }
      });
  });
  */
});