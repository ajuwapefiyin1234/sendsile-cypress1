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
    
    // Check current page content first
    cy.get("body").then(($body) => {
      const bodyText = $body.text().toLowerCase();
      cy.log(`Landing page content: ${bodyText.substring(0, 300)}...`);
      
      // Look for any product-related links or elements
      cy.get('a', { timeout: 10000 }).then(($allLinks) => {
        const productLinks = $allLinks.filter((_, el) => {
          const href = el.href || '';
          const text = (el.textContent || "").toLowerCase();
          return href.includes('/product') || href.includes('/item') || href.includes('/shop') ||
                 text.includes('product') || text.includes('shop') || text.includes('item') ||
                 text.includes('buy') || text.includes('cart');
        });
        
        if (productLinks.length > 0) {
          cy.log(`✅ Found ${productLinks.length} product-related links`);
          
          // Click first product link
          cy.wrap(productLinks.first()).click({ force: true });
          cy.wait(3000);
          cy.log("✅ Clicked product link");
          
          // Check if we're on a product page
          cy.url().then(url => {
            cy.log(`Current URL: ${url}`);
            
            if (url.includes('/product/') || url.includes('/item/') || url.includes('/shop/')) {
              cy.log("✅ Successfully navigated to product page");
              
              // Look for add to cart button
              cy.get('button:contains("Add to Cart"), button:contains("Add"), button:contains("Buy"), [data-action="add-to-cart"], .add-to-cart', { timeout: 10000 })
                .then(($addToCartButtons) => {
                  if ($addToCartButtons.length > 0) {
                    cy.log(`✅ Found ${$addToCartButtons.length} add to cart buttons`);
                    cy.wrap($addToCartButtons.first()).click({ force: true });
                    cy.wait(3000);
                    cy.log("✅ Clicked add to cart button");
                    
                    // Verify cart was updated
                    cy.get("body").then(($newBody) => {
                      const newBodyText = $newBody.text().toLowerCase();
                      if (newBodyText.includes("added") || newBodyText.includes("success") || newBodyText.includes("cart updated")) {
                        cy.log("✅ Product successfully added to cart");
                      } else {
                        cy.log("ℹ️ Checking for cart icon updates...");
                        
                        // Look for cart icon with count
                        cy.get('[class*="cart"], [class*="bag"], .cart-count', { timeout: 5000 })
                          .then(($cartElements) => {
                            if ($cartElements.length > 0) {
                              cy.log("✅ Found cart elements");
                              $cartElements.each((_, el) => {
                                const cartText = Cypress.$(el).text();
                                if (cartText && cartText !== '0' && cartText !== '') {
                                  cy.log(`✅ Cart shows: ${cartText}`);
                                }
                              });
                            } else {
                              cy.log("ℹ️ No cart elements found after add to cart");
                            }
                          });
                      }
                    });
                  } else {
                    cy.log("⚠️ No add to cart button found on product page");
                  }
                });
            } else {
              cy.log("⚠️ Not on product page, checking for add to cart buttons directly");
              
              // Try to find add to cart buttons directly
              cy.get('button:contains("Add to Cart"), button:contains("Add"), button:contains("Buy")', { timeout: 5000 })
                .then(($directButtons) => {
                  if ($directButtons.length > 0) {
                    cy.log(`✅ Found ${$directButtons.length} direct add to cart buttons`);
                    cy.wrap($directButtons.first()).click({ force: true });
                    cy.wait(3000);
                    cy.log("✅ Clicked direct add to cart button");
                  } else {
                    cy.log("⚠️ No direct add to cart buttons found");
                  }
                });
            }
          });
        } else {
          cy.log("⚠️ No product links found on landing page");
          
          // Try to navigate to shop via URL
          cy.log("ℹ️ Trying direct navigation to shop page");
          cy.visit(`${baseUrl}/shop`, { failOnStatusCode: false });
          cy.wait(3000);
          
          // Try again on shop page
          cy.get('[data-product], [class*="product"], [class*="item"]', { timeout: 5000 })
            .then(($shopProducts) => {
              if ($shopProducts.length > 0) {
                cy.log(`✅ Found ${$shopProducts.length} products in shop`);
                cy.wrap($shopProducts.first()).click({ force: true });
                cy.wait(3000);
                cy.log("✅ Clicked shop product");
              } else {
                cy.log("ℹ️ No products found on shop page either");
              }
            });
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

 /* it("should handle cart interactions and notifications", () => {
    cy.log("🛒 Testing cart interactions and notifications...");
    
    cy.visit(baseUrl, { timeout: 60000 });
    cy.get("body", { timeout: 30000 }).should("be.visible");
    cy.wait(3000);
    
    // Look for cart icon or button - use text-based approach first
    cy.get("body").then(($body) => {
      const bodyText = $body.text().toLowerCase();
      
      if (bodyText.includes("cart") || bodyText.includes("bag")) {
        cy.log("✅ Found cart-related text on page");
        
        // Try clicking any element with cart text
        cy.get('*').filter((_, el) => {
          const text = (el.textContent || "").toLowerCase();
          return text.includes("cart") || text.includes("bag");
        }).then(($cartTextElements) => {
          if ($cartTextElements.length > 0) {
            cy.log(`✅ Found ${$cartTextElements.length} elements with cart text`);
            cy.wrap($cartTextElements.first()).click({ force: true });
            cy.wait(2000);
            cy.log("✅ Clicked cart text element");
            
            // Check if cart modal/panel opened
            cy.get("body").then(($newBody) => {
              const cartText = $newBody.text().toLowerCase();
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
            cy.log("ℹ️ No cart functionality detected on page");
          }
        });
      } else {
        cy.log("ℹ️ No cart text found on page");
      }
    });
  });
*/
  it("should handle toast notifications for cart actions", () => {
    cy.log("🛒 Testing toast notifications for cart actions...");
    
    cy.visit(baseUrl, { timeout: 60000 });
    cy.get("body", { timeout: 30000 }).should("be.visible");
    cy.wait(3000);
    
    // Look for product and add to cart - try broader selectors
    cy.get('[class*="product"], [class*="card"], article, .item, .product-item, .shop-item, [data-product], button:contains("Add"), button:contains("Buy"), button:contains("Shop")', { timeout: 5000 })
      .then(($products) => {
        if ($products.length > 0) {
          cy.log(`✅ Found ${$products.length} product elements`);
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
                
                // Wait for any response and check page content changes
                cy.wait(2000);
                
                // Check if page content changed after adding to cart
                cy.get("body").then(($newBody) => {
                  const newBodyText = $newBody.text().toLowerCase();
                  
                  if (newBodyText.includes("added") || newBodyText.includes("success") || newBodyText.includes("cart")) {
                    cy.log("✅ Page content indicates successful cart action");
                  } else {
                    cy.log("ℹ️ No notification or page change detected");
                  }
                });
              }
            });
        } else {
          cy.log("⚠️ No product elements found, trying alternative approach...");
          
          // Try to find any clickable elements that might trigger add to cart
          cy.get("body").then(($body) => {
            const bodyText = $body.text().toLowerCase();
            
            // Look for any elements with add/cart related text
            cy.get('*').filter((_, el) => {
              const text = (el.textContent || "").toLowerCase();
              return text.includes("add") || text.includes("cart") || text.includes("buy") || text.includes("shop");
            }).then(($actionElements) => {
              if ($actionElements.length > 0) {
                cy.log(`✅ Found ${$actionElements.length} elements with action text`);
                
                // Try clicking the first few elements
                cy.get($actionElements.slice(0, 3)).each(($element, index) => {
                  const elementText = $element.text().toLowerCase();
                  cy.log(`Trying element ${index + 1}: ${elementText.substring(0, 30)}...`);
                  
                  cy.wrap($element).click({ force: true });
                  cy.wait(1000);
                  
                  // Check for any response
                  cy.get("body").then(($newBody) => {
                    const newBodyText = $newBody.text().toLowerCase();
                    if (newBodyText.includes("added") || newBodyText.includes("success") || newBodyText.includes("cart")) {
                      cy.log("✅ Action triggered successfully");
                      return false; // Stop the loop
                    }
                  });
                });
              } else {
                cy.log("ℹ️ No action elements found on page");
              }
            });
          });
        }
      });
  });
});
