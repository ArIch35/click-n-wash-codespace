// Login function
// Make a login function so that we can use it in the test
function loginSetDefault() {
  cy.visit(Cypress.env('VITE_FRONTEND_ADDRESS') as string);
  cy.wait(1000);
  cy.get('body').then((body) => {
    if (body.find('button:contains("Login")').length > 0) {
      cy.contains('button', 'Login').eq(0).should('exist').click();
      cy.get('input[name="email"]').should('exist').type('newUser@mantine.de');
      cy.get('input[name="password"]').should('exist').type('ValidP4$$w0rd');
      cy.get('button[type="submit"]').eq(1).should('exist').click();
    } else {
      // If the button doesn't exist, return
      return;
    }
  });
}

describe('visit the website', () => {
  it('passes', () => {
    // Use the .env with the help of load-env.ts
    cy.visit(Cypress.env('VITE_FRONTEND_ADDRESS') as string);
    cy.wait(1000);
  });
});

describe('login', () => {
  it('passes', () => {
    loginSetDefault();
  });
});

describe('click the hamburger button and deactivate vendor mode', () => {
  it('passes', () => {
    loginSetDefault();
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
    loginSetDefault();
    cy.get('button').eq(0).should('exist').click();
    cy.wait(1000);
    cy.contains('a', 'Manage laundromats').should('exist').click();
    cy.wait(1000);
    cy.contains('button', 'Edit').should('exist').click();
    cy.wait(1000);
    // Delete the laundromat
    cy.contains('button', 'Delete').should('exist').click();
    cy.wait(1000);
    cy.contains('div', 'Failed to delete Laundromat').should('exist');
    cy.wait(1000);
    cy.contains('div', 'Laundromat has washing machines').should('exist');
    cy.wait(1000);
    // Delete the washing machine
    cy.get('button')
      .should('exist')
      .find('svg.tabler-icon.tabler-icon-trash')
      .should('exist')
      .click();
    // Delete the laundromat
    cy.contains('button', 'Delete').should('exist').click();
    cy.wait(1000);
    // A Modal should appear
    cy.contains('h2', 'Delete Laundromat Cypress Laundromat').should('exist');
    cy.wait(1000);
    cy.contains('p', 'Are you sure you want to delete Laundromat Cypress Laundromat?').should(
      'exist',
    );
    cy.wait(1000);
    cy.get('section button').eq(2).should('exist').click();
    cy.wait(1000);
    cy.contains('div', 'Success').should('exist');
    cy.wait(1000);
    cy.contains('div', 'Laundromat successfully deleted').should('exist');
    cy.wait(1000);
  });
});

describe('click the hamburger button and deactivate vendor mode', () => {
  it('passes', () => {
    loginSetDefault();
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
