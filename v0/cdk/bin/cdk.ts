import 'source-map-support/register';
import { App } from 'aws-cdk-lib';
import { NewslettersSource } from '../lib/newsletters-source';

const app = new App();
new NewslettersSource(app, 'newsletters-source-CODE', {
	stack: 'newsletters',
	stage: 'CODE',
});
new NewslettersSource(app, 'newsletters-source-PROD', {
	stack: 'newsletters',
	stage: 'PROD',
});
