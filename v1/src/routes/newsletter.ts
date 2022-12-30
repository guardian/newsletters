import type { FastifyInstance, FastifyPluginOptions } from 'fastify';
import { getAllNewsletters } from '../services/newsletter';

async function routes(fastify: FastifyInstance, options: FastifyPluginOptions) {
	fastify.get('/', async () => {
		const newsletters = await getAllNewsletters();
		return newsletters;
	});
}

export { routes };
