import { login, register } from './index.cy';

describe('visit the website', () => {
  it('passes', () => {
    // Use the .env with the help of load-env.ts
    cy.visit(Cypress.env('VITE_FRONTEND_ADDRESS') as string);
    cy.wait(1000);
  });
});

describe('register new user', () => {
  it('passes', () => {
    try {
      cy.readFile('cypress/fixtures/userData.json');
    } catch (error) {
      register();
    }
  });
});

describe('login', () => {
  it('passes', () => {
    login();
  });
});

describe('Add Funds 20', () => {
  it('passes', () => {
    login();
    cy.get('button').eq(0).should('exist').click();
    cy.wait(1000);
    cy.contains('a', 'Balance').should('exist').click();
    cy.contains('button', 'Add Funds').should('exist').click();
    cy.contains('button', '20').should('exist').click();
    cy.contains('button', 'Topup').should('exist').click();
  });
});

describe('check the balance', () => {
  it('passes', () => {
    login();
    cy.get('button').eq(0).should('exist').click();
    cy.wait(1000);
    cy.contains('a', 'Balance').should('exist').click();
    cy.wait(1000);
    cy.contains('div', '20').should('exist');
    cy.wait(1000);
  });
});

describe('log out from the website', () => {
  it('passes', () => {
    cy.visit(Cypress.env('VITE_FRONTEND_ADDRESS') as string);
    cy.wait(1000);
    cy.get('button').eq(2).should('exist').trigger('mouseover');
    cy.contains('div', 'Logout').should('exist').click();
  });
});
