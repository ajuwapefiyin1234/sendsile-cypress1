import { Sendsile } from "../configuration/project.config";

describe("Login Page", () => { // Group all login-related tests.
  const pageUrl = Sendsile.login.pageUrl; // Define login URL once for reuse.

  beforeEach(() => { // Run setup before each test.
    cy.visit(pageUrl); // Open login page.
  }); // End setup block.

  it("should render login page properly", () => { // Verify login screen renders core elements.
    cy.contains(Sendsile.login.message01).should("be.visible"); // Check heading visibility.
    cy.get(Sendsile.login.emailId).should("exist"); // Check email input exists.
    cy.get("#password").should("exist"); // Check password input exists.
    cy.contains("button", Sendsile.login.button).should("be.visible"); // Check submit button is visible.
  }); // End render test.

  it("should allow typing into email and password", () => { // Verify field input behavior.
    cy.get(Sendsile.login.emailId).type(Sendsile.login.emailentry); // Type email value.
    cy.get(Sendsile.login.emailId).should("have.value", Sendsile.login.emailentry); // Assert email value.

    cy.get("#password").type(Sendsile.login.passwordentry); // Type password value.
    cy.get("#password").should("have.value", Sendsile.login.passwordentry); // Assert password value.
  }); // End input test.

  it("should navigate to forgot password page", () => { // Verify forgot-password link behavior.
    cy.contains(Sendsile.login.message02).click(); // Click forgot-password link.
    cy.url().should("include", "/forgot-password"); // Confirm browser navigated correctly.
  }); // End link navigation test.

  it("should show google login button", () => { // Verify Google login option appears.
    cy.contains(Sendsile.login.message03).should("be.visible"); // Check Google button text visibility.
  }); // End Google button test.

  it("should show API error message when login fails", () => { // Verify inline error on failed login.
    cy.intercept("POST", `**${Sendsile.login.path}`, { // Mock login endpoint failure.
      statusCode: Sendsile.login.statuscodefail || 400, // Return bad request status to trigger form error state.
      body: { // Mock error body payload.
        message: Sendsile.login.message04, // Expected message shown in UI.
      }, // End error payload.
    }).as("loginFail"); // Alias failed request.

    cy.get(Sendsile.login.emailId).type(Sendsile.login.wrongemail); // Enter invalid email.
    cy.get("#password").type(Sendsile.login.wrongpassword); // Enter invalid password.
    cy.contains("button", Sendsile.login.button).click(); // Submit login form.

    cy.wait("@loginFail"); // Wait for mocked failed request.
    cy.contains(Sendsile.login.message04).should("be.visible"); // Confirm error message is displayed.
  }); // End failed login test.

  it("should show OTP screen when 2FA is required", () => { // Verify 2FA branch of login flow.
    cy.intercept("POST", `**${Sendsile.login.path}`, { // Mock successful login response requiring OTP.
      statusCode: 200, // Return success status.
      body: { // Mock response object.
        data: { // Mock login data payload.
          token: "", // Token placeholder for this test path.
          refresh_token: "", // Refresh token placeholder.
          email: Sendsile.login.testemail, // Returned user email.
          name: Sendsile.login.testname, // Returned user name.
          balance: Sendsile.login.testbalance, // Returned user balance.
          phone: Sendsile.login.testphone, // Returned phone number.
          photo: Sendsile.login.photo, // Returned photo URL placeholder.
          "2fa_required": true, // Flag that activates OTP screen.
          temp_token: Sendsile.login.temp_token, // Temporary token used for OTP verification.
        }, // End login data payload.
      }, // End response object.
    }).as("login2fa"); // Alias this request.

    cy.get(Sendsile.login.emailId).type(Sendsile.login.loginemail); // Enter login email.
    cy.get("#password").type(Sendsile.login.loginpassword); // Enter login password.
    cy.contains("button", Sendsile.login.button).click(); // Submit login form.

    cy.wait("@login2fa"); // Wait for mocked 2FA response.
    cy.contains(Sendsile.login.loginmessage01).should("be.visible"); // Confirm OTP title appears.
    cy.contains(Sendsile.login.instructionmessage01).should("be.visible"); // Confirm OTP instruction text.
    cy.window().then((win) => { // Access browser window to inspect localStorage.
      expect(win.localStorage.getItem("temp_token")).to.eq(Sendsile.login.temp_token); // Confirm temp token was saved.
    }); // End localStorage assertion.
  }); // End 2FA test.
}); // End login test suite.
