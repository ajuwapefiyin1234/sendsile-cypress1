describe("Email Verification Page", () => { // Group email-verification tests.
  const pageUrl = "http://localhost:3000/email-verification/:token/:id"; // Define default route for instruction-screen state.

  it("should load email verification instructions with saved email", () => { // Verify page shows stored email.
    cy.visit(pageUrl, { // Open email verification page.
      onBeforeLoad(win) { // Run logic before app loads.
        win.localStorage.setItem("user_email", "test@example.com"); // Seed localStorage with user email.
      }, // End onBeforeLoad callback.
    }); // End visit options.

    cy.contains("Check your inbox").should("be.visible"); // Confirm heading is visible.
    cy.contains("test@example.com").should("be.visible"); // Confirm seeded email is rendered.
    cy.contains("button", "Resend verification email").should("be.visible"); // Confirm resend button is present.
  }); // End saved-email render test.

  it("should load email verification page even without saved email", () => { // Verify page still renders with empty localStorage email.
    cy.visit(pageUrl, { // Open email verification page.
      onBeforeLoad(win) { // Run logic before app loads.
        win.localStorage.removeItem("user_email"); // Remove stored email value.
      }, // End onBeforeLoad callback.
    }); // End visit options.

    cy.contains("Check your inbox").should("be.visible"); // Confirm heading still shows.
    cy.contains("button", "Resend verification email").should("be.visible"); // Confirm resend button remains available.
  }); // End missing-email render test.

  it("should resend verification email successfully", () => { // Verify resend success path.
    cy.intercept("POST", "**/email/resend", (req) => { // Mock resend endpoint.
      expect(req.body).to.deep.equal({ email: "test@example.com" }); // Assert request payload.
      req.reply({ // Return mocked success response.
        statusCode: 200, // Return OK status.
        body: { // Response body object.
          data: { // Nested response data.
            message: "Verification email resent", // Success message for UI toast.
          }, // End nested data.
        }, // End response body.
      }); // End mocked reply.
    }).as("resendVerificationEmail"); // Alias request for waiting.

    cy.visit(pageUrl, { // Open verification page.
      onBeforeLoad(win) { // Run logic before app loads.
        win.localStorage.setItem("user_email", "test@example.com"); // Seed email for resend payload.
      }, // End onBeforeLoad callback.
    }); // End visit options.

    cy.contains("button", "Resend verification email").click(); // Trigger resend action.
    cy.wait("@resendVerificationEmail"); // Wait for mocked resend request.
    cy.contains("Verification email resent").should("be.visible"); // Confirm success feedback is shown.
  }); // End resend success test.

  it("should show error when resend verification API fails", () => { // Verify resend failure path.
    cy.intercept("POST", "**/email/resend", { // Mock failed resend request.
      statusCode: 400, // Return bad request status.
      body: { // Error response body.
        message: "Unable to resend verification email", // Expected error message.
      }, // End error body.
    }).as("resendVerificationEmailFail"); // Alias failed request.

    cy.visit(pageUrl, { // Open verification page.
      onBeforeLoad(win) { // Run logic before app loads.
        win.localStorage.setItem("user_email", "test@example.com"); // Seed email for request payload.
      }, // End onBeforeLoad callback.
    }); // End visit options.

    cy.contains("button", "Resend verification email").click(); // Attempt resend action.
    cy.wait("@resendVerificationEmailFail"); // Wait for mocked failure request.
    cy.contains("Unable to resend verification email").should("be.visible"); // Confirm failure feedback is shown.
  }); // End resend failure test.

  it("should verify email token and redirect to login", () => { // Verify token-check path redirects on success.
    cy.intercept("GET", "**/email/verify/test-token/123?*", { // Mock verify endpoint for real token/id route.
      statusCode: 200, // Return success status.
      body: { // Success response body.
        data: { // Nested success payload.
          message: "Email verified", // Success message.
        }, // End nested payload.
      }, // End response body.
    }).as("verifyEmail"); // Alias verify request.

    cy.visit("http://localhost:3000/email-verification/test-token/123?signature=abc&expires=1"); // Open real verification URL.

    cy.wait("@verifyEmail"); // Wait for verification request.
    cy.url().should("include", "/login"); // Confirm redirect to login after successful verification.
  }); // End token verification test.
}); // End email-verification suite.
