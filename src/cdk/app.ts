import apigateway = require('@aws-cdk/aws-apigateway');
import lambda = require('@aws-cdk/aws-lambda');
import s3 = require('@aws-cdk/aws-s3');
import cdk = require('@aws-cdk/core');

export class LambdaService extends cdk.Stack {
	constructor(scope: cdk.Construct, id: string) {
		super(scope, id, { env: { region: 'eu-west-1' } });

		const stage = new cdk.CfnParameter(this, 'Stage', {
			type: 'String',
			default: 'CODE',
		});

		const bucket = 'aws-frontend-artifacts';
		const key = `frontend/${stage.valueAsString}/newsletters-api/newsletters-api.zip`;

		const handler = new lambda.Function(this, 'frontend-newsletters-api', {
			runtime: lambda.Runtime.NODEJS_14_X,
			code: lambda.Code.fromBucket(
				s3.Bucket.fromBucketName(this, 'lambda-code-bucket', bucket),
				key,
			),
			handler: 'server.handler',
			functionName: `frontend-newsletters-api-${stage.valueAsString}`,
		});

		// tslint:disable-next-line: no-unused-expression
		new apigateway.LambdaRestApi(this, 'newsletters-api', {
			restApiName: `newsletters-api-${stage.valueAsString}`,
			description: 'newsletters source',
			proxy: true,
			handler,
			deployOptions: {
				loggingLevel: apigateway.MethodLoggingLevel.INFO,
				dataTraceEnabled: true,
			},
		});
	}
}

const app = new cdk.App();
// tslint:disable-next-line: no-unused-expression
new LambdaService(app, 'newsletters-api');
