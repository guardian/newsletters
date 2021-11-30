import { ALBResult } from 'aws-lambda';
import { s3upload } from '../lib/s3Upload';
import { getEmailNewsletters } from './newsletters';

const BUCKET = 'aws-frontend-newsletters-source';

const buildNewsletters = async (): Promise<ALBResult> => {
	try {
		const newsletters = await getEmailNewsletters();
		await s3upload({
			Bucket: BUCKET,
			Key: `${process.env.STAGE}/newsletters.json`,
			Body: JSON.stringify(newsletters),
		});
		return {
			body: `${newsletters.length} newsletters successfully processed`,
			statusCode: 200,
		};
	} catch (e) {
		return {
			body: (e as Error).message,
			statusCode: 500,
		};
	}
};

export { buildNewsletters };
