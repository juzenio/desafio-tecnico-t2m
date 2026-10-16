import { defineConfig } from 'cypress';

export default defineConfig({
  e2e: {
    baseUrl: 'https://www.saucedemo.com',
    supportFile: 'cypress/support/e2e.ts',
    specPattern: 'cypress/e2e/**/*.cy.ts',
    video: false,
    env: {
      apiUrl: 'https://restful-booker.herokuapp.com',
      hideCredentials: true,
      restfulBookerUsername:
        process.env.RESTFULBOOKER_USERNAME ?? 'admin',
      restfulBookerPassword:
        process.env.RESTFULBOOKER_PASSWORD ?? 'password123',
    },
  },
});
