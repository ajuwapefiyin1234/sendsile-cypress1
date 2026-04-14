const baseUrl = process.env.CYPRESS_BASE_URL || "https://www.sendsile.com";

export default {
  allowCypressEnv: false,

  e2e: {
    baseUrl,
    pageLoadTimeout: 120000, // Increased to 2 minutes
    defaultCommandTimeout: 10000, // Increased to 10 seconds
    requestTimeout: 10000, // Increased to 10 seconds
    responseTimeout: 10000, // Increased to 10 seconds
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
  },
};
