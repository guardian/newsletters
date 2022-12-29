import type { GuStackProps } from '@guardian/cdk/lib/constructs/core';
import { GuStack } from '@guardian/cdk/lib/constructs/core';
import { GuScheduledLambda } from '@guardian/cdk/lib/patterns/scheduled-lambda';
import type { App } from 'aws-cdk-lib';
import { Duration } from 'aws-cdk-lib';
import { Schedule } from 'aws-cdk-lib/aws-events';
import { Effect, PolicyStatement } from 'aws-cdk-lib/aws-iam';
import { Runtime } from 'aws-cdk-lib/aws-lambda';
import { NEWSLETTERS_BUCKET_NAME } from '../../src/constants';

export class NewslettersSource extends GuStack {
	constructor(scope: App, id: string, props: GuStackProps) {
		super(scope, id, props);

		const { stage, stack } = props;

		const app = 'newsletters-source';

		const s3PutPolicy = new PolicyStatement({
			effect: Effect.ALLOW,
			actions: ['s3:PutObject', 's3:PutObjectAcl'],
			resources: [`arn:aws:s3:::${NEWSLETTERS_BUCKET_NAME}/*`],
		});

		new GuScheduledLambda(this, `${app}-lambda`, {
			app,
			runtime: Runtime.NODEJS_18_X,
			functionName: `${stack}-${app}-${stage}`,
			memorySize: 512,
			handler: 'cron.handler',
			fileName: `${app}.zip`,
			monitoringConfiguration: {
				/*
				The alarm will trigger if: >= 2 runs fail within 7 minutes
				*/
				toleratedErrorPercentage: 99,
				numberOfMinutesAboveThresholdBeforeAlarm: 7,
				datapointsToAlarm: 2,
				snsTopicName: `newsletters-alerts`,
			},
			rules: [{ schedule: Schedule.rate(Duration.minutes(5)) }],
			timeout: Duration.seconds(60),
			environment: {
				STAGE: stage,
			},
			initialPolicy: [s3PutPolicy],
		});
	}
}
