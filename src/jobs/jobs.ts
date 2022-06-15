import { ALBResult } from 'aws-lambda';
import { NEWSLETTERS_BUCKET_NAME } from '../constants';
import { s3upload } from '../lib/s3Upload';
import {
	getEmailNewsletters,
	getEmailNewslettersIncludingCancelled,
} from './newsletters';

const buildNewsletters = async (
	includeCancelled = false,
): Promise<ALBResult> => {
	try {
		const newsletters = includeCancelled
			? await getEmailNewslettersIncludingCancelled
			: await getEmailNewsletters();

		// TO DO - check if this is all that is required to upload a second document to the bucket
		const keySuffix = includeCancelled
			? 'newsletters-cancelled'
			: 'newsletters';

		await s3upload({
			Bucket: NEWSLETTERS_BUCKET_NAME,
			Key: `${process.env.STAGE}/${keySuffix}`,
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
