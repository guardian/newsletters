import { ALBResult, ScheduledEvent } from 'aws-lambda';
import { buildNewsletters } from './jobs/jobs';

const handler = async (event?: ScheduledEvent): Promise<ALBResult> => {
	console.log(`Event ${JSON.stringify(event)}`);
	const result = await buildNewsletters();
	console.log(`Job result ${JSON.stringify(result)}`);
	return result;
};

const runLocal = async (): Promise<void> => {
	await handler();
};

if (process.env.STAGE === 'DEVELOPMENT') {
	runLocal();
}

exports.handler = handler;
