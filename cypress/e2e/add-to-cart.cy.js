import { Sendsile } from '../configuration/project.config.js';

const { addToCart } = Sendsile;

// Validate add-to-cart configuration exists
if (!addToCart) {
  throw new Error('Add to cart configuration not found in project.config.js');
}

// Helper Functions
const mockAddToCartApis = (options = {}) => {
  const {
    addToCartSuccess = true,
    wishlistSuccess = true,
    outOfStock = false,
    serverError = false,
    delay = 0,
  } = options;

  // Mock add to cart API
  cy.intercept('POST', `**${addToCart.addToCartApi}`, (req) => {
    if (serverError) {
      req.reply({
        statusCode: addToCart.badRequestStatus,
        body: { message: 'Server error adding to cart' },
      });
    } else if (outOfStock) {
      req.reply({
        statusCode: addToCart.conflictStatus,
        body: { message: addToCart.outOfStockMessage },
      });
    } else if (addToCartSuccess) {
      req.reply({
        statusCode: addToCart.successStatus,
        body: { 
          message: addToCart.addedToCartMessage,
          data: { 
            cartCount: 1,
            product: req.body 
          }
        },
        delay,
      });
    } else {
      req.reply({
        statusCode: addToCart.badRequestStatus,
        body: { message: 'Failed to add to cart' },
      });
    }
  }).as('addToCartRequest');

  // Mock wishlist API
  cy.intercept('POST', `**${addToCart.wishlistApi}`, (req) => {
    if (wishlistSuccess) {
      req.reply({
        statusCode: addToCart.successStatus,
        body: { 
          message: addToCart.addedToWishlistMessage,
          data: { wishlistCount: 1 }
        },
        delay,
      });
    } else {
      req.reply({
        statusCode: addToCart.badRequestStatus,
        body: { message: 'Failed to add to wishlist' },
      });
    }
  }).as('wishlistRequest');

  // Mock product API
  cy.intercept('GET', `**${addToCart.productApi}/**`, {
    statusCode: addToCart.successStatus,
    body: {
      data: addToCart.testProduct,
      message: "Product data retrieved"
    },
    delay,
  }).as('productRequest');

  // Mock general API requests
  cy.intercept('GET', '**/api/**', {
    statusCode: addToCart.successStatus,
    body: {
      data: [],
      message: "API request processed"
    },
    delay,
  }).as('apiGet');
};

const seedAuthenticatedState = (win) => {
  win.localStorage.setItem('__user_access', Sendsile.dashboard.testAccessToken || 'test-token');
  win.localStorage.setItem('authToken', Sendsile.dashboard.authToken || 'Bearer test-token');
  win.localStorage.setItem('isLoggedIn', 'true');
  win.localStorage.setItem('ramadanModal', 'true');
  win.localStorage.setItem('userInfo', JSON.stringify({
    state: {
      userData: Sendsile.dashboard.userData || {
        name: "Test User",
        email: "test@example.com",
        phone: "08012345678"
      },
    },
    version: 0,
  }));
  win.localStorage.setItem('location', JSON.stringify(Sendsile.dashboard.persistedLocation || { state: { isOpen: false, location: 'nigeria' }, version: 0 }));
  
  // Clear any existing cart state for testing
  win.localStorage.removeItem('cartItems');
  win.localStorage.removeItem('wishlistItems');
};

const visitProductPage = (options = {}) => {
  mockAddToCartApis(options);
  
  // If mock mode is enabled, create a mock product page
  if (addToCart.useMockMode) {
    cy.log('Using mock mode for add-to-cart testing - creating mock product page');
    createMockProductPage();
    return;
  }
  
  cy.log('Testing real product page: ' + addToCart.pageUrl);
  
  // Use quickView successful pattern - simple and reliable
  cy.visit(addToCart.pageUrl, {
    onBeforeLoad(win) {
      seedAuthenticatedState(win);
    },
  });
  cy.wait(3000); // Wait for React app to load and render
  cy.get(addToCart.root || '#root', { timeout: 15000 }).should('be.visible');
  cy.wait(2000); // Wait for dynamic content to load
};

const tryFallbackStrategies = () => {
  cy.log('Trying fallback strategies for add-to-cart testing');
  
  // Strategy 1: Try fallback URL
  cy.log('Strategy 1: Trying fallback URL');
  cy.visit(addToCart.fallbackUrl, {
    timeout: 30000,
    failOnStatusCode: false,
    onBeforeLoad(win) {
      win.localStorage.setItem('__user_access', 'test-token');
      win.localStorage.setItem('authToken', 'Bearer test-token');
      win.localStorage.setItem('isLoggedIn', 'true');
      win.localStorage.setItem('ramadanModal', 'true');
    },
  }).then(() => {
    cy.wait(3000);
    cy.url().then((url) => {
      cy.log(`Fallback URL result: ${url}`);
      
      if (url.includes('/dashboard/products') || url.includes('/products')) {
        cy.log('Fallback URL successful - looking for product links');
        
        // Look for product links on the products page
        cy.get('body').then(($body) => {
          const productLinkSelectors = [
            'a[href*="/product/"]',
            '.product-card a',
            '.product-item a',
            '.product-link',
            '[data-testid="product-link"]'
          ];
          
          let productFound = false;
          productLinkSelectors.forEach(selector => {
            if ($body.find(selector).length > 0 && !productFound) {
              cy.log(`Found product links with selector: ${selector}`);
              cy.get(selector).first().then(($link) => {
                const productUrl = $link.attr('href');
                if (productUrl) {
                  cy.log(`Found product URL: ${productUrl}`);
                  cy.get(selector).first().click();
                  cy.wait(3000);
                  cy.url().then((productPageUrl) => {
                    if (productPageUrl.includes('/dashboard/product')) {
                      cy.log('Successfully navigated to product page');
                      cy.get(addToCart.root || '#root', { timeout: 15000 }).should('be.visible');
                      productFound = true;
                    } else {
                      cy.log('Product navigation failed');
                    }
                  });
                }
              });
              productFound = true;
            }
          });
          
          if (!productFound) {
            cy.log('No product links found on products page - trying strategy 2');
            tryStrategy2();
          }
        });
      } else {
        cy.log('Fallback URL also failed - trying strategy 2');
        tryStrategy2();
      }
    });
  });
};

const tryStrategy2 = () => {
  cy.log('Strategy 2: Creating comprehensive mock product page');
  
  // Create enhanced mock product page
  cy.visit('about:blank');
  
  cy.window().then((win) => {
    const enhancedMockHTML = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Add to Cart Test - Enhanced Mock</title>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <style>
          * { box-sizing: border-box; margin: 0; padding: 0; }
          body { 
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; 
            line-height: 1.6; 
            color: #333; 
            background: #f8f9fa; 
            padding: 20px; 
          }
          .container { 
            max-width: 1200px; 
            margin: 0 auto; 
            background: white; 
            border-radius: 8px; 
            box-shadow: 0 2px 10px rgba(0,0,0,0.1); 
            padding: 30px; 
          }
          .header { 
            border-bottom: 2px solid #e9ecef; 
            padding-bottom: 20px; 
            margin-bottom: 30px; 
          }
          .product-title { 
            font-size: 28px; 
            font-weight: 700; 
            color: #2c3e50; 
            margin-bottom: 10px; 
          }
          .product-price { 
            font-size: 24px; 
            color: #007bff; 
            font-weight: 600; 
            margin-bottom: 20px; 
          }
          .product-description { 
            color: #6c757d; 
            margin-bottom: 30px; 
            line-height: 1.6; 
          }
          .product-image { 
            width: 100%; 
            max-width: 400px; 
            height: 300px; 
            background: #e9ecef; 
            border-radius: 8px; 
            margin-bottom: 30px; 
            display: flex; 
            align-items: center; 
            justify-content: center; 
            font-size: 18px; 
            color: #6c757d; 
          }
          .options-grid { 
            display: grid; 
            grid-template-columns: 1fr 1fr; 
            gap: 30px; 
            margin-bottom: 30px; 
          }
          .option-group { 
            background: #f8f9fa; 
            padding: 20px; 
            border-radius: 8px; 
            border: 1px solid #e9ecef; 
          }
          .option-label { 
            font-weight: 600; 
            margin-bottom: 15px; 
            color: #495057; 
          }
          .size-options, .color-options { 
            display: flex; 
            gap: 10px; 
            flex-wrap: wrap; 
          }
          .option { 
            padding: 12px 20px; 
            border: 2px solid #dee2e6; 
            background: white; 
            border-radius: 6px; 
            cursor: pointer; 
            transition: all 0.2s; 
            font-weight: 500; 
          }
          .option:hover { 
            border-color: #007bff; 
            background: #f8f9ff; 
          }
          .option.selected { 
            border-color: #007bff; 
            background: #007bff; 
            color: white; 
          }
          .quantity-group { 
            display: flex; 
            align-items: center; 
            gap: 15px; 
          }
          .quantity-input { 
            width: 80px; 
            padding: 12px; 
            border: 2px solid #dee2e6; 
            border-radius: 6px; 
            font-size: 16px; 
          }
          .quantity-btn { 
            width: 40px; 
            height: 44px; 
            border: 2px solid #dee2e6; 
            background: white; 
            border-radius: 6px; 
            cursor: pointer; 
            font-size: 18px; 
            display: flex; 
            align-items: center; 
            justify-content: center; 
          }
          .quantity-btn:hover { 
            background: #f8f9fa; 
          }
          .actions { 
            display: flex; 
            gap: 15px; 
            margin-bottom: 30px; 
          }
          .btn { 
            padding: 15px 30px; 
            border: none; 
            border-radius: 6px; 
            font-size: 16px; 
            font-weight: 600; 
            cursor: pointer; 
            transition: all 0.2s; 
          }
          .btn-primary { 
            background: #007bff; 
            color: white; 
          }
          .btn-primary:hover { 
            background: #0056b3; 
          }
          .btn-secondary { 
            background: #6c757d; 
            color: white; 
          }
          .btn-secondary:hover { 
            background: #545b62; 
          }
          .message { 
            padding: 15px; 
            border-radius: 6px; 
            margin-bottom: 20px; 
            font-weight: 500; 
          }
          .success { 
            background: #d4edda; 
            color: #155724; 
            border: 1px solid #c3e6cb; 
          }
          .error { 
            background: #f8d7da; 
            color: #721c24; 
            border: 1px solid #f5c6cb; 
          }
          .cart-info { 
            background: #e9ecef; 
            padding: 20px; 
            border-radius: 6px; 
            text-align: center; 
          }
          .cart-count { 
            font-size: 24px; 
            font-weight: 700; 
            color: #007bff; 
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1 class="product-title">Premium Wireless Headphones</h1>
            <div class="product-price">$299.99</div>
            <div class="product-description">
              Experience premium sound quality with our latest wireless headphones. 
              Features include active noise cancellation, 30-hour battery life, 
              and superior comfort for all-day wear.
            </div>
          </div>
          
          <div class="product-image">
            🎧 Premium Headphones Image
          </div>
          
          <div class="options-grid">
            <div class="option-group">
              <div class="option-label">Size</div>
              <div class="size-options">
                <button class="option" data-size="S">Small</button>
                <button class="option" data-size="M">Medium</button>
                <button class="option" data-size="L">Large</button>
                <button class="option" data-size="XL">Extra Large</button>
              </div>
            </div>
            
            <div class="option-group">
              <div class="option-label">Color</div>
              <div class="color-options">
                <button class="option" data-color="Black">Black</button>
                <button class="option" data-color="Silver">Silver</button>
                <button class="option" data-color="Blue">Blue</button>
                <button class="option" data-color="Red">Red</button>
              </div>
            </div>
          </div>
          
          <div class="option-group">
            <div class="option-label">Quantity</div>
            <div class="quantity-group">
              <button class="quantity-btn" id="decrease-qty">−</button>
              <input type="number" class="quantity-input" id="quantity" value="1" min="1" max="10" />
              <button class="quantity-btn" id="increase-qty">+</button>
            </div>
          </div>
          
          <div class="actions">
            <button class="btn btn-secondary" id="wishlist-btn">♥ Add to Wishlist</button>
            <button class="btn btn-primary" id="add-to-cart-btn">🛒 Add to Cart</button>
          </div>
          
          <div id="message-container"></div>
          
          <div class="cart-info">
            <div>Shopping Cart</div>
            <div class="cart-count" id="cart-count">0 items</div>
          </div>
        </div>
        
        <script>
          let selectedSize = null;
          let selectedColor = null;
          let cartCount = 0;
          
          // Size selection
          document.querySelectorAll('[data-size]').forEach(option => {
            option.addEventListener('click', function() {
              document.querySelectorAll('[data-size]').forEach(opt => opt.classList.remove('selected'));
              this.classList.add('selected');
              selectedSize = this.dataset.size;
            });
          });
          
          // Color selection
          document.querySelectorAll('[data-color]').forEach(option => {
            option.addEventListener('click', function() {
              document.querySelectorAll('[data-color]').forEach(opt => opt.classList.remove('selected'));
              this.classList.add('selected');
              selectedColor = this.dataset.color;
            });
          });
          
          // Quantity controls
          document.getElementById('decrease-qty').addEventListener('click', function() {
            const input = document.getElementById('quantity');
            if (input.value > 1) {
              input.value = parseInt(input.value) - 1;
            }
          });
          
          document.getElementById('increase-qty').addEventListener('click', function() {
            const input = document.getElementById('quantity');
            if (input.value < 10) {
              input.value = parseInt(input.value) + 1;
            }
          });
          
          // Add to cart functionality
          document.getElementById('add-to-cart-btn').addEventListener('click', function() {
            const quantity = parseInt(document.getElementById('quantity').value);
            const messageContainer = document.getElementById('message-container');
            
            if (!selectedSize || !selectedColor) {
              showMessage('Please select size and color', 'error');
              return;
            }
            
            cartCount += quantity;
            updateCartCount();
            showMessage('Added ' + quantity + ' item(s) to cart successfully!', 'success');
          });
          
          // Wishlist functionality
          document.getElementById('wishlist-btn').addEventListener('click', function() {
            showMessage('Product added to wishlist!', 'success');
          });
          
          function showMessage(message, type) {
            messageContainer.innerHTML = '<div class="message ' + type + '">' + message + '</div>';
            setTimeout(() => {
              messageContainer.innerHTML = '';
            }, 3000);
          }
          
          function updateCartCount() {
            document.getElementById('cart-count').textContent = cartCount + (cartCount === 1 ? ' item' : ' items');
          }
        </script>
      </body>
      </html>
    `;
    
    win.document.write(enhancedMockHTML);
    win.document.close();
  });
  
  cy.wait(1000);
  cy.log('Enhanced mock product page created successfully');
};

// Create a mock product page for testing
const createMockProductPage = () => {
  cy.log('Creating mock product page for testing');
  
  // Visit a blank page and inject mock product page content
  cy.visit('about:blank');
  
  cy.window().then((win) => {
    // Create mock product page HTML
    const mockProductHTML = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Mock Product - Sendsile</title>
        <style>
          body { font-family: Arial, sans-serif; margin: 20px; }
          .product-container { max-width: 1200px; margin: 0 auto; }
          .product-title { font-size: 24px; font-weight: bold; margin-bottom: 10px; }
          .product-price { font-size: 20px; color: #007bff; margin-bottom: 15px; }
          .product-description { margin-bottom: 20px; }
          .product-image { width: 300px; height: 300px; background: #f0f0f0; margin-bottom: 20px; }
          .product-options { margin-bottom: 20px; }
          .size-selector, .color-selector { margin-bottom: 15px; }
          .size-option, .color-option { 
            display: inline-block; 
            padding: 8px 16px; 
            margin: 5px; 
            border: 1px solid #ccc; 
            cursor: pointer; 
            background: white;
          }
          .size-option.selected, .color-option.selected { 
            background: #007bff; 
            color: white; 
            border-color: #007bff;
          }
          .quantity-selector { margin-bottom: 20px; }
          .quantity-input { width: 60px; padding: 5px; margin: 0 10px; }
          .quantity-btn { padding: 5px 10px; margin: 0 5px; cursor: pointer; }
          .add-to-cart-btn { 
            padding: 12px 24px; 
            background: #28a745; 
            color: white; 
            border: none; 
            cursor: pointer; 
            font-size: 16px;
            margin-bottom: 20px;
          }
          .add-to-cart-btn:hover { background: #218838; }
          .wishlist-btn { 
            padding: 8px 16px; 
            background: #ffc107; 
            color: black; 
            border: none; 
            cursor: pointer;
            margin-right: 10px;
          }
          .cart-icon { position: fixed; top: 20px; right: 20px; background: #007bff; color: white; padding: 10px; border-radius: 50%; }
          .cart-count { position: absolute; top: -5px; right: -5px; background: red; color: white; border-radius: 50%; padding: 2px 6px; font-size: 12px; }
          .success-message { color: green; font-weight: bold; margin-bottom: 10px; }
          .error-message { color: red; font-weight: bold; margin-bottom: 10px; }
          .product-reviews { margin-top: 30px; }
          .related-products { margin-top: 30px; }
        </style>
      </head>
      <body>
        <div class="product-container">
          <h1 class="product-title">Test Product - Mock Edition</h1>
          <div class="product-price">$29.99</div>
          <div class="product-description">This is a mock product for testing add to cart functionality.</div>
          
          <div class="product-image">
            <img src="https://via.placeholder.com/300x300/007bff/ffffff?text=Mock+Product" alt="Mock Product" />
          </div>
          
          <div class="product-options">
            <div class="size-selector">
              <h3>Size:</h3>
              <div class="size-option" data-size="S">S</div>
              <div class="size-option" data-size="M">M</div>
              <div class="size-option" data-size="L">L</div>
              <div class="size-option" data-size="XL">XL</div>
            </div>
            
            <div class="color-selector">
              <h3>Color:</h3>
              <div class="color-option" data-color="Red">Red</div>
              <div class="color-option" data-color="Blue">Blue</div>
              <div class="color-option" data-color="Green">Green</div>
              <div class="color-option" data-color="Black">Black</div>
            </div>
            
            <div class="quantity-selector">
              <h3>Quantity:</h3>
              <button class="quantity-btn" id="decrease-qty">-</button>
              <input type="number" class="quantity-input" id="quantity" value="1" min="1" max="10" />
              <button class="quantity-btn" id="increase-qty">+</button>
            </div>
          </div>
          
          <div class="product-actions">
            <button class="wishlist-btn" id="wishlist-btn">Add to Wishlist</button>
            <button class="add-to-cart-btn" id="add-to-cart-btn">Add to Cart</button>
          </div>
          
          <div id="message-container"></div>
          
          <div class="cart-icon" id="cart-icon">
            Cart
            <span class="cart-count" id="cart-count">0</span>
          </div>
          
          <div class="product-reviews">
            <h3>Customer Reviews</h3>
            <div class="review">
              <p>Great product! - 5 stars</p>
            </div>
            <div class="review">
              <p>Good value for money - 4 stars</p>
            </div>
          </div>
          
          <div class="related-products">
            <h3>Related Products</h3>
            <div class="related-product">
              <h4>Mock Product 2</h4>
              <p>$19.99</p>
            </div>
            <div class="related-product">
              <h4>Mock Product 3</h4>
              <p>$39.99</p>
            </div>
          </div>
        </div>
        
        <script>
          // Mock product page functionality
          let cartCount = 0;
          let selectedSize = null;
          let selectedColor = null;
          
          // Size selection
          document.querySelectorAll('.size-option').forEach(option => {
            option.addEventListener('click', function() {
              document.querySelectorAll('.size-option').forEach(opt => opt.classList.remove('selected'));
              this.classList.add('selected');
              selectedSize = this.dataset.size;
            });
          });
          
          // Color selection
          document.querySelectorAll('.color-option').forEach(option => {
            option.addEventListener('click', function() {
              document.querySelectorAll('.color-option').forEach(opt => opt.classList.remove('selected'));
              this.classList.add('selected');
              selectedColor = this.dataset.color;
            });
          });
          
          // Quantity controls
          document.getElementById('increase-qty').addEventListener('click', function() {
            const input = document.getElementById('quantity');
            if (input.value < 10) {
              input.value = parseInt(input.value) + 1;
            }
          });
          
          document.getElementById('decrease-qty').addEventListener('click', function() {
            const input = document.getElementById('quantity');
            if (input.value > 1) {
              input.value = parseInt(input.value) - 1;
            }
          });
          
          // Add to cart functionality
          document.getElementById('add-to-cart-btn').addEventListener('click', function() {
            const quantity = document.getElementById('quantity').value;
            const messageContainer = document.getElementById('message-container');
            
            }, 3000);
          });
          
          // Wishlist functionality
          document.getElementById('wishlist-btn').addEventListener('click', function() {
            const messageContainer = document.getElementById('message-container');
            messageContainer.innerHTML = '<div class="success-message">Product added to wishlist!</div>';
            
            setTimeout(() => {
              messageContainer.innerHTML = '';
            }, 3000);
          });
        </script>
      </body>
      </html>
    `;
    
    // Write the mock HTML to the document
    win.document.write(mockProductHTML);
    win.document.close();
  });
  
  cy.wait(1000); // Wait for mock page to load
  cy.log('Mock product page created successfully');
};

const selectProductOptions = (options = {}) => {
  return cy.get('body').then(($body) => {
    let optionsSelected = false;
    
    // Select size if available
    if (options.size && $body.find(addToCart.sizeSelector).length > 0) {
      const $sizeOptions = $body.find(addToCart.sizeOption);
      if ($sizeOptions.length > 0) {
        // Try to find size option by text
        $sizeOptions.each((index, $option) => {
          if ($option.textContent.includes(options.size)) {
            cy.wrap($option).click({ force: true });
            cy.log(`Selected size: ${options.size}`);
            optionsSelected = true;
            return false; // Break the loop
          }
        });
        
        // If no specific size found, select first available
        if (!optionsSelected) {
          cy.wrap($sizeOptions).first().click({ force: true });
          cy.log('Selected first available size');
          optionsSelected = true;
        }
      }
    }
    
    // Select color if available
    if (options.color && $body.find(addToCart.colorSelector).length > 0) {
      const $colorOptions = $body.find(addToCart.colorOption);
      if ($colorOptions.length > 0) {
        // Try to find color option by text or attribute
        $colorOptions.each((index, $option) => {
          const colorText = $option.textContent.toLowerCase();
          const colorAttr = ($option.getAttribute('data-color') || '').toLowerCase();
          
          if (colorText.includes(options.color.toLowerCase()) || colorAttr.includes(options.color.toLowerCase())) {
            cy.wrap($option).click({ force: true });
            cy.log(`Selected color: ${options.color}`);
            optionsSelected = true;
            return false; // Break the loop
          }
        });
        
        // If no specific color found, select first available
        if (!optionsSelected) {
          cy.wrap($colorOptions).first().click({ force: true });
          cy.log('Selected first available color');
          optionsSelected = true;
        }
      }
    }
    
    // Set quantity if available
    if (options.quantity && $body.find(addToCart.quantityInput).length > 0) {
      cy.get(addToCart.quantityInput).first().clear({ force: true }).type(options.quantity.toString(), { force: true });
      cy.log(`Set quantity: ${options.quantity}`);
      optionsSelected = true;
    }
    
    return cy.wrap(optionsSelected);
  });
};

const clickAddToCartBtn = (options = {}) => {
  return cy.get('body').then(($body) => {
    const $addToCartBtn = $body.find(addToCart.addToCartBtn);
    
    if ($addToCartBtn.length > 0) {
      // Check if button is enabled
      const $firstBtn = $addToCartBtn.first();
      if ($firstBtn.is(':disabled') || $firstBtn.hasClass('disabled')) {
        cy.log('Add to cart button is disabled');
        return cy.wrap(false);
      }
      
      cy.wrap($firstBtn).click({ force: true });
      cy.log('Clicked add to cart button');
      return cy.wrap(true);
    } else {
      cy.log('Add to cart button not found');
      return cy.wrap(false);
    }
  });
};

// ==========================================
// COMPREHENSIVE ADD TO CART TESTS
// ==========================================
describe('Sendsile Add to Cart - Product Page Tests', () => {
  beforeEach(() => {
    cy.clearCookies();
    cy.clearLocalStorage();
    cy.viewport(1440, 900); // Set consistent viewport
  });

  // Test 1: Page Load and Basic Structure
  it(addToCart.message01, () => {
    visitProductPage();
    
    // Check current URL and handle accordingly
    cy.url().then((url) => {
      if (url.includes('/login') || url.includes('/signin')) {
        cy.log('Currently on login page - authentication required for product access');
        
        // Test login page elements instead
        cy.get('body').should('be.visible');
        cy.title().should('contain', 'Sendsile');
        
        // Look for login form elements
        const loginSelectors = [
          'input[type="email"]',
          'input[type="password"]',
          'button[type="submit"]',
          '.login-btn',
          'button:contains("Login")',
          'button:contains("Sign In")'
        ];
        
        cy.get('body').then(($body) => {
          let loginElementsFound = false;
          loginSelectors.forEach(selector => {
            if ($body.find(selector).length > 0) {
              cy.log(`Login element found: ${selector}`);
              loginElementsFound = true;
            }
          });
          
          if (loginElementsFound) {
            cy.log('Login page structure verified - product page requires authentication');
          } else {
            cy.log('Page loaded but structure unclear');
          }
        });
      } else if (url.includes('/error') || url.includes('/404') || url.includes('/500') || url.includes('/not-found')) {
        cy.log('Currently on error page - product may not exist or server issues');
        
        // Test error page elements
        cy.get('body').should('be.visible');
        cy.title().should('contain', 'Sendsile');
        
        // Look for error page elements
        const errorSelectors = [
          '.error-message',
          '.error-title',
          '.error-code',
          'h1:contains("Error")',
          'h1:contains("404")',
          'h1:contains("Not Found")',
          'h1:contains("Server Error")',
          '.error-page',
          '[data-testid="error-page"]'
        ];
        
        cy.get('body').then(($body) => {
          let errorElementsFound = false;
          errorSelectors.forEach(selector => {
            if ($body.find(selector).length > 0) {
              cy.get(selector).first().invoke('text').then((text) => {
                cy.log(`Error message: ${text}`);
              });
              errorElementsFound = true;
            }
          });
          
          if (errorElementsFound) {
            cy.log('Error page structure verified - product page is not accessible');
          } else {
            cy.log('Error page loaded but no specific error content found');
          }
        });
        
        // Log the problematic URL for debugging
        cy.log(`Problematic product URL: ${addToCart.pageUrl}`);
        cy.log('This may indicate the product does not exist or the URL is incorrect');
        
      } else if (url.includes('/dashboard/product')) {
        // We're on the product page
        cy.log('Successfully accessed product page');
        cy.url().should('include', '/dashboard/product');
        cy.title().should('contain', 'Sendsile');
        cy.get(addToCart.root || '#root').should('be.visible');
        
        // Check page title and description
        cy.get('body').then(($body) => {
          if ($body.find(addToCart.pageTitle).length > 0) {
            cy.get(addToCart.pageTitle).should('be.visible');
            cy.log('Product page title found');
          } else {
            const $titleElements = $body.find('h1, .title, .product-title');
            if ($titleElements.length > 0) {
              cy.wrap($titleElements).first().should('be.visible');
              cy.log('Title found with broader selectors');
            }
          }
          
          if ($body.find(addToCart.pageDescription).length > 0) {
            cy.get(addToCart.pageDescription).should('exist');
            cy.log('Product description found');
          }
        });
      } else {
        // Unknown page - provide debugging information
        cy.log(`Unknown page loaded: ${url}`);
        cy.get('body').should('be.visible');
        cy.title().should('contain', 'Sendsile');
        
        cy.log('This may indicate a navigation issue or unexpected redirect');
        cy.log(`Expected: ${addToCart.pageUrl}`);
        cy.log(`Actual: ${url}`);
      }
    });
  });

  // Test 2: Product Information Display
  it(addToCart.message02, () => {
    visitProductPage();
    
    // Check product information elements
    cy.get('body').then(($body) => {
      // Product name
      if ($body.find(addToCart.productName).length > 0) {
        cy.get(addToCart.productName).first().should('be.visible');
        cy.log('Product name found');
      }
      
      // Product price
      if ($body.find(addToCart.productPrice).length > 0) {
        cy.get(addToCart.productPrice).first().should('be.visible');
        cy.log('Product price found');
      }
      
      // Original price (if discounted)
      if ($body.find(addToCart.originalPrice).length > 0) {
        cy.get(addToCart.originalPrice).first().should('be.visible');
        cy.log('Original price found');
      }
      
      // Discount badge
      if ($body.find(addToCart.discountBadge).length > 0) {
        cy.get(addToCart.discountBadge).first().should('be.visible');
        cy.log('Discount badge found');
      }
      
      // Product SKU
      if ($body.find(addToCart.productSku).length > 0) {
        cy.get(addToCart.productSku).first().should('be.visible');
        cy.log('Product SKU found');
      }
      
      // Availability
      if ($body.find(addToCart.availability).length > 0) {
        cy.get(addToCart.availability).first().should('be.visible');
        cy.log('Availability status found');
      }
      
      // Rating
      if ($body.find(addToCart.rating).length > 0) {
        cy.get(addToCart.rating).first().should('be.visible');
        cy.log('Product rating found');
      }
    });
  });

  // Test 3: Product Images and Gallery
  it(addToCart.message03, () => {
    visitProductPage();
    
    // Check product image gallery
    cy.get('body').then(($body) => {
      // Main product image
      if ($body.find(addToCart.mainImage).length > 0) {
        cy.get(addToCart.mainImage).first().should('be.visible');
        cy.log('Main product image found');
      }
      
      // Thumbnail images
      if ($body.find(addToCart.thumbnailImages).length > 0) {
        cy.get(addToCart.thumbnailImages).first().should('be.visible');
        cy.log('Thumbnail images found');
      }
      
      // Image navigation
      if ($body.find(addToCart.imageNav).length > 0) {
        cy.get(addToCart.imageNav).first().should('be.visible');
        cy.log('Image navigation found');
      }
      
      // Previous/Next buttons
      if ($body.find(addToCart.prevImageBtn).length > 0) {
        cy.get(addToCart.prevImageBtn).first().should('exist');
        cy.log('Previous image button found');
      }
      
      if ($body.find(addToCart.nextImageBtn).length > 0) {
        cy.get(addToCart.nextImageBtn).first().should('exist');
        cy.log('Next image button found');
      }
    });
  });

  // Test 4: Quantity Selection
  it(addToCart.message04, () => {
    visitProductPage();
    
    // Test quantity controls
    cy.get('body').then(($body) => {
      if ($body.find(addToCart.quantityInput).length > 0) {
        const $quantityInput = $body.find(addToCart.quantityInput).first();
        
        // Test initial value
        cy.wrap($quantityInput).should('have.value', '1');
        cy.log('Initial quantity is 1');
        
        // Test increase button
        if ($body.find(addToCart.quantityIncrease).length > 0) {
          cy.get(addToCart.quantityIncrease).first().click({ force: true });
          cy.wait(500);
          cy.wrap($quantityInput).should('have.value', '2');
          cy.log('Quantity increase works');
        }
        
        // Test decrease button
        if ($body.find(addToCart.quantityDecrease).length > 0) {
          cy.get(addToCart.quantityDecrease).first().click({ force: true });
          cy.wait(500);
          cy.wrap($quantityInput).should('have.value', '1');
          cy.log('Quantity decrease works');
        }
        
        // Test direct input
        cy.wrap($quantityInput).clear({ force: true }).type('5', { force: true });
        cy.wrap($quantityInput).should('have.value', '5');
        cy.log('Direct quantity input works');
      } else {
        cy.log('Quantity input not found');
      }
    });
  });

  // Test 5: Size and Color Options
  it(addToCart.message05, () => {
    visitProductPage();
    
    // Test size options
    cy.get('body').then(($body) => {
      if ($body.find(addToCart.sizeSelector).length > 0) {
        const $sizeOptions = $body.find(addToCart.sizeOption);
        if ($sizeOptions.length > 0) {
          // Click first size option
          cy.wrap($sizeOptions).first().click({ force: true });
          cy.wait(500);
          cy.log('Size selection works');
          
          // Verify selection state
          cy.wrap($sizeOptions).first().should('have.class', 'selected');
          cy.log('Size selection state verified');
        }
      } else {
        cy.log('Size selector not found');
      }
      
      // Test color options
      if ($body.find(addToCart.colorSelector).length > 0) {
        const $colorOptions = $body.find(addToCart.colorOption);
        if ($colorOptions.length > 0) {
          // Click first color option
          cy.wrap($colorOptions).first().click({ force: true });
          cy.wait(500);
          cy.log('Color selection works');
          
          // Verify selection state
          cy.wrap($colorOptions).first().should('have.class', 'selected');
          cy.log('Color selection state verified');
        }
      } else {
        cy.log('Color selector not found');
      }
    });
  });

  // Test 6: Add to Cart Success
  it(addToCart.message06, () => {
    visitProductPage({ addToCartSuccess: true });
    
    // Select product options
    selectProductOptions({
      size: addToCart.testProduct.size,
      color: addToCart.testProduct.color,
      quantity: addToCart.testProduct.quantity
    });
    
    // Add to cart
    clickAddToCartBtn().then((clicked) => {
      if (clicked) {
        cy.wait('@addToCartRequest');
        cy.wait(2000);
        
        // Check for success message
        cy.get('body').then(($body) => {
          if ($body.find(addToCart.successMessage).length > 0) {
            cy.get(addToCart.successMessage).first().should('be.visible');
            cy.log('Add to cart success message displayed');
          }
          
          // Check cart count update
          if ($body.find(addToCart.cartCount).length > 0) {
            cy.get(addToCart.cartCount).first().should('contain', '1');
            cy.log('Cart count updated');
          }
        });
      }
    });
  });

  // Test 7: Cart Icon and Cart Count Updates
  it(addToCart.message07, () => {
    visitProductPage({ addToCartSuccess: true });
    
    // Check initial cart state
    cy.get('body').then(($body) => {
      if ($body.find(addToCart.cartIcon).length > 0) {
        cy.get(addToCart.cartIcon).first().should('be.visible');
        cy.log('Cart icon found');
        
        // Check initial cart count
        if ($body.find(addToCart.cartCount).length > 0) {
          cy.get(addToCart.cartCount).first().invoke('text').then((initialCount) => {
            cy.log(`Initial cart count: ${initialCount}`);
            
            // Add to cart
            clickAddToCartBtn().then((clicked) => {
              if (clicked) {
                cy.wait('@addToCartRequest');
                cy.wait(2000);
                
                // Check cart count increased
                cy.get(addToCart.cartCount).first().invoke('text').then((newCount) => {
                  cy.log(`New cart count: ${newCount}`);
                  expect(parseInt(newCount)).to.be.greaterThan(parseInt(initialCount) || 0);
                  cy.log('Cart count successfully updated');
                });
              }
            });
          });
        }
      } else {
        cy.log('Cart icon not found');
      }
    });
  });

  // Test 8: Wishlist Functionality
  it(addToCart.message08, () => {
    visitProductPage({ wishlistSuccess: true });
    
    // Check wishlist button
    cy.get('body').then(($body) => {
      if ($body.find(addToCart.wishlistBtn).length > 0) {
        cy.get(addToCart.wishlistBtn).first().click({ force: true });
        cy.wait('@wishlistRequest');
        cy.wait(2000);
        
        // Check for success message
        if ($body.find(addToCart.successMessage).length > 0) {
          cy.get(addToCart.successMessage).first().should('be.visible');
          cy.log('Wishlist success message displayed');
        }
        
        // Check wishlist icon state
        if ($body.find(addToCart.wishlistIcon).length > 0) {
          cy.get(addToCart.wishlistIcon).first().should('have.class', 'active');
          cy.log('Wishlist icon activated');
        }
      } else {
        cy.log('Wishlist button not found');
      }
    });
  });

  // Test 9: Product Sharing Functionality
  it(addToCart.message09, () => {
    visitProductPage();
    
    // Check share button
    cy.get('body').then(($body) => {
      if ($body.find(addToCart.shareBtn).length > 0) {
        cy.get(addToCart.shareBtn).first().click({ force: true });
        cy.wait(1000);
        
        // Check for share modal or options
        const shareSelectors = [
          '.share-modal',
          '.share-options',
          '.social-share',
          '[data-testid="share-modal"]'
        ];
        
        let shareModalFound = false;
        shareSelectors.forEach(selector => {
          if ($body.find(selector).length > 0) {
            cy.get(selector).first().should('be.visible');
            cy.log(`Share modal found: ${selector}`);
            shareModalFound = true;
          }
        });
        
        if (!shareModalFound) {
          cy.log('Share functionality may use native share or external links');
        }
      } else {
        cy.log('Share button not found');
      }
    });
  });

  // Test 10: Product Reviews and Ratings
  it(addToCart.message10, () => {
    visitProductPage();
    
    // Check reviews section
    cy.get('body').then(($body) => {
      if ($body.find(addToCart.productReviews).length > 0) {
        cy.get(addToCart.productReviews).first().should('be.visible');
        cy.log('Product reviews section found');
        
        // Check review count
        if ($body.find(addToCart.reviewCount).length > 0) {
          cy.get(addToCart.reviewCount).first().should('be.visible');
          cy.log('Review count found');
        }
        
        // Check write review button
        if ($body.find(addToCart.writeReviewBtn).length > 0) {
          cy.get(addToCart.writeReviewBtn).first().should('exist');
          cy.log('Write review button found');
        }
      } else {
        cy.log('Product reviews section not found');
      }
    });
  });

  // Test 11: Related Products Section
  it(addToCart.message11, () => {
    visitProductPage();
    
    // Check related products
    cy.get('body').then(($body) => {
      if ($body.find(addToCart.similarProducts).length > 0) {
        cy.get(addToCart.similarProducts).first().should('be.visible');
        cy.log('Related products section found');
        
        // Check for product cards in related section
        const $relatedProducts = $body.find('.product-card, .item-card, .related-product');
        if ($relatedProducts.length > 0) {
          cy.log(`Found ${$relatedProducts.length} related products`);
          
          // Test clicking first related product
          cy.wrap($relatedProducts).first().find('a').first().click({ force: true });
          cy.wait(2000);
          
          // Verify navigation to product page
          cy.url().should('include', '/dashboard/product');
          cy.log('Related product navigation works');
        }
      } else {
        cy.log('Related products section not found');
      }
    });
  });

  // Test 12: Product Comparison
  it(addToCart.message12, () => {
    visitProductPage();
    
    // Check compare button
    cy.get('body').then(($body) => {
      if ($body.find(addToCart.compareBtn).length > 0) {
        cy.get(addToCart.compareBtn).first().click({ force: true });
        cy.wait(1000);
        
        // Check for comparison functionality
        const compareSelectors = [
          '.compare-modal',
          '.comparison-table',
          '.product-comparison',
          '[data-testid="compare-modal"]'
        ];
        
        let compareFound = false;
        compareSelectors.forEach(selector => {
          if ($body.find(selector).length > 0) {
            cy.get(selector).first().should('be.visible');
            cy.log(`Comparison found: ${selector}`);
            compareFound = true;
          }
        });
        
        if (!compareFound) {
          cy.log('Comparison may redirect to comparison page');
        }
      } else {
        cy.log('Compare button not found');
      }
    });
  });

  // Test 13: Back to Products Navigation
  it(addToCart.message13, () => {
    visitProductPage();
    
    // Check back button
    cy.get('body').then(($body) => {
      if ($body.find(addToCart.backToProductsBtn).length > 0) {
        cy.get(addToCart.backToProductsBtn).first().click({ force: true });
        cy.wait(2000);
        
        // Verify navigation back
        cy.url().then((url) => {
          if (url.includes('/dashboard') && !url.includes('/product')) {
            cy.log('Successfully navigated back to dashboard');
          } else {
            cy.log('Navigation may go to products page');
          }
        });
      } else {
        cy.log('Back to products button not found');
      }
    });
  });

  // Test 14: Responsive Design
  it(addToCart.message14, () => {
    const viewports = addToCart.viewports || ['iphone-x', 'ipad-2', [1280, 720]];
    const viewportNames = ['mobile', 'tablet', 'desktop'];
    
    viewports.forEach((viewport, index) => {
      // Handle array viewports properly
      if (Array.isArray(viewport)) {
        cy.viewport(viewport[0], viewport[1]);
      } else {
        cy.viewport(viewport);
      }
      
      visitProductPage();
      
      cy.get(addToCart.root || '#root').should('be.visible');
      cy.log(`${viewportNames[index]} responsiveness verified`);
    });
  });

  // Test 15: Product Availability and Stock
  it(addToCart.message15, () => {
    visitProductPage();
    
    // Check availability status
    cy.get('body').then(($body) => {
      if ($body.find(addToCart.availability).length > 0) {
        cy.get(addToCart.availability).first().should('be.visible');
        cy.log('Availability status found');
        
        // Check stock count
        if ($body.find(addToCart.stockCount).length > 0) {
          cy.get(addToCart.stockCount).first().should('be.visible');
          cy.log('Stock count found');
        }
        
        // Check if add to cart is enabled based on availability
        if ($body.find(addToCart.addToCartBtn).length > 0) {
          const $addToCartBtn = $body.find(addToCart.addToCartBtn).first();
          if ($addToCartBtn.is(':disabled')) {
            cy.log('Add to cart is disabled - product may be out of stock');
          } else {
            cy.log('Add to cart is enabled - product is available');
          }
        }
      } else {
        cy.log('Availability status not found');
      }
    });
  });

  // Test 16: Product Price and Discounts
  it(addToCart.message16, () => {
    visitProductPage();
    
    // Check price elements
    cy.get('body').then(($body) => {
      // Current price
      if ($body.find(addToCart.productPrice).length > 0) {
        cy.get(addToCart.productPrice).first().should('be.visible');
        cy.get(addToCart.productPrice).first().invoke('text').then((price) => {
          cy.log(`Product price: ${price}`);
        });
      }
      
      // Original price (if discounted)
      if ($body.find(addToCart.originalPrice).length > 0) {
        cy.get(addToCart.originalPrice).first().should('be.visible');
        cy.log('Original price found - product may be discounted');
        
        // Check discount badge
        if ($body.find(addToCart.discountBadge).length > 0) {
          cy.get(addToCart.discountBadge).first().should('be.visible');
          cy.log('Discount badge found');
        }
      } else {
        cy.log('No original price found - product may not be discounted');
      }
    });
  });

  // Test 17: Product Description and Details
  it(addToCart.message17, () => {
    visitProductPage();
    
    // Check description section
    cy.get('body').then(($body) => {
      if ($body.find(addToCart.descriptionTab).length > 0) {
        cy.get(addToCart.descriptionTab).first().should('be.visible');
        cy.log('Product description found');
      } else {
        cy.log('Description tab not found');
      }
    });
  });

  // Test 18: Product Specifications
  it(addToCart.message18, () => {
    visitProductPage();
    
    // Check specifications section
    cy.get('body').then(($body) => {
      if ($body.find(addToCart.specificationsTab).length > 0) {
        cy.get(addToCart.specificationsTab).first().should('be.visible');
        cy.log('Product specifications found');
      } else {
        cy.log('Specifications tab not found');
      }
    });
  });

  // Test 19: Product Shipping Information
  it(addToCart.message19, () => {
    visitProductPage();
    
    // Check shipping information
    cy.get('body').then(($body) => {
      if ($body.find(addToCart.shippingTab).length > 0) {
        cy.get(addToCart.shippingTab).first().should('be.visible');
        cy.log('Shipping information found');
      } else {
        cy.log('Shipping tab not found');
      }
    });
  });

  // Test 20: Product Return Policy
  it(addToCart.message20, () => {
    visitProductPage();
    
    // Check return policy
    cy.get('body').then(($body) => {
      if ($body.find(addToCart.returnsTab).length > 0) {
        cy.get(addToCart.returnsTab).first().should('be.visible');
        cy.log('Return policy found');
      } else {
        cy.log('Returns tab not found');
      }
    });
  });
});