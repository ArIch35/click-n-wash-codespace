# Click n' Wash

## Our Website

Feel free to check our website at <a href="https://clicknwash.pro/"> clicknwash.pro </a>.

## Table of Contents

- [About](#about)
- [Features](#features)
- [Getting Started](#started)
- [Tech Stakes](#tech-stakes)
- [Database Structures](#database-structure)
- [API Functions](#api-functions)
- [Pages](#pages)
- [Components](#components)
- [Authors](#authors)

## About Click n' Wash <a name="about"></a>

Click n' Wash is a student-led initiative aimed at simplifying the laundry experience for individuals residing in the student dormitory. Faced with the inconvenience of traditional laundry routines, the team developed a user-friendly website to transform and digitize the laundromat experience. Click n' Wash offers a seamless online platform where users can effortlessly book and monitor the availability of washing machines. This innovative solution eliminates the need for physical visits to the laundromat, providing a convenient and time-efficient alternative.

## Features <a name="features"></a>

- **Book a Washing machine**: a user can book a washing machine directly from the web, when the washing machine is available.
- **Check the availability of a Washing machine**: a user can check the availability for a washing machine directly from the website, without the need to go to the laundromat.
- **Report a Problem**: a user can report a problem to the technician or the owner of the laundromat,when the washing machine has an issue.
- **search the nearest Laundromat**: the user can search for the nearest Laundromat from their location.
- **Manage a Laundromat**: a vendor can manage their own laundromat.
- **Manage a Booking**: a user can manage or cancel their own booking.
- **Top up balance**: a user can top up their own balance for the payment method for the washing machine.
- **Transaction History**: user can see their own transaction history.
- **Become a Vendor**: user can become a vendor to open their own laundromat.
- **Refund System** : a vendor can refunds the transaction to the user, when there is an error with the machine.

## Getting Started <a name="started"></a>

### Prerequisites

To get Started with the application, make sure you have the following prerequisites installed:

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

2. Configure the enviroment variables( .env)
   Create and fill the enviroment variables in the `.env` and make sure the file located in the root of the back-end folder. You can use the [`env.example`](./.env.example) file as template.

3. Installation Methods:

#### Docker Compose

1. To provide a one-command solution for starting the Database/Backend. Simply run the following command in the terminal:

```
cd back-end/
docker compose up -d
```

#### Backend

1. Install Depedencies:

```bash
cd back-end/
npm i
```

2. Start the Database with no data:

```
npm run dev
```

#### Frontend

1. Install Depedencies:

```bash
cd front-end/
npm i
```

2. Start the front end

```bash
cd ..
cd front-end/
npm run dev
```

3. Open the website

```
http://localhost:5173/
```

## Database Structures <a name="database-structure"></a>

This website uses PostgreSQL as the database, with typeORM as the ODM. The database consists of 5 tables: `contract`, `laundromat`, `user`, `washingMachine`, and also the `baseEntity`.

### Contract

The `contract` table stores a contract entity. Each contract has the following fields:

- `id`: a column to stores the id of a contract.
- `createdAt`: a column to stores when the contract is created.
- `updatedAt`: a column to stores when the contract is updated.
- `deletedAt`: a column to stores when the contract is deleted.
- `name`: a column to stores the name of the contract.
- `startDate`: a column to stores when the contract starts.
- `endDate`: a column to stores when the contract ends.
- `status`: a column to stores the status of the contract.
- `price`: a column to stores the price of the contract.
- `user`: a column to stores the user information.
- `washingMachine`: a column to stores to which washing machine the contract belongs.

### Laundromat

The `laundromat` table stores a laundromat entity. Each laundromat has the following fields:

- `id`: a column to stores the id of a laundromat.
- `createdAt`: a column to stores when the laundromat is created.
- `updatedAt`: a column to stores when the laundromat is updated.
- `deletedAt`: a column to stores when the laundromat is deleted.
- `name`: a column to stores the name of the laundromat.
- `street`,`city`,`country`,`postalCode`: a column to stores the address of the laundromat.
- `price`: a column to stores the price of the laundromat.
- `owner`: a column to stores who is the owner of the laundromat.
- `washingMachines`: a column to stores how many washing machines belong to a laundromat.

### User

The `user` table stores a user entity. Each user has the following fields:

- `id`: a column to stores the id of a user.
- `createdAt`: a column to stores when the user is created.
- `updatedAt`: a column to stores when the user is updated.
- `deletedAt`: a column to stores when the user is deleted.
- `name`: a column to stores the name of the user.
- `email`: a column to stores the user email.
- `credit`: a column to stores the total credit a user has.
- `isAlsoVendor`: a column to tell if the user is a vendor or not.
- `laundromats`: a column to store the laundromats the user has.
- `contracts`: a column to store how many contracts a user has.

### Washing Machine

The `washingMachine` table stores a washingMachine entity. Each washingMachine has the following fields:

- `id`: a column to stores the id of a washingMachine.
- `createdAt`: a column to stores when the washingMachine is created.
- `updatedAt`: a column to stores when the washingMachine is updated.
- `deletedAt`: a column to stores when the washingMachine is deleted.
- `name`: a column to stores the name of the washingMachine.
- `brand`: a column to stores the brand of the washingMachine.
- `description`: a column to stores the description of a washingMachine.
- `contracts`: a column to stores the contracts that belong to the washingMachine.
- `laundromat`: a column to stores

### Base Entity

The `baseEntity` table stores a base entity. Each baseEntity has the following fields:

- `id`: a column to stores the id of the baseEntity.
- `createdAt`: a column to stores when the baseEntity is created.
- `updatedAt`: a column to stores when the baseEntity is updated.
- `deletedAt`: a column to stores when the baseEntity is deleted.
- `name`: a column to stores the name of the baseEntity.

## API Functions <a name="api-functions"></a>

In our Project we have a folders called API, to help us work with the data from backend. The API will be divided in some categories based on the Entity.

### Balance Transactions API

- `getBalanceTransactions`: This API will be use to retrieve a balance transactions.

### Contracts API

- `getContracts`: This API will retrieve the contracts from the server.
- `getContractsById`: This API will retrieve a contract by its ID from the server.
- `bookWashingMachine`: This API is used to books a washing machine for a specified start date.
- `bulkCancelContracts`: This API will cancel multiple contracts in bulk.
- `reportContract`: This API will sends a report for a contract with specified ID.
- cancelContract`: This API is for the contract cancellation.

### Laundromats API

- `getLaundromats`: This will retrieve list of laundromats from the server.
- `getLaundromatsById`: This will retrieve a laudromat with a specified ID.
- `getLaundromatTimeSlots`: It will retrieve the time slots for a specific laundromat.
- `createLaundromat`: API to creates a new laundromat.
- `updateLaundromat`: API to updates laundromat with the specified ID.
- `deleteLaundromat`: API to deletes a laundromat by its ID.
- `getLaundromatFilters`: It will retrieve the filter parameters for the laundromats.
- `getFilteredLaundromats`: Retrieves a list of filtered laundromats from the server.

### Users API

- `getUser`: Retrieves a user based on the ID.
- `createUser`: Creates a new user.
- `updateUser`: Updates a user's information.
- `markAsRead`: Marks the specified messages as read.
- `topUpBalance`: Top up the balance of a user.

### Washing Machines API

- `createWashingMachine`: Creates a washing machine.
- `getWashingMachineById`: Retreives a washing machine by its ID.
- `updateWashingMachines`: Updates a washing machine's informations.
- `deleteWashingMachines`: Delete a washing machine by its ID.

## Pages <a name="pages"></a>

### Home Page

In this page the user will see a map that shows the location of the laundromats and also a list of the available laundromats.

### Inbox Page

In this page the user and the vendor can see the list of messages that they got about their booking or about their laundromats.

### Manage Bookings Page

Here the user can see the list of their booking and the detail of the booking. the user can also cancel their booking or report a problem with the washing machine in this page.

### Balance Page

In this page the user can see their transaction list, their current balance and also top up their balance.

### Manage Laundromats

This page is only available to vendor. In this page the vendor can manage their laundromats informations and also add or delete a washing machine.

### Edit Laundromats

In this page the vendor can edit their laundromat information.

### Washing Machine Detail Page

In this page the vendor can see the detail of the washing machine and also change the information of the washing machine. Here the vendor can also see the list of contract and refund or cancel a contracts, when something's wrong happened to the washing machine.

## Components <a name="components"></a>

### Navbar

We have a navigation bar as a component to help the user to navigate through our website comfortably.

### Authentication Form

This component will pop up in the middle of the screen and show the login or authetication form to the user.

### Goggle Button

This component will help the user to login to our website with their own google account.

### Filter

This component will the the user to find the nearest or cheapest laundromat. In this coomponent the user can set a filter for the laundromats.

### Map

This component will show a openstreetmap API in the homepage to show the location of the laundromats.

### TimePicker

With the help of this component the user can choose which date they want and also which time for the booking of the washing machine.

### Washing Machine Picker

With this component the user can pick which machine they want to book.

### Add Funds Modal

This component is used in the balance page to help the user top up their balance.

### Add Washing Machine Modal

This component will show a form for the detail of the washing machine,that will be added to the laundromat.

##

## Tech Stakes <a name="tech-stakes"></a>

### Frontend

- [React](https://reactjs.org/) - JavaScript library for building user interfaces
- [React Router](https://reactrouter.com/) - React routing library
- [Vite](https://vitejs.dev/) - Build tool
- [Mantine](https://mantine.dev/) - React CSS Framework
- [Firebase](https://firebase.google.com/) - Google base login service
- [Openstreetmap](https://www.openstreetmap.org/#map=6/51.330/10.453) - World map API

### Backend

- [PostgreSQL](https://www.postgresql.org/) - Database
- [TypeORM](https://typeorm.io/) - ODM
- [Firebase](https://firebase.google.com/) - Authentification service
- [Mocha](https://mochajs.org/) - Testing framework
- [Chai](https://www.chaijs.com/) - Assertion library
- [tsc-watch](https://www.npmjs.com/package/tsc-watch) -TypeScript compiler
- [Axios](https://www.npmjs.com/package/axios) - JavaScript library
- [Express](https://expressjs.com/) - Web framework
- [Faker](https://www.npmjs.com/package/@faker-js/faker) - Dummy Data generator

### Other tools

- [Docker](https://www.docker.com/) - Containerization platform
- [Docker Compose](https://docs.docker.com/compose/) - Tool for defining and running multi-container Docker applications
- [ESLint](https://eslint.org/) - Linter
- [Prettier](https://prettier.io/) - Code formatter

## Authors <a name="authors"></a>

- [Vinston Salim, 772744]
- [Bernhard Ricardo Putranto, 772543]
- [Agustinus Nicander Hery, 772535]
- [Moses Antonio, 1112599]
- [Vinsky Strauss TanHanSen, 772529]
