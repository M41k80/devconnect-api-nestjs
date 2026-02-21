import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { baseDatabaseConfig } from './database.config';

export const typeOrmConfig: TypeOrmModuleOptions = {
  ...baseDatabaseConfig,
  autoLoadEntities: true,
  synchronize: false,
};
