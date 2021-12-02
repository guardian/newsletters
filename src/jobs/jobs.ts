import { ALBResult } from 'aws-lambda';
import { NEWSLETTERS_BUCKET_NAME } from '../constants';
import { s3upload } from '../lib/s3Upload';
import { getEmailNewsletters } from './newsletters';

const buildNewsletters = async (): Promise<ALBResult> => {
	try {
		const newsletters = await getEmailNewsletters();
		await s3upload({
			Bucket: NEWSLETTERS_BUCKET_NAME,
			Key: `${process.env.STAGE}/newsletters`,
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
