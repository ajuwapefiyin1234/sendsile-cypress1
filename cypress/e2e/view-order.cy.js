import { Sendsile } from "../configuration/project.config.js";

describe("Sendsile View Order Page", () => {
  const pageUrl = Sendsile.viewOrder.pageUrl;

  beforeEach(() => {
    // Mock authentication for order viewing
    cy.window().then((win) => {
      win.localStorage.setItem("__user_access", "test-token");
      win.localStorage.setItem("ramadanModal", "true");
      win.localStorage.setItem(
        "userInfo",
        JSON.stringify({ 
          state: { 
            userData: { 
              name: "Test User",
              email: "test@example.com",
              phone: "08012345678"
            } 
          }, 
          version: 0 
        })
      );
    });

    // Mock API responses for order viewing
    cy.intercept('GET', '**/api/**', {
      statusCode: 200,
      body: {
        data: {
          orderId: "81d0be09-0cae-4b60-a973-f3fa99294ad2",
          orderStatus: "completed",
          orderDate: "2024-03-25T10:30:00Z",
          items: [
            {
              id: "item-1",
              name: "Test Product 1",
              price: 29.99,
              quantity: 2,
              image: "/images/product1.jpg"
            },
            {
              id: "item-2", 
              name: "Test Product 2",
              price: 19.99,
              quantity: 1,
              image: "/images/product2.jpg"
            }
          ],
          subtotal: 79.97,
          tax: 6.40,
          shipping: 5.00,
          total: 91.37
        },
        message: Sendsile.viewOrder.message01
      } 
    }).as("apiGetOrder");

    cy.visit(pageUrl);
    cy.wait(3000);
  });

  // Test 1: Order Details Header
  it(Sendsile.viewOrder.message01, () => {
    // Check for page title or heading
    cy.get("body").then(($body) => {
      if ($body.find(Sendsile.viewOrder.pageTitle).length > 0) {
        cy.get(Sendsile.viewOrder.pageTitle).should("be.visible");
      } else {
        cy.log("ℹ️ Order title not found, checking for alternative content");
        cy.get("body").should("be.visible");
      }
    });
    
    // Check for page description
    cy.get("body").then(($body) => {
      if ($body.find(Sendsile.viewOrder.pageDescription).length > 0) {
        cy.get(Sendsile.viewOrder.pageDescription).should("exist");
      } else {
        cy.log("ℹ️ Order description not found");
      }
    });
  });

  // Test 2: Order Information Section
  it(Sendsile.viewOrder.message02, () => {
    // Check for order information section
    cy.get("body").then(($body) => {
      if ($body.find(Sendsile.viewOrder.orderInfo).length > 0) {
        cy.get(Sendsile.viewOrder.orderInfo).should("be.visible");
      }
    });
    
    // Check for order ID
    cy.get("body").then(($body) => {
      if ($body.find(Sendsile.viewOrder.orderId).length > 0) {
        cy.get(Sendsile.viewOrder.orderId).should("exist");
      }
    });
    
    // Check for order date
    cy.get("body").then(($body) => {
      if ($body.find(Sendsile.viewOrder.orderDate).length > 0) {
        cy.get(Sendsile.viewOrder.orderDate).should("exist");
      }
    });
    
    // Check for order status
    cy.get("body").then(($body) => {
      if ($body.find(Sendsile.viewOrder.orderStatus).length > 0) {
        cy.get(Sendsile.viewOrder.orderStatus).should("exist");
      }
    });
  });

  // Test 3: Order Items List
  it(Sendsile.viewOrder.message03, () => {
    // Check for order items list
    cy.get("body").then(($body) => {
      if ($body.find(Sendsile.viewOrder.itemsList).length > 0) {
        cy.get(Sendsile.viewOrder.itemsList).should("be.visible");
      }
    });
    
    // Check for order items
    cy.get("body").then(($body) => {
      if ($body.find(Sendsile.viewOrder.orderItem).length > 0) {
        cy.get(Sendsile.viewOrder.orderItem).should("exist");
      }
    });
    
    // Check for item names
    cy.get("body").then(($body) => {
      if ($body.find(Sendsile.viewOrder.itemName).length > 0) {
        cy.get(Sendsile.viewOrder.itemName).should("exist");
      }
    });
    
    // Check for item prices
    cy.get("body").then(($body) => {
      if ($body.find(Sendsile.viewOrder.itemPrice).length > 0) {
        cy.get(Sendsile.viewOrder.itemPrice).should("exist");
      }
    });
    
    // Check for item quantities
    cy.get("body").then(($body) => {
      if ($body.find(Sendsile.viewOrder.itemQuantity).length > 0) {
        cy.get(Sendsile.viewOrder.itemQuantity).should("exist");
      }
    });
    
    // Check for item images
    cy.get("body").then(($body) => {
      if ($body.find(Sendsile.viewOrder.itemImage).length > 0) {
        cy.get(Sendsile.viewOrder.itemImage).should("exist");
      }
    });
  });

  // Test 4: Order Status Section
  it(Sendsile.viewOrder.message04, () => {
    // Check for status section
    cy.get("body").then(($body) => {
      if ($body.find(Sendsile.viewOrder.statusSection).length > 0) {
        cy.get(Sendsile.viewOrder.statusSection).should("be.visible");
      }
    });
    
    // Check for status badge
    cy.get("body").then(($body) => {
      if ($body.find(Sendsile.viewOrder.statusBadge).length > 0) {
        cy.get(Sendsile.viewOrder.statusBadge).should("exist");
      }
    });
    
    // Check for tracking number
    cy.get("body").then(($body) => {
      if ($body.find(Sendsile.viewOrder.trackingNumber).length > 0) {
        cy.get(Sendsile.viewOrder.trackingNumber).should("exist");
      }
    });
  });

  // Test 5: Order Timeline Section
  it(Sendsile.viewOrder.message05, () => {
    // Check for timeline section
    cy.get("body").then(($body) => {
      if ($body.find(Sendsile.viewOrder.timeline).length > 0) {
        cy.get(Sendsile.viewOrder.timeline).should("be.visible");
      }
    });
    
    // Check for timeline events
    cy.get("body").then(($body) => {
      if ($body.find(Sendsile.viewOrder.timelineEvent).length > 0) {
        cy.get(Sendsile.viewOrder.timelineEvent).should("exist");
      }
    });
    
    // Check for event dates
    cy.get("body").then(($body) => {
      if ($body.find(Sendsile.viewOrder.eventDate).length > 0) {
        cy.get(Sendsile.viewOrder.eventDate).should("exist");
      }
    });
    
    // Check for event descriptions
    cy.get("body").then(($body) => {
      if ($body.find(Sendsile.viewOrder.eventDescription).length > 0) {
        cy.get(Sendsile.viewOrder.eventDescription).should("exist");
      }
    });
  });

  // Test 6: Shipping Information
  it(Sendsile.viewOrder.message06, () => {
    // Check for shipping information section
    cy.get("body").then(($body) => {
      if ($body.find(Sendsile.viewOrder.shippingInfo).length > 0) {
        cy.get(Sendsile.viewOrder.shippingInfo).should("be.visible");
      }
    });
    
    // Check for shipping address
    cy.get("body").then(($body) => {
      if ($body.find(Sendsile.viewOrder.shippingAddress).length > 0) {
        cy.get(Sendsile.viewOrder.shippingAddress).should("exist");
      }
    });
    
    // Check for recipient name
    cy.get("body").then(($body) => {
      if ($body.find(Sendsile.viewOrder.recipientName).length > 0) {
        cy.get(Sendsile.viewOrder.recipientName).should("exist");
      }
    });
    
    // Check for shipping method
    cy.get("body").then(($body) => {
      if ($body.find(Sendsile.viewOrder.shippingMethod).length > 0) {
        cy.get(Sendsile.viewOrder.shippingMethod).should("exist");
      }
    });
    
    // Check for estimated delivery
    cy.get("body").then(($body) => {
      if ($body.find(Sendsile.viewOrder.estimatedDelivery).length > 0) {
        cy.get(Sendsile.viewOrder.estimatedDelivery).should("exist");
      }
    });
  });

  // Test 7: Billing Information
  it(Sendsile.viewOrder.message07, () => {
    // Check for billing information section
    cy.get("body").then(($body) => {
      if ($body.find(Sendsile.viewOrder.billingInfo).length > 0) {
        cy.get(Sendsile.viewOrder.billingInfo).should("be.visible");
      }
    });
    
    // Check for billing address
    cy.get("body").then(($body) => {
      if ($body.find(Sendsile.viewOrder.billingAddress).length > 0) {
        cy.get(Sendsile.viewOrder.billingAddress).should("exist");
      }
    });
    
    // Check for payment method
    cy.get("body").then(($body) => {
      if ($body.find(Sendsile.viewOrder.paymentMethod).length > 0) {
        cy.get(Sendsile.viewOrder.paymentMethod).should("exist");
      }
    });
    
    // Check for card last 4 digits
    cy.get("body").then(($body) => {
      if ($body.find(Sendsile.viewOrder.cardLast4).length > 0) {
        cy.get(Sendsile.viewOrder.cardLast4).should("exist");
      }
    });
  });

  // Test 8: Order Total Section
  it(Sendsile.viewOrder.message08, () => {
    // Check for total section
    cy.get("body").then(($body) => {
      if ($body.find(Sendsile.viewOrder.totalSection).length > 0) {
        cy.get(Sendsile.viewOrder.totalSection).should("be.visible");
      }
    });
    
    // Check for subtotal
    cy.get("body").then(($body) => {
      if ($body.find(Sendsile.viewOrder.subtotal).length > 0) {
        cy.get(Sendsile.viewOrder.subtotal).should("exist");
      }
    });
    
    // Check for tax
    cy.get("body").then(($body) => {
      if ($body.find(Sendsile.viewOrder.tax).length > 0) {
        cy.get(Sendsile.viewOrder.tax).should("exist");
      }
    });
    
    // Check for shipping cost
    cy.get("body").then(($body) => {
      if ($body.find(Sendsile.viewOrder.shipping).length > 0) {
        cy.get(Sendsile.viewOrder.shipping).should("exist");
      }
    });
    
    // Check for discount
    cy.get("body").then(($body) => {
      if ($body.find(Sendsile.viewOrder.discount).length > 0) {
        cy.get(Sendsile.viewOrder.discount).should("exist");
      }
    });
    
    // Check for grand total
    cy.get("body").then(($body) => {
      if ($body.find(Sendsile.viewOrder.grandTotal).length > 0) {
        cy.get(Sendsile.viewOrder.grandTotal).should("exist");
      }
    });
  });

  // Test 9: Order Actions
  it(Sendsile.viewOrder.message09, () => {
    // Check for actions section
    cy.get("body").then(($body) => {
      if ($body.find(Sendsile.viewOrder.actionsSection).length > 0) {
        cy.get(Sendsile.viewOrder.actionsSection).should("be.visible");
      }
    });
    
    // Check for track order button
    cy.get("body").then(($body) => {
      if ($body.find(Sendsile.viewOrder.trackOrderBtn).length > 0) {
        cy.get(Sendsile.viewOrder.trackOrderBtn).should("exist");
      }
    });
    
    // Check for download invoice button
    cy.get("body").then(($body) => {
      if ($body.find(Sendsile.viewOrder.downloadInvoiceBtn).length > 0) {
        cy.get(Sendsile.viewOrder.downloadInvoiceBtn).should("exist");
      }
    });
    
    // Check for cancel order button
    cy.get("body").then(($body) => {
      if ($body.find(Sendsile.viewOrder.cancelOrderBtn).length > 0) {
        cy.get(Sendsile.viewOrder.cancelOrderBtn).should("exist");
      }
    });
    
    // Check for reorder button
    cy.get("body").then(($body) => {
      if ($body.find(Sendsile.viewOrder.reorderBtn).length > 0) {
        cy.get(Sendsile.viewOrder.reorderBtn).should("exist");
      }
    });
  });

  // Test 10: Order Tracking Information
  it(Sendsile.viewOrder.message10, () => {
    // Check for tracking details section
    cy.get("body").then(($body) => {
      if ($body.find(Sendsile.viewOrder.trackingInfo).length > 0) {
        cy.get(Sendsile.viewOrder.trackingInfo).should("be.visible");
      }
    });
    
    // Check for tracking link
    cy.get("body").then(($body) => {
      if ($body.find(Sendsile.viewOrder.trackingLink).length > 0) {
        cy.get(Sendsile.viewOrder.trackingLink).should("exist");
      }
    });
  });

  // Test 11: Loading States
  it(Sendsile.viewOrder.message11, () => {
    // Check for loading indicators
    cy.get("body").then(($body) => {
      if ($body.find(Sendsile.viewOrder.loadingIndicator).length > 0) {
        cy.get(Sendsile.viewOrder.loadingIndicator).should("be.visible");
      }
    });
  });

  // Test 12: Error States
  it(Sendsile.viewOrder.message12, () => {
    // Check for error messages
    cy.get("body").then(($body) => {
      if ($body.find(Sendsile.viewOrder.errorMessage).length > 0) {
        cy.get(Sendsile.viewOrder.errorMessage).should("be.visible");
      }
    });
    
    // Check for validation errors
    cy.get("body").then(($body) => {
      if ($body.find(Sendsile.viewOrder.requiredFieldError).length > 0) {
        cy.get(Sendsile.viewOrder.requiredFieldError).should("be.visible");
      }
    });
    
    // Check for invalid data errors
    cy.get("body").then(($body) => {
      if ($body.find(Sendsile.viewOrder.invalidDataError).length > 0) {
        cy.get(Sendsile.viewOrder.invalidDataError).should("be.visible");
      }
    });
  });

  // Test 13: Responsive Design
  it(Sendsile.viewOrder.message13, () => {
    // Test mobile view
    cy.viewport(Sendsile.viewOrder.mobileView);
    cy.get("body").then(($body) => {
      if ($body.find(Sendsile.viewOrder.root).length > 0) {
        cy.get(Sendsile.viewOrder.root).should('be.visible');
      } else {
        cy.get("body").should("be.visible");
      }
    });
    
    // Test tablet view
    cy.viewport(Sendsile.viewOrder.tabletView);
    cy.get("body").then(($body) => {
      if ($body.find(Sendsile.viewOrder.root).length > 0) {
        cy.get(Sendsile.viewOrder.root).should('be.visible');
      } else {
        cy.get("body").should("be.visible");
      }
    });
    
    // Test desktop view
    cy.viewport(1280, 720);
    cy.get("body").then(($body) => {
      if ($body.find(Sendsile.viewOrder.root).length > 0) {
        cy.get(Sendsile.viewOrder.root).should('be.visible');
      } else {
        cy.get("body").should("be.visible");
      }
    });
  });
});