class CheckoutPage {
  fillInformation(firstName: string, lastName: string, postalCode: string) {
    this.fillFirstName(firstName);
    this.fillLastName(lastName);
    this.postalCode().type(postalCode);
  }

  fillFirstName(firstName: string) {
    return cy.get('[data-test="firstName"]').type(firstName);
  }

  fillLastName(lastName: string) {
    return cy.get('[data-test="lastName"]').type(lastName);
  }

  postalCode() {
    return cy.get('[data-test="postalCode"]');
  }

  continue() {
    return cy.get('[data-test="continue"]').click();
  }

  finish() {
    return cy.get('[data-test="finish"]').click();
  }

  error() {
    return cy.get('[data-test="error"]');
  }

  title() {
    return cy.get('[data-test="title"]');
  }

  itemName() {
    return cy.get('[data-test="inventory-item-name"]');
  }

  subtotal() {
    return cy.get('[data-test="subtotal-label"]');
  }

  tax() {
    return cy.get('[data-test="tax-label"]');
  }

  total() {
    return cy.get('[data-test="total-label"]');
  }

  confirmation() {
    return cy.get('[data-test="complete-header"]');
  }
}

export default new CheckoutPage();
