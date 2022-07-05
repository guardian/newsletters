import { buildNewsletters } from './jobs/jobs';

const handler = async (): Promise<void> => {
	console.log(`Running job`);
	await buildNewsletters();
	console.log(`Job completed`);
};

if (process.env.STAGE === 'DEVELOPMENT') {
	handler();
}

exports.handler = handler;
