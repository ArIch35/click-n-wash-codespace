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
