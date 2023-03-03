import { app } from './app';
import { env } from './env';

app.listen({ port: Number(env.APP_PORT) }).then(() => {
	console.log('Server running! 🚀');
});
