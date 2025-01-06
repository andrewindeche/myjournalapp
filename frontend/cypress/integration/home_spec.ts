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
});
