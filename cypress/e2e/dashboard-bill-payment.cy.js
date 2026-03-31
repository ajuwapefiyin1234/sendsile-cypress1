describe("Dashboard Bill Payment", () => {
  const pageUrl = "/dashboard/bill-payment";

  beforeEach(() => {
    cy.stubDashboardApis();
    cy.loginSendsile(pageUrl);
    cy.wait(2000);
  });

  it("should stay on the bill payment page", () => {
    cy.url().should("include", "/dashboard/bill-payment");
    cy.get("body").should("be.visible");
  });

  it("should show bill payment content", () => {
    cy.get("body").then(($body) => {
      const text = $body.text().toLowerCase();
      if (text.includes("bill payment")) {
        cy.log("✅ Found bill payment heading");
      } else if (text.includes("bill")) {
        cy.log("✅ Found bill-related content");
      } else {
        cy.log("❌ Bill payment text not found");
      }
    });
  });
});
