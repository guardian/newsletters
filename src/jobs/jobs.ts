import { ALBResult } from 'aws-lambda';
import { NEWSLETTERS_BUCKET_NAME } from '../constants';
import { s3upload } from '../lib/s3Upload';
import {
	getEmailNewsletters,
	getEmailNewslettersIncludingCancelled,
} from './newsletters';

const getAndUploadNewsletters = async (
	includeCancelled = false,
): Promise<number> => {
	const newsletters = includeCancelled
		? await getEmailNewslettersIncludingCancelled()
		: await getEmailNewsletters();

	// TO DO - check if this is all that is required to upload two different documents to the bucket
	const keySuffix = includeCancelled
		? 'newsletters-including-cancelled'
		: 'newsletters';

	await s3upload({
		Bucket: NEWSLETTERS_BUCKET_NAME,
		Key: `${process.env.STAGE}/${keySuffix}`,
		Body: JSON.stringify(newsletters),
	});

	return newsletters.length;
};

const buildNewsletters = async (): Promise<ALBResult> => {
	try {
		const liveProcessed = await getAndUploadNewsletters();
		const allProcessed = await getAndUploadNewsletters(true);

		return {
			body: `${liveProcessed} newsletters successfully processed, including cancelled newsletters ${allProcessed} succesfully processed`,
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
