// Login function
// Make a login function so that we can use it in the test
function login() {
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
