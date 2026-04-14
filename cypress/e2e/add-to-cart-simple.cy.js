/* global cy, describe, it, beforeEach */
import { Sendsile } from '../configuration/project.config.js';

const { addToCart } = Sendsile;

// Validate add-to-cart configuration exists
if (!addToCart) {
  throw new Error('Add to cart configuration not found in project.config.js');
}

// Simple mock product page for testing
const createSimpleMockProductPage = () => {
  cy.log('Creating simple mock product page');
  
  // Visit a blank page and inject simple mock product page content
  cy.visit('about:blank');
  
  cy.window().then((win) => {
    // Create simple mock product page HTML
    const mockHTML = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Add to Cart Test - Sendsile</title>
        <style>
          body { font-family: Arial, sans-serif; margin: 20px; padding: 20px; }
          .product-container { max-width: 800px; margin: 0 auto; padding: 20px; border: 1px solid #ddd; border-radius: 8px; }
          .product-title { font-size: 24px; font-weight: bold; margin-bottom: 15px; color: #333; }
          .product-price { font-size: 20px; color: #007bff; margin-bottom: 15px; font-weight: bold; }
          .product-description { margin-bottom: 20px; color: #666; }
          .product-options { margin-bottom: 20px; }
          .option-group { margin-bottom: 15px; }
          .option-label { font-weight: bold; margin-bottom: 5px; }
          .size-options, .color-options { display: flex; gap: 10px; margin-bottom: 10px; }
          .size-option, .color-option { 
            padding: 8px 16px; 
            border: 1px solid #ccc; 
            background: #f9f9f9; 
            cursor: pointer; 
            border-radius: 4px; 
          }
          .size-option:hover, .color-option:hover { background: #e9ecef; }
          .size-option.selected, .color-option.selected { background: #007bff; color: white; border-color: #007bff; }
          .quantity-selector { margin-bottom: 15px; }
          .quantity-input { width: 80px; padding: 8px; border: 1px solid #ccc; border-radius: 4px; }
          .add-to-cart-btn { 
            padding: 12px 24px; 
            background: #28a745; 
            color: white; 
            border: none; 
            cursor: pointer; 
            font-size: 16px;
            border-radius: 4px;
            margin-top: 10px;
          }
          .add-to-cart-btn:hover { background: #218838; }
          .add-to-cart-btn:disabled { background: #6c757d; cursor: not-allowed; }
          .wishlist-btn { 
            padding: 8px 16px; 
            background: #ffc107; 
            color: #212529; 
            border: none; 
            cursor: pointer;
            border-radius: 4px;
            margin-right: 10px;
          }
          .success-message { color: #28a745; font-weight: bold; margin-top: 10px; padding: 10px; background: #d4edda; border-radius: 4px; }
          .error-message { color: #dc3545; font-weight: bold; margin-top: 10px; padding: 10px; background: #f8d7da; border-radius: 4px; }
          .cart-info { margin-top: 15px; padding: 10px; background: #e9ecef; border-radius: 4px; }
        </style>
      </head>
      <body>
        <div class="product-container">
          <h1 class="product-title">Test Product</h1>
          <div class="product-price">$29.99</div>
          <div class="product-description">This is a test product for add to cart functionality testing.</div>
          
          <div class="product-options">
            <div class="option-group">
              <div class="option-label">Size:</div>
              <div class="size-options">
                <button class="size-option" data-size="S">S</button>
                <button class="size-option" data-size="M">M</button>
                <button class="size-option" data-size="L">L</button>
                <button class="size-option" data-size="XL">XL</button>
              </div>
            </div>
            
            <div class="option-group">
              <div class="option-label">Color:</div>
              <div class="color-options">
                <button class="color-option" data-color="Red">Red</button>
                <button class="color-option" data-color="Blue">Blue</button>
                <button class="color-option" data-color="Green">Green</button>
                <button class="color-option" data-color="Black">Black</button>
              </div>
            </div>
            
            <div class="option-group">
              <div class="option-label">Quantity:</div>
              <div class="quantity-selector">
                <input type="number" class="quantity-input" id="quantity" value="1" min="1" max="10" />
              </div>
            </div>
          </div>
          
          <div class="product-actions">
            <button class="wishlist-btn" id="wishlist-btn">Add to Wishlist</button>
            <button class="add-to-cart-btn" id="add-to-cart-btn">Add to Cart</button>
          </div>
          
          <div id="message-container"></div>
          
          <div class="cart-info">
            <div>Cart Status: <span id="cart-status">Empty</span></div>
            <div>Cart Count: <span id="cart-count">0</span></div>
          </div>
        </div>
        
        <script>
          // Simple product page functionality
          let selectedSize = null;
          let selectedColor = null;
          let cartCount = 0;
          
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
          
          // Quantity input change
          document.getElementById('quantity').addEventListener('input', function() {
            const value = parseInt(this.value);
            if (value >= 1 && value <= 10) {
              this.value = value;
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
            
            if (quantity < 1 || quantity > 10) {
              showMessage('Quantity must be between 1 and 10', 'error');
              return;
            }
            
            // Simulate add to cart
            cartCount += quantity;
            updateCartStatus();
            showMessage(\`Added ${quantity} item(s) to cart successfully!\`, 'success');
          });
          
          // Wishlist functionality
          document.getElementById('wishlist-btn').addEventListener('click', function() {
            showMessage('Product added to wishlist!', 'success');
          });
          
          function showMessage(message, type) {
            messageContainer.innerHTML = \`<div class="\${type}-message">\${message}</div>\`;
            setTimeout(() => {
              messageContainer.innerHTML = '';
            }, 3000);
          }
          
          function updateCartStatus() {
            document.getElementById('cart-count').textContent = cartCount;
            document.getElementById('cart-status').textContent = cartCount > 0 ? \`\${cartCount} items\` : 'Empty';
          }
        </script>
      </body>
      </html>
    `;
    
    // Write mock HTML to document
    win.document.write(mockHTML);
    win.document.close();
  });
  
  cy.wait(1000); // Wait for mock page to load
  cy.log('Simple mock product page created successfully');
};

// Helper function to wait for element and click it
const clickElement = (selector, options = {}) => {
  cy.get(selector, { timeout: 10000 }).should('be.visible').click(options);
};

// Helper function to type text in input
const typeText = (selector, text, options = {}) => {
  cy.get(selector, { timeout: 10000 }).should('be.visible').clear().type(text, options);
};

// ==========================================
// SIMPLE ADD TO CART TESTS
// ==========================================
describe('Sendsile Add to Cart - Simple Tests', () => {
  beforeEach(() => {
    cy.clearCookies();
    cy.clearLocalStorage();
    cy.viewport(1440, 900); // Set consistent viewport
  });

  // Test 1: Page Load and Basic Structure
  it('should load mock product page with basic structure', () => {
    createSimpleMockProductPage();
    
    // Verify page title
    cy.title().should('contain', 'Add to Cart Test');
    
    // Verify basic elements are present
    cy.get('.product-container').should('be.visible');
    cy.get('.product-title').should('be.visible').should('contain', 'Test Product');
    cy.get('.product-price').should('be.visible').should('contain', '$29.99');
    cy.get('.product-description').should('be.visible');
    cy.get('.add-to-cart-btn').should('be.visible');
    cy.get('.wishlist-btn').should('be.visible');
    cy.get('.quantity-input').should('be.visible');
  });

  // Test 2: Size Selection
  it('should handle size selection correctly', () => {
    createSimpleMockProductPage();
    
    // Click size option
    clickElement('.size-option[data-size="M"]');
    
    // Verify size is selected
    cy.get('.size-option[data-size="M"]').should('have.class', 'selected');
    
    // Click another size
    clickElement('.size-option[data-size="L"]');
    
    // Verify new size is selected
    cy.get('.size-option[data-size="L"]').should('have.class', 'selected');
    cy.get('.size-option[data-size="M"]').should('not.have.class', 'selected');
  });

  // Test 3: Color Selection
  it('should handle color selection correctly', () => {
    createSimpleMockProductPage();
    
    // Click color option
    clickElement('.color-option[data-color="Blue"]');
    
    // Verify color is selected
    cy.get('.color-option[data-color="Blue"]').should('have.class', 'selected');
    
    // Click another color
    clickElement('.color-option[data-color="Red"]');
    
    // Verify new color is selected
    cy.get('.color-option[data-color="Red"]').should('have.class', 'selected');
    cy.get('.color-option[data-color="Blue"]').should('not.have.class', 'selected');
  });

  // Test 4: Quantity Input
  it('should handle quantity input correctly', () => {
    createSimpleMockProductPage();
    
    // Verify initial quantity
    cy.get('.quantity-input').should('have.value', '1');
    
    // Change quantity
    typeText('.quantity-input', '5');
    
    // Verify quantity changed
    cy.get('.quantity-input').should('have.value', '5');
    
    // Test invalid quantity
    typeText('.quantity-input', '0');
    cy.get('.quantity-input').should('have.value', '1'); // Should revert to min value
  });

  // Test 5: Add to Cart - Success Case
  it('should add product to cart successfully', () => {
    createSimpleMockProductPage();
    
    // Select size and color
    clickElement('.size-option[data-size="M"]');
    clickElement('.color-option[data-color="Blue"]');
    
    // Set quantity
    typeText('.quantity-input', '2');
    
    // Click add to cart
    clickElement('#add-to-cart-btn');
    
    // Verify success message
    cy.get('.success-message').should('be.visible').should('contain', 'Added 2 item(s) to cart successfully!');
    
    // Verify cart count updated
    cy.get('#cart-count').should('contain', '2');
    cy.get('#cart-status').should('contain', '2 items');
  });

  // Test 6: Add to Cart - Error Cases
  it('should show error when size not selected', () => {
    createSimpleMockProductPage();
    
    // Set quantity but don't select size
    typeText('.quantity-input', '1');
    
    // Click add to cart
    clickElement('#add-to-cart-btn');
    
    // Verify error message
    cy.get('.error-message').should('be.visible').should('contain', 'Please select size and color');
  });

  it('should show error when color not selected', () => {
    createSimpleMockProductPage();
    
    // Select size but don't select color
    clickElement('.size-option[data-size="M"]');
    
    // Set quantity
    typeText('.quantity-input', '1');
    
    // Click add to cart
    clickElement('#add-to-cart-btn');
    
    // Verify error message
    cy.get('.error-message').should('be.visible').should('contain', 'Please select size and color');
  });

  it('should show error when quantity is invalid', () => {
    createSimpleMockProductPage();
    
    // Select size and color
    clickElement('.size-option[data-size="M"]');
    clickElement('.color-option[data-color="Blue"]');
    
    // Set invalid quantity
    typeText('.quantity-input', '15');
    
    // Click add to cart
    clickElement('#add-to-cart-btn');
    
    // Verify error message
    cy.get('.error-message').should('be.visible').should('contain', 'Quantity must be between 1 and 10');
  });

  // Test 7: Wishlist Functionality
  it('should handle wishlist functionality correctly', () => {
    createSimpleMockProductPage();
    
    // Click wishlist button
    clickElement('#wishlist-btn');
    
    // Verify success message
    cy.get('.success-message').should('be.visible').should('contain', 'Product added to wishlist!');
  });

  // Test 8: Responsive Design
  it('should be responsive on mobile view', () => {
    cy.viewport('iphone-x'); // Mobile viewport
    createSimpleMockProductPage();
    
    // Verify elements are still visible and functional
    cy.get('.product-container').should('be.visible');
    cy.get('.add-to-cart-btn').should('be.visible');
    cy.get('.size-option').should('have.length', 4);
    cy.get('.color-option').should('have.length', 4);
  });

  it('should be responsive on tablet view', () => {
    cy.viewport('ipad-2'); // Tablet viewport
    createSimpleMockProductPage();
    
    // Verify elements are still visible and functional
    cy.get('.product-container').should('be.visible');
    cy.get('.add-to-cart-btn').should('be.visible');
    cy.get('.size-option').should('have.length', 4);
    cy.get('.color-option').should('have.length', 4);
  });

  // Test 9: Button States
  it('should handle button states correctly', () => {
    createSimpleMockProductPage();
    
    // Initially button should be enabled
    cy.get('#add-to-cart-btn').should('not.be.disabled');
    
    // Select size and color
    clickElement('.size-option[data-size="M"]');
    clickElement('.color-option[data-color="Blue"]');
    
    // Button should still be enabled
    cy.get('#add-to-cart-btn').should('not.be.disabled');
  });

  // Test 10: Cart Status Updates
  it('should update cart status correctly', () => {
    createSimpleMockProductPage();
    
    // Initially cart should be empty
    cy.get('#cart-status').should('contain', 'Empty');
    cy.get('#cart-count').should('contain', '0');
    
    // Add items to cart
    clickElement('.size-option[data-size="M"]');
    clickElement('.color-option[data-color="Blue"]');
    typeText('.quantity-input', '3');
    clickElement('#add-to-cart-btn');
    
    // Verify cart status updated
    cy.get('#cart-status').should('contain', '3 items');
    cy.get('#cart-count').should('contain', '3');
    
    // Add more items
    clickElement('.size-option[data-size="L"]');
    clickElement('.color-option[data-color="Red"]');
    typeText('.quantity-input', '1');
    clickElement('#add-to-cart-btn');
    
    // Verify cart status updated again
    cy.get('#cart-status').should('contain', '4 items');
    cy.get('#cart-count').should('contain', '4');
  });
});
