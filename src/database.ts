import { env } from './env';
import { knex as setupKnex, Knex } from 'knex';

export const config: Knex.Config = {
	client: 'pg',
	connection: {
		host: env.DATABASE_HOST,
		port: Number(env.DATABASE_PORT),
		user: env.DATABASE_USER,
		password: env.DATABASE_PASSWORD,
		database: env.DATABASE_DATABASE,
	},
	searchPath: [env.DATABASE_SCHEMA], // especifica em qual schema do banco procurar
	migrations: {
		extension: 'ts',
		directory: './db/migrations',
	},
};

export const knex = setupKnex(config);
