import { getBrazeAttributeName } from './getBrazeAttributeName';

describe('getBrazeAttributeName', () => {
	const testCases = [
		{ input: 'a_newsletter', expected: 'ANewsletter_Subscribe_Email' },
		{ input: '_a_newsletter_', expected: 'ANewsletter_Subscribe_Email' },
		{ input: 'a', expected: 'A_Subscribe_Email' },
		{ input: 'a_', expected: 'A_Subscribe_Email' },
		{ input: '', expected: '' },
	];

	it.each(testCases)(
		'returns "$expected" for input of "$input"',
		({ input, expected }) => {
			expect(getBrazeAttributeName(input)).toEqual(expected);
		},
	);
});
