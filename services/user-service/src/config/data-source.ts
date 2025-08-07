import { DataSource } from 'typeorm';
import { config } from '@tuneton/shared';
import { User } from '../entities/User';

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: config.database.host,
  port: config.database.port,
  username: config.database.username,
  password: config.database.password,
  database: config.database.name,
  synchronize: config.nodeEnv !== 'production',
  logging: config.database.logging,
  entities: [User],
  migrations: ['src/migrations/*.ts'],
  subscribers: [],
  ssl: config.nodeEnv === 'production' ? { rejectUnauthorized: false } : false,
});

// For CLI usage
export default AppDataSource;
