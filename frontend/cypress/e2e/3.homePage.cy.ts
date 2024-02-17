import { login } from './index.cy';

// Create new Date
const date = new Date();
const formattedDate = date.toLocaleDateString('en-GB', {
  day: 'numeric',
  month: 'long',
  year: 'numeric',
});

describe('visit the website', () => {
  it('passes', () => {
    // Use the .env with the help of load-env.ts
    cy.visit(Cypress.env('VITE_FRONTEND_ADDRESS') as string);
    cy.wait(1000);
  });
});

describe('login', () => {
  it('passes', () => {
    login();
  });
});

describe('click the hamburger button', () => {
  it('passes', () => {
    cy.visit(Cypress.env('VITE_FRONTEND_ADDRESS') as string);
    cy.get('button').eq(0).should('exist').click();
    cy.wait(1000);
  });
});

describe('try to book', () => {
  it('should be able to click show on map of list washing machine', () => {
    cy.visit(Cypress.env('VITE_FRONTEND_ADDRESS') as string);
    cy.wait(1000);
    cy.contains('button', 'Show on map').should('exist').click();
    cy.wait(1000);
  });

  it('should be able to book by clicking the image icon from map', () => {
    cy.visit(Cypress.env('VITE_FRONTEND_ADDRESS') as string);
    cy.wait(1000);
    cy.get('img[alt="Marker"]').eq(0).should('exist').click({ force: true });
    cy.wait(1000);
  });

  it('should be able to book by clicking the book button from list', () => {
    cy.visit(Cypress.env('VITE_FRONTEND_ADDRESS') as string);
    cy.wait(1000);
    cy.contains('button', 'Book').should('exist').click();
    cy.wait(1000);
    cy.get(`button[aria-label="${formattedDate}"]`).should('exist').click();
    cy.wait(1000);
    cy.get('input').eq(4).should('exist').click();
    cy.contains('div', /[0-9]{2}:00/)
      .eq(0)
      .should('exist')
      .click();
    cy.wait(1000);
    cy.contains('button', 'Book Time').should('exist').click();
    cy.wait(1000);
    cy.get('ul div button').eq(0).should('exist').click({ force: true });
    cy.wait(1000);
  });
});

describe('go to inbox', () => {
  it('passes', () => {
    cy.visit(Cypress.env('VITE_FRONTEND_ADDRESS') as string);
    cy.wait(1000);
    cy.get('button').eq(2).should('exist').trigger('mouseover');
    cy.wait(1000);
    cy.contains('button', 'Inbox').should('exist').click();
    cy.wait(1000);
    cy.contains('button', 'User Inbox').should('exist');
  });
});

describe('log out from the website', () => {
  it('passes', () => {
    cy.visit(Cypress.env('VITE_FRONTEND_ADDRESS') as string);
    cy.wait(1000);
    cy.get('button').eq(2).should('exist').trigger('mouseover');
    cy.wait(1000);
    cy.contains('div', 'Logout').should('exist').click();
    cy.wait(1000);
  });
});
