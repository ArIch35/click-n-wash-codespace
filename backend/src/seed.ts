import './utils/load-env';
import { fakerDE } from '@faker-js/faker';
import User from './entities/user';
import admin from './firebase-admin';
import getDb, { connectToDb } from './db';
import Laundromat from './entities/laundromat';
import WashingMachine from './entities/washing-machine';

/**
 * Seed the database with random data
 */
const seed = async () => {
  // Delete all data from the database
  console.log('Deleting all data from the database...');
  await getDb().dropDatabase();
  console.log('All data deleted from the database');

  console.log('Seeding database...');

  const totalUser = 5;
  const totalLaundromat = 3;
  const totalWashingMachine = 5;

  // Make 5 random users
  const users: User[] = [];
  for (let i = 0; i < totalUser; i++) {
    const firebaseUser = await admin.auth().createUser({
      email: fakerDE.internet.email(),
      password: fakerDE.internet.password(),
    });
    const user = getDb().userRepository.create({
      id: firebaseUser.uid,
      email: firebaseUser.email,
      name: fakerDE.person.fullName(),
    });
    users.push(user);
  }
  await getDb().userRepository.save(users);

  // Make 3 random laundromats
  const laundromats: Laundromat[] = [];
  for (let i = 0; i < totalLaundromat; i++) {
    const laundromat = getDb().laundromatRepository.create({
      name: fakerDE.company.name(),
      street: fakerDE.location.streetAddress(),
      city: fakerDE.location.city(),
      country: fakerDE.location.country(),
      postalCode: Number(fakerDE.location.zipCode()),
      price: Number(fakerDE.commerce.price()),
      owner: users[Math.floor(Math.random() * users.length)],
    });
    laundromats.push(laundromat);
  }
  await getDb().laundromatRepository.save(laundromats);

  // Make 5 random wash machines
  const washingMachines: WashingMachine[] = [];
  for (let i = 0; i < totalWashingMachine; i++) {
    const washingMachine = getDb().washingMachineRepository.create({
      name: fakerDE.company.name(),
      brand: fakerDE.company.name(),
      description: fakerDE.lorem.paragraph(),
      laundromat: laundromats[Math.floor(Math.random() * laundromats.length)],
    });
    washingMachines.push(washingMachine);
  }
  await getDb().washingMachineRepository.save(washingMachines);
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
