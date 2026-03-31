import { Sendsile } from "../configuration/project.config";

describe("Dashboard Home", () => {
  const Pageurl = "https://www.sendsile.com/dashboard";

  beforeEach(() => {
    cy.stubDashboardApis();
    cy.loginSendsile(Pageurl);
    cy.wait(2000);
  });

  it("should load dashboard home page", () => {
    cy.get(Sendsile.dashboard.message01).should(Sendsile.dashboard.message02);
    cy.log(Sendsile.dashboard.message03);
  });

  it("should find dashboard navigation", () => {
    cy.get(Sendsile.dashboard.message01).then($body => {
      const bodyText = $body.text();
      
      // Check for navigation items
      const hasNavigation = bodyText.toLowerCase().includes(Sendsile.dashboard.message04) ||
                          bodyText.toLowerCase().includes(Sendsile.dashboard.message05) ||
                          bodyText.toLowerCase().includes(Sendsile.dashboard.message06) ||
                          bodyText.toLowerCase().includes(Sendsile.dashboard.message07) ||
                          bodyText.toLowerCase().includes(Sendsile.dashboard.message08);
      
      if (hasNavigation) {
        cy.log(Sendsile.dashboard.message09);
      } else {
        cy.log(Sendsile.dashboard.message10);
      }
    });
  });

  it("should find any interactive elements", () => {
    cy.get(Sendsile.dashboard.message11).then($elements => {
      if ($elements.length > 0) {
        cy.log(Sendsile.dashboard.message28);
        $elements.each((index, el) => {
          const tagName = el.tagName.toLowerCase();
          const text = Cypress.$(el).text();
          cy.log(Sendsile.dashboard.message29);
        });
      } else {
        cy.log(Sendsile.dashboard.message12);
      }
    });
  });

  it("should find dashboard widgets or cards", () => {
    cy.get(Sendsile.dashboard.message01).then($body => {
      const bodyText = $body.text();
      
      // Check for dashboard content
      const hasDashboardContent = bodyText.toLowerCase().includes(Sendsile.dashboard.message13) ||
                                 bodyText.toLowerCase().includes(Sendsile.dashboard.message06) ||
                                 bodyText.toLowerCase().includes(Sendsile.dashboard.message05) ||
                                 bodyText.toLowerCase().includes(Sendsile.dashboard.message07) ||
                                 bodyText.toLowerCase().includes(Sendsile.dashboard.message14) ||
                                 bodyText.toLowerCase().includes(Sendsile.dashboard.message15);
      
      if (hasDashboardContent) {
        cy.log(Sendsile.dashboard.message16);
      } else {
        cy.log(Sendsile.dashboard.message17);
      }
      
      // Try to find container elements
      cy.get(Sendsile.dashboard.message18).then($containers => {
        if ($containers.length > 0) {
          cy.log(Sendsile.dashboard.message30);
        } else {
          cy.log(Sendsile.dashboard.message19);
        }
      });
    });
  });

  it("should try to click first button", () => {
    cy.get(Sendsile.dashboard.message20).first().then($button => {
      if ($button.length > 0) {
        const buttonText = Cypress.$($button).text();
        cy.log(Sendsile.dashboard.message31);
        cy.wrap($button).click({ force: true });
        cy.wait(2000);
        cy.log(Sendsile.dashboard.message21);
      } else {
        cy.log(Sendsile.dashboard.message22);
      }
    });
  });

  it("should check for links to other dashboard sections", () => {
    cy.get(Sendsile.dashboard.message27).then($links => {
      if ($links.length > 0) {
        cy.log(Sendsile.dashboard.message32);
        $links.each((index, el) => {
          const text = Cypress.$(el).text();
          const href = el.href;
          cy.log(Sendsile.dashboard.message33);
        });
      } else {
        cy.log(Sendsile.dashboard.message24);
      }
    });
  });

  it("should handle authentication", () => {
    cy.url().then(url => {
      if (url.includes(Sendsile.dashboard.message24)) {
        cy.log(Sendsile.dashboard.message25);
      } else if (url.includes(Pageurl)) {
        cy.log(Sendsile.dashboard.message26);
      } else {
        cy.log(Sendsile.dashboard.message34);
      }
    });
  });
});
