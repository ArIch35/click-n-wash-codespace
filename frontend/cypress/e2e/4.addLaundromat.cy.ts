// Login function
// Make a login function so that we can use it in the test
function loginAddLaundromat() {
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
    loginAddLaundromat();
  });
});

describe('click the hamburger button and activate vendor mode', () => {
  it('passes', () => {
    loginAddLaundromat();
    cy.get('button').eq(0).should('exist').click();
    cy.wait(1000);
    cy.contains('a', 'Activate Vendor Mode').should('exist').click();
    cy.wait(1000);
    cy.contains('div', 'Success').should('exist');
    cy.contains('div', 'Activated vendor mode successfully!').should('exist');
  });
});

describe('go to manage laundromat and create laundromat and also add washing machine', () => {
  it('passes', () => {
    loginAddLaundromat();
    cy.get('button').eq(0).should('exist').click();
    cy.wait(1000);
    cy.contains('a', 'Manage laundromats').should('exist').click();
    cy.wait(1000);
    cy.contains('button', '+ Add').should('exist').click();
    cy.wait(1000);
    cy.get('input[name="name"]').should('exist').type('Cypress Laundromat');
    cy.get('input[name="street"]').should('exist').type('Berliner Allee 6C');
    cy.get('input[name="city"]').should('exist').type('Darmstadt');
    cy.get('input[name="country"]').should('exist').type('Deutschland');
    cy.get('input[name="postalCode"]').should('exist').type('64295');
    cy.get('input[name="price"]').should('exist').type('5');
    cy.contains('button', 'Find Location').should('exist').click();
    cy.wait(1000);
    cy.get('input[name="name"]').should('exist').type('Cypress Washing Machine');
    cy.get('input[name="brand"]').should('exist').type('Miele');
    cy.get('input[name="description"]').should('exist').type('Max. 8 Kg');
    cy.contains('button', 'Next').should('exist').click();
    cy.wait(1000);
    cy.contains('button', 'Submit').should('exist').click();
    cy.wait(1000);
    cy.contains('div', 'Success').should('exist');
    cy.contains('div', 'Laundromat successfully created').should('exist');
    cy.wait(1000);
    cy.contains('td', 'Cypress Laundromat').should('exist');
    cy.contains('td', 'Berliner Allee 6C').should('exist');
    cy.contains('td', '64295 - Darmstadt').should('exist');
    cy.contains('td', '1').should('exist');
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
