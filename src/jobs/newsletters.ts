import { strict as assert } from 'assert';
import { isRight } from 'fp-ts/lib/Either';
import { GROUP_INDEX, PREVIEW_INDEX, THEME_INDEX } from '../constants';
import {
	prepareRows,
	readNewslettersSheet,
} from '../lib/googleNewsletterSheets';
import type {
	BaseEmailNewsletter,
	NewsletterIllustration,
	NewsletterResponse,
} from '../models/newsletters';
import {
	BaseEmailNewsletterCodec,
	NewsletterResponseCodec,
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
}: string[]): void | BaseEmailNewsletter => {
	const newsletter = {
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
	};
	const decodedNewsletter = BaseEmailNewsletterCodec.decode(newsletter);
	if (isRight(decodedNewsletter)) {
		return decodedNewsletter.right;
	} else {
		console.log(`Could not decode newsletter: ${newsletter}`);
	}
};

/**
 * Identity API requires some values on the newsletter object to be present.
 * Those values are not required in the spreadsheet for cancelled newsletters, so we apply default values here.
 * @param newsletter the newsletter to apply default values to
 * @returns a copy of `newsletter`
 */
function setDefaultValues(
	newsletter: BaseEmailNewsletter,
): BaseEmailNewsletter {
	const valueOrDefault = (value: string | null | undefined): string => {
		const defaultValue = 'cancelled';
		return value ?? defaultValue;
	};

	return {
		...newsletter,
		description: valueOrDefault(newsletter.description),
		frequency: valueOrDefault(newsletter.frequency),
		brazeSubscribeAttributeName: valueOrDefault(
			newsletter.brazeSubscribeAttributeName,
		),
		brazeNewsletterName: valueOrDefault(newsletter.brazeNewsletterName),
		brazeSubscribeEventNamePrefix: valueOrDefault(
			newsletter.brazeSubscribeEventNamePrefix,
		),
		emailEmbed: {
			...newsletter.emailEmbed,
			description: valueOrDefault(newsletter.emailEmbed.description),
		},
	};
}

const getEmailNewsletters = async (): Promise<NewsletterResponse[]> => {
	const rows = await readNewslettersSheet();
	const newsletterObjects = prepareRows(rows)
		.map((row) => rowToNewsletter(row))
		.filter(BaseEmailNewsletterCodec.is);

	const newsletters = newsletterObjects
		.map((newsletter) =>
			newsletter.cancelled ? setDefaultValues(newsletter) : newsletter,
		)
		.map(NewsletterResponseCodec.decode)
		.filter(isRight)
		.map((_) => _.right);

	assert.ok(!!newsletters.length, 'No newsletters processed!');
	return newsletters;
};

export { getEmailNewsletters, rowToNewsletter };
