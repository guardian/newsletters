import { strict as assert } from 'assert';
import { GROUP_INDEX, PREVIEW_INDEX, THEME_INDEX } from '../constants';
import {
	prepareRows,
	readNewslettersSheet,
} from '../lib/googleNewsletterSheets';
import {
	CurrentEmailNewsletter,
	CurrentEmailNewsletterType,
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
	3: cancelled,
	4: name, // column headding on the sheet is "Displayed Name"
	5: frequency,
	6: description,
	7: identityName,
	8: listIdV1,
	9: listId,
	10: brazeSubscribeEventNamePrefix,
	11: brazeNewsletterName,
	12: brazeSubscribeAttributeName,
	13: brazeSubscribeAttributeNameAlternate,
	14: campaignName,
	15: campaignCode,
	16: restricted,
	17: paused,
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
}: string[]): CurrentEmailNewsletter =>
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
	} as CurrentEmailNewsletter);

const getEmailNewsletters = async (): Promise<CurrentEmailNewsletter[]> => {
	const rows = await readNewslettersSheet();
	const newsletters = prepareRows(rows)
		.map(rowToNewsletter)
		.filter(CurrentEmailNewsletterType.is);

	assert.ok(!!newsletters.length, 'No newsletters processed!');
	return newsletters;
};

export { getEmailNewsletters, rowToNewsletter };
