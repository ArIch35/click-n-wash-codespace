import { DataSource, EntityManager, Repository } from 'typeorm';
import createDataSource from './data-source';
import BalanceTransaction from './entities/balance-transaction';
import Contract from './entities/contract';
import Laundromat from './entities/laundromat';
import Message from './entities/message';
import User from './entities/user';
import WashingMachine from './entities/washing-machine';

interface Db {
  dataSource: DataSource;
  entityManager: EntityManager;
  dropDatabase: () => Promise<void>;
  userRepository: Repository<User>;
  laundromatRepository: Repository<Laundromat>;
  washingMachineRepository: Repository<WashingMachine>;
  contractRepository: Repository<Contract>;
  balanceTransactionRepository: Repository<BalanceTransaction>;
  messageRepository: Repository<Message>;
  // Add other repositories here
}

let currentDb: Db | null = null;

/**
 * Connects to the database and initializes the repositories.
 * @param test Whether to use the test schema.
 */
export const connectToDb = async (test?: boolean): Promise<void> => {
  try {
    // Destroy the old data source if it exists
    await getDb().dataSource.destroy();
  } catch (error) {
    // Do nothing
  }

  const schema = test ? 'cnw-schema-test' : undefined;
  const dataSource = await createDataSource(schema);
  const em = dataSource.createEntityManager();
  currentDb = {
    dataSource: dataSource,
    entityManager: em,
    dropDatabase: async () => {
      await getDb().contractRepository.delete({});
      await getDb().balanceTransactionRepository.delete({});
      await getDb().messageRepository.delete({});
      await getDb().washingMachineRepository.delete({});
      await getDb().laundromatRepository.delete({});
      await getDb().userRepository.delete({});
    },
    userRepository: em.getRepository(User),
    laundromatRepository: em.getRepository(Laundromat),
    washingMachineRepository: em.getRepository(WashingMachine),
    contractRepository: em.getRepository(Contract),
    balanceTransactionRepository: em.getRepository(BalanceTransaction),
    messageRepository: em.getRepository(Message),
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
