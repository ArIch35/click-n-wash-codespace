import { fakerDE } from '@faker-js/faker';
import getDb, { connectToDb } from './db';
import Laundromat from './entities/laundromat';
import User from './entities/user';
import WashingMachine from './entities/washing-machine';
import './utils/load-env';
import { randomNumber } from './utils/utils';

/**
 * Seed the database with random data
 */
const seed = async () => {
  // Delete all data from the database
  console.log('Deleting all data from the database...');
  await getDb().dropDatabase();
  console.log('All data deleted from the database');

  console.log('Seeding database...');

  const batchSize = 1000;

  const totalUser = randomNumber(100, 200);
  const users: User[] = [];
  for (let i = 0; i < totalUser; i++) {
    const user = getDb().userRepository.create({
      email: fakerDE.internet.email(),
      name: fakerDE.person.fullName(),
    });
    users.push(user);
  }

  console.log(`Seeding ${totalUser} users...`);
  for (let i = 0; i < totalUser; i += batchSize) {
    const batch = users.slice(i, i + batchSize);
    await getDb().userRepository.save(batch);
    console.log(`Seeding ${batch.length} users completed`);
  }
  console.log(`Seeding ${totalUser} users completed`);

  const laundromats: Laundromat[] = [];
  users.forEach((user) => {
    const totalLaundromat = randomNumber(1, 3);
    for (let i = 0; i < totalLaundromat; i++) {
      const laundromat = getDb().laundromatRepository.create({
        name: fakerDE.company.name(),
        street: fakerDE.location.streetAddress(),
        city: fakerDE.location.city(),
        country: fakerDE.location.country(),
        postalCode: fakerDE.location.zipCode(),
        price: Number(fakerDE.commerce.price()),
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
    console.log(`Seeding ${batch.length} laundromats completed`);
  }
  console.log(`Seeding ${laundromats.length} laundromats completed`);

  const washingMachines: WashingMachine[] = [];
  laundromats.forEach((laundromat) => {
    const totalWashingMachine = randomNumber(1, 5);
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
    console.log(`Seeding ${batch.length} washing machines completed`);
  }
  console.log(`Seeding ${washingMachines.length} washing machines completed`);
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
