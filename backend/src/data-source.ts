import { DataSource } from 'typeorm';

const AppDataSource = new DataSource({
  type: 'postgres',
  host: 'localhost',
  port: (process.env.DB_PORT as unknown as number) || 5432,
  username: process.env.DB_USER || 'cnw-user',
  password: process.env.DB_PASSWORD || 'cnw-password',
  database: process.env.DB_NAME || 'cnw-db',
  synchronize: true,
  logging: true,
  entities: [],
  subscribers: [],
  migrations: [],
});

export default AppDataSource;
