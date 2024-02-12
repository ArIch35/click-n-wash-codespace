// Login function
// Make a login function so that we can use it in the test
function loginManage() {
  cy.visit(Cypress.env('VITE_FRONTEND_ADDRESS') as string);
  cy.wait(3000);
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
    cy.wait(3000);
  });
});

describe('login', () => {
  it('passes', () => {
    loginManage();
  });
});

describe('move to manage bookings page and report problem', () => {
  it('passes', () => {
    loginManage();
    cy.get('button').eq(0).should('exist').click();
    cy.wait(3000);
    cy.contains('a', 'Manage bookings').should('exist').click();
    cy.wait(3000);
    cy.contains('button', 'Report problem').eq(0).should('exist').click();
    cy.wait(3000);
    cy.get('input[name="reason"]').should('exist').type('Cannot turn on');
    cy.get('textarea[name="description"]')
      .should('exist')
      .type(
        'I already booked it through the app but it cannot be turned on. I already tried to turn it on but it still cannot be turned on.',
      );
    cy.contains('button', 'Submit report').should('exist').click();
    cy.wait(3000);
  });
});

describe('cancel booking', () => {
  it('passes', () => {
    loginManage();
    cy.get('button').eq(0).should('exist').click();
    cy.wait(3000);
    cy.contains('a', 'Manage bookings').should('exist').click();
    cy.wait(3000);
    cy.contains('button', 'Cancel').eq(0).should('exist').click();
    cy.wait(3000);
  });
});

describe('log out from the website', () => {
  it('passes', () => {
    cy.visit(Cypress.env('VITE_FRONTEND_ADDRESS') as string);
    cy.wait(3000);
    cy.get('button').eq(2).should('exist').trigger('mouseover');
    cy.contains('div', 'Logout').should('exist').click();
  });
});
