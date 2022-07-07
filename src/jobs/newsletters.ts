import { strict as assert } from 'assert';
import { isRight } from 'fp-ts/lib/Either';
import { GROUP_INDEX, PREVIEW_INDEX, THEME_INDEX } from '../constants';
import {
	prepareRows,
	readNewslettersSheet,
} from '../lib/googleNewsletterSheets';
import {
	CancelledEmailNewsletter,
	CancelledEmailNewsletterType,
	EmailNewsletter,
	EmailNewsletterType,
	NewsletterIllustration,
} from '../models/newsletters';
import {
	getBrazeAttributeName,
	removeSitePrefix,
	replaceLastSpaceByNonBreakingSpace,
} from '../util';

const getIllustration = (
	circle: string,
): NewsletterIllustration | null | undefined => {
	if (!circle) return;
	return { circle };
};

const isTrue = (str: string | undefined): boolean =>
	str !== undefined ? str.toLowerCase() === 'true' : false;

const rowToNewsletter = ({
	[THEME_INDEX]: theme,
	// column 2 ("name") is not used.
	[GROUP_INDEX]: group,
	3: name, // column headding on the sheet is "Displayed Name"
	4: frequency,
	5: description,
	6: identityName,
	7: listIdV1,
	8: listId,
	9: brazeSubscribeEventNamePrefix,
	10: brazeNewsletterName,
	11: brazeSubscribeAttributeName,
	12: brazeSubscribeAttributeNameAlternate,
	13: campaignName,
	14: campaignCode,
	15: restricted,
	16: paused,
	17: cancelled,
	18: emailConfirmation,
	[PREVIEW_INDEX]: exampleUrl,
	20: signupPage,
	21: mailName,
	22: mailTitle,
	23: mailDescription,
	24: mailSuccessDescription,
	25: mailHexCode,
	26: mailImageUrl,
	27: illustration,
}: string[]): EmailNewsletter =>
	({
		identityName,
		name,
		cancelled: isTrue(cancelled),
		restricted: isTrue(restricted),
		paused: isTrue(paused),
		emailConfirmation: isTrue(emailConfirmation),
		brazeNewsletterName,
		brazeSubscribeAttributeName:
			brazeSubscribeAttributeName ||
			getBrazeAttributeName(brazeSubscribeEventNamePrefix),
		brazeSubscribeEventNamePrefix,
		theme: theme?.toLowerCase(),
		group,
		description: description,
		frequency,
		listIdV1: parseInt(listIdV1),
		listId: parseInt(listId),
		exampleUrl,
		signupPage: removeSitePrefix(signupPage),
		emailEmbed: {
			name: mailName || name,
			title: replaceLastSpaceByNonBreakingSpace(
				mailTitle || `Sign up for ${mailName || name}`,
			),
			description: mailDescription ? mailDescription : description,
			successHeadline: isTrue(emailConfirmation)
				? 'Check your email inbox and confirm your subscription'
				: 'Subscription confirmed',
			successDescription:
				mailSuccessDescription || 'Thanks for subscribing!',
			hexCode: mailHexCode || '#DCDCDC',
			imageUrl: mailImageUrl?.length > 0 ? mailImageUrl : undefined,
		},
		illustration: getIllustration(illustration),
		campaignName: campaignName?.includes('not in ophan')
			? undefined
			: campaignName,
		campaignCode,
		brazeSubscribeAttributeNameAlternate:
			brazeSubscribeAttributeNameAlternate
				?.split(',')
				?.map((a) => a.trim()),
	} as EmailNewsletter);

function setDefaultValues(
	newsletter: CancelledEmailNewsletter,
): CancelledEmailNewsletter {
	return {
		...newsletter,
		description: 'cancelled',
		frequency: newsletter.frequency ?? 'cancelled',
		brazeSubscribeAttributeName:
			newsletter.brazeSubscribeAttributeName ?? 'cancelled',
		brazeNewsletterName: newsletter.brazeNewsletterName ?? 'cancelled',
		brazeSubscribeEventNamePrefix:
			newsletter.brazeSubscribeEventNamePrefix ?? 'cancelled',
		emailEmbed: {
			...newsletter.emailEmbed,
			description: newsletter.emailEmbed.description ?? 'cancelled',
		},
	};
}

type AllNewsletters = EmailNewsletter | CancelledEmailNewsletter;

const getEmailNewsletters = async (): Promise<AllNewsletters[]> => {
	const rows = await readNewslettersSheet();
	const newsletterObjects = prepareRows(rows).map((row) =>
		rowToNewsletter(row),
	);

	const newsletters = newsletterObjects
		.map(EmailNewsletterType.decode)
		.filter(isRight)
		.map((_) => _.right);

	const cancelledNewsletters = newsletterObjects
		.map(CancelledEmailNewsletterType.decode)
		.filter(isRight)
		.map((_) => _.right)
		.map(setDefaultValues);

	assert.ok(!!newsletters.length, 'No newsletters processed!');
	return [...newsletters, ...cancelledNewsletters];
};

export { getEmailNewsletters, rowToNewsletter };
