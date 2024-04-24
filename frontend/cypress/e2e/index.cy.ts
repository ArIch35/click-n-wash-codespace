export const register = () => {
  // Create random 24 character email
  const email = `${Math.random().toString(36).substring(2, 15)}@${Math.random()
    .toString(36)
    .substring(2, 15)}.com`;
  const password = 'ValidP4$$w0rd';

  cy.visit(Cypress.env('VITE_FRONTEND_ADDRESS') as string);
  cy.wait(1000);
  cy.contains('button', 'Login').should('exist').click();
  cy.contains('button', 'Not a member yet? Register').should('exist').click();
  cy.get('input[name="name"]').eq(1).should('exist').type(email);
  cy.get('input[name="email"]').should('exist').type(email);
  cy.get('input[name="password"]').should('exist').type(password);
  cy.get('input[name="confirmPassword"]').should('exist').type(password);
  cy.get('input[name="terms"]').should('exist').check();
  cy.contains('button', 'Register').should('exist').click();
  cy.wait(1000);

  // Write to a local file
  cy.writeFile('cypress/fixtures/userData.json', { email, password });
};

export const login = () => {
  let username = '';
  let password = '';
  cy.readFile('cypress/fixtures/userData.json').then((userData) => {
    username = userData.email;
    password = userData.password;
  });
  cy.visit(Cypress.env('VITE_FRONTEND_ADDRESS') as string);
  cy.wait(1000);
  cy.get('body').then((body) => {
    if (body.find('button:contains("Login")').length > 0) {
      cy.contains('button', 'Login').eq(0).should('exist').click();
      cy.get('input[name="email"]').should('exist').type(username);
      cy.get('input[name="password"]').should('exist').type(password);
      cy.get('button[type="submit"]').eq(1).should('exist').click();
      cy.wait(1000);
      cy.get('div[role="alert"]').contains('You have been successfully logged in').should('exist');
      cy.wait(1000);
    } else {
      // If the button doesn't exist, return
      return;
    }
  });
};
