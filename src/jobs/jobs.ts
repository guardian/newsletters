import { ALBResult } from 'aws-lambda';
import { NEWSLETTERS_BUCKET_NAME } from '../constants';
import { s3upload } from '../lib/s3Upload';
import { getEmailNewsletters } from './newsletters';

const buildNewsletters = async (): Promise<ALBResult> => {
	try {
		console.log(`Getting newsletters from Google sheet`);
		const newsletters = await getEmailNewsletters();
		console.log(`Newsletters processed`);
		console.log(`Uploading to S3`);
		await s3upload({
			Bucket: NEWSLETTERS_BUCKET_NAME,
			Key: `${process.env.STAGE}/newsletters`,
			Body: JSON.stringify(newsletters),
		});
		console.log(`Uploaded to S3`);
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
