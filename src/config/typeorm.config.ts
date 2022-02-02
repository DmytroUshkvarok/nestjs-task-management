import { TypeOrmModuleOptions } from '@nestjs/typeorm';

export const typeOrmConfig: TypeOrmModuleOptions = {
  type: 'postgres',
  host: 'localhost',
  database: 'task-management',
  username: 'postgres',
  password: 'postgres',
  port: 5432,
  autoLoadEntities: true,
  synchronize: true,
  entities: [__dirname + '/../**/*.entity{.ts,.js}'],
};
