import { EntityManager, Repository } from 'typeorm';
import AppDataSource from './data-source';
import Contract from './entities/contract';
import Laundromat from './entities/laundromat';
import User from './entities/user';
import WashingMachine from './entities/washing-machine';

interface Db {
  entityManager: EntityManager;
  dropDatabase: () => Promise<void>;
  userRepository: Repository<User>;
  laundromatRepository: Repository<Laundromat>;
  washingMachineRepository: Repository<WashingMachine>;
  contractRepository: Repository<Contract>;
  // Add other repositories here
}

let currentDb: Db | null = null;

/**
 * Connects to the database and initializes the repositories.
 */
export const connectToDb = async (test?: boolean): Promise<void> => {
  if (test) {
    process.env['DB_NAME'] = 'unit-test-db';
  }

  const orm = await AppDataSource.initialize();
  const em = orm.createEntityManager();
  currentDb = {
    entityManager: em,
    dropDatabase: async () => {
      await getDb().washingMachineRepository.delete({});
      await getDb().laundromatRepository.delete({});
      await getDb().userRepository.delete({});
    },
    userRepository: em.getRepository(User),
    laundromatRepository: em.getRepository(Laundromat),
    washingMachineRepository: em.getRepository(WashingMachine),
    contractRepository: em.getRepository(Contract),
    // Add other repositories here
  };
};

/**
 * Returns the database object.
 * @returns The database object.
 * @throws If the database is not initialized.
 */
const getDb = (): Db => {
  if (!currentDb) {
    throw new Error('DB not initialized');
  }
  return currentDb;
};

export default getDb;
