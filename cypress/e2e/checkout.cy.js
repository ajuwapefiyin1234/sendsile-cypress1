import { Sendsile } from '../configuration/project.config.js';

describe('Sendsile Checkout Functionality', () => {
  const { checkout } = Sendsile;
  const checkoutUrl = checkout.pageUrl;

  beforeEach(() => {
    // Clear cookies and local storage before each test
    cy.clearCookies();
    cy.clearLocalStorage();
    
    // Set up authentication state for checkout
    cy.window().then((win) => {
      win.localStorage.setItem("__user_access", "test-token");
      win.localStorage.setItem("userInfo", JSON.stringify({ 
        state: { 
          userData: { 
            name: "Test User",
            email: "test@example.com",
            phone: "08012345678"
          } 
        }, 
        version: 0 
      }));
    });

    // Mock API responses for checkout
    cy.intercept('POST', '**/cart/checkout', {
      statusCode: 200,
      body: {
        success: true,
        message: 'Order successfully placed',
        data: {
          orderId: 'order-12345',
          reference: 'ref-67890'
        }
      }
    }).as("checkoutRequest");

    cy.intercept('GET', '**/api/cart/**', {
      statusCode: 200,
      body: {
        success: true,
        data: {
          items: [
            {
              id: 1,
              name: 'Test Product',
              price: 100,
              quantity: 2,
              image: '/test-image.jpg'
            }
          ],
          total: 200
        }
      }
    }).as("cartData");
  });

  // Test 1: Page Load and Basic Structure
  it(checkout.message01, () => {
    cy.visit(checkoutUrl, { failOnStatusCode: false });
    cy.wait("@cartData");
    
    // Check page loads correctly
    cy.url().should('include', '/checkout');
    cy.get(checkout.root).should('be.visible');
    
    // Check page title
    cy.get(checkout.pageTitle).should('be.visible');
    cy.log('Checkout page loaded successfully');
  });

  // Test 2: Order Summary Section
  it(checkout.message02, () => {
    cy.visit(checkoutUrl);
    cy.wait("@cartData");
    
    // Check order summary section
    cy.get(checkout.orderSummary).should('be.visible');
    
    // Check order items
    cy.get(checkout.orderItems).should('have.length.greaterThan', 0);
    
    // Check item details
    cy.get(checkout.itemQuantity).should('be.visible');
    cy.get(checkout.itemPrice).should('be.visible');
    cy.get(checkout.subtotal).should('be.visible');
    
    cy.log('Order summary section displayed correctly');
  });

  // Test 3: Shipping Information Form
  it(checkout.message03, () => {
    cy.visit(checkoutUrl);
    cy.wait("@cartData");
    
    // Check shipping form
    cy.get(checkout.shippingForm).should('be.visible');
    
    // Check shipping input fields
    cy.get(checkout.firstName).should('be.visible');
    cy.get(checkout.lastName).should('be.visible');
    cy.get(checkout.email).should('be.visible');
    cy.get(checkout.phone).should('be.visible');
    cy.get(checkout.address).should('be.visible');
    cy.get(checkout.city).should('be.visible');
    cy.get(checkout.state).should('be.visible');
    cy.get(checkout.zipCode).should('be.visible');
    cy.get(checkout.country).should('be.visible');
    
    cy.log('Shipping information form displayed correctly');
  });

  // Test 4: Billing Information Form
  it(checkout.message04, () => {
    cy.visit(checkoutUrl);
    cy.wait("@cartData");
    
    // Check billing form
    cy.get(checkout.billingForm).should('be.visible');
    
    // Check billing input fields
    cy.get(checkout.cardNumber).should('be.visible');
    cy.get(checkout.cardName).should('be.visible');
    cy.get(checkout.expiryDate).should('be.visible');
    cy.get(checkout.cvv).should('be.visible');
    
    cy.log('Billing information form displayed correctly');
  });

  // Test 5: Payment Method Selection
  it(checkout.message05, () => {
    cy.visit(checkoutUrl);
    cy.wait("@cartData");
    
    // Check payment methods section
    cy.get(checkout.paymentMethods).should('be.visible');
    
    // Check payment method options
    cy.get(checkout.creditCardOption).should('exist');
    cy.get(checkout.paypalOption).should('exist');
    cy.get(checkout.applePayOption).should('exist');
    cy.get(checkout.googlePayOption).should('exist');
    
    cy.log('Payment method selection displayed correctly');
  });

  // Test 6: Order Total Calculation
  it(checkout.message06, () => {
    cy.visit(checkoutUrl);
    cy.wait("@cartData");
    
    // Check order total section
    cy.get(checkout.orderTotal).should('be.visible');
    cy.get(checkout.tax).should('be.visible');
    cy.get(checkout.shipping).should('be.visible');
    cy.get(checkout.discount).should('be.visible');
    cy.get(checkout.grandTotal).should('be.visible');
    
    cy.log('Order total calculation displayed correctly');
  });

  // Test 7: Action Buttons
  it(checkout.message07, () => {
    cy.visit(checkoutUrl);
    cy.wait("@cartData");
    
    // Check action buttons
    cy.get(checkout.placeOrderBtn).should('be.visible');
    cy.get(checkout.continueBtn).should('be.visible');
    cy.get(checkout.backBtn).should('be.visible');
    
    cy.log('Action buttons displayed correctly');
  });

  // Test 8: Form Validation
  it(checkout.message09, () => {
    cy.visit(checkoutUrl);
    cy.wait("@cartData");
    
    // Test empty form submission
    cy.get(checkout.placeOrderBtn).click();
    
    // Check for validation errors
    cy.get(checkout.requiredFieldError).should('be.visible');
    cy.get(checkout.invalidEmailError).should('be.visible');
    cy.get(checkout.invalidCardError).should('be.visible');
    
    cy.log('Form validation working correctly');
  });

  // Test 9: Loading States
  it(checkout.message10, () => {
    cy.visit(checkoutUrl);
    cy.wait("@cartData");
    
    // Mock loading state
    cy.intercept('POST', '**/cart/checkout', {
      statusCode: 200,
      body: { success: true },
      delay: 2000
    }).as("slowCheckout");
    
    // Fill form and submit
    cy.get(checkout.firstName).type('Test');
    cy.get(checkout.lastName).type('User');
    cy.get(checkout.email).type('test@example.com');
    cy.get(checkout.phone).type('1234567890');
    cy.get(checkout.address).type('123 Test St');
    cy.get(checkout.city).type('Test City');
    cy.get(checkout.state).select('Test State');
    cy.get(checkout.zipCode).type('12345');
    cy.get(checkout.country).select('Test Country');
    
    cy.get(checkout.placeOrderBtn).click();
    
    // Check loading indicator
    cy.get(checkout.loadingIndicator).should('be.visible');
    cy.get(checkout.loadingBtn).should('be.disabled');
    
    cy.wait("@slowCheckout");
    cy.log('Loading states working correctly');
  });

  // Test 10: Error States
  it(checkout.message11, () => {
    // Mock error response
    cy.intercept('POST', '**/cart/checkout', {
      statusCode: 400,
      body: {
        success: false,
        message: 'Payment failed'
      }
    }).as("failedCheckout");
    
    cy.visit(checkoutUrl);
    cy.wait("@cartData");
    
    // Fill and submit form
    cy.get(checkout.firstName).type('Test');
    cy.get(checkout.lastName).type('User');
    cy.get(checkout.email).type('test@example.com');
    cy.get(checkout.placeOrderBtn).click();
    
    cy.wait("@failedCheckout");
    
    // Check error message
    cy.get(checkout.errorMessage).should('be.visible');
    
    cy.log('Error states handled correctly');
  });

  // Test 11: Success States
  it(checkout.message12, () => {
    // Mock success response
    cy.intercept('POST', '**/cart/checkout', {
      statusCode: 200,
      body: {
        success: true,
        message: 'Order placed successfully',
        data: { orderId: 'order-12345' }
      }
    }).as("successCheckout");
    
    cy.visit(checkoutUrl);
    cy.wait("@cartData");
    
    // Fill and submit form
    cy.get(checkout.firstName).type('Test');
    cy.get(checkout.lastName).type('User');
    cy.get(checkout.email).type('test@example.com');
    cy.get(checkout.placeOrderBtn).click();
    
    cy.wait("@successCheckout");
    
    // Check success message
    cy.get(checkout.successMessage).should('be.visible');
    
    cy.log('Success states handled correctly');
  });

  // Test 12: Responsive Design
  it(checkout.message12, () => {
    // Test mobile view
    cy.viewport(checkout.mobileView);
    cy.visit(checkoutUrl);
    cy.wait("@cartData");
    
    cy.get(checkout.root).should('be.visible');
    
    // Test tablet view
    cy.viewport(checkout.tabletView);
    cy.get(checkout.root).should('be.visible');
    
    // Test desktop view
    cy.viewport(1280, 720);
    cy.get(checkout.root).should('be.visible');
    
    cy.log('Responsive design working correctly');
  });

  // Test 13: Complete Checkout Process
  it(checkout.message13, () => {
    cy.visit(checkoutUrl);
    cy.wait("@cartData");
    
    // Fill shipping information
    cy.get(checkout.firstName).type('John');
    cy.get(checkout.lastName).type('Doe');
    cy.get(checkout.email).type('john.doe@example.com');
    cy.get(checkout.phone).type('1234567890');
    cy.get(checkout.address).type('123 Main St');
    cy.get(checkout.city).type('New York');
    cy.get(checkout.state).select('NY');
    cy.get(checkout.zipCode).type('10001');
    cy.get(checkout.country).select('United States');
    
    // Fill billing information
    cy.get(checkout.cardNumber).type('4242424242424242');
    cy.get(checkout.cardName).type('John Doe');
    cy.get(checkout.expiryDate).type('12/25');
    cy.get(checkout.cvv).type('123');
    
    // Select payment method
    cy.get(checkout.creditCardOption).check();
    
    // Submit order
    cy.get(checkout.placeOrderBtn).click();
    
    // Wait for checkout completion
    cy.wait("@checkoutRequest");
    
    // Verify success
    cy.get(checkout.successMessage).should('be.visible');
    
    cy.log('Complete checkout process successful');
  });

  // Test 14: Valid Inputs Handling
  it(checkout.message14, () => {
    cy.visit(checkoutUrl);
    cy.wait("@cartData");
    
    // Test valid email
    cy.get(checkout.email).type('valid.email@example.com');
    cy.get(checkout.email).should('have.value', 'valid.email@example.com');
    
    // Test valid phone
    cy.get(checkout.phone).type('1234567890');
    cy.get(checkout.phone).should('have.value', '1234567890');
    
    // Test valid card number
    cy.get(checkout.cardNumber).type('4242424242424242');
    cy.get(checkout.cardNumber).should('have.value', '4242424242424242');
    
    cy.log('Valid inputs handled correctly');
  });

  // Test 15: Invalid Inputs Handling
  it(checkout.message15, () => {
    cy.visit(checkoutUrl);
    cy.wait("@cartData");
    
    // Test invalid email
    cy.get(checkout.email).type('invalid-email');
    cy.get(checkout.email).blur();
    cy.get(checkout.invalidEmailError).should('be.visible');
    
    // Test invalid card number
    cy.get(checkout.cardNumber).type('123');
    cy.get(checkout.cardNumber).blur();
    cy.get(checkout.invalidCardError).should('be.visible');
    
    cy.log('Invalid inputs handled correctly');
  });

  // Test 16: Input Field Interactions
  it(checkout.message16, () => {
    cy.visit(checkoutUrl);
    cy.wait("@cartData");
    
    // Test all input fields
    cy.get(checkout.firstName).type('Test').clear().should('have.value', '');
    cy.get(checkout.lastName).type('User').clear().should('have.value', '');
    cy.get(checkout.email).type('test@example.com').clear().should('have.value', '');
    cy.get(checkout.phone).type('1234567890').clear().should('have.value', '');
    cy.get(checkout.address).type('123 Test St').clear().should('have.value', '');
    cy.get(checkout.city).type('Test City').clear().should('have.value', '');
    cy.get(checkout.zipCode).type('12345').clear().should('have.value', '');
    
    // Test select fields
    cy.get(checkout.state).select('Test State').should('have.value', 'Test State');
    cy.get(checkout.country).select('Test Country').should('have.value', 'Test Country');
    
    cy.log('Input field interactions working correctly');
  });

  // Test 17: Coupon Functionality
  it(checkout.message17, () => {
    cy.visit(checkoutUrl);
    cy.wait("@cartData");
    
    // Test coupon input
    cy.get(checkout.couponInput).type('TESTCODE123');
    cy.get(checkout.couponButton).click();
    
    // Check coupon message
    cy.get(checkout.couponMessage).should('be.visible');
    
    cy.log('Coupon functionality working correctly');
  });

  // Test 18: Payment Method Selection
  it(checkout.message18, () => {
    cy.visit(checkoutUrl);
    cy.wait("@cartData");
    
    // Test different payment methods
    cy.get(checkout.creditCardOption).check();
    cy.get(checkout.creditCardOption).should('be.checked');
    
    cy.get(checkout.paypalOption).check();
    cy.get(checkout.paypalOption).should('be.checked');
    
    cy.get(checkout.applePayOption).check();
    cy.get(checkout.applePayOption).should('be.checked');
    
    cy.log('Payment method selection working correctly');
  });

  // Test 19: Order Details Verification
  it(checkout.message19, () => {
    cy.visit(checkoutUrl);
    cy.wait("@cartData");
    
    // Verify order details
    cy.get(checkout.orderItems).should('have.length.greaterThan', 0);
    cy.get(checkout.itemName).should('be.visible');
    cy.get(checkout.itemPrice).should('be.visible');
    cy.get(checkout.itemQuantity).should('be.visible');
    cy.get(checkout.itemImage).should('be.visible');
    
    cy.log('Order details verified correctly');
  });

  // Test 20: Realistic User Behavior
  it(checkout.message20, () => {
    cy.visit(checkoutUrl);
    cy.wait("@cartData");
    
    // Simulate realistic user behavior
    cy.get(checkout.firstName).type('John', { delay: 100 });
    cy.get(checkout.lastName).type('Doe', { delay: 100 });
    cy.get(checkout.email).type('john.doe@example.com', { delay: 100 });
    cy.get(checkout.phone).type('1234567890', { delay: 100 });
    
    // User pauses to think
    cy.wait(1000);
    
    cy.get(checkout.address).type('123 Main St, Apt 4B', { delay: 100 });
    cy.get(checkout.city).type('New York', { delay: 100 });
    cy.get(checkout.state).select('NY');
    cy.get(checkout.zipCode).type('10001', { delay: 100 });
    cy.get(checkout.country).select('United States');
    
    // User reviews order
    cy.get(checkout.orderSummary).scrollIntoView();
    cy.wait(2000);
    
    // User proceeds to payment
    cy.get(checkout.cardNumber).type('4242424242424242', { delay: 100 });
    cy.get(checkout.cardName).type('John Doe', { delay: 100 });
    cy.get(checkout.expiryDate).type('12/25', { delay: 100 });
    cy.get(checkout.cvv).type('123', { delay: 100 });
    
    // Final review before submission
    cy.wait(1000);
    cy.get(checkout.placeOrderBtn).click();
    
    cy.wait("@checkoutRequest");
    cy.get(checkout.successMessage).should('be.visible');
    
    cy.log('Realistic user behavior simulation successful');
  });
});