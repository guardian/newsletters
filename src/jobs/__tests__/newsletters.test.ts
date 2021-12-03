import { FREQUENCY_INDEX } from '../../constants';
import * as mock from '../../lib/googleNewsletterSheets';
import { replaceLastSpaceByNonBreakingSpace } from '../../util';
import { getEmailNewsletters } from '../newsletters';

const EXPECTED_RESULTS = [
	{
		identityName: 'the-upside',
		name: 'The Upside',
		brazeNewsletterName: 'Editorial_TheUpside',
		brazeSubscribeAttributeName: 'TheUpside_Subscribe_Email',
		brazeSubscribeEventNamePrefix: 'the_upside',
		theme: 'features',
		group: 'Features',
		description:
			'Journalism that uncovers real solutions: people, movements and innovations offering answers to our most pressing problems. We’ll round up the best articles for you every week.',
		frequency: 'Weekly',
		listIdV1: -1,
		listId: 4205,
		exampleUrl: '/world/series/the-upside-weekly-report/latest/email',
		signupPage:
			'/world/2018/feb/12/the-upside-sign-up-for-our-weekly-email',
		restricted: false,
		emailEmbed: {
			name: 'Email name, if not present default to name',
			title: replaceLastSpaceByNonBreakingSpace(
				'Email title, if not present default Sign up for + title',
			),
			description:
				"News doesn’t have to be bad. Get a weekly shot of optimism with real solutions to the world's most pressing problems.",
			successHeadline:
				'Check your email inbox and confirm your subscription',
			successDescription:
				"Thanks for subscribing. We'll send you The Upside every week",
			hexCode: '#DCDCDC',
			imageUrl: 'imageUrl',
		},
		illustration: {
			circle: 'illustration',
		},
	},
];

const VALID_NEWSLETTER_ENTRY = [
	'FEATURES',
	'The Upside',
	'The Upside',
	'',
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
	'Journalism that uncovers real solutions: people, movements and innovations offering answers to our most pressing problems. We’ll round up the best articles for you every week.',
	'-1',
	'4205',
	'the-upside',
	'the_upside',
	'Editorial_TheUpside',
	'',
	'Email name, if not present default to name',
	'Email title, if not present default Sign up for + title',
	"News doesn’t have to be bad. Get a weekly shot of optimism with real solutions to the world's most pressing problems.",
	"Thanks for subscribing. We'll send you The Upside every week",
	'',
	'imageUrl',
	'illustration',
];
describe('Newsletters service', () => {
	beforeEach(() => {
		jest.resetAllMocks();
	});

	it('getEmailNewsletters', async () => {
		const mockResponse = [VALID_NEWSLETTER_ENTRY];
		jest.spyOn(mock, 'readNewslettersSheet').mockImplementation(jest.fn());
		jest.spyOn(mock, 'prepareRows').mockImplementation(() => mockResponse);

		const got = await getEmailNewsletters();

		expect(mock.readNewslettersSheet).toBeCalled();
		expect(got).toEqual(EXPECTED_RESULTS);
	});

	it('filters incomplete newsletter entry', async () => {
		const mockResponse = [
			VALID_NEWSLETTER_ENTRY,
			[...(VALID_NEWSLETTER_ENTRY.slice()[FREQUENCY_INDEX] = '')],
		];

		jest.spyOn(mock, 'readNewslettersSheet').mockImplementation(jest.fn());
		jest.spyOn(mock, 'prepareRows').mockImplementation(() => mockResponse);

		const got = await getEmailNewsletters();

		expect(mock.readNewslettersSheet).toBeCalled();
		expect(got).toEqual(EXPECTED_RESULTS);
	});
});
