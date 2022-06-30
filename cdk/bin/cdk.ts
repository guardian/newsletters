import 'source-map-support/register';
import { App } from 'aws-cdk-lib';
import { NewslettersSource } from '../lib/newsletters-source';

const app = new App();
new NewslettersSource(app, 'NewslettersSource-CODE', {
	stack: 'newsletters',
	stage: 'CODE',
});
new NewslettersSource(app, 'NewslettersSource-PROD', {
	stack: 'newsletters',
	stage: 'PROD',
});
