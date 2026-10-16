import InventoryPage from '../../pages/InventoryPage';
import LoginPage from '../../pages/LoginPage';

describe('Sauce Demo logout', () => {
  it('logs out and returns to the login page', () => {
    LoginPage.visit();
    cy.fixture('users').then((users) => {
      cy.loginSauceDemo(
        users.standard.username,
        users.password,
      );
    });

    InventoryPage.openMenu();
    InventoryPage.logout();
    LoginPage.loginButton().should('be.visible');
  });
});
