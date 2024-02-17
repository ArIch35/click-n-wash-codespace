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

describe('click the hamburger button and deactivate vendor mode', () => {
  it('passes', () => {
    cy.visit(Cypress.env('VITE_FRONTEND_ADDRESS') as string);
    cy.get('button').eq(0).should('exist').click();
    cy.wait(1000);
    cy.contains('a', 'Deactivate Vendor Mode').should('exist').click();
    cy.wait(1000);
    cy.contains('div', 'Error').should('exist');
    cy.contains('div', 'You still have laundromats, you cannot change to non vendor').should(
      'exist',
    );
  });
});

describe('go to manage laundromat and delete laundromat', () => {
  it('passes', () => {
    cy.visit(Cypress.env('VITE_FRONTEND_ADDRESS') as string);
    cy.get('button').eq(0).should('exist').click();
    cy.wait(1000);
    cy.contains('a', 'Manage laundromats').should('exist').click();
    cy.wait(1000);
    cy.contains('button', 'Edit').should('exist').click();
    cy.wait(1000);
    // Delete the laundromat
    cy.contains('button', 'Delete').should('exist').click();
    cy.wait(2000);
    cy.contains('div', 'Failed to delete Laundromat').should('exist');
    cy.wait(1000);
    // Delete the washing machine
    cy.get('button')
      .should('exist')
      .find('svg.tabler-icon.tabler-icon-trash')
      .should('exist')
      .click();
    cy.wait(1000);
    cy.contains('div', 'Success').should('exist');
    cy.wait(1000);
    // Delete the laundromat
    cy.contains('button', 'Delete').should('exist').click();
    cy.wait(1000);
    cy.get('section button').eq(2).should('exist').click();
    cy.wait(1000);
    cy.contains('div', 'Success').should('exist');
    cy.contains('div', 'Laundromat successfully deleted').should('exist');
  });
});

describe('click the hamburger button and deactivate vendor mode', () => {
  it('passes', () => {
    cy.visit(Cypress.env('VITE_FRONTEND_ADDRESS') as string);
    cy.get('button').eq(0).should('exist').click();
    cy.wait(1000);
    cy.contains('a', 'Deactivate Vendor Mode').should('exist').click();
    cy.wait(1000);
    cy.contains('div', 'Success').should('exist');
    cy.contains('div', 'Deactivated vendor mode successfully!').should('exist');
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
