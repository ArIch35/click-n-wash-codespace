import { DataSource } from 'typeorm';
import Contract from './entities/contract';
import Laundromat from './entities/laundromat';
import User from './entities/user';
import WashingMachine from './entities/washing-machine';
import loadEnv from './utils/load-env';

const AppDataSource = new DataSource({
  type: 'postgres',
  host: loadEnv().DB_HOST,
  port: loadEnv().DB_PORT,
  username: loadEnv().DB_USER,
  password: loadEnv().DB_PASSWORD,
  database: loadEnv().DB_NAME,
  synchronize: true,
  logging: true,
  entities: [User, Laundromat, WashingMachine, Contract],
  subscribers: [],
  migrations: [],
});

export default AppDataSource;
