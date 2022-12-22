import Fastify from 'fastify';
import { newslettersRouter } from './routes/newsletter';

const fastify = Fastify({
	logger: true,
});

fastify.register(newslettersRouter, { prefix: '/v1/newsletters' });

fastify.listen({ port: 3000 }, function (err, address) {
	if (err) {
		fastify.log.error(err);
		process.exit(1);
	}
});
