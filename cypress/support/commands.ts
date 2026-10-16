import LoginPage from '../pages/LoginPage';

Cypress.Commands.add('loginSauceDemo', (username: string, password: string) => LoginPage.login(username, password));
