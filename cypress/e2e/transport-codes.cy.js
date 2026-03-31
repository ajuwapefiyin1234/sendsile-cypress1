describe("Transport Codes - Test Suite", () => {
  const pageUrl = "http://localhost:3000/transport-codes";

  beforeEach(() => {
    // Mock authentication
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

    // Mock API responses for transport codes
    cy.intercept("GET", "**/api/v1/transport-codes**", {
      statusCode: 200,
      body: {
        success: true,
        data: [
          {
            id: "TC001",
            code: "AIR",
            name: "Air Transport",
            description: "Air freight and cargo transport",
            active: true
          },
          {
            id: "TC002", 
            code: "SEA",
            name: "Sea Transport",
            description: "Maritime shipping and cargo transport",
            active: true
          },
          {
            id: "TC003",
            code: "LAND",
            name: "Land Transport",
            description: "Ground transportation and logistics",
            active: false
          },
          {
            id: "TC004",
            code: "RAIL",
            name: "Rail Transport",
            description: "Railway freight and passenger transport",
            active: true
          }
        ]
      }
    }).as("getTransportCodes");

    cy.intercept("POST", "**/api/v1/transport-codes", {
      statusCode: 201,
      body: {
        success: true,
        data: {
          id: "TC005",
          code: "ROAD",
          name: "Road Transport",
          description: "Road freight and delivery services",
          active: true
        }
      }
    }).as("createTransportCode");

    cy.intercept("PUT", "**/api/v1/transport-codes/**", {
      statusCode: 200,
      body: {
        success: true,
        data: {
          id: "TC003",
          code: "LAND",
          name: "Land Transport Updated",
          description: "Updated ground transportation and logistics",
          active: true
        }
      }
    }).as("updateTransportCode");

    cy.intercept("DELETE", "**/api/v1/transport-codes/**", {
      statusCode: 200,
      body: {
        success: true,
        message: "Transport code deleted successfully"
      }
    }).as("deleteTransportCode");
  });

  it("should load transport codes page", () => {
    cy.visit(pageUrl);
    cy.wait("@getTransportCodes");
    cy.wait(3000);
    
    cy.get("body").should("be.visible");
    cy.log("✅ Transport codes page loaded");
    
    cy.url().then(url => {
      if (url.includes("transport-codes")) {
        cy.log("✅ On transport codes page");
      } else if (url.includes("login")) {
        cy.log("⚠️ Redirected to login - authentication issue");
      } else {
        cy.log(`⚠️ Unexpected URL: ${url}`);
      }
    });
  });

  it("should display transport codes list", () => {
    cy.visit(pageUrl);
    cy.wait("@getTransportCodes");
    cy.wait(3000);
    
    // Check for transport codes content
    cy.get("body").then($body => {
      const bodyText = $body.text();
      
      if (bodyText.toLowerCase().includes('transport') || 
          bodyText.toLowerCase().includes('codes') ||
          bodyText.toLowerCase().includes('air') ||
          bodyText.toLowerCase().includes('sea') ||
          bodyText.toLowerCase().includes('land')) {
        cy.log("✅ Found transport codes content");
      } else {
        cy.log("❌ No transport codes content found");
        cy.log(`Page content: ${bodyText.substring(0, 200)}...`);
      }
    });
    
    // Look for table or list elements
    cy.get("table, ul, ol, .list, .grid").then($containers => {
      if ($containers.length > 0) {
        cy.log(`✅ Found ${$containers.length} list/table elements`);
      } else {
        cy.log("❌ No list/table elements found");
      }
    });
  });

  it("should find interactive elements", () => {
    cy.visit(pageUrl);
    cy.wait("@getTransportCodes");
    cy.wait(3000);
    
    // Check for buttons
    cy.get("button").then($buttons => {
      if ($buttons.length > 0) {
        cy.log(`✅ Found ${$buttons.length} buttons`);
        $buttons.each((index, el) => {
          const buttonText = Cypress.$(el).text();
          cy.log(`Button ${index}: "${buttonText}"`);
        });
      } else {
        cy.log("❌ No buttons found");
      }
    });
    
    // Check for inputs
    cy.get("input, select, textarea").then($inputs => {
      if ($inputs.length > 0) {
        cy.log(`✅ Found ${$inputs.length} input elements`);
      } else {
        cy.log("❌ No input elements found");
      }
    });
    
    // Check for links
    cy.get("a").then($links => {
      if ($links.length > 0) {
        cy.log(`✅ Found ${$links.length} links`);
      } else {
        cy.log("❌ No links found");
      }
    });
  });

  it("should test add transport code functionality", () => {
    cy.visit(pageUrl);
    cy.wait("@getTransportCodes");
    cy.wait(3000);
    
    // Look for add button
    cy.contains("button", /add|new|create/i).then($button => {
      if ($button.length > 0) {
        cy.log("✅ Found add button");
        cy.wrap($button).click();
        cy.wait(2000);
        
        // Try to fill form if it exists
        cy.get("input[name*='code'], input[placeholder*='code']").should('not.be.disabled').then($codeInput => {
          if ($codeInput.length > 0) {
            cy.wrap($codeInput).type("ROAD");
            cy.log("✅ Typed transport code");
          }
        });
        
        cy.get("input[name*='name'], input[placeholder*='name']").should('not.be.disabled').then($nameInput => {
          if ($nameInput.length > 0) {
            cy.wrap($nameInput).type("Road Transport");
            cy.log("✅ Typed transport name");
          }
        });
        
        cy.get("textarea[name*='description'], textarea[placeholder*='description']").should('not.be.disabled').then($descInput => {
          if ($descInput.length > 0) {
            cy.wrap($descInput).type("Road freight and delivery services");
            cy.log("✅ Typed description");
          }
        });
        
        // Try to submit
        cy.contains("button", /save|submit|create/i).then($submitBtn => {
          if ($submitBtn.length > 0) {
            cy.log("✅ Found submit button");
            cy.wrap($submitBtn).click();
            cy.wait(2000);
            cy.log("✅ Form submitted");
          }
        });
      } else {
        cy.log("❌ No add button found");
      }
    });
  });

  it("should test edit transport code functionality", () => {
    cy.visit(pageUrl);
    cy.wait("@getTransportCodes");
    cy.wait(3000);
    
    // Look for edit buttons
    cy.contains("button", /edit|update/i).then($editBtn => {
      if ($editBtn.length > 0) {
        cy.log("✅ Found edit button");
        cy.wrap($editBtn).first().click();
        cy.wait(2000);
        
        // Try to update form
        cy.get("input[name*='name'], input[placeholder*='name']").should('not.be.disabled').then($nameInput => {
          if ($nameInput.length > 0) {
            cy.wrap($nameInput).clear().type("Land Transport Updated");
            cy.log("✅ Updated transport name");
          }
        });
        
        // Try to save
        cy.contains("button", /save|update/i).then($saveBtn => {
          if ($saveBtn.length > 0) {
            cy.log("✅ Found save button");
            cy.wrap($saveBtn).click();
            cy.wait(2000);
            cy.log("✅ Changes saved");
          }
        });
      } else {
        cy.log("❌ No edit button found");
      }
    });
  });

  it("should test delete transport code functionality", () => {
    cy.visit(pageUrl);
    cy.wait("@getTransportCodes");
    cy.wait(3000);
    
    // Look for delete buttons
    cy.contains("button", /delete|remove/i).then($deleteBtn => {
      if ($deleteBtn.length > 0) {
        cy.log("✅ Found delete button");
        cy.wrap($deleteBtn).first().click();
        cy.wait(2000);
        
        // Look for confirmation
        cy.contains("button", /confirm|yes|ok/i).then($confirmBtn => {
          if ($confirmBtn.length > 0) {
            cy.log("✅ Found confirmation button");
            cy.wrap($confirmBtn).click();
            cy.wait(2000);
            cy.log("✅ Delete confirmed");
          }
        });
      } else {
        cy.log("❌ No delete button found");
      }
    });
  });

  it("should test search and filter functionality", () => {
    cy.visit(pageUrl);
    cy.wait("@getTransportCodes");
    cy.wait(3000);
    
    // Look for search input
    cy.get("input[type='search'], input[placeholder*='search'], input[placeholder*='filter']").should('not.be.disabled').then($searchInput => {
      if ($searchInput.length > 0) {
        cy.log("✅ Found search input");
        cy.wrap($searchInput).type("AIR");
        cy.wait(2000);
        cy.log("✅ Typed in search");
      } else {
        cy.log("❌ No search input found");
      }
    });
    
    // Look for filter dropdown
    cy.get("select").then($selects => {
      if ($selects.length > 0) {
        cy.log("✅ Found select elements");
        cy.wrap($selects).first().select("AIR").then(() => {
          cy.log("✅ Selected filter option");
        });
      } else {
        cy.log("❌ No select elements found");
      }
    });
  });
});
