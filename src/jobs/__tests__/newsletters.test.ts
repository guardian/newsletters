import * as mock from '../../lib/googleNewsletterSheets';
import { replaceLastSpaceByNonBreakingSpace } from '../../util';
import { getEmailNewsletters } from '../newsletters';

const FREQUENCY_INDEX = 5;
const CANCELLED_INDEX = 3;

const EXPECTED_RESULTS = [
	{
		identityName: 'the-upside',
		name: 'The Upside',
		cancelled: false,
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
			successHeadline: 'Subscription confirmed',
			successDescription:
				"Thanks for subscribing. We'll send you The Upside every week",
			hexCode: '#DCDCDC',
			imageUrl: 'imageUrl',
		},
		illustration: {
			circle: 'illustration',
		},
		campaignName: 'testCampaignName',
		campaignCode: 'testCampaignCode',
		brazeSubscribeAttributeNameAlternate: [
			'brazeSubscribeAttributeNameAlternate1',
			'brazeSubscribeAttributeNameAlternate2',
		],
		paused: true,
		emailConfirmation: false,
	},
];

const VALID_NEWSLETTER_ENTRY = [
	'FEATURES',
	'The Upside',
	'Features',
	'FALSE',
	'The Upside',
	'Weekly',
	'Journalism that uncovers real solutions: people, movements and innovations offering answers to our most pressing problems. We’ll round up the best articles for you every week.',
	'the-upside',
	'-1',
	'4205',
	'the_upside',
	'Editorial_TheUpside',
	'TheUpside_Subscribe_Email',
	'brazeSubscribeAttributeNameAlternate1, brazeSubscribeAttributeNameAlternate2',
	'testCampaignName',
	'testCampaignCode',
	'',
	'TRUE',
	'',
	'/world/series/the-upside-weekly-report/latest/email',
	'https://www.theguardian.com/world/2018/feb/12/the-upside-sign-up-for-our-weekly-email',
	'Email name, if not present default to name',
	'Email title, if not present default Sign up for + title',
	"News doesn’t have to be bad. Get a weekly shot of optimism with real solutions to the world's most pressing problems.",
	"Thanks for subscribing. We'll send you The Upside every week",
	'',
	'imageUrl',
	'illustration',
	'Series of same name',
	'Weekly, Friday/ad usually, ~12-2pm',
	'Article',
	'A contact',
	'',
	'world/series/the-upside',
];

const NEWSLETTER_ENTRY_WITH_MISSING_FREQUENCY = [
	...VALID_NEWSLETTER_ENTRY.slice(0, FREQUENCY_INDEX),
	'',
	...VALID_NEWSLETTER_ENTRY.slice(FREQUENCY_INDEX + 1),
];

const CANCELLED_NEWSLETTER_ENTRY = [
	...VALID_NEWSLETTER_ENTRY.slice(0, CANCELLED_INDEX),
	'TRUE',
	...VALID_NEWSLETTER_ENTRY.slice(CANCELLED_INDEX + 1),
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
			NEWSLETTER_ENTRY_WITH_MISSING_FREQUENCY,
		];

		jest.spyOn(mock, 'readNewslettersSheet').mockImplementation(jest.fn());
		jest.spyOn(mock, 'prepareRows').mockImplementation(() => mockResponse);

		const got = await getEmailNewsletters();

		expect(mock.readNewslettersSheet).toBeCalled();
		expect(got).toEqual(EXPECTED_RESULTS);
	});

	it('filters cancelled newsletter entry', async () => {
		const mockResponse = [
			VALID_NEWSLETTER_ENTRY,
			CANCELLED_NEWSLETTER_ENTRY,
		];

		jest.spyOn(mock, 'readNewslettersSheet').mockImplementation(jest.fn());
		jest.spyOn(mock, 'prepareRows').mockImplementation(() => mockResponse);

		const got = await getEmailNewsletters();
		expect(mock.readNewslettersSheet).toBeCalled();
		expect(got).toEqual(EXPECTED_RESULTS);
	});
});
