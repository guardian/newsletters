import { strict as assert } from 'assert';
import { GROUP_INDEX, PREVIEW_INDEX, THEME_INDEX } from '../constants';
import {
	prepareRows,
	readNewslettersSheet,
} from '../lib/googleNewsletterSheets';
import {
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

const rowToNewsletter = ({
	[THEME_INDEX]: theme,
	[GROUP_INDEX]: group,
	3: name,
	4: frequency,
	5: identityName,
	6: brazeSubscribeEventNamePrefix,
	7: brazeNewsletterName,
	8: listIdV1,
	9: listId,
	10: campaignName,
	11: campaignCode,
	12: description,
	13: restricted,
	14: paused,
	15: emailConfirmation,
	[PREVIEW_INDEX]: exampleUrl,
	17: signupPage,
	24: brazeSubscribeAttributeName,
	25: mailName,
	26: mailTitle,
	27: mailDescription,
	28: mailSuccessDescription,
	29: mailHexCode,
	30: mailImageUrl,
	31: illustration,
	32: brazeSubscribeAttributeNameAlternate,
}: string[]): EmailNewsletter =>
	({
		identityName,
		name,
		restricted: !!restricted,
		paused: !!paused,
		emailConfirmation: !!emailConfirmation,
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
			successHeadline: emailConfirmation
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

const getEmailNewsletters = async (): Promise<EmailNewsletter[]> => {
	const rows = await readNewslettersSheet();
	const newsletters = prepareRows(rows)
		.map(rowToNewsletter)
		.filter(EmailNewsletterType.is);

	assert.ok(!!newsletters.length, 'No newsletters processed!');
	return newsletters;
};

export { getEmailNewsletters };
