import { DataSource } from 'typeorm';
import BalanceTransaction from './entities/balance-transaction';
import Contract from './entities/contract';
import Laundromat from './entities/laundromat';
import Message from './entities/message';
import User from './entities/user';
import WashingMachine from './entities/washing-machine';
import loadEnv from './utils/load-env';

/**
 * Creates a new data source with the given schema and initializes it.
 * @param schema The schema to use for the data source.
 * @returns The created data source.
 */
const createDataSource = (schema?: string) => {
  return new DataSource({
    type: 'postgres',
    host: loadEnv().DB_HOST,
    port: loadEnv().DB_PORT,
    username: loadEnv().DB_USER,
    password: loadEnv().DB_PASSWORD,
    database: loadEnv().DB_NAME,
    schema: schema || 'cnw-schema',
    synchronize: true,
    logging: false,
    entities: [User, Laundromat, WashingMachine, Contract, BalanceTransaction, Message],
    subscribers: [],
    migrations: [],
  }).initialize();
};

export default createDataSource;
