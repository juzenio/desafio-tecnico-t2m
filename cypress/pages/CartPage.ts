class CartPage {
  checkout() {
    return cy.get('[data-test="checkout"]').click();
  }

  removeBackpack() {
    return cy.get('[data-test="remove-sauce-labs-backpack"]').click();
  }

  backpackName() {
    return cy.get('[data-test="inventory-item-name"]');
  }

  items() {
    return cy.get('[data-test="inventory-item"]');
  }
}

export default new CartPage();
