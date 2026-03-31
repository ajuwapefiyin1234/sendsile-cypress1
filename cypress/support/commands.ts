/// <reference types="cypress" />
import { Sendsile } from "../configuration/project.config";
// ***********************************************
// This example commands.ts shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })
//
// declare global {
//   namespace Cypress {
//     interface Chainable {
//       login(email: string, password: string): Chainable<void>
//       drag(subject: string, options?: Partial<TypeOptions>): Chainable<Element>
//       dismiss(subject: string, options?: Partial<TypeOptions>): Chainable<Element>
//       visit(originalFn: CommandOriginalFn, url: string, options: Partial<VisitOptions>): Chainable<Element>
//     }
//   }
// }

Cypress.Commands.add("loginSendsile", (path: string = "/dashboard") => {
  const baseUrl = Cypress.config("baseUrl") || "http://localhost:3000";
  const fullUrl = path.startsWith("http") ? path : `${baseUrl}${path}`;
  cy.visit(fullUrl, {
    onBeforeLoad(win) {
      win.localStorage.setItem("__user_access", "success-token");
      win.localStorage.setItem("ramadanModal", "true");
      win.localStorage.setItem(
        "userInfo",
        JSON.stringify({ state: { userData: { name: Sendsile.login.testname } }, version: 0 })
      );
    },
  });
});

Cypress.Commands.add("stubDashboardApis", () => {
  cy.intercept("GET", "**/api/v1/**", {
    statusCode: 200,
    body: { data: [] },
  }).as("apiGet");

  cy.intercept("POST", "**/api/v1/**", {
    statusCode: 200,
    body: { data: [] },
  }).as("apiPost");
});

Cypress.Commands.add("stubGroceriesApis", (categoryId: string = "5b34d672-1b57-4483-87d9-7d5cc1b20be8") => {
  const mockProducts = [
    {
      product_id: "prod-1",
      name: "Fresh Tomatoes",
      images: [],
      variants: [{ variant_id: "var-1", price: "1200", variation: "1kg" }],
    },
    {
      product_id: "prod-2",
      name: "Organic Apples",
      images: [],
      variants: [{ variant_id: "var-2", price: "800", variation: "5kg" }],
    },
  ];

  const mockCategories = [
    {
      id: categoryId,
      name: "Soup & ingredients",
      image: "https://via.placeholder.com/160x160.png?text=Soup",
    },
    {
      id: "cat-2",
      name: "Meat, poultry & seafood",
      image: "https://via.placeholder.com/160x160.png?text=Meat",
    },
  ];

  cy.intercept("GET", "**/api/v1/**", (req) => {
    if (req.url.includes("/products/filter")) {
      req.alias = "getProducts";
      req.reply({ statusCode: 200, body: { data: mockProducts } });
      return;
    }
    if (req.url.includes("/products/search")) {
      req.alias = "getProductsSearch";
      req.reply({ statusCode: 200, body: { data: mockProducts } });
      return;
    }
    if (req.url.includes("/categories")) {
      req.alias = "getCategories";
      req.reply({ statusCode: 200, body: { data: mockCategories } });
      return;
    }
    if (req.url.includes("/user/notifications")) {
      req.alias = "getNotifications";
      req.reply({ statusCode: 200, body: { data: [] } });
      return;
    }
    req.alias = "apiGetFallback";
    req.reply({ statusCode: 200, body: { data: [] } });
  });

  cy.intercept("POST", "**/api/v1/**", (req) => {
    if (req.url.includes("/products/filter")) {
      req.alias = "postProductsFilter";
      req.reply({ statusCode: 200, body: { data: mockProducts } });
      return;
    }
    req.alias = "apiPostFallback";
    req.reply({ statusCode: 200, body: { data: [] } });
  });
});

Cypress.Commands.add("closeRamadanModalIfPresent", () => {
  cy.get("body").then(($body) => {
    const candidates = $body.find("button");
    const closeButtons = candidates.filter((_, el) => {
      const label = (el.getAttribute("aria-label") || "").toLowerCase();
      const text = (el.textContent || "").trim().toLowerCase();
      return label.includes("close") || text === "x" || text === "×";
    });

    if (closeButtons.length > 0) {
      cy.wrap(closeButtons.first()).click({ force: true });
    }
  });
});

declare global {
  namespace Cypress {
    interface Chainable {
      loginSendsile(path?: string): Chainable<void>;
      stubDashboardApis(): Chainable<void>;
      stubGroceriesApis(categoryId?: string): Chainable<void>;
      closeRamadanModalIfPresent(): Chainable<void>;
    }
  }
}

export {};
