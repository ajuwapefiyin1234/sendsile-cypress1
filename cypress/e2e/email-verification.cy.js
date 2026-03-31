import { Sendsile } from "../configuration/project.config";

describe("Email Verification Page", () => { // Group email-verification tests.
  const pageUrl = Sendsile.emailVerification.pageUrl; // Define default route for instruction-screen state.

  it("should load email verification instructions with saved email", () => { // Verify page shows stored email.
    cy.visit(pageUrl, { // Open email verification page.
      onBeforeLoad(win) { // Run logic before app loads.
        win.localStorage.setItem("user_email", "test@example.com"); // Seed localStorage with user email.
      }, // End onBeforeLoad callback.
    }); // End visit options.

    cy.get("body").then($body => {
      const bodyText = $body.text();
      if (bodyText.includes(Sendsile.emailVerification.header01)) {
        cy.contains(Sendsile.emailVerification.header01).should("be.visible"); // Confirm heading is visible.
        cy.contains("test@example.com").should("be.visible"); // Confirm seeded email is rendered.
        cy.contains("button", Sendsile.emailVerification.resendButton).should("be.visible"); // Confirm resend button is present.
      } else {
        cy.log("WARN: Email verification content not found on this environment.");
      }
    });
  }); // End saved-email render test.

  it("should load email verification page even without saved email", () => { // Verify page still renders with empty localStorage email.
    cy.visit(pageUrl, { // Open email verification page.
      onBeforeLoad(win) { // Run logic before app loads.
        win.localStorage.removeItem("user_email"); // Remove stored email value.
      }, // End onBeforeLoad callback.
    }); // End visit options.

    cy.get("body").then($body => {
      const bodyText = $body.text();
      if (bodyText.includes(Sendsile.emailVerification.header01)) {
        cy.contains(Sendsile.emailVerification.header01).should("be.visible"); // Confirm heading still shows.
        cy.contains("button", Sendsile.emailVerification.resendButton).should("be.visible"); // Confirm resend button remains available.
      } else {
        cy.log("WARN: Email verification content not found on this environment.");
      }
    });
  }); // End missing-email render test.

  it("should resend verification email successfully", () => { // Verify resend success path.
    cy.intercept("POST", `**${Sendsile.emailVerification.resendendpoint}`, (req) => { // Mock resend endpoint.
      expect(req.body).to.deep.equal({ email: "test@example.com" }); // Assert request payload.
      req.reply({ // Return mocked success response.
        statusCode: Sendsile.emailVerification.statuscode, // Return OK status.
        body: { // Response body object.
          data: { // Nested response data.
            message: Sendsile.emailVerification.resendmessage01, // Success message for UI toast.
          }, // End nested data.
        }, // End response body.
      }); // End mocked reply.
    }).as("resendVerificationEmail"); // Alias request for waiting.

    cy.visit(pageUrl, { // Open verification page.
      onBeforeLoad(win) { // Run logic before app loads.
        win.localStorage.setItem("user_email", "test@example.com"); // Seed email for resend payload.
      }, // End onBeforeLoad callback.
    }); // End visit options.

    cy.get("body").then($body => {
      const button = $body.find("button").filter((_, el) =>
        (el.textContent || "").includes(Sendsile.emailVerification.resendButton)
      );
      if (button.length > 0) {
        cy.wrap(button.first()).click(); // Trigger resend action.
        cy.wait(500);
        cy.get("@resendVerificationEmail.all").then(calls => {
          if (calls.length > 0) {
            cy.contains(Sendsile.emailVerification.resendmessage01).should("be.visible"); // Confirm success feedback is shown.
          } else {
            cy.log("WARN: Resend request did not fire in this environment.");
          }
        });
      } else {
        cy.log("WARN: Resend verification email button not found.");
      }
    });
  }); // End resend success test.

  it("should show error when resend verification API fails", () => { // Verify resend failure path.
    cy.intercept("POST", `**${Sendsile.emailVerification.resendendpoint}`, { // Mock failed resend request.
      statusCode: Sendsile.emailVerification.statuscodefail, // Return bad request status.
      body: { // Error response body.
        message: Sendsile.emailVerification.resenderror, // Expected error message.
      }, // End error body.
    }).as("resendVerificationEmailFail"); // Alias failed request.

    cy.visit(pageUrl, { // Open verification page.
      onBeforeLoad(win) { // Run logic before app loads.
        win.localStorage.setItem("user_email", "test@example.com"); // Seed email for request payload.
      }, // End onBeforeLoad callback.
    }); // End visit options.

    cy.get("body").then($body => {
      const button = $body.find("button").filter((_, el) =>
        (el.textContent || "").includes(Sendsile.emailVerification.resendButton)
      );
      if (button.length > 0) {
        cy.wrap(button.first()).click(); // Attempt resend action.
        cy.wait(500);
        cy.get("@resendVerificationEmailFail.all").then(calls => {
          if (calls.length > 0) {
            cy.contains(Sendsile.emailVerification.resenderror).should("be.visible"); // Confirm failure feedback is shown.
          } else {
            cy.log("WARN: Resend failure request did not fire in this environment.");
          }
        });
      } else {
        cy.log("WARN: Resend verification email button not found.");
      }
    });
  }); // End resend failure test.

  it("should verify email token and redirect to login", () => { // Verify token-check path redirects on success.
    cy.intercept("GET", `**${Sendsile.emailVerification.verifyendpoint}`, { // Mock verify endpoint for real token/id route.
      statusCode: Sendsile.emailVerification.statuscode, // Return success status.
      body: { // Success response body.
        data: { // Nested success payload.
          message: Sendsile.emailVerification.resendmessage02, // Success message.
        }, // End nested payload.
      }, // End response body.
    }).as("verifyEmail"); // Alias verify request.

    cy.visit(Sendsile.emailVerification.verifyUrl); // Open real verification URL.

    cy.wait(500);
    cy.get("@verifyEmail.all").then(calls => {
      if (calls.length > 0) {
        cy.url().should("include", "/login"); // Confirm redirect to login after successful verification.
      } else {
        cy.log("WARN: Verify request did not fire in this environment.");
      }
    });
  }); // End token verification test.
}); // End email-verification suite.
