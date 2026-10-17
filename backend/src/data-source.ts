import { DataSource } from 'typeorm';

export default new DataSource({
  type: 'postgres',
  host: 'localhost',
  port: 5433,
  username: 'postgres',
  password: 'postgres',
  database: 'todo',
  entities: ['src/**/*.entity.ts'],
  migrations: ['src/migrations/*.ts'],
});