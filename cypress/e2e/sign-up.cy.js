const WEB_BASE_URL = "https://taxporta.fctirs.gov.ng/";
const LOGIN_PATH = "login";
const CREATE_ACCOUNT_PATH = "create-account";
const CREATE_ACCOUNT_TEXT = "Create account";
const ACCOUNT_REGISTRATION_HEADING = "Account Registration";
const TAXPAYER_TYPE_LABEL = "Taxpayer Type";
const CONTINUE_TEXT = "Continue";
const TAXPAYER_OPTIONS = ["Individual", "Corporate"];

const openCreateAccountFromLogin = () => {
  cy.visit(`${WEB_BASE_URL}${LOGIN_PATH}`);
  cy.wait(3000);
  cy.contains("a", CREATE_ACCOUNT_TEXT).should("exist").click({ force: true });
  cy.url().should("include", `/${CREATE_ACCOUNT_PATH}`);
};

describe("Sign Up Page", () => {
  it("should open create account from login", () => {
    openCreateAccountFromLogin();
    cy.contains(ACCOUNT_REGISTRATION_HEADING).should("exist");
    cy.log("Create account page opened from login");
  });

  it("should show taxpayer type dropdown and continue button", () => {
    openCreateAccountFromLogin();

    cy.contains(TAXPAYER_TYPE_LABEL).should("exist");
    cy.get("select, [role='combobox']").should("have.length.at.least", 1);
    cy.contains("button", CONTINUE_TEXT).should("exist");
    cy.log("Taxpayer type dropdown and continue button found");
  });

  it("should allow selecting taxpayer type option", () => {
    openCreateAccountFromLogin();

    cy.contains(TAXPAYER_TYPE_LABEL).should("exist");

    cy.get("select").then(($selects) => {
      if ($selects.length) {
        cy.wrap($selects)
          .first()
          .select(TAXPAYER_OPTIONS[0], { force: true });
        cy.log("Selected taxpayer type from native select");
      } else {
        cy.get("[role='combobox']").first().click({ force: true });
        cy.contains(TAXPAYER_OPTIONS[0]).should("exist").click({ force: true });
        cy.log("Selected taxpayer type from custom dropdown");
      }
    });
  });

  it("should show available taxpayer type options", () => {
    openCreateAccountFromLogin();

    cy.get("select").then(($selects) => {
      if ($selects.length) {
        TAXPAYER_OPTIONS.forEach((option) => {
          cy.wrap($selects).first().find("option").contains(option);
        });
      } else {
        cy.get("[role='combobox']").first().click({ force: true });
        TAXPAYER_OPTIONS.forEach((option) => {
          cy.contains(option).should("exist");
        });
      }
    });
  });

  it("should show login link", () => {
    openCreateAccountFromLogin();
    cy.contains("a", /login here|login/i).should("exist");
    cy.log("Login link found");
  });
});
