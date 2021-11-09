import {
	GROUP_INDEX,
	prepareRows,
	PREVIEW_INDEX,
	readNewslettersSheet,
	THEME_INDEX,
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

const getIllutration = (
	circle: string,
): NewsletterIllustration | null | undefined => {
	if (!circle) return;
	return { circle };
};

const rowToNewsletter = ({
	2: name,
	[PREVIEW_INDEX]: exampleUrl,
	6: frequency,
	9: signupPage,
	[THEME_INDEX]: theme,
	[GROUP_INDEX]: group,
	14: description,
	15: listIdV1,
	16: listId,
	17: identityName,
	18: brazeSubscribeEventNamePrefix,
	19: brazeNewsletterName,
	20: brazeSubscribeAttributeName,
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
		brazeNewsletterName,
		brazeSubscribeAttributeName:
			brazeSubscribeAttributeName ||
			getBrazeAttributeName(brazeSubscribeEventNamePrefix),
		brazeSubscribeEventNamePrefix,
		theme,
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
			successHeadline:
				'Check your email inbox and confirm your subscription',
			successDescription:
				mailSuccessDescription || 'Thanks for subscribing!',
			hexCode: mailHexCode || '#DCDCDC',
			imageUrl: mailImageUrl?.length > 0 ? mailImageUrl : undefined,
		},
		illustration: getIllutration(illustration),
	} as EmailNewsletter);

const getEmailNewsletters = async (): Promise<EmailNewsletter[]> => {
	const rows = await readNewslettersSheet();

	return prepareRows(rows)
		.map(rowToNewsletter)
		.filter(EmailNewsletterType.is);
};

export { getEmailNewsletters };
