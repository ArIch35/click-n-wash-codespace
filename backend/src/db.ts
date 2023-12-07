import { Repository } from 'typeorm';
import AppDataSource from './data-source';
import Contract from './entities/contract';
import Laundromat from './entities/laundromat';
import User from './entities/user';
import WashingMachine from './entities/washing-machine';

interface Db {
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
export const connectToDb = async (): Promise<void> => {
  const orm = await AppDataSource.initialize();
  const em = orm.createEntityManager();
  currentDb = {
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
