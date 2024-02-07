describe('visit the website', () => {
  it('passes', () => {
    cy.visit('http://localhost:5173/');
    cy.wait(1000);
  });
});

describe('check the login button', () => {
  it('passes', () => {
    cy.visit('http://localhost:5173/');
    cy.wait(1000);
    cy.get('[data-testid="login"]').should('exist');
  });
});

describe('click the login modal', () => {
  it('passes', () => {
    cy.visit('http://localhost:5173/');
    cy.wait(1000);
    cy.get('[data-testid="login"]').click({ force: true });
    cy.get('[data-testid="auth-modal"]').should('exist');
  });
});

describe('click the register button', () => {
  it('passes', () => {
    cy.visit('http://localhost:5173/');
    cy.wait(1000);
    cy.get('[data-testid="login"]').click({ force: true });
    cy.get('[data-testid="auth-modal"]').should('exist');
  });
});
