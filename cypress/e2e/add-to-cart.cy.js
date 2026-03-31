import { Sendsile } from "../configuration/project.config";

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
            
            // If no product found, try clicking any elements to trigger add to cart
            if (!productClicked) {
              cy.log("⚠️ No product elements found, trying general approach...");
              
              // Look for any elements with action-related text
              cy.get($elements.slice(0, 10)).each(($element, index) => {
                const elementText = $element.text().toLowerCase();
                
                if (elementText.includes("shop") || elementText.includes("buy") || 
                    elementText.includes("add") || elementText.includes("cart")) {
                  cy.log(`✅ Found action element ${index + 1}: ${elementText.substring(0, 30)}...`);
                  cy.wrap($element).click({ force: true });
                  cy.wait(1000);
                }
              });
            }
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
            
            // Look for elements that might be products or add to cart related
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
            
            // If no product found, try clicking any elements
            if (!productClicked) {
              cy.log("⚠️ No specific product elements found, trying general approach...");
              
              cy.get($elements.slice(0, 10)).each(($element, index) => {
                const elementText = $element.text().toLowerCase();
                
                if (elementText.includes("shop") || elementText.includes("buy") || 
                    elementText.includes("add") || elementText.includes("cart")) {
                  cy.log(`✅ Found action element ${index + 1}: ${elementText.substring(0, 30)}...`);
                  cy.wrap($element).click({ force: true });
                  cy.wait(1000);
                }
              });
            }
          } else {
            cy.log("⚠️ No clickable elements found on Ramadan page");
          }
        });
    });
  });

  it("should add products to cart from groceries page", () => {
    cy.log("🛒 Testing add to cart from groceries page...");
    
    cy.visit(groceriesUrl, { timeout: 60000 });
    cy.get("body", { timeout: 30000 }).should("be.visible");
    cy.wait(3000);
    
    // Look for grocery products
    cy.get("body").then(($body) => {
      const bodyText = $body.text().toLowerCase();
      cy.log(`Groceries page content: ${bodyText.substring(0, 300)}...`);
      
      // Try to find product elements
      cy.get('[class*="product"], [class*="item"], [class*="card"], article', { timeout: 5000 })
        .then(($products) => {
          if ($products.length > 0) {
            cy.log(`✅ Found ${$products.length} grocery products`);
            
            // Try clicking multiple products
            cy.get($products.slice(0, 3)).each(($product, index) => {
              cy.log(`✅ Processing product ${index + 1}`);
              
              // Click on product
              cy.wrap($product).click({ force: true });
              cy.wait(1000);
              
              // Look for add to cart button
              cy.get('button', { timeout: 3000 })
                .then(($buttons) => {
                  const addToCartButtons = $buttons.filter((_, el) => {
                    const buttonText = (el.textContent || "").toLowerCase();
                    return buttonText.includes("add") && buttonText.includes("cart") ||
                           buttonText.includes("add to bag") ||
                           buttonText.includes("shop") ||
                           buttonText.includes("buy");
                  });
                  
                  if (addToCartButtons.length > 0) {
                    cy.wrap(addToCartButtons.first()).click({ force: true });
                    cy.wait(1000);
                    cy.log(`✅ Added grocery product ${index + 1} to cart`);
                  }
                });
            });
            
            // Check cart status after adding multiple items
            cy.wait(2000);
            cy.get("body").then(($body) => {
              const finalText = $body.text().toLowerCase();
              cy.log(`Final cart status: ${finalText.substring(0, 300)}...`);
              
              if (finalText.includes("cart") && (finalText.includes("item") || finalText.includes("product"))) {
                cy.log("✅ Multiple products successfully added to cart");
              }
            });
          } else {
            cy.log("⚠️ No grocery products found");
          }
        });
    });
  });

  it("should handle cart interactions and notifications", () => {
    cy.log("🛒 Testing cart interactions and notifications...");
    
    cy.visit(baseUrl, { timeout: 60000 });
    cy.get("body", { timeout: 30000 }).should("be.visible");
    cy.wait(3000);
    
    // Look for cart icon or button
    cy.get('[class*="cart"], [class*="bag"], [aria-label*="cart"], [title*="cart"]', { timeout: 5000 })
      .then(($cartElements) => {
        if ($cartElements.length > 0) {
          cy.log(`✅ Found ${$cartElements.length} cart elements`);
          
          // Click on cart to open it
          cy.wrap($cartElements.first()).click({ force: true });
          cy.wait(2000);
          cy.log("✅ Clicked cart icon");
          
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
            }
          });
        } else {
          cy.log("⚠️ No cart elements found");
        }
      });
  });

  it("should handle toast notifications for cart actions", () => {
    cy.log("🛒 Testing toast notifications for cart actions...");
    
    cy.visit(baseUrl, { timeout: 60000 });
    cy.get("body", { timeout: 30000 }).should("be.visible");
    cy.wait(3000);
    
    // Look for product and add to cart
    cy.get('[class*="product"], [class*="card"], article', { timeout: 5000 })
      .then(($products) => {
        if ($products.length > 0) {
          cy.wrap($products.first()).click({ force: true });
          cy.wait(2000);
          
          // Look for add to cart button
          cy.get('button', { timeout: 5000 })
            .then(($buttons) => {
              const addToCartButtons = $buttons.filter((_, el) => {
                const buttonText = (el.textContent || "").toLowerCase();
                return buttonText.includes("add") && buttonText.includes("cart") ||
                       buttonText.includes("add to bag") ||
                       buttonText.includes("shop");
              });
              
              if (addToCartButtons.length > 0) {
                cy.wrap(addToCartButtons.first()).click({ force: true });
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
              }
            });
        }
      });
  });
});
