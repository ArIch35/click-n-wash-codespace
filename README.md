# Click n' Wash

## Table of Contents

- [About](#about)
- [Features](#features)
- [Tech Stakes](tech-stakes)
- [Database Structures](database-structure)
- [Authors](#authors)

## About Click n' Wash <a name="about"></a>

Click n' Wash is a student-led initiative aimed at simplifying the laundry experience for individuals residing in the student dormitory. Faced with the inconvenience of traditional laundry routines, the team developed a user-friendly website to transform and digitize the laundromat experience. Click n' Wash offers a seamless online platform where users can effortlessly book and monitor the availability of washing machines. This innovative solution eliminates the need for physical visits to the laundromat, providing a convenient and time-efficient alternative.

## Features <a name="features"></a>

- **Book a Washing machine**: a user can book a washing machine direct from the web, when the washing machine is available.
- **Check the availability of a Washing machine**: a user can check the availability for a washing machine direct from the website, without the need to go to the laundromat.
- **Report a Problem**: a user can report a problem to the technician or the owner of the laundromat,when the washing machine has an issue.
- \*\*

## Database Structures <a name="database-structures"></a>

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

## Tech Stakes <a name="tech-stakes"></a>

### Frontend

- [React](https://reactjs.org/) - JavaScript library for building user interfaces
- [React Router](https://reactrouter.com/) - React routing library
- [Vite](https://vitejs.dev/) - Build tool
- [Mantine](https://mantine.dev/) - React CSS Framework
- [Firebase](https://firebase.google.com/) - Google base login service

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
