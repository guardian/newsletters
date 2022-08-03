import { strict as assert } from 'assert';
import { fold, isRight } from 'fp-ts/lib/Either';
import { pipe } from 'fp-ts/lib/function';
import * as t from 'io-ts';
import { NonEmptyString } from 'io-ts-types/lib/NonEmptyString';
import { GROUP_INDEX, PREVIEW_INDEX, THEME_INDEX } from '../constants';
import {
	prepareRows,
	readNewslettersSheet,
} from '../lib/googleNewsletterSheets';
import type {
	BaseNewsletter,
	NewsletterIllustration,
	NewsletterResponse,
} from '../models/newsletters';
import {
	BaseNewsletterValidator,
	NewsletterResponseValidator,
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

const getNewsletterFromRowData = (rowData: string[]): BaseNewsletter => {
	const {
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
	} = rowData;

	return {
		identityName: identityName as NonEmptyString,
		name: name as NonEmptyString,
		cancelled: isTrue(cancelled),
		restricted: isTrue(restricted),
		paused: isTrue(paused),
		emailConfirmation: isTrue(emailConfirmation),
		brazeNewsletterName,
		brazeSubscribeAttributeName:
			brazeSubscribeAttributeName ||
			getBrazeAttributeName(brazeSubscribeEventNamePrefix),
		brazeSubscribeEventNamePrefix,
		theme: theme?.toLowerCase() as NonEmptyString,
		group: group as NonEmptyString,
		description: description,
		frequency,
		listIdV1: parseInt(listIdV1),
		listId: parseInt(listId),
		exampleUrl,
		signupPage: removeSitePrefix(signupPage),
		emailEmbed: {
			name: (mailName || name) as NonEmptyString,
			title: replaceLastSpaceByNonBreakingSpace(
				mailTitle || `Sign up for ${mailName || name}`,
			) as NonEmptyString,
			description: mailDescription ? mailDescription : description,
			successHeadline: (isTrue(emailConfirmation)
				? 'Check your email inbox and confirm your subscription'
				: 'Subscription confirmed') as NonEmptyString,
			successDescription: (mailSuccessDescription ||
				'Thanks for subscribing!') as NonEmptyString,
			hexCode: (mailHexCode || '#DCDCDC') as NonEmptyString,
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
};

const validateNewsletter = (
	newsletter: BaseNewsletter,
): BaseNewsletter | undefined => {
	// Failure scenario: console log the errors and return undefined
	const onLeft = (errors: t.Errors): undefined => {
		console.log(`Could not decode newsletter: ${newsletter.name}`);
		console.log(
			errors.map((error: t.ValidationError) =>
				error.context.map(({ key }) => key).join('.'),
			),
		);
		return undefined;
	};

	// Success scenario: return validated newsletter
	const onRight = (newsletter: BaseNewsletter): BaseNewsletter => newsletter;

	return pipe(
		BaseNewsletterValidator.decode(newsletter),
		fold(onLeft, onRight),
	);
};

/**
 * Identity API requires some values on the newsletter object to be present.
 * Those values are not required in the spreadsheet for cancelled newsletters, so we apply default values here.
 * @param newsletter the newsletter to apply default values to
 * @returns a copy of `newsletter`
 */
function setDefaultValues(newsletter: BaseNewsletter): BaseNewsletter {
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
		.map((row) => getNewsletterFromRowData(row))
		.map((newsletter) => validateNewsletter(newsletter))
		.filter(BaseNewsletterValidator.is);

	const newsletters = newsletterObjects
		.map((newsletter) =>
			newsletter.cancelled ? setDefaultValues(newsletter) : newsletter,
		)
		.map(NewsletterResponseValidator.decode)
		.filter(isRight)
		.map((_) => _.right);

	assert.ok(!!newsletters.length, 'No newsletters processed!');
	return newsletters;
};

export { getEmailNewsletters, validateNewsletter, getNewsletterFromRowData };
