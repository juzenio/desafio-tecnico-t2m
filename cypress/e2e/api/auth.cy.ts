describe('Restful Booker authentication', () => {
  it('returns a token for valid credentials', () => {
    cy.apiAuthenticate(Cypress.env('restfulBookerUsername'), Cypress.env('restfulBookerPassword')).then(({ body, status }) => {
      expect(status).to.equal(200);
      expect(body.token).to.be.a('string').and.not.be.empty;
    });
  });

  it('rejects invalid credentials without returning a token', () => {
    cy.apiAuthenticate('invalid-user', 'invalid-password').then(({ body, status }) => {
      expect(status).to.equal(200);
      expect(body).to.have.property('reason', 'Bad credentials');
      expect(body).not.to.have.property('token');
    });
  });
});
