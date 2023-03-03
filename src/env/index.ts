import { config } from 'dotenv';
import { z } from 'zod';

if (process.env.NODE_ENV === 'test') {
	config({ path: './.env.test', override: true });
} else {
	console.log('if production');
	config();
}

const envSchema = z.object({
	NODE_ENV: z.enum(['development', 'test', 'production']).default('production'),
	DATABASE_CLIENT: z.string(),
	DATABASE_HOST: z.string(),
	DATABASE_PORT: z.coerce.number(),
	DATABASE_USER: z.string(),
	DATABASE_PASSWORD: z.string(),
	DATABASE_DATABASE: z.string(),
	DATABASE_SCHEMA: z.string(),
	APP_PORT: z.coerce.number().default(3333),
});

const _env = envSchema.safeParse(process.env);

if (_env.success === false) {
	console.error('Invalid environment variables!: ', _env.error.format());

	throw new Error('Invalid environment variables');
}

export const env = _env.data;
