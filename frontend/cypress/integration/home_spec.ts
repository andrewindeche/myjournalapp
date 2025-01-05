describe("Home Page Tests", () => {
  beforeEach(() => {
    cy.visit("Home");
  });

  it("should display the correct text", () => {
    cy.contains("Every Day has a Story!").should("be.visible");

    cy.contains("Write Yours").should("be.visible");

    cy.contains("Dive into Creativity").should("be.visible");

    cy.contains("Document Your Imagination").should("be.visible");
  });

  it("should have a sign-in button", () => {
    cy.contains("Sign In").click();
  });

  it("should have a register button", () => {
    cy.contains("Register").click();
  });

  it("should navigate to the sign-in page when the sign-in button is clicked", () => {
    cy.contains("Sign In").should("be.visible").click();
    cy.contains("Login").should("be.visible");
  });

  it("should navigate to the register page when the register button is clicked", () => {
    cy.contains("Register").should("be.visible").click();
    cy.contains("Register").should("be.visible");
  });
});
