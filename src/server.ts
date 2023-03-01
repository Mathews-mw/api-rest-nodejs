import fastify from 'fastify';
import { knex } from './database';
import { env } from './env';

const app = fastify();

app.get('/', async () => {
	const test = await knex('users').select('*');

	return test;
});

app.listen({ port: Number(env.APP_PORT) }).then(() => {
	console.log('Server running! 🚀');
});
