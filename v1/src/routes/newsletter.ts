import { FastifyInstance, FastifyServerOptions } from 'fastify';
import { getAllNewsletters } from '../services/newsletter';

const newslettersRouter = async (
	fastify: FastifyInstance,
	opts: FastifyServerOptions,
) => {
	fastify.get('/', function (_, reply) {
		const newsletters = getAllNewsletters();
		reply.send(newsletters);
	});
};

export { newslettersRouter };
