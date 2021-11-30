import { ALBResult, ScheduledEvent } from 'aws-lambda';
import { buildNewsletters } from './jobs/jobs';

const handler = async (event?: ScheduledEvent): Promise<ALBResult> => {
	console.log(`Event ${JSON.stringify(event)}`);
	return await buildNewsletters();
};

const runLocal = async (): Promise<void> => {
	const result = await handler();
	console.log(`Job result ${JSON.stringify(result)}`);
};

if (process.env.STAGE === 'DEVELOPMENT') {
	runLocal();
}

exports.handler = handler;
