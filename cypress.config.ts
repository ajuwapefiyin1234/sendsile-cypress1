import { defineConfig } from "cypress";

export default defineConfig({
  projectId: "r6gvgm",
  e2e: {
    baseUrl: "https://www.sendsile.com",
    supportFile: "cypress/support/e2e.ts",
    specPattern: "cypress/e2e/**/*.cy.{js,jsx,ts,tsx}",
    excludeSpecPattern: ["*.hot-update.js"],
    trashAssetsBeforeRuns: true,
    video: false,
    screenshotOnRunFailure: true,
    defaultCommandTimeout: 8000,
    requestTimeout: 8000,
    responseTimeout: 8000,
    pageLoadTimeout: 30000,
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
  },
});
