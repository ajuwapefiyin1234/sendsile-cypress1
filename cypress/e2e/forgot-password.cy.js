describe("Forgot Password Page", () => { // Group forgot-password tests.
  const pageUrl = "http://localhost:3000/forgot-password"; // Define forgot-password URL once.

  beforeEach(() => { // Run setup before each test.
    cy.visit(pageUrl); // Open forgot-password page.
  }); // End setup block.

  it("should load the forgot password form", () => { // Verify core UI appears.
    cy.contains("Forgot your password?").should("be.visible"); // Check page heading.
    cy.get("form").should("exist"); // Check form exists.
    cy.get("#email").should("exist"); // Check email input exists.
    cy.contains("button", "Reset password").should("be.visible"); // Check submit button exists.
  }); // End render test.

  it("should allow user to type email", () => { // Verify email input accepts value.
    cy.get("#email").type("test@example.com"); // Type sample email.
    cy.get("#email").should("have.value", "test@example.com"); // Assert typed email value.
  }); // End input test.

  it("should navigate to login page from remember password link", () => { // Verify login link navigation.
    cy.contains("Remember password?").should("be.visible"); // Check helper text exists.
    cy.contains("Login").click(); // Click login link.
    cy.url().should("include", "/login"); // Confirm redirect to login route.
  }); // End navigation test.

  it("should submit forgot password request successfully", () => { // Verify success flow with mocked API.
    cy.intercept("POST", "**/password/reset/initiate", (req) => { // Mock reset-initiate endpoint.
      expect(req.body).to.deep.equal({ email: "test@example.com" }); // Assert outgoing payload.
      req.reply({ // Send mocked success response.
        statusCode: 200, // Return OK status.
        body: { // Response object body.
          data: { // Nested response data.
            message: "Reset link sent", // Success message from backend.
          }, // End nested data.
        }, // End body object.
      }); // End reply object.
    }).as("resetPassword"); // Alias request for waiting.

    cy.get("#email").type("test@example.com"); // Enter email for reset.
    cy.contains("button", "Reset password").click(); // Submit forgot-password form.

    cy.wait("@resetPassword"); // Wait for mocked success request.
    cy.contains("Set a new password").should("be.visible"); // Confirm UI moved to next step.
    cy.window().then((win) => { // Access window object.
      expect(win.localStorage.getItem("user_email")).to.eq("test@example.com"); // Confirm saved email in localStorage.
    }); // End localStorage assertion.
  }); // End success API test.

  it("should show API error when forgot password request fails", () => { // Verify error flow with mocked API.
    cy.intercept("POST", "**/password/reset/initiate", { // Mock failed reset-initiate request.
      statusCode: 400, // Return bad request.
      body: { // Error response body.
        message: "Email does not exist", // Expected message in UI.
      }, // End error body.
    }).as("resetPasswordFail"); // Alias failed request.

    cy.get("#email").type("unknown@example.com"); // Enter non-existent email.
    cy.contains("button", "Reset password").click(); // Submit form.

    cy.wait("@resetPasswordFail"); // Wait for failed request.
    cy.contains("Email does not exist").should("be.visible"); // Confirm error message appears.
  }); // End failure API test.
}); // End forgot-password suite.
