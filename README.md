# Click n' Wash

## Our Website

Feel free to check our [website](https://clicknwash.pro/).

## Table of Contents

- [About](#about)
- [Features](#features)
- [Getting Started](#started)
- [Tech Stacks](#tech-stacks)
- [Database Structures](#database-structure)
- [API Routes](#api-routes)
- [Pages](#pages)
- [Components](#components)
- [Tests](#tests)
- [Authors](#authors)

## About Click n' Wash <a name="about"/>

Click n' Wash is a student-led initiative aimed at simplifying the laundry experience for individuals residing in the student dormitory. Faced with the inconvenience of traditional laundry routines, the team developed a user-friendly website to transform and digitize the laundromat experience. Click n' Wash offers a seamless online platform where users can effortlessly book and monitor the availability of washing machines. This innovative solution eliminates the need for physical visits to the laundromat, providing a convenient and time-efficient alternative.

## Features <a name="features"/>

- **Book a Washing machine**: a user can book a washing machine directly from the web when the washing machine is available.
- **Check the availability of a Washing machine**: a user can check the availability of a washing machine directly from the website, without the need to go to the laundromat.
- **Report a Problem**: a user can report a problem to the technician or the owner of the laundromat when the washing machine has an issue.
- **Search the nearest Laundromat**: the user can search for the nearest Laundromat from their location.
- **Manage a Laundromat**: a vendor can manage their laundromat.
- **Manage a Booking**: a user can manage or cancel their booking.
- **Topup balance**: a user can top up their balance for the payment method for the washing machine.
- **Transaction History**: user can see their transaction history.
- **Become a Vendor**: Users can become a vendor to open their laundromat.
- **Refund System**: a vendor can refund the transaction to the user when there is an error with the machine.

## Getting Started <a name="started"/>

### Prerequisites

To get started with the application, make sure you have the following prerequisites installed:

- [Node.js](https://nodejs.org/en/)
- [npm](https://www.npmjs.com/)
- [Docker](https://www.docker.com/)
- [Docker Compose](https://docs.docker.com/compose/)
- [PostgreSQL](https://www.postgresql.org/)

### Installation

1. Clone the repository

```bash
git clone https://code.fbi.h-da.de/click-n-wash/click-n-wash.git
```

2. Configure the environment variables( .env)
   Create and fill the environment variables in the `.env` and make sure the file is located in the root of the back-end folder. You can use the [`env.example`](./.env.example) file as a template. Firebase environment variables are required for the program to work. You can get the environment variables at the end of this readme.

3. Installation Methods:

#### Docker Compose

1. To provide a one-command solution for starting the application, we have provided a `docker-compose.yml` file. To start the application, run the following command in the root directory of the project:

```
docker-compose up -d
```

2. Go to http://localhost:8080/ to see the website or whatever port you have set in the `.env` file.

#### Manual Installation

1. Start the Database:

```bash
docker compose up -d click-n-wash-db
```

2. Start the Backend:

```bash
cd back-end/
npm i
npm run dev
```

3. Start the Frontend:

```bash
cd front-end/
npm i
npm run dev
```

4. Open the website:

```bash
http://localhost:5173/
```

### Seeding

To seed the database with dummy data, run the following command:

```bash
cd back-end/
npm run seed
```

## Database Structures <a name="database-structure"/>

This website uses PostgreSQL as the database, with typeORM as the ORM. The database consists of 6 tables: `BalanceTransaction`, `Contract`, `Laundromat`, `Message`, `User`, and `WashingMachine`.

### Base Entity

The `BaseEntity` is the entity, which all the other entities will inherit from. It has the following fields:

- `id`: a column to store the ID of an entity.
- `createdAt`: a column to store when the entity is created.
- `updatedAt`: a column to store when the entity is updated.
- `deletedAt`: a column to store when the entity is deleted.
- `name`: a column to store the name of an entity.

### Balance Transaction

The `balanceTransaction` table stores a balance transaction entity. Each balance transaction has the fields from the base entity and the following fields:

- `amount`: a column to store the amount of the transaction.
- `type`: a column to store the type of the transaction.
- `user`: a column to store the user information.

### Contract

The `contract` table stores a contract entity. Each contract has the fields from the base entity and the following fields:

- `startDate`: a column to store the start date of the contract.
- `endDate`: a column to store the end date of the contract.
- `status`: a column to store the status of the contract.
- `price`: a column to store the price of the contract.
- `user`: a column to store the user information.
- `washingMachine`: a column to store the washing machine information.

### Laundromat

The `laundromat` table stores a laundromat entity. Each laundromat has the fields from the base entity and the following fields:

- `street`: a column to store the street of the laundromat.
- `city`: a column to store the city of the laundromat.
- `country`: a column to store the country of the laundromat.
- `postalCode`: a column to store the postal code of the laundromat.
- `price`: a column to store the price of each washing machine in the laundromat.
- `lat`: a column to store the latitude of the laundromat.
- `lon`: a column to store the longitude of the laundromat.
- `owner`: a column to store the owner of the laundromat.
- `washingMachines`: a column to store the washing machines in the laundromat.

### Message

The `message` table stores a message entity. Each message has the fields from the base entity and the following fields:

- `content`: a column to store the content of the message.
- `read`: a column to store whether the message is read.
- `forVendor`: a column to store whether the message is for the vendor.
- `to`: a column to store the user information.

### User

The `user` table stores a user entity. Each user has the fields from the base entity and the following fields:

- `email`: a column to store the email of the user.
- `balance`: a column to store the balance of the user.
- `isAlsoVendor`: a column to store whether the user is also a vendor.
- `laundromats`: a column to store the laundromats owned by the user.
- `contracts`: a column to store the contracts of the user.
- `inbox`: a column to store the messages of the user.

### Washing Machine

The `washingMachine` table stores a washing machine entity. Each washing machine has the fields from the base entity and the following fields:

- `brand`: a column to store the brand of the washing machine.
- `description`: a column to store the description of the washing machine.
- `contracts`: a column to store the contracts of the washing machine.
- `laundromat`: a column to store the laundromat of the washing machine.

## API Routes <a name="api-routes"/>

The API routes are divided into 5 categories: `Users`, `Laundromats`, `Washing Machines`, `Contracts`, and `Balance Transactions`.

### Users API

- `GET /api/users/:idOrEmail`: This API will retrieve a user based on the ID or email.
- `POST /api/users`: This API will create a new user.
- `POST /api/users/restore`: This API will restore a user by its ID (automatically read from the token) when the user is deleted.
- `POST /api/users/topup`: This API will top up the balance of a user.
- `PUT /api/users/`: This API will update a user's information by its ID (automatically read from the token).
- `PUT /api/users/read`: This API will mark the specified messages as read.
- `DELETE /api/users/`: This API will delete a user by its ID (automatically read from the token).

### Laundromats API

- `GET /api/laundromats`: This API will retrieve a list of laundromats from the server.
- `GET /api/laundromats/filter-params`: This API will retrieve the filter parameters for the laundromats.
- `GET /api/laundromats/:id`: This API will retrieve a laundromat with a specified ID.
- `GET /api/laundromats/:id/time-slots`: This API will retrieve all booked time slots for a specific laundromat.
- `GET /api/laundromats/:id/analytics`: This API will retrieve the analytics for a specific laundromat.
- `POST /api/laundromats`: This API will create a new laundromat.
- `PUT /api/laundromats/:id`: This API will update the laundromat with the specified ID.
- `DELETE /api/laundromats/:id`: This API will delete a laundromat by its ID.

### Washing Machines API

- `GET /api/washingmachines/`: This API will retrieve a list of washing machines from the server.
- `GET /api/washingmachines/:id`: This API will retrieve a washing machine by its ID from the server.
- `POST /api/washingmachines`: This API will create a new washing machine.
- `PUT /api/washingmachines/:id`: This API will update the washing machine with the specified ID.
- `DELETE /api/washingmachines/:id`: This API will delete a washing machine by its ID.

### Contracts API

- `GET /api/contracts`: This API will retrieve the contracts that are owned by the user.
- `GET /api/contracts/:id`: This API will retrieve a contract that is owned by the user by its ID.
- `POST /api/contracts`: This API will book a washing machine for a specified start date and time.
- `POST /api/contracts/bulk-cancel`: This API will cancel multiple contracts in bulk (only for the owner).
- `POST /api/contracts/:id/report`: This API will send a report for a contract with the specified ID to its owner.
- `PUT /api/contracts/:id`: This API will cancel a contract by its ID by updating the status through body.

### Balance Transactions API

- `GET /api/balancetransactions`: This API will retrieve the balance transactions from the server.
- `GET /api/balancetransactions/:id`: This API will retrieve a balance transaction by its ID from the server.

## Pages <a name="pages"/>

### Home Page

On this page, the user will see a map that shows the location of the laundromats and also a list of the available laundromats.

### Inbox Page

On this page, the user and the vendor can see the list of messages that they got about their booking or their laundromats.

### Manage Bookings Page

Here the user can see the list of their booking and the details of the booking. the user can also cancel their booking or report a problem with the washing machine on this page.

### Balance Page

On this page, the user can see their transaction list, and their current balance and also top up their balance.

### Manage Laundromats

This page is only available to vendors. On this page, the vendor can manage their laundromat information and also add or delete a washing machine.

### Edit Laundromats

On this page, the vendor can edit their laundromat information.

### Washing Machine Detail Page

On this page, the vendor can see the details of the washing machine and also change the information about the washing machine. Here the vendor can also see the list of contracts and refund or cancel a contract when something's wrong happened to the washing machine.

## Components <a name="components"/>

### Navbar

We have a navigation bar as a component to help the user navigate through our website comfortably.

### Authentication Form

This component will pop up in the middle of the screen and show the login or authentication form to the user.

### Goggle Button

This component will help the user to log in to our website with their own Google account.

### Filter

This component will help the user to find the nearest or cheapest laundromat. In this component, the user can set a filter for the laundromats.

### Map

This component will show an OpenStreetMap API on the homepage to show the location of the laundromats.

### TimePicker

With the help of this component, the user can choose which date they want and also which time for the booking of the washing machine.

### Washing Machine Picker

With this component, the user can pick which machine they want to book.

### Add Funds Modal

This component is used on the balance page to help the user top up their balance.

### Add Washing Machine Modal

This component will show a form for the detail of the washing machine, that will be added to the laundromat.

## Tests <a name="tests"/>

We have 2 different tests in our project. the first one is to test our backend. and the second one is an end-to-end test for our frontend with the help of CyPress.

### Backend Test

1. Make sure that the database is already running before we do the backend test.

```bash
docker compose up -d click-n-wash-db
```

2. Install all the dependencies that are needed for the backend.

```bash
cd back-end/
npm i
```

3. start the test by running the following command.

```bash
cd back-end/
npm test
```

### Frontend Test

1. Make sure that the docker, the backend, and also the frontend are already running. before we do the frontend test. [with a seeded Database](#seeding).

```bash
cd back-end/
docker compose up -d
```

```bash
cd back-end/
npm run dev
```

2. Install all the dependencies that are needed for the frontend and run it.

```bash
cd front-end/
npm i
```

```bash
cd front-end/
npm run dev
```

3. Run the frontend with the help of Cypress. There are 2 choices of commands to run the test.

- First Option(with UI)

```bash
cd front-end/
npx cypress open
```

After that, a pop-up screen from Cypress will appear. Select 'E2E Testing' and choose your preferred browser for testing. Finally, run the test based on the sequence of the filename.

- Second Option(with npx cypress run --headless)(without UI)

```bash
cd front-end/
npm run test
```

With the second Option, the test will run in the terminal. If there are Errors, it will be saved in the file ./frontend/cypress/screenshots.

## Tech Stacks <a name="tech-stacks"/>

### Frontend

- [React](https://reactjs.org/) - JavaScript library for building user interfaces
- [React Router](https://reactrouter.com/) - React routing library
- [Vite](https://vitejs.dev/) - Build tool
- [Mantine](https://mantine.dev/) - React CSS Framework
- [Firebase](https://firebase.google.com/) - Google base login service
- [Openstreetmap](https://www.openstreetmap.org/#map=6/51.330/10.453) - World map API
- [Cypress](https://www.cypress.io/) - End To End Testing

### Backend

- [PostgreSQL](https://www.postgresql.org/) - Database
- [TypeORM](https://typeorm.io/) - ORM
- [Firebase](https://firebase.google.com/) - Authentication service
- [Mocha](https://mochajs.org/) - Testing framework
- [Chai](https://www.chaijs.com/) - Assertion library
- [tsc-watch](https://www.npmjs.com/package/tsc-watch) -TypeScript compiler
- [Express](https://expressjs.com/) - Web framework
- [Faker](https://www.npmjs.com/package/@faker-js/faker) - Dummy Data Generator

### Other tools

- [Docker](https://www.docker.com/) - Containerization platform
- [Docker Compose](https://docs.docker.com/compose/) - Tool for defining and running multi-container Docker applications
- [ESLint](https://eslint.org/) - Linter
- [Prettier](https://prettier.io/) - Code formatter

## Authors <a name="authors"/>

- [Vinston Salim, 772744]
- [Bernhard Ricardo Putranto, 772543]
- [Agustinus Nicander Hery, 772535]
- [Moses Antonio, 1112599]
- [Vinsky Strauss TanHanSen, 772529]
