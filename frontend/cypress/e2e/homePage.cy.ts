describe('visit the website', () => {
  it('passes', () => {
    // Use the .env with the help of load-env.ts
    cy.visit(Cypress.env('VITE_FRONTEND_ADDRESS') as string);
    cy.wait(1000);
  });
});

describe('check the login button', () => {
  it('passes', () => {
    cy.visit(Cypress.env('VITE_FRONTEND_ADDRESS') as string);
    cy.wait(1000);
    cy.get('[data-testid="login"]').should('exist');
  });
});

describe('click the login modal', () => {
  it('passes', () => {
    cy.visit(Cypress.env('VITE_FRONTEND_ADDRESS') as string);
    cy.wait(1000);
    cy.get('[data-testid="login"]').click({ force: true });
    cy.get('[data-testid="auth-modal"]').should('exist');
  });
});

describe('click the register button', () => {
  it('passes', () => {
    cy.visit(Cypress.env('VITE_FRONTEND_ADDRESS') as string);
    cy.wait(1000);
    cy.get('[data-testid="login"]').click({ force: true });
    cy.get('[data-testid="auth-modal"]').should('exist');
  });
});

describe('register new user', () => {
  it('passes', () => {
    cy.visit(Cypress.env('VITE_FRONTEND_ADDRESS') as string);
    cy.wait(1000);
    cy.get('[data-testid="login-button"]').should('exist').click();
    cy.contains('button', 'Not a member yet? Register').should('exist').click();
    cy.get('input[name="name"]').eq(1).should('exist').type('newUser');
    cy.get('input[name="email"]').should('exist').type('newUser@mantine.de');
    cy.get('input[name="password"]').should('exist').type('ValidP4$$w0rd');
    cy.get('input[name="confirmPassword"]').should('exist').type('ValidP4$$w0rd');
    cy.get('input[name="terms"]').should('exist').check();
    cy.contains('button', 'Register').should('exist');
  });
});

describe('try to book', () => {
  it('should be able to click show on map of list washing machine', () => {
    cy.visit(Cypress.env('VITE_FRONTEND_ADDRESS') as string);
    cy.wait(1000);
    cy.contains('button', 'Show on map').should('exist').click();
  });

  it('should be able to book by clicking the image icon from map', () => {
    cy.visit(Cypress.env('VITE_FRONTEND_ADDRESS') as string);
    cy.wait(1000);
    cy.get('img[alt="Marker"]').eq(0).should('exist').click({ force: true });
    cy.get('input[name="email"]').should('be.visible');
  });

  it('should be able to book by clicking the book button from list', () => {
    cy.visit(Cypress.env('VITE_FRONTEND_ADDRESS') as string);
    cy.wait(1000);
    cy.contains('button', 'Book').should('exist').click();
    cy.get('input[name="email"]').should('be.visible');
  });
});
