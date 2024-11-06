// cypress/support/e2e.ts

// Import any necessary custom commands
import "./commands"; // Assuming you have a commands file

// You can also set up global configurations here
Cypress.on("uncaught:exception", (err, runnable) => {
  // Prevent Cypress from failing the test for uncaught exceptions
  return false;
});

// Any other global setup code can go here
