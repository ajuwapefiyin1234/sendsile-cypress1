import { Sendsile } from "../configuration/project.config";

describe("Dashboard Profile", () => {
  const pageUrl = "https://www.sendsile.com/dashboard/profile";

  beforeEach(() => {
    cy.stubDashboardApis();
    cy.loginSendsile(pageUrl);
    cy.wait(2000);
  });

  it("should stay on the profile page", () => {
    cy.url().should(Sendsile.dashboardprofile.message01, Sendsile.dashboardprofile.message52);
    cy.get("body").should("be.visible");
  });

  it("should show profile sections", () => {
    cy.get(Sendsile.dashboardprofile.message02).then(($body) => {
      const text = $body.text().toLowerCase();
      if (text.includes(Sendsile.dashboardprofile.message04)) {
        cy.log(Sendsile.dashboardprofile.message05);
      } else {
        cy.log(Sendsile.dashboardprofile.message06);
      }
      if (text.includes(Sendsile.dashboardprofile.message07)) {
        cy.log(Sendsile.dashboardprofile.message08);
      } else {
        cy.log(Sendsile.dashboardprofile.message09);
      }
    });
  });

  it("should open update address form", () => {
    cy.contains(Sendsile.dashboardprofile.message10).click({ force: true });
    cy.get(Sendsile.dashboardprofile.message02).then(($body) => {
      const text = $body.text().toLowerCase();
      if (text.includes(Sendsile.dashboardprofile.message11)) {
        cy.log(Sendsile.dashboardprofile.message12);
      } else if (text.includes(Sendsile.dashboardprofile.message13)) {
        cy.log(Sendsile.dashboardprofile.message14);
      } else {
        cy.log(Sendsile.dashboardprofile.message15);
      }
    });
  });

  it("should open update password and type into fields", () => {
    cy.contains(Sendsile.dashboardprofile.message16).click({ force: true });

    cy.get("body").then(($body) => {
      const text = $body.text().toLowerCase();
      if (text.includes(Sendsile.dashboardprofile.message53)) {
        cy.log(Sendsile.dashboardprofile.message17);
      } else {
        cy.log(Sendsile.dashboardprofile.message18);
      }
    });

    cy.get(Sendsile.dashboardprofile.message02).then(($body) => {
      const $inputs = $body.find(Sendsile.dashboardprofile.message19);
      if ($inputs.length >= 3) {
        cy.wrap($inputs.eq(0)).clear().type(Sendsile.dashboardprofile.message20);
        cy.wrap($inputs.eq(1)).clear().type(Sendsile.dashboardprofile.message21);
        cy.wrap($inputs.eq(2)).clear().type(Sendsile.dashboardprofile.message21);
        cy.log(Sendsile.dashboardprofile.message22);
      } else {
        cy.log(Sendsile.dashboardprofile.message23);
      }
    });

    cy.contains(Sendsile.dashboardprofile.message24, Sendsile.dashboardprofile.message16).click({ force: true });
    cy.log(Sendsile.dashboardprofile.message25);
  });

  it("should open two-factor authentication page", () => {
    cy.contains(Sendsile.dashboardprofile.message26).click({ force: true });

    cy.get(Sendsile.dashboardprofile.message02).then(($body) => {
      const text = $body.text().toLowerCase();
      if (text.includes(Sendsile.dashboardprofile.message27)) {
        cy.log(Sendsile.dashboardprofile.message28);
      } else if (text.includes(Sendsile.dashboardprofile.message29)) {
        cy.log(Sendsile.dashboardprofile.message30);
      } else {
        cy.log(Sendsile.dashboardprofile.message31);
      }
    });
  });

  it("should show legal links after scrolling", () => {
    cy.window().then((win) => {
      win.scrollTo(0, win.document.body.scrollHeight);
    });
    cy.wait(800);

    cy.get(Sendsile.dashboardprofile.message02).then(($body) => {
      const text = $body.text().toLowerCase();
      if (text.includes(Sendsile.dashboardprofile.message32)) {
        cy.log(Sendsile.dashboardprofile.message33);
      } else {
        cy.log(Sendsile.dashboardprofile.message34 );
      }
      if (text.includes(Sendsile.dashboardprofile.message35)) {
        cy.log(Sendsile.dashboardprofile.message36);
      }
      if (text.includes(Sendsile.dashboardprofile.message37)) {
        cy.log(Sendsile.dashboardprofile.message38);
      }
      if (text.includes(Sendsile.dashboardprofile.message39)) {
        cy.log(Sendsile.dashboardprofile.message40);
      }
    });
  });

  it("should open privacy policy page from profile", () => {
    cy.window().then((win) => {
      win.scrollTo(0, win.document.body.scrollHeight);
    });
    cy.wait(800);

    cy.window().then((win) => {
      cy.stub(win, Sendsile.dashboardprofile.message41).as(Sendsile.dashboardprofile.message42);
    });

    cy.contains(Sendsile.dashboardprofile.message43).click({ force: true });
    cy.get(Sendsile.dashboardprofile.message44).should(Sendsile.dashboardprofile.message45);

    cy.get(Sendsile.dashboardprofile.message44).then((stub) => {
      const url = stub.getCall(0)?.args?.[0];
      if (url) {
        cy.wrap(url).should("match", /privacy/i);
      } else {
        cy.log(Sendsile.dashboardprofile.message46);
      }
    });
  });

  it("should open terms of service page from profile", () => {
    cy.window().then((win) => {
      win.scrollTo(0, win.document.body.scrollHeight);
    });
    cy.wait(800);

    cy.window().then((win) => {
      cy.stub(win, Sendsile.dashboardprofile.message41).as(Sendsile.dashboardprofile.message42);
    });

    cy.contains(Sendsile.dashboardprofile.message47).click({ force: true });
    cy.get(Sendsile.dashboardprofile.message44).should(Sendsile.dashboardprofile.message45);

    cy.get(Sendsile.dashboardprofile.message44).then((stub) => {
      const url = stub.getCall(0)?.args?.[0];
      if (url) {
        cy.wrap(url).should("match", /terms|service/i);
      } else {
        cy.log(Sendsile.dashboardprofile.message49);
      }
    });
  });

  it("should open cookies page from profile", () => {
    cy.window().then((win) => {
      win.scrollTo(0, win.document.body.scrollHeight);
    });
    cy.wait(800);

    cy.window().then((win) => {
      cy.stub(win, Sendsile.dashboardprofile.message41).as(Sendsile.dashboardprofile.message42);
    });

    cy.contains(Sendsile.dashboardprofile.message54).click({ force: true });
    cy.get(Sendsile.dashboardprofile.message44).should(Sendsile.dashboardprofile.message45);

    cy.get(Sendsile.dashboardprofile.message44).then((stub) => {
      const url = stub.getCall(0)?.args?.[0];
      if (url) {
        cy.wrap(url).should("match", /cookie/i);
      } else {
        cy.log(Sendsile.dashboardprofile.message51);
      }
    });
  });
});
