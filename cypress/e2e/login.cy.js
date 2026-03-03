describe("Login Page", () => { // Group all login-related tests.
  const pageUrl = "http://localhost:3000/login"; // Define login URL once for reuse.

  beforeEach(() => { // Run setup before each test.
    cy.visit(pageUrl); // Open login page.
  }); // End setup block.

  it("should render login page properly", () => { // Verify login screen renders core elements.
    cy.contains("Login to your account").should("be.visible"); // Check heading visibility.
    cy.get("#email").should("exist"); // Check email input exists.
    cy.get("#password").should("exist"); // Check password input exists.
    cy.contains("button", "Continue").should("be.visible"); // Check submit button is visible.
  }); // End render test.

  it("should allow typing into email and password", () => { // Verify field input behavior.
    cy.get("#email").type("hello@test.com"); // Type email value.
    cy.get("#email").should("have.value", "hello@test.com"); // Assert email value.

    cy.get("#password").type("mypassword"); // Type password value.
    cy.get("#password").should("have.value", "mypassword"); // Assert password value.
  }); // End input test.

  it("should navigate to forgot password page", () => { // Verify forgot-password link behavior.
    cy.contains("Forgot password?").click(); // Click forgot-password link.
    cy.url().should("include", "/forgot-password"); // Confirm browser navigated correctly.
  }); // End link navigation test.

  it("should show google login button", () => { // Verify Google login option appears.
    cy.contains("Continue with google").should("be.visible"); // Check Google button text visibility.
  }); // End Google button test.

  it("should show API error message when login fails", () => { // Verify inline error on failed login.
    cy.intercept("POST", "**/login", { // Mock login endpoint failure.
      statusCode: 400, // Return bad request status to trigger form error state.
      body: { // Mock error body payload.
        message: "Invalid credentials", // Expected message shown in UI.
      }, // End error payload.
    }).as("loginFail"); // Alias failed request.

    cy.get("#email").type("wrong@example.com"); // Enter invalid email.
    cy.get("#password").type("wrongpassword"); // Enter invalid password.
    cy.contains("button", "Continue").click(); // Submit login form.

    cy.wait("@loginFail"); // Wait for mocked failed request.
    cy.contains("Invalid credentials").should("be.visible"); // Confirm error message is displayed.
  }); // End failed login test.

  it("should show OTP screen when 2FA is required", () => { // Verify 2FA branch of login flow.
    cy.intercept("POST", "**/login", { // Mock successful login response requiring OTP.
      statusCode: 200, // Return success status.
      body: { // Mock response object.
        data: { // Mock login data payload.
          token: "", // Token placeholder for this test path.
          refresh_token: "", // Refresh token placeholder.
          email: "user@example.com", // Returned user email.
          name: "Test User", // Returned user name.
          balance: 0, // Returned user balance.
          phone: "0000000000", // Returned phone number.
          photo: "", // Returned photo URL placeholder.
          "2fa_required": true, // Flag that activates OTP screen.
          temp_token: "temp-2fa-token", // Temporary token used for OTP verification.
        }, // End login data payload.
      }, // End response object.
    }).as("login2fa"); // Alias this request.

    cy.get("#email").type("user@example.com"); // Enter login email.
    cy.get("#password").type("Password123"); // Enter login password.
    cy.contains("button", "Continue").click(); // Submit login form.

    cy.wait("@login2fa"); // Wait for mocked 2FA response.
    cy.contains("OTP").should("be.visible"); // Confirm OTP title appears.
    cy.contains("Enter the 6-digit code on your Authenticator App").should("be.visible"); // Confirm OTP instruction text.
    cy.window().then((win) => { // Access browser window to inspect localStorage.
      expect(win.localStorage.getItem("temp_token")).to.eq("temp-2fa-token"); // Confirm temp token was saved.
    }); // End localStorage assertion.
  }); // End 2FA test.
}); // End login test suite.
