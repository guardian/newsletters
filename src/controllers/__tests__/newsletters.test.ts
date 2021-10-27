import * as mock from '../../lib/googleNewsletterSheets';
import { getGroupedEmailNewsletters } from '../newsletters';

describe('Newsletters service', () => {
	test('getGroupedEmailNewsletters', async () => {
		const mockResponse = [
			[
				'FEATURES',
				'The Upside',
				'The Upside',
				'/world/series/the-upside-weekly-report/latest/email',
				'Series of same name',
				'Weekly, Friday/ad usually, ~12-2pm',
				'Weekly',
				'Article',
				'A contact',
				'https://www.theguardian.com/world/2018/feb/12/the-upside-sign-up-for-our-weekly-email',
				'',
				'world/series/the-upside',
				'Features',
				'features',
				'1',
				'Journalism that uncovers real solutions: people, movements and innovations offering answers to our most pressing problems. We’ll round up the best articles for you every week.',
				'-1',
				'4205',
				'the-upside',
				'the_upside',
				'Editorial_TheUpside',
				'',
				'', //name
				'', //title
				"News doesn’t have to be bad. Get a weekly shot of optimism with real solutions to the world's most pressing problems.",
				"Thanks for subscribing. We'll send you The Upside every week",
				'',
				'',
				'',
			],
		];
		jest.spyOn(mock, 'readNewslettersSheet').mockImplementation(jest.fn());
		jest.spyOn(mock, 'prepareRows').mockImplementation(() => mockResponse);

		const want = {
			features: {
				displayName: 'Features',
				newsletters: [
					{
						id: 'the-upside',
						name: 'The Upside',
						brazeNewsletterName: 'Editorial_TheUpside',
						brazeSubscribeAttributeName:
							'TheUpside_Subscribe_Email',
						brazeSubscribeEventNamePrefix: 'the_upside',
						theme: 'features',
						description:
							'Journalism that uncovers real solutions: people, movements and innovations offering answers to our most pressing problems. We’ll round up the best articles for you every week.',
						frequency: 'Weekly',
						exactTargetListId: 4205,
						listIdv1: -1,
						listId: 4205,
						exampleUrl:
							'/world/series/the-upside-weekly-report/latest/email',
						emailEmbed: {
							name: 'The Upside',
							title: 'Sign up for The Upside',
							description:
								"News doesn’t have to be bad. Get a weekly shot of optimism with real solutions to the world's most pressing problems.",
							successHeadline:
								'Check your email inbox and confirm your subscription',
							successDescription:
								"Thanks for subscribing. We'll send you The Upside every week",
							hexCode: '#DCDCDC',
						},
					},
				],
			},
		};

		const got = await getGroupedEmailNewsletters();

		expect(mock.readNewslettersSheet).toBeCalled();
		expect(got).toEqual(want);
	});
});
