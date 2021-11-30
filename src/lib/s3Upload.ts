/* eslint-disable import/named -- AWS libs. */
import {
	PutObjectCommand,
	PutObjectCommandInput,
	PutObjectCommandOutput,
} from '@aws-sdk/client-s3';
import { s3Client } from './s3';

const s3upload = async ({
	Bucket,
	Key,
	Body,
}: PutObjectCommandInput): Promise<PutObjectCommandOutput> => {
	const results = await s3Client.send(
		new PutObjectCommand({ Bucket, Key, Body }),
	);
	console.log(
		`Successfully created ${Key} and uploaded it to ${Bucket}/${Key}`,
	);
	return results;
};

export { s3upload };
