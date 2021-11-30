import { Rule, Schedule } from '@aws-cdk/aws-events';
import { LambdaFunction } from '@aws-cdk/aws-events-targets';
import { Policy, PolicyStatement } from '@aws-cdk/aws-iam';
import lambda = require('@aws-cdk/aws-lambda');
import { Bucket } from '@aws-cdk/aws-s3';
import { Aws } from '@aws-cdk/core';
import cdk = require('@aws-cdk/core');
import { NEWSLETTERS_BUCKET_NAME } from '../constants';

export class LambdaCronService extends cdk.Stack {
	constructor(scope: cdk.Construct, id: string) {
		super(scope, id, { env: { region: Aws.REGION } });

		const stage = new cdk.CfnParameter(this, 'Stage', {
			type: 'String',
			default: 'CODE',
		});

		const ssmPolicy = new PolicyStatement({
			actions: ['ssm:GetParametersByPath'],
			resources: [
				`arn:aws:ssm:${Aws.REGION}:${Aws.ACCOUNT_ID}:parameter/frontend/${stage.valueAsString}/newsletters-source/*`,
			],
		});

		const newslettersBucket = Bucket.fromBucketName(
			this,
			'newsletters-bucket',
			NEWSLETTERS_BUCKET_NAME,
		);

		const lambdaCodeBucket = 'aws-frontend-artifacts';
		const key = `frontend/${stage.valueAsString}/newsletters-source/newsletters-source.zip`;

		const handler = new lambda.Function(
			this,
			'frontend-newsletters-source',
			{
				functionName: `frontend-newsletters-source-${stage.valueAsString}`,
				runtime: lambda.Runtime.NODEJS_14_X,
				memorySize: 384,
				handler: 'cron.handler',
				code: lambda.Code.fromBucket(
					Bucket.fromBucketName(
						this,
						'lambda-code-bucket',
						lambdaCodeBucket,
					),
					key,
				),
				timeout: cdk.Duration.seconds(30),
				environment: {
					STAGE: stage.valueAsString,
				},
			},
		);

		newslettersBucket.grantWrite(handler);

		handler.role?.attachInlinePolicy(
			new Policy(this, 'required-parameters-policies', {
				statements: [ssmPolicy],
			}),
		);

		const rule = new Rule(this, 'Schedule Rule', {
			schedule: Schedule.cron({ minute: '5' }),
		});

		rule.addTarget(new LambdaFunction(handler));
	}
}

const app = new cdk.App();
// tslint:disable-next-line: no-unused-expression
new LambdaCronService(app, 'newsletters-source');
