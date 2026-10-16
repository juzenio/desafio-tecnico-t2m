class InventoryPage {
  addBackpack() {
    return cy.get('[data-test="add-to-cart-sauce-labs-backpack"]').click();
  }

  openCart() {
    return cy.get('[data-test="shopping-cart-link"]').click();
  }

  openMenu() {
    return cy.get('#react-burger-menu-btn').click();
  }

  logout() {
    return cy.get('[data-test="logout-sidebar-link"]').click();
  }
}

export default new InventoryPage();
