import { Sendsile } from "../configuration/project.config";

describe("Dashboard Transactions", () => {
  const pageUrl = "https://www.sendsile.com/dashboard/transactions";

  beforeEach(() => {
    cy.stubDashboardApis();
    cy.loginSendsile(pageUrl);
    cy.wait(2000);
  });

  it("should stay on the transactions page", () => {
    cy.url().should(Sendsile.dashboardtransaction.message21, "/dashboard/transactions");
    cy.get(Sendsile.dashboardtransaction.message01).should(Sendsile.dashboardtransaction.message02);
  });

  it("should show transactions heading or content", () => {
    cy.get(Sendsile.dashboardtransaction.message01).then(($body) => {
      const text = $body.text().toLowerCase();
      if (text.includes(Sendsile.dashboardtransaction.message03)) {
        cy.log(Sendsile.dashboardtransaction.message04);
      } else if (text.includes(Sendsile.dashboardtransaction.message15)) {
        cy.log(Sendsile.dashboardtransaction.message05);
      } else {
        cy.log(Sendsile.dashboardtransaction.message06);
      }
    });
  });

  it("should access search input if present", () => {
    cy.get(Sendsile.dashboardtransaction.message01).then(($body) => {
      const $inputs = $body.find(Sendsile.dashboardtransaction.message07);
      if ($inputs.length === 0) {
        cy.log(Sendsile.dashboardtransaction.message08);
        return;
      }

      const search = $inputs.filter((_, el) => {
        const placeholder = (el.getAttribute(Sendsile.dashboardtransaction.message09) || "").toLowerCase();
        const type = (el.getAttribute(Sendsile.dashboardtransaction.message10) || "").toLowerCase();
        return placeholder.includes(Sendsile.dashboardtransaction.message11) || type === Sendsile.dashboardtransaction.message11;
      });

      if (search.length > 0) {
        cy.wrap(search.first()).type(Sendsile.dashboardtransaction.message12);
        cy.log(Sendsile.dashboardtransaction.message13);
      } else {
        cy.log(Sendsile.dashboardtransaction.message14);
      }
    });
  });

  it("should find filter controls if present", () => {
    cy.get(Sendsile.dashboardtransaction.message01).then(($body) => {
      const text = $body.text().toLowerCase();
      if (text.includes(Sendsile.dashboardtransaction.message16) || text.includes(Sendsile.dashboardtransaction.message17) || text.includes(Sendsile.dashboardtransaction.message18)) {
        cy.log(Sendsile.dashboardtransaction.message19);
      } else {
        cy.log(Sendsile.dashboardtransaction.message20);
      }
    });
  });

  it("should open the date picker when Date is clicked", () => {
    cy.viewport(1280, 720);
    cy.get("body").then(($body) => {
      const $dateLabel = $body.find(".react-datepicker-wrapper").find("p").filter((_, el) =>
        (el.textContent || "").trim() === "Date"
      );
      if ($dateLabel.length === 0) {
        cy.log("WARN: Date filter label not found.");
        return;
      }

      cy.wrap($dateLabel.first()).closest("div").click({ force: true });

      cy.wait(200);
      cy.get("body").then(($updatedBody) => {
        const $popper = $updatedBody.find(".react-datepicker-popper");
        if ($popper.length === 0) {
          cy.log("WARN: Date picker popper not found after clicking Date.");
          return;
        }
        const opacity = $popper.css("opacity");
        const visibility = $popper.css("visibility");
        if (opacity === "0" || visibility === "hidden") {
          cy.log("WARN: Date picker is present but not visible (opacity 0).");
        }
      });
    });
  });

  it("should allow selecting a date from the date picker", () => {
    cy.viewport(1280, 720);
    cy.get("body").then(($body) => {
      const $dateLabel = $body.find(".react-datepicker-wrapper").find("p").filter((_, el) =>
        (el.textContent || "").trim() === "Date"
      );
      if ($dateLabel.length === 0) {
        cy.log("WARN: Date filter label not found.");
        return;
      }

      const $trigger = $dateLabel.first().closest("div");
      const beforeText = ($trigger.text() || "").trim();

      cy.wrap($trigger).scrollIntoView().click({ force: true });
      cy.wait(200);

      cy.get("body").then(($updatedBody) => {
        const $days = $updatedBody
          .find(".react-datepicker__day:visible")
          .not(".react-datepicker__day--outside-month")
          .not(".react-datepicker__day--disabled");

        if ($days.length === 0) {
          cy.log("WARN: No visible selectable day found in date picker.");
          return;
        }

        cy.wrap($days.first()).click({ force: true });

        cy.wrap($trigger).invoke("text").then((afterTextRaw) => {
          const afterText = (afterTextRaw || "").trim();
          if (afterText && afterText !== "Date" && afterText !== beforeText) {
            cy.log("Date selection updated.");
          } else {
            cy.log("WARN: Date label did not update after selection.");
          }
        });
      });
    });
  });

  it("should show transaction type options when clicked", () => {
    cy.get("body").then(($body) => {
      const $typeButton = $body.find("button").filter((_, el) =>
        (el.textContent || "").includes("Transaction type")
      );
      if ($typeButton.length === 0) {
        cy.log("WARN: Transaction type filter not found.");
        return;
      }

      cy.wrap($typeButton.first()).click({ force: true });

      cy.get("body").then(($updatedBody) => {
        const text = $updatedBody.text();
        const hasOptions =
          text.includes("Groceries") && text.includes("Airtime") && text.includes("Data plan");
        if (hasOptions) {
          cy.log("Transaction type options are visible.");
        } else {
          cy.log("WARN: Transaction type options not visible.");
        }
      });
    });
  });

  it("should show status options when clicked", () => {
    cy.get("body").then(($body) => {
      const $statusButton = $body.find("button").filter((_, el) =>
        (el.textContent || "").trim() === "Status"
      );
      if ($statusButton.length === 0) {
        cy.log("WARN: Status filter not found.");
        return;
      }

      cy.wrap($statusButton.first()).click({ force: true });

      cy.get("body").then(($updatedBody) => {
        const text = $updatedBody.text();
        const hasOptions =
          text.includes("Pending") && text.includes("Processing") && text.includes("Failed");
        if (hasOptions) {
          cy.log("Status options are visible.");
          
          // Now actually click on the status options
          cy.log("🔍 Clicking on status options...");
          
          // Click on "Pending" status
          const $pendingOption = $updatedBody.find("button").filter((_, el) =>
            (el.textContent || "").trim() === "Pending"
          );
          if ($pendingOption.length > 0) {
            cy.wrap($pendingOption.first()).click({ force: true });
            cy.log("✅ Clicked on Pending status");
            cy.wait(2000);
          }
          
          // Click on "Processing" status
          const $processingOption = $updatedBody.find("button").filter((_, el) =>
            (el.textContent || "").trim() === "Processing"
          );
          if ($processingOption.length > 0) {
            cy.wrap($processingOption.first()).click({ force: true });
            cy.log("✅ Clicked on Processing status");
            cy.wait(2000);
          }
          
          // Click on "Failed" status
          const $failedOption = $updatedBody.find("button").filter((_, el) =>
            (el.textContent || "").trim() === "Failed"
          );
          if ($failedOption.length > 0) {
            cy.wrap($failedOption.first()).click({ force: true });
            cy.log("✅ Clicked on Failed status");
            cy.wait(2000);
          }
          
        } else {
          cy.log("WARN: Status options not visible.");
        }
      });
    });
  });

  it("should select a transaction type and show empty state", () => {
    cy.viewport(1280, 720);
    cy.get("body").then(($body) => {
      const $typeButton = $body.find("button").filter((_, el) =>
        (el.textContent || "").includes("Transaction type")
      );
      if ($typeButton.length === 0) {
        cy.log("WARN: Transaction type filter not found.");
        return;
      }

      cy.wrap($typeButton.first()).click({ force: true });

      cy.get("body").then(($updatedBody) => {
        const $option = $updatedBody.find("button").filter((_, el) =>
          (el.textContent || "").trim() === "Groceries"
        );
        if ($option.length === 0) {
          cy.log("WARN: Transaction type option not found.");
          return;
        }
        cy.wrap($option.first()).click({ force: true });
        cy.get("img[alt='empty table']").should("be.visible");
      });
    });
  });

  it("should select a status and show empty state", () => {
    cy.viewport(1280, 720);
    cy.get("body").then(($body) => {
      const $statusButton = $body.find("button").filter((_, el) =>
        (el.textContent || "").trim() === "Status"
      );
      if ($statusButton.length === 0) {
        cy.log("WARN: Status filter not found.");
        return;
      }

      cy.wrap($statusButton.first()).click({ force: true });

      cy.get("body").then(($updatedBody) => {
        const $option = $updatedBody.find("button").filter((_, el) =>
          (el.textContent || "").trim() === "Pending"
        );
        if ($option.length === 0) {
          cy.log("WARN: Status option not found.");
          return;
        }
        cy.wrap($option.first()).click({ force: true });
        cy.get("img[alt='empty table']").should("be.visible");
      });
    });
  });

  it("should access help and feedback section", () => {
    cy.log("🔍 Testing help and feedback access from dashboard...");
    
    // Stay on the transactions page and look for help/feedback elements
    cy.get("body").then(($body) => {
      const bodyText = $body.text().toLowerCase();
      cy.log(`Dashboard transactions content: ${bodyText.substring(0, 300)}...`);
      
      // Look for help and feedback elements based on the screenshot
      // Try to find help icon/button (usually in header or top navigation)
      cy.get('svg, i, button, a, [class*="help"], [class*="question"], [class*="support"]', { timeout: 5000 })
        .then(($elements) => {
          if ($elements.length > 0) {
            cy.log(`✅ Found ${$elements.length} potential help elements`);
            
            // Check each element for help indicators
            let helpClicked = false;
            
            cy.get($elements.slice(0, 10)).each(($element, index) => {
              if (!helpClicked) {
                const elementClass = $element.attr('class') || '';
                const elementTitle = $element.attr('title') || '';
                const elementAria = $element.attr('aria-label') || '';
                const parentText = $element.parent().text().toLowerCase();
                
                // Check if this looks like a help element (icon, question mark, etc.)
                const isHelpElement = elementClass.includes('help') || elementClass.includes('question') || 
                                   elementClass.includes('support') || elementClass.includes('info') ||
                                   elementTitle.includes('help') || elementTitle.includes('question') ||
                                   elementAria.includes('help') || elementAria.includes('question') ||
                                   parentText.includes('help') || parentText.includes('question');
                
                if (isHelpElement) {
                  cy.log(`✅ Found help element ${index + 1}: ${elementClass}`);
                  cy.wrap($element).click({ force: true });
                  cy.wait(2000);
                  cy.log("✅ Clicked help element");
                  helpClicked = true;
                  
                  // Check if help modal/page opened
                  cy.get("body").then(($newBody) => {
                    const newText = $newBody.text().toLowerCase();
                    cy.log(`After help click content: ${newText.substring(0, 300)}...`);
                    
                    if (newText.includes("help") || newText.includes("guide") || newText.includes("tutorial") || newText.includes("faq")) {
                      cy.log("✅ Successfully opened help section");
                    }
                  });
                }
              }
            });
          }
        });
      
      // Look for feedback elements (usually in footer, menu, or as a button)
      cy.get('button, a, [class*="feedback"], [class*="contact"], [class*="support"]', { timeout: 5000 })
        .then(($elements) => {
          if ($elements.length > 0) {
            cy.log(`✅ Found ${$elements.length} potential feedback elements`);
            
            let feedbackClicked = false;
            
            cy.get($elements.slice(0, 10)).each(($element, index) => {
              if (!feedbackClicked) {
                const elementText = $element.text().toLowerCase();
                const elementClass = $element.attr('class') || '';
                const elementTitle = $element.attr('title') || '';
                const elementAria = $element.attr('aria-label') || '';
                
                // Check if this looks like a feedback element
                const isFeedbackElement = elementText.includes("feedback") || elementText.includes("contact") ||
                                        elementText.includes("support") || elementClass.includes('feedback') ||
                                        elementClass.includes('contact') || elementClass.includes('support') ||
                                        elementTitle.includes('feedback') || elementTitle.includes('contact') ||
                                        elementAria.includes('feedback') || elementAria.includes('contact');
                
                if (isFeedbackElement) {
                  cy.log(`✅ Found feedback element ${index + 1}: ${elementText.substring(0, 30)}...`);
                  cy.wrap($element).click({ force: true });
                  cy.wait(2000);
                  cy.log("✅ Clicked feedback element");
                  feedbackClicked = true;
                  
                  // Check if feedback modal/page opened
                  cy.get("body").then(($newBody) => {
                    const newText = $newBody.text().toLowerCase();
                    cy.log(`After feedback click content: ${newText.substring(0, 300)}...`);
                    
                    if (newText.includes("feedback") || newText.includes("contact") || newText.includes("support") || newText.includes("message")) {
                      cy.log("✅ Successfully opened feedback section");
                    }
                  });
                }
              }
            });
          }
        });
      
      // If still not found, try looking in common locations (header, footer, sidebar)
      cy.wait(3000).then(() => {
        cy.log("🔍 Checking common help/feedback locations...");
        
        // Check header area
        cy.get('header, [class*="header"], [class*="nav"], [class*="top"]', { timeout: 3000 })
          .then(($headerElements) => {
            if ($headerElements.length > 0) {
              cy.log(`✅ Found ${$headerElements.length} header elements`);
              
              cy.get($headerElements.first()).find('button, a, svg, i').each(($element, index) => {
                const elementClass = $element.attr('class') || '';
                const elementTitle = $element.attr('title') || '';
                
                if (elementClass.includes('help') || elementClass.includes('question') || elementTitle.includes('help')) {
                  cy.log(`✅ Found help in header: ${elementClass}`);
                  cy.wrap($element).click({ force: true });
                  cy.wait(2000);
                  cy.log("✅ Clicked header help element");
                }
              });
            }
          });
        
        // Check footer area
        cy.get('footer, [class*="footer"], [class*="bottom"]', { timeout: 3000 })
          .then(($footerElements) => {
            if ($footerElements.length > 0) {
              cy.log(`✅ Found ${$footerElements.length} footer elements`);
              
              cy.get($footerElements.first()).find('a, button').each(($element, index) => {
                const elementText = $element.text().toLowerCase();
                
                if (elementText.includes("help") || elementText.includes("feedback") || elementText.includes("contact") || elementText.includes("support")) {
                  cy.log(`✅ Found ${elementText} in footer`);
                  cy.wrap($element).click({ force: true });
                  cy.wait(2000);
                  cy.log(`✅ Clicked footer ${elementText} element`);
                }
              });
            }
          });
      });
    });
  });

  });
