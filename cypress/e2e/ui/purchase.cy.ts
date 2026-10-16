import CartPage from '../../pages/CartPage';
import CheckoutPage from '../../pages/CheckoutPage';
import InventoryPage from '../../pages/InventoryPage';
import LoginPage from '../../pages/LoginPage';

describe('Sauce Demo purchase', () => {
  beforeEach(() => {
    LoginPage.visit();
    cy.fixture('users').then((users) => {
      cy.loginSauceDemo(
        users.standard.username,
        users.password,
      );
    });
  });

  it('validates required checkout information', () => {
    InventoryPage.addBackpack();
    InventoryPage.openCart();
    CartPage.checkout();
    CheckoutPage.continue();
    CheckoutPage.error().should('contain.text', 'Error: First Name is required');

    CheckoutPage.fillFirstName('Taylor');
    CheckoutPage.continue();
    CheckoutPage.error().should('contain.text', 'Error: Last Name is required');

    CheckoutPage.fillLastName('Customer');
    CheckoutPage.continue();
    CheckoutPage.error().should('contain.text', 'Error: Postal Code is required');
  });

  it('removes a product from the cart', () => {
    InventoryPage.addBackpack();
    InventoryPage.openCart();
    CartPage.backpackName().should('have.text', 'Sauce Labs Backpack');

    CartPage.removeBackpack();
    CartPage.items().should('not.exist');
  });

  it('completes an order and confirms the correct totals', () => {
    InventoryPage.addBackpack();
    InventoryPage.openCart();
    CartPage.checkout();
    CheckoutPage.fillInformation('Taylor', 'Customer', '10001');
    CheckoutPage.continue();

    CheckoutPage.title().should('have.text', 'Checkout: Overview');
    CheckoutPage.itemName().should('have.text', 'Sauce Labs Backpack');
    CheckoutPage.subtotal().should('have.text', 'Item total: $29.99');
    CheckoutPage.tax().should('have.text', 'Tax: $2.40');
    CheckoutPage.total().should('have.text', 'Total: $32.39');
    CheckoutPage.finish();
    CheckoutPage.confirmation().should(
      'have.text',
      'Thank you for your order!',
    );
  });
});
