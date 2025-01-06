import { defineConfig } from "cypress";

export default defineConfig({
  e2e: {
    specPattern: "cypress/integration/**/*.{js,jsx,ts,tsx}",
    supportFile: "cypress/support/e2e.js",
    baseUrl: "https://boyhqjw-anonymous-8081.exp.direct",
  },
});
