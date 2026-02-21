import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { baseDatabaseConfig } from '../config/database.config';

export default new DataSource({
  ...baseDatabaseConfig,
  entities: ['src/**/*.entity.ts'],
  migrations: ['src/database/migrations/*.ts'],
});
