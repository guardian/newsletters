import { App } from 'aws-cdk-lib';
import { Template } from 'aws-cdk-lib/assertions';
import { NewslettersSource } from './newsletters-source';

describe('The NewslettersSource stack', () => {
	it('matches the snapshot', () => {
		const app = new App();
		const stack = new NewslettersSource(app, 'NewslettersSource', {
			stack: 'newsletters',
			stage: 'TEST',
		});
		const template = Template.fromStack(stack);
		expect(template.toJSON()).toMatchSnapshot();
	});
});
