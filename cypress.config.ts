const baseUrl = process.env.CYPRESS_BASE_URL || "https://www.sendsile.com";

export default {
  allowCypressEnv: false,

  e2e: {
    baseUrl,
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
  },
};
