describe("Sign Up Page", () => { // Group all signup-related tests.
  beforeEach(() => { // Run this setup before every test case.
    cy.visit("http://localhost:3000/sign-up"); // Open the signup page.
  }); // End setup block.

  it("should load the signup form", () => { // Verify initial page render.
    cy.get("form").should("exist"); // Check that the form is present.
    cy.get("input[type=\"email\"]").should("exist"); // Check that email input exists.
  }); // End render test.

  it("should allow user to type into signup fields", () => { // Verify user can fill fields.
    cy.get("#fullname").type("Test User"); // Type full name.
    cy.get("#email").type("test@example.com"); // Type email address.
    cy.get("#password").type("Password123"); // Type password.
    cy.get("#confirmPassword").type("Password123"); // Type confirm password.

    cy.get("#fullname").should("have.value", "Test User"); // Assert full name value.
    cy.get("#email").should("have.value", "test@example.com"); // Assert email value.
    cy.get("#password").should("have.value", "Password123"); // Assert password value.
    cy.get("#confirmPassword").should("have.value", "Password123"); // Assert confirm password value.
  }); // End input test.

  it("should show validation error when passwords do not match", () => { // Verify client-side mismatch validation.
    cy.get("#fullname").type("Test User"); // Type full name.
    cy.get("#email").type("test@example.com"); // Type email address.
    cy.get("#password").type("Password123"); // Type first password.
    cy.get("#confirmPassword").type("Password321"); // Type different confirm password.
    cy.contains("button", "Continue").click(); // Submit the form.

    cy.contains("Passwords do not match").should("be.visible"); // Confirm validation message.
  }); // End mismatch validation test.

  it("should submit signup form successfully", () => { // Verify success flow with mocked API.
    cy.intercept("POST", "**/register", { // Mock register endpoint.
      statusCode: 200, // Return success status.
      body: { // Mock response body.
        data: { // Mock payload object.
          email: "newuser@example.com", // Email returned by backend.
        }, // End payload object.
      }, // End response body.
    }).as("registerUser"); // Alias this request for waiting.

    cy.get("#fullname").type("Test User"); // Fill full name.
    cy.get("#email").type("newuser@example.com"); // Fill signup email.
    cy.get("#password").type("Password123"); // Fill password.
    cy.get("#confirmPassword").type("Password123"); // Fill matching confirm password.
    cy.contains("button", "Continue").click(); // Submit signup form.

    cy.wait("@registerUser"); // Wait for mocked register request.
    cy.window().then((win) => { // Access browser window object.
      expect(win.localStorage.getItem("user_email")).to.eq("newuser@example.com"); // Verify saved email in localStorage.
    }); // End localStorage assertion.
    cy.url().should("include", "/email-verification"); // Confirm redirect to email verification page.
  }); // End successful signup test.

  it("should show API error message when signup fails", () => { // Verify failure flow with mocked API error.
    cy.intercept("POST", "**/register", { // Mock register endpoint failure.
      statusCode: 400, // Return bad request status.
      body: { // Mock error response body.
        message: "Email already exists", // Error message shown to user.
      }, // End error body.
    }).as("registerUserFail"); // Alias failed request.

    cy.get("#fullname").type("Test User"); // Fill full name.
    cy.get("#email").type("existing@example.com"); // Fill already-used email.
    cy.get("#password").type("Password123"); // Fill password.
    cy.get("#confirmPassword").type("Password123"); // Fill confirm password.
    cy.contains("button", "Continue").click(); // Submit signup form.

    cy.wait("@registerUserFail"); // Wait for failed mocked request.
    cy.contains("Email already exists").should("be.visible"); // Confirm API error is displayed.
  }); // End failure signup test.
}); // End signup test suite.
