import { fakerDE } from '@faker-js/faker';
import getDb from '../db';
import Laundromat from '../entities/laundromat';
import User from '../entities/user';

class DummyGenerator {
  private static instance: DummyGenerator;

  private constructor() {}

  public static getInstance() {
    if (!DummyGenerator.instance) {
      DummyGenerator.instance = new DummyGenerator();
    }

    return DummyGenerator.instance;
  }

  public generateRandomLaundromat(user: User) {
    return getDb().laundromatRepository.create({
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
  }

  public generateRandomWashingMachine(laundromat: Laundromat) {
    return getDb().washingMachineRepository.create({
      name: fakerDE.company.name(),
      brand: fakerDE.company.name(),
      description: fakerDE.lorem.paragraph(),
      laundromat,
    });
  }
}

export default DummyGenerator.getInstance();
