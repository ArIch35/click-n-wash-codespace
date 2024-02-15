import { fakerDE } from '@faker-js/faker';
import {
  createUserWithEmailAndPassword,
  deleteUser,
  signInWithEmailAndPassword,
} from 'firebase/auth';
import getDb, { connectToDb } from './db';
import Contract, { finalizeContract } from './entities/contract';
import Laundromat from './entities/laundromat';
import User from './entities/user';
import WashingMachine from './entities/washing-machine';
import firebaseAuth from './utils/firebase';
import './utils/load-env';
import { randomDate, randomNumber } from './utils/utils';

/**
 * Seed the database with random data
 */
const seed = async () => {
  // Check if DOCKER_SEED is set to true and DB is already seeded
  if (
    process.env.DOCKER_SEED === 'true' &&
    (await getDb().userRepository.findOne({ where: { email: 'seed@gmail.com' } }))
  ) {
    console.log('Database already seeded');
    return;
  }

  // Delete all data from the database
  console.log('Deleting all data from the database...');
  await getDb().dropDatabase();
  console.log('All data deleted from the database');

  console.log('Seeding database...');

  const startTime = Date.now();

  const batchSize = 1000;

  const userMin = 100;
  const userMax = 200;
  const laundromatMinPerUser = 1;
  const laundromatMaxPerUser = 3;
  const washingMachineMinPerLaundromat = 1;
  const washingMachineMaxPerLaundromat = 5;
  const contractMinPerPseudoUser = 100;
  const contractMaxPerPseudoUser = 200;

  const totalUser = randomNumber(userMin, userMax);
  const userMap = new Map<string, User>();
  for (let i = 0; i < totalUser; i++) {
    const user = getDb().userRepository.create({
      email: fakerDE.internet.email(),
      name: fakerDE.person.fullName(),
      balance: 1500,
    });
    userMap.set(user.email, user);

    if (i === 0) {
      try {
        // If able to sign in then delete the user
        const existingUserCredential = await signInWithEmailAndPassword(
          firebaseAuth,
          'seed@gmail.com',
          'seed@gmail.com',
        );

        await deleteUser(existingUserCredential.user);
      } catch (e) {
        // Do nothing
      }
      const firebaseUser = await createUserWithEmailAndPassword(
        firebaseAuth,
        'seed@gmail.com',
        'seed@gmail.com',
      );
      const user = getDb().userRepository.create({
        id: firebaseUser.user.uid,
        email: firebaseUser.user.email!,
        name: 'Seed User',
        balance: 1500,
      });
      userMap.set(user.email, user);
    }
  }

  const users = Array.from(userMap.values());

  console.log(`Seeding ${users.length} users...`);
  for (let i = 0; i < users.length; i += batchSize) {
    const batch = users.slice(i, i + batchSize);
    await getDb().userRepository.save(batch);
    console.log(`Seeding batch ${i / 1000 + 1} users completed`);
  }
  console.log(`Seeding ${users.length} users completed`);

  const laundromats: Laundromat[] = [];
  users.forEach((user) => {
    const totalLaundromat = randomNumber(laundromatMinPerUser, laundromatMaxPerUser);
    for (let i = 0; i < totalLaundromat; i++) {
      const laundromat = getDb().laundromatRepository.create({
        name: fakerDE.company.name(),
        street: fakerDE.location.streetAddress(),
        city: fakerDE.location.city(),
        country: fakerDE.location.country(),
        postalCode: fakerDE.location.zipCode(),
        price: Number(fakerDE.commerce.price({ min: 2, max: 5 })),
        owner: user,
        lat: fakerDE.location.latitude().toString(),
        lon: fakerDE.location.longitude().toString(),
      });
      laundromats.push(laundromat);
    }
  });

  console.log(`Seeding ${laundromats.length} laundromats...`);
  for (let i = 0; i < laundromats.length; i += batchSize) {
    const batch = laundromats.slice(i, i + batchSize);
    await getDb().laundromatRepository.save(batch);
    console.log(`Seeding batch ${i / 1000 + 1} laundromats completed`);
  }
  console.log(`Seeding ${laundromats.length} laundromats completed`);

  const washingMachines: WashingMachine[] = [];
  laundromats.forEach((laundromat) => {
    const totalWashingMachine = randomNumber(
      washingMachineMinPerLaundromat,
      washingMachineMaxPerLaundromat,
    );
    for (let i = 0; i < totalWashingMachine; i++) {
      const washingMachine = getDb().washingMachineRepository.create({
        name: fakerDE.company.name(),
        brand: fakerDE.company.name(),
        description: fakerDE.lorem.paragraph(),
        laundromat,
      });
      washingMachines.push(washingMachine);
    }
  });

  console.log(`Seeding ${washingMachines.length} washing machines...`);
  for (let i = 0; i < washingMachines.length; i += batchSize) {
    const batch = washingMachines.slice(i, i + batchSize);
    await getDb().washingMachineRepository.save(batch);
    console.log(`Seeding batch ${i / 1000 + 1} washing machines completed`);
  }
  console.log(`Seeding ${washingMachines.length} washing machines completed`);

  const threeMonthsAgo = new Date();
  const threeMonthsAhead = new Date();
  threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3);
  threeMonthsAhead.setMonth(threeMonthsAhead.getMonth() + 3);
  const TWO_HOURS = 2 * 60 * 60 * 1000;
  const contracts: Contract[] = [];
  const totalContracts =
    randomNumber(contractMinPerPseudoUser, contractMaxPerPseudoUser) * users.length;
  for (let i = 0; i < totalContracts; i++) {
    const user = users[randomNumber(0, users.length - 1)];
    const washingMachine = washingMachines[randomNumber(0, washingMachines.length - 1)];
    const startDate = randomDate(threeMonthsAgo, threeMonthsAhead);
    const endDate = new Date(startDate.getTime() + TWO_HOURS - 1);
    const contract = getDb().contractRepository.create({
      startDate,
      endDate,
      price: washingMachine.laundromat.price,
      user,
      washingMachine,
    });

    // Check for overlapping contracts
    if (
      contracts.some(
        (c) =>
          c.washingMachine.id === contract.washingMachine.id &&
          c.startDate < contract.endDate &&
          c.endDate > contract.startDate,
      )
    ) {
      continue;
    }

    contracts.push(contract);
  }

  console.log(`Seeding ${contracts.length} contracts...`);

  for (let i = 0; i < contracts.length; i += batchSize) {
    const batch = contracts.slice(i, i + batchSize);
    await finalizeContract(batch);
    console.log(`Seeding batch ${i / 1000 + 1} contracts completed`);
  }

  console.log(`Seeding ${contracts.length} contracts completed`);

  const endTime = Date.now();

  console.log(`Database seeded in ${(endTime - startTime) / 1000} seconds`);
};

connectToDb()
  .then(() =>
    seed().then(() => {
      console.log('Database seeded successfully');
      process.exit(0);
    }),
  )
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
