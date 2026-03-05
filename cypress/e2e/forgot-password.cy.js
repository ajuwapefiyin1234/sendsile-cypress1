import { Sendsile } from "../configuration/project.config";

describe("Forgot Password Page", () => { // Group forgot-password tests.
  const pageUrl = Sendsile.forgotpassword.pageUrl; // Define forgot-password URL once.

  beforeEach(() => { // Run setup before each test.
    cy.visit(pageUrl); // Open forgot-password page.
  }); // End setup block.

  it("should load the forgot password form", () => { // Verify core UI appears.
    cy.contains(Sendsile.forgotpassword.header01).should("be.visible"); // Check page heading.
    cy.get("form").should("exist"); // Check form exists.
    cy.get(Sendsile.forgotpassword.emailId).should("exist"); // Check email input exists.
    cy.contains("button", Sendsile.forgotpassword.resetButton).should("be.visible"); // Check submit button exists.
  }); // End render test.

  it("should allow user to type email", () => { // Verify email input accepts value.
    cy.get(Sendsile.forgotpassword.emailId).type(Sendsile.forgotpassword.emailtest); // Type sample email.
    cy.get(Sendsile.forgotpassword.emailId).should("have.value", Sendsile.forgotpassword.emailtest); // Assert typed email value.
  }); // End input test.

  it("should navigate to login page from remember password link", () => { // Verify login link navigation.
    cy.contains(Sendsile.forgotpassword.rememberPassword).should("be.visible"); // Check helper text exists.
    cy.contains("Login").click(); // Click login link.
    cy.url().should("include", "/login"); // Confirm redirect to login route.
  }); // End navigation test.

  it("should submit forgot password request successfully", () => { // Verify success flow with mocked API.
    cy.intercept("POST", `**${Sendsile.forgotpassword.resetURL}`, (req) => { // Mock reset-initiate endpoint.
      expect(req.body).to.deep.equal({ email: Sendsile.forgotpassword.emailtest }); // Assert outgoing payload.
      req.reply({ // Send mocked success response.
        statusCode: Sendsile.forgotpassword.statuscode, // Return OK status.
        body: { // Response object body.
          data: { // Nested response data.
            message: Sendsile.forgotpassword.resetmessage02, // Success message from backend.
          }, // End nested data.
        }, // End body object.
      }); // End reply object.
    }).as("resetPassword"); // Alias request for waiting.

    cy.get(Sendsile.forgotpassword.emailId).type(Sendsile.forgotpassword.emailtest); // Enter email for reset.
    cy.contains("button", Sendsile.forgotpassword.resetButton).click(); // Submit forgot-password form.

    cy.wait("@resetPassword"); // Wait for mocked success request.
    cy.contains(Sendsile.forgotpassword.resetmessage01).should("be.visible"); // Confirm UI moved to next step.
    cy.window().then((win) => { // Access window object.
      expect(win.localStorage.getItem("user_email")).to.eq(Sendsile.forgotpassword.emailtest); // Confirm saved email in localStorage.
    }); // End localStorage assertion.
  }); // End success API test.

  it("should show API error when forgot password request fails", () => { // Verify error flow with mocked API.
    cy.intercept("POST", `**${Sendsile.forgotpassword.resetURL}`, { // Mock failed reset-initiate request.
      statusCode: Sendsile.forgotpassword.statuscodefail, // Return bad request.
      body: { // Error response body.
        message: Sendsile.forgotpassword.resetmessage03, // Expected message in UI.
      }, // End error body.
    }).as("resetPasswordFail"); // Alias failed request.

    cy.get(Sendsile.forgotpassword.emailId).type("unknown@example.com"); // Enter non-existent email.
    cy.contains("button", Sendsile.forgotpassword.resetButton).click(); // Submit form.

    cy.wait("@resetPasswordFail"); // Wait for failed request.
    cy.contains(Sendsile.forgotpassword.resetmessage03).should("be.visible"); // Confirm error message appears.
  }); // End failure API test.
}); // End forgot-password suite.
