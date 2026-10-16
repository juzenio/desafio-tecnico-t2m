class LoginPage {
  visit() {
    cy.visit('/');
  }

  username() {
    return cy.get('[data-test="username"]');
  }

  password() {
    return cy.get('[data-test="password"]');
  }

  submit() {
    return cy.get('[data-test="login-button"]').click();
  }

  login(username: string, password: string) {
    this.username().clear().type(username);
    this.password().clear().type(password, { log: false });
    return this.submit();
  }

  loginButton() {
    return cy.get('[data-test="login-button"]');
  }

  error() {
    return cy.get('[data-test="error"]');
  }
}

export default new LoginPage();
