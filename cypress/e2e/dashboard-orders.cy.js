import { Sendsile } from "../configuration/project.config";

describe("Dashboard Orders", () => {
  const pageUrl = "https://www.sendsile.com/dashboard/orders";

  beforeEach(() => {
    cy.stubDashboardApis();
    cy.loginSendsile(pageUrl);
    cy.wait(2000);
  });

  it("should load dashboard orders page", () => {
    cy.get(Sendsile.dashboardorders.message01).should(Sendsile.dashboardorders.message02);
    cy.log(Sendsile.dashboardorders.message03);
  });

  it("should check if redirected to login", () => {
    cy.url().then(url => {
      if (url.includes(Sendsile.dashboardorders.message04)) {
        cy.log(Sendsile.dashboardorders.message05);
      } else if (url.includes(Sendsile.dashboardorders.message06)) {
        cy.log(Sendsile.dashboardorders.message07);
        
        // Try to find order-related content
        cy.get(Sendsile.dashboardorders.message01).then($body => {
          const bodyText = $body.text();
          cy.log(Sendsile.dashboardorders.message12);
          
          // Check for order-related keywords
          const hasOrderKeywords = bodyText.toLowerCase().includes(Sendsile.dashboardorders.message08) || 
                                 bodyText.toLowerCase().includes(Sendsile.dashboardorders.message09) || 
                                 bodyText.toLowerCase().includes(Sendsile.dashboardorders.message10) ||
                                 bodyText.toLowerCase().includes(Sendsile.dashboardorders.message11);
          
          if (hasOrderKeywords) {
            cy.log(Sendsile.dashboardorders.message13);
          } else {
            cy.log(Sendsile.dashboardorders.message14);
          }
        });
      } else {
        cy.log(Sendsile.dashboardorders.message15);
      }
    });
  });

  it("should find any interactive elements", () => {
    cy.get(Sendsile.dashboardorders.message16).then($elements => {
      if ($elements.length > 0) {
        cy.log(Sendsile.dashboardorders.message17);
        $elements.each((index, el) => {
          const tagName = el.tagName.toLowerCase();
          const text = Cypress.$(el).text();
          cy.log(Sendsile.dashboardorders.message18);
        });
      } else {
        cy.log(Sendsile.dashboardorders.message19);
      }
    });
  });

  it("should try to interact with first clickable element", () => {
    cy.get(Sendsile.dashboardorders.message20).first().then($element => {
      if ($element.length > 0) {
        const tagName = $element[0].tagName.toLowerCase();
        const text = Cypress.$($element).text();
        cy.log(Sendsile.dashboardorders.message21);
        cy.wrap($element).click({ force: true });
        cy.wait(2000);
        cy.log(Sendsile.dashboardorders.message22);
      } else {
        cy.log(Sendsile.dashboardorders.message23);
      }
    });
  });
});
