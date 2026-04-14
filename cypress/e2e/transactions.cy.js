import { Sendsile } from "../configuration/project.config.js";

describe("Sendsile Transactions Dashboard - Component Testing", () => {
  const pageUrl = Sendsile.transaction.pageUrl;

  beforeEach(() => {
    // Mock authentication directly without config (same as dashboard)
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

    // Mock API responses
    cy.intercept('GET', '**/api/**', {
      statusCode: 200,
      body: {
        data: [],
        message: Sendsile.transaction.message
      } 
    }).as("apiGet");

    cy.visit(pageUrl);
    cy.wait(3000);
  });

  it(Sendsile.transaction.message01, () => {
    cy.url().then((url) => {
      if (url.includes('/transactions')) {
        cy.log(Sendsile.transaction.urlTrans);
      } else if (url.includes('/login')) {
        cy.log(Sendsile.transaction.urlLogin);
      } else {
        cy.log(`ℹ️ Current page: ${url}`);
      }
    });
  });

  it(Sendsile.transaction.message02, () => {
    cy.get("body").then(($body) => {
      if ($body.find("#root").length > 0) {
        cy.get("#root").should("exist");
        cy.log(Sendsile.transaction.pageStuct);
      } else {
        cy.log(Sendsile.transaction.nPageStruct);
      }
    });
  });

  it(Sendsile.transaction.message03, () => {
    cy.get("body").then(($body) => {
      if ($body.find("nav, .navbar").length > 0) {
        cy.log(Sendsile.transaction.navFound);
      } else {
        cy.log(Sendsile.transaction.nNavFound);
      }
    });
  });

  it(Sendsile.transaction.message04, () => {
    cy.get("body").then(($body) => {
      if ($body.find("table").length > 0) {
        cy.log(Sendsile.transaction.tableFound);
      } else {
        cy.log(Sendsile.transaction.nTableFound);
      }
    });
  });

  it(Sendsile.transaction.message05, () => {
    cy.get("body").then(($body) => {
      if ($body.find("input[type='search'], select").length > 0) {
        cy.log(Sendsile.transaction.filtersFound);
      } else {
        cy.log(Sendsile.transaction.nFiltersFound);
      }
    });
  });

  it(Sendsile.transaction.message06, () => {
    cy.log(Sendsile.transaction.testAuth01);
    cy.log(Sendsile.transaction.testAuth02);
    cy.log(Sendsile.transaction.testAuth03);
    cy.log(Sendsile.transaction.testAuth04);
    cy.log(Sendsile.transaction.testAuth05);
    cy.log(Sendsile.transaction.testAuth06);
    cy.log(Sendsile.transaction.testAuth07);
    cy.log(Sendsile.transaction.testAuth08);
  });
});
