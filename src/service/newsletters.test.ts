import * as mock from '../lib/readNewslettersSheet';
import { getNewslettersFromSheet } from './newsletters';

describe('Newsletter get sheets', () => {
	const mockResponse = [
		[
			'pillar',
			'email',
			'preview',
			'topic',
			'frequency',
			'format',
			'contact',
			'ophan alert',
			'signup page',
			'notes',
			'treat',
		],
		[
			'FEATURES',
			'The Upside',
			'https://www.theguardian.com/',
			'Series of same name',
			'Weekly, Friday/ad usually, ~12-2pm',
			'Article',
			'A contact',
			'',
			'https://www.theguardian.com/world/2018/feb/12/the-upside-sign-up-for-our-weekly-email',
			'',
			'world/series/the-upside',
		],
	];
	jest.spyOn(mock, 'readNewslettersSheet').mockImplementation(() =>
		Promise.resolve(mockResponse),
	);

	test('Newsletter get sheets', () => {
		const want = [
			{
				pillar: 'FEATURES',
				email: 'The Upside',
				previews: 'https://www.theguardian.com/',
				topic: 'Series of same name',
				frequency: 'Weekly, Friday/ad usually, ~12-2pm',
				format: 'Article',
				contact: 'A contact',
				ophanAlert: '',
				signUpPage:
					'https://www.theguardian.com/world/2018/feb/12/the-upside-sign-up-for-our-weekly-email',
				notes: '',
				treat: 'world/series/the-upside',
			},
		];

		const got = getNewslettersFromSheet();

		expect(got).toEqual(want);
	});
});
