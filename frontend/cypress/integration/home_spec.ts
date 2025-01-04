describe("Home Page Tests", () => {
  beforeEach(() => {
    cy.visit("/");
  });

  it("should display the correct text", () => {
    cy.contains("Every Day has a Story! Write Yours").should("be.visible");
  });

  it("should display the correct text", () => {
    cy.contains("Dive into Creativity Document Your Imagination").should(
      "be.visible",
    );
  });

  it("should have a sign-in button", () => {
    cy.get("button").contains("Sign In").should("be.visible");
  });

  it("should have a register button", () => {
    cy.get("button").contains("Register").should("be.visible");
  });

  it("should navigate to the sign-in page when the sign-in button is clicked", () => {
    cy.get("button").contains("Sign In").click();
    cy.url().should("include", "/login");
    cy.contains("Login").should("be.visible");
  });

  it("should navigate to the register page when the register button is clicked", () => {
    cy.get("button").contains("Register").click();
    cy.url().should("include", "/register");
    cy.contains("Register").should("be.visible");
  });
});
