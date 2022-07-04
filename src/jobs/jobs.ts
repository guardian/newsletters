import { NEWSLETTERS_BUCKET_NAME } from '../constants';
import { s3upload } from '../lib/s3Upload';
import { getEmailNewsletters } from './newsletters';

const buildNewsletters = async (): Promise<void> => {
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
		console.log(`${newsletters.length} newsletters successfully processed`);
	} catch (e) {
		console.error((e as Error).message);
		throw e;
	}
};

export { buildNewsletters };
