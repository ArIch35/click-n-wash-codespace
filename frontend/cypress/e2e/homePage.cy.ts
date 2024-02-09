// Login function
// Make a login function so that we can use it in the test
function loginHome() {
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

describe('register new user', () => {
  it('passes', () => {
    cy.visit(Cypress.env('VITE_FRONTEND_ADDRESS') as string);
    cy.wait(1000);
    cy.contains('button', 'Login').should('exist').click();
    cy.contains('button', 'Not a member yet? Register').should('exist').click();
    cy.get('input[name="name"]').eq(1).should('exist').type('newUser');
    cy.get('input[name="email"]').should('exist').type('newUser@mantine.de');
    cy.get('input[name="password"]').should('exist').type('ValidP4$$w0rd');
    cy.get('input[name="confirmPassword"]').should('exist').type('ValidP4$$w0rd');
    cy.get('input[name="terms"]').should('exist').check();
    cy.contains('button', 'Register').should('exist').click();
  });
});

describe('login', () => {
  it('passes', () => {
    loginHome();
  });
});

describe('click the hamburger button', () => {
  it('passes', () => {
    loginHome();
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

describe('log out from the website', () => {
  it('passes', () => {
    cy.visit(Cypress.env('VITE_FRONTEND_ADDRESS') as string);
    cy.wait(1000);
    cy.get('button').eq(2).should('exist').trigger('mouseover');
    cy.contains('div', 'Logout').should('exist').click();
  });
});
