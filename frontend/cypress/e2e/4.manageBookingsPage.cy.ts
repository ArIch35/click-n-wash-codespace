import { login } from './index.cy';

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

describe('move to manage bookings page and report problem', () => {
  it('passes', () => {
    cy.visit(Cypress.env('VITE_FRONTEND_ADDRESS') as string);
    cy.get('button').eq(0).should('exist').click();
    cy.wait(1000);
    cy.contains('a', 'Manage bookings').should('exist').click();
    cy.wait(1000);
    cy.contains('button', 'Report problem').eq(0).should('exist').click();
    cy.wait(1000);
    cy.get('input[name="reason"]').should('exist').type('Cannot turn on');
    cy.get('textarea[name="description"]')
      .should('exist')
      .type(
        'I already booked it through the app but it cannot be turned on. I already tried to turn it on but it still cannot be turned on.',
      );
    cy.contains('button', 'Submit report').should('exist').click();
    cy.wait(1000);
  });
});

describe('cancel booking', () => {
  it('passes', () => {
    cy.visit(Cypress.env('VITE_FRONTEND_ADDRESS') as string);
    cy.get('button').eq(0).should('exist').click();
    cy.wait(1000);
    cy.contains('a', 'Manage bookings').should('exist').click();
    cy.wait(1000);
    cy.contains('button', 'Cancel').eq(0).should('exist').click();
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
