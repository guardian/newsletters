import Fastify from 'fastify';
import { routes as newsletterRoutes } from './routes/newsletter';

const app = Fastify({
	logger: true,
});

app.register(newsletterRoutes, { prefix: '/v1/newsletters' });

app.listen({ port: 8080 }, (err, address) => {
	if (err) {
		console.error(err);
		process.exit(1);
	}
});
