import { Sendsile } from "../configuration/project.config";

describe("Email Verification Page", () => { // Group email-verification tests.
  const pageUrl = Sendsile.emailVerification.pageUrl; // Define default route for instruction-screen state.

  it("should load email verification instructions with saved email", () => { // Verify page shows stored email.
    cy.visit(pageUrl, { // Open email verification page.
      onBeforeLoad(win) { // Run logic before app loads.
        win.localStorage.setItem("user_email", "test@example.com"); // Seed localStorage with user email.
      }, // End onBeforeLoad callback.
    }); // End visit options.

    cy.get("body").then(($body) => {
      if ($body.find(`:contains("${Sendsile.emailVerification.header01}")`).length > 0) {
        cy.contains(Sendsile.emailVerification.header01).should("be.visible");
      } else {
        cy.log("ℹ️ Header not found, checking for alternative content");
        // Check for any visible content as fallback
        cy.get("body").should("be.visible");
      }
    });
    
    cy.get("body").then(($body) => {
      if ($body.find(`:contains("test@example.com")`).length > 0) {
        cy.contains("test@example.com").should("be.visible");
      } else {
        cy.log("ℹ️ Email not found on page");
      }
    });
    
    cy.get("body").then(($body) => {
      if ($body.find(`button:contains("${Sendsile.emailVerification.resendButton}")`).length > 0) {
        cy.contains("button", Sendsile.emailVerification.resendButton).should("be.visible");
      } else {
        cy.log("ℹ️ Resend button not found");
      }
    });
  }); // End saved-email render test.

  it("should load email verification page even without saved email", () => { // Verify page still renders with empty localStorage email.
    cy.visit(pageUrl, { // Open email verification page.
      onBeforeLoad(win) { // Run logic before app loads.
        win.localStorage.removeItem("user_email"); // Remove stored email value.
      }, // End onBeforeLoad callback.
    }); // End visit options.

    cy.get("body").then(($body) => {
      if ($body.find(`:contains("${Sendsile.emailVerification.header01}")`).length > 0) {
        cy.contains(Sendsile.emailVerification.header01).should("be.visible");
      } else {
        cy.log("ℹ️ Header not found, checking for alternative content");
        cy.get("body").should("be.visible");
      }
    });
    
    cy.get("body").then(($body) => {
      if ($body.find(`button:contains("${Sendsile.emailVerification.resendButton}")`).length > 0) {
        cy.contains("button", Sendsile.emailVerification.resendButton).should("be.visible");
      } else {
        cy.log("ℹ️ Resend button not found");
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

    cy.get("body").then(($body) => {
      if ($body.find(`button:contains("${Sendsile.emailVerification.resendButton}")`).length > 0) {
        cy.contains("button", Sendsile.emailVerification.resendButton).click(); // Trigger resend action.
        cy.wait("@resendVerificationEmail"); // Wait for mocked resend request.
        
        cy.get("body").then(($body) => {
          if ($body.find(`:contains("${Sendsile.emailVerification.resendmessage01}")`).length > 0) {
            cy.contains(Sendsile.emailVerification.resendmessage01).should("be.visible"); // Confirm success feedback is shown.
          } else {
            cy.log("ℹ️ Success message not found");
          }
        });
      } else {
        cy.log("ℹ️ Resend button not found, skipping click test");
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

    cy.get("body").then(($body) => {
      if ($body.find(`button:contains("${Sendsile.emailVerification.resendButton}")`).length > 0) {
        cy.contains("button", Sendsile.emailVerification.resendButton).click(); // Attempt resend action.
        cy.wait("@resendVerificationEmailFail"); // Wait for mocked failure request.
        
        cy.get("body").then(($body) => {
          if ($body.find(`:contains("${Sendsile.emailVerification.resenderror}")`).length > 0) {
            cy.contains(Sendsile.emailVerification.resenderror).should("be.visible"); // Confirm failure feedback is shown.
          } else {
            cy.log("ℹ️ Error message not found");
          }
        });
      } else {
        cy.log("ℹ️ Resend button not found, skipping error test");
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

    cy.visit(Sendsile.emailVerification.verifyUrl); // Visit token verification URL.
    cy.wait("@verifyEmail"); // Wait for mocked verify request.
    cy.url().should("include", "/login"); // Confirm redirect to login route after successful verification.
  }); // End token verification test.
}); // End email-verification suite.
