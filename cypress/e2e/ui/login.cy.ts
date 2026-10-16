import LoginPage from '../../pages/LoginPage';

describe('Sauce Demo login', () => {
  beforeEach(() => {
    LoginPage.visit();
  });

  it('shows validation messages when login fields are empty', () => {
    cy.fixture('users').then((users) => {
      LoginPage.submit();
      LoginPage.error().should('contain.text', 'Username is required');

      LoginPage.username().type(users.standard.username);
      LoginPage.submit();
      LoginPage.error().should('contain.text', 'Password is required');
    });
  });

  it('shows an error for invalid credentials', () => {
    cy.fixture('users').then((users) => {
      cy.loginSauceDemo(users.invalid.username, users.invalid.password);
    });
    LoginPage.error().should(
      'contain.text',
      'Username and password do not match any user in this service',
    );
  });

  it('shows the locked-out behavior for a non-standard user', () => {
    cy.fixture('users').then((users) => {
      cy.loginSauceDemo(users.lockedOut.username, users.password);
    });

    LoginPage.error().should(
      'contain.text',
      'Sorry, this user has been locked out.',
    );
  });
});
