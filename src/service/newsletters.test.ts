import { getNewslettersFromSheet } from './newsletters';

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
			ophanAlert: undefined,
			signUpPage:
				'https://www.theguardian.com/world/2018/feb/12/the-upside-sign-up-for-our-weekly-email',
			notes: undefined,
			treat: 'world/series/the-upside',
		},
	];
	const got = getNewslettersFromSheet();

	expect(got).toEqual(want);
});
