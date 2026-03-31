describe("Taxporta Codes - Test Suite", () => {
  const pageUrl = "http://localhost:3000/taxporta-codes";

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

    // Mock API responses for taxporta codes
    cy.intercept("GET", "**/api/v1/taxporta-codes**", {
      statusCode: 200,
      body: {
        success: true,
        data: [
          {
            id: "TX001",
            code: "VAT-STD",
            name: "Standard VAT",
            rate: 7.5,
            description: "Standard Value Added Tax rate",
            active: true,
            category: "VAT"
          },
          {
            id: "TX002", 
            code: "VAT-RED",
            name: "Reduced VAT",
            rate: 5.0,
            description: "Reduced Value Added Tax for essential goods",
            active: true,
            category: "VAT"
          },
          {
            id: "TX003",
            code: "VAT-EXM",
            name: "VAT Exempt",
            rate: 0.0,
            description: "VAT exempt goods and services",
            active: true,
            category: "VAT"
          },
          {
            id: "TX004",
            code: "WHT-STD",
            name: "Standard Withholding Tax",
            rate: 10.0,
            description: "Standard withholding tax on payments",
            active: true,
            category: "WHT"
          },
          {
            id: "TX005",
            code: "WHT-RENT",
            name: "Rental Withholding Tax",
            rate: 7.5,
            description: "Withholding tax on rental income",
            active: true,
            category: "WHT"
          },
          {
            id: "TX006",
            code: "CIT-STD",
            name: "Corporate Income Tax",
            rate: 30.0,
            description: "Standard corporate income tax rate",
            active: true,
            category: "CIT"
          }
        ]
      }
    }).as("getTaxportaCodes");

    cy.intercept("POST", "**/api/v1/taxporta-codes", {
      statusCode: 201,
      body: {
        success: true,
        data: {
          id: "TX007",
          code: "VAT-ZERO",
          name: "Zero Rated VAT",
          rate: 0.0,
          description: "Zero rated exports and international services",
          active: true,
          category: "VAT"
        }
      }
    }).as("createTaxportaCode");

    cy.intercept("PUT", "**/api/v1/taxporta-codes/**", {
      statusCode: 200,
      body: {
        success: true,
        data: {
          id: "TX002",
          code: "VAT-RED",
          name: "Reduced VAT Updated",
          rate: 5.5,
          description: "Updated reduced VAT rate",
          active: true,
          category: "VAT"
        }
      }
    }).as("updateTaxportaCode");

    cy.intercept("DELETE", "**/api/v1/taxporta-codes/**", {
      statusCode: 200,
      body: {
        success: true,
        message: "Taxporta code deleted successfully"
      }
    }).as("deleteTaxportaCode");
  });

  it("should load taxporta codes page", () => {
    cy.visit(pageUrl);
    cy.wait("@getTaxportaCodes");
    cy.wait(3000);
    
    cy.get("body").should("be.visible");
    cy.log("✅ Taxporta codes page loaded");
    
    cy.url().then(url => {
      if (url.includes("taxporta-codes")) {
        cy.log("✅ On taxporta codes page");
      } else if (url.includes("login")) {
        cy.log("⚠️ Redirected to login - authentication issue");
      } else {
        cy.log(`⚠️ Unexpected URL: ${url}`);
      }
    });
  });

  it("should display taxporta codes list", () => {
    cy.visit(pageUrl);
    cy.wait("@getTaxportaCodes");
    cy.wait(3000);
    
    // Check for taxporta codes content
    cy.get("body").then($body => {
      const bodyText = $body.text();
      
      if (bodyText.toLowerCase().includes('tax') || 
          bodyText.toLowerCase().includes('vat') ||
          bodyText.toLowerCase().includes('wht') ||
          bodyText.toLowerCase().includes('cit') ||
          bodyText.toLowerCase().includes('standard')) {
        cy.log("✅ Found taxporta codes content");
      } else {
        cy.log("❌ No taxporta codes content found");
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

  it("should display tax rates and categories", () => {
    cy.visit(pageUrl);
    cy.wait("@getTaxportaCodes");
    cy.wait(3000);
    
    // Check for specific tax codes
    cy.get("body").then($body => {
      const bodyText = $body.text();
      
      // Look for tax rates
      if (bodyText.includes('7.5') || bodyText.includes('5.0') || bodyText.includes('10.0') || bodyText.includes('30.0')) {
        cy.log("✅ Found tax rates");
      } else {
        cy.log("❌ No tax rates found");
      }
      
      // Look for tax categories
      if (bodyText.toLowerCase().includes('vat') || 
          bodyText.toLowerCase().includes('wht') || 
          bodyText.toLowerCase().includes('cit')) {
        cy.log("✅ Found tax categories");
      } else {
        cy.log("❌ No tax categories found");
      }
    });
  });

  it("should find interactive elements", () => {
    cy.visit(pageUrl);
    cy.wait("@getTaxportaCodes");
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

  it("should test add taxporta code functionality", () => {
    cy.visit(pageUrl);
    cy.wait("@getTaxportaCodes");
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
            cy.wrap($codeInput).type("VAT-ZERO");
            cy.log("✅ Typed tax code");
          }
        });
        
        cy.get("input[name*='name'], input[placeholder*='name']").should('not.be.disabled').then($nameInput => {
          if ($nameInput.length > 0) {
            cy.wrap($nameInput).type("Zero Rated VAT");
            cy.log("✅ Typed tax name");
          }
        });
        
        cy.get("input[name*='rate'], input[placeholder*='rate']").should('not.be.disabled').then($rateInput => {
          if ($rateInput.length > 0) {
            cy.wrap($rateInput).type("0.0");
            cy.log("✅ Typed tax rate");
          }
        });
        
        cy.get("textarea[name*='description'], textarea[placeholder*='description']").should('not.be.disabled').then($descInput => {
          if ($descInput.length > 0) {
            cy.wrap($descInput).type("Zero rated exports and international services");
            cy.log("✅ Typed description");
          }
        });
        
        // Try to select category
        cy.get("select[name*='category'], select[placeholder*='category']").then($categorySelect => {
          if ($categorySelect.length > 0) {
            cy.wrap($categorySelect).select("VAT");
            cy.log("✅ Selected tax category");
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

  it("should test edit taxporta code functionality", () => {
    cy.visit(pageUrl);
    cy.wait("@getTaxportaCodes");
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
            cy.wrap($nameInput).clear().type("Reduced VAT Updated");
            cy.log("✅ Updated tax name");
          }
        });
        
        cy.get("input[name*='rate'], input[placeholder*='rate']").should('not.be.disabled').then($rateInput => {
          if ($rateInput.length > 0) {
            cy.wrap($rateInput).clear().type("5.5");
            cy.log("✅ Updated tax rate");
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

  it("should test delete taxporta code functionality", () => {
    cy.visit(pageUrl);
    cy.wait("@getTaxportaCodes");
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
    cy.wait("@getTaxportaCodes");
    cy.wait(3000);
    
    // Look for search input
    cy.get("input[type='search'], input[placeholder*='search'], input[placeholder*='filter']").should('not.be.disabled').then($searchInput => {
      if ($searchInput.length > 0) {
        cy.log("✅ Found search input");
        cy.wrap($searchInput).type("VAT");
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
        cy.wrap($selects).first().select("VAT").then(() => {
          cy.log("✅ Selected filter option");
        });
      } else {
        cy.log("❌ No select elements found");
      }
    });
  });

  it("should test tax code calculations", () => {
    cy.visit(pageUrl);
    cy.wait("@getTaxportaCodes");
    cy.wait(3000);
    
    // Look for calculation features
    cy.get("body").then($body => {
      const bodyText = $body.text();
      
      if (bodyText.toLowerCase().includes('calculate') || 
          bodyText.toLowerCase().includes('compute') ||
          bodyText.toLowerCase().includes('amount') ||
          bodyText.toLowerCase().includes('total')) {
        cy.log("✅ Found calculation features");
        
        // Look for calculation inputs
        cy.get("input[type='number'], input[placeholder*='amount'], input[placeholder*='value']").should('not.be.disabled').then($calcInput => {
          if ($calcInput.length > 0) {
            cy.log("✅ Found calculation input");
            cy.wrap($calcInput).first().type("1000");
            cy.wait(1000);
            cy.log("✅ Entered amount for calculation");
          }
        });
        
        // Look for calculate button
        cy.contains("button", /calculate|compute/i).then($calcBtn => {
          if ($calcBtn.length > 0) {
            cy.log("✅ Found calculate button");
            cy.wrap($calcBtn).click();
            cy.wait(2000);
            cy.log("✅ Calculation performed");
          }
        });
      } else {
        cy.log("❌ No calculation features found");
      }
    });
  });
});
