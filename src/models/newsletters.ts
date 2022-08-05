import * as t from 'io-ts';
import { optional } from 'io-ts-extra';
import { NonEmptyString } from 'io-ts-types/lib/NonEmptyString';

const NewsletterIllustrationValidator = t.type({
	circle: t.string,
});

const baseEmailEmbedModel = {
	name: NonEmptyString,
	title: NonEmptyString,
	description: optional(t.string),
	successHeadline: NonEmptyString,
	successDescription: NonEmptyString,
	hexCode: NonEmptyString,
	imageUrl: optional(t.string), //deprecated
};

const EmailEmbedValidator = t.type({
	...baseEmailEmbedModel,
});

/** The parser sets the value of EmailEmbed.description using the
 * "mailDescription" column or the  "description"  column if
 * "mailDescription" is empty.
 * "Description" is optional on a CancelledEmailNewsletter, but
 * is required  as a NonEmptyString on an EmailNewsletter.
 * Consequently, EmailEmbed.description will always be a
 * NonEmptyString for a (non-cancelled) EmailNewsletter.
 */
const EmailEmbedWithDescriptionValidator = t.type({
	...baseEmailEmbedModel,
	description: NonEmptyString,
});

const baseNewsletterModel = {
	name: NonEmptyString,
	identityName: NonEmptyString,
	cancelled: t.boolean,
	theme: NonEmptyString,
	group: NonEmptyString,
	description: optional(t.string),
	frequency: optional(t.string),
	listId: t.number,
	listIdV1: t.number,
	brazeSubscribeAttributeName: optional(t.string),
	brazeSubscribeAttributeNameAlternate: optional(t.array(t.string)),
	brazeSubscribeEventNamePrefix: optional(t.string),
	brazeNewsletterName: optional(t.string),
	emailEmbed: EmailEmbedValidator,
	restricted: t.boolean,
	paused: t.boolean,
	emailConfirmation: t.boolean,
	signupPage: optional(t.string),
	exampleUrl: optional(t.string),
	illustration: optional(NewsletterIllustrationValidator),
	campaignName: optional(t.string),
	campaignCode: optional(t.string),
};

export const BaseNewsletterValidator = t.type({ ...baseNewsletterModel });
export type BaseNewsletter = t.TypeOf<typeof BaseNewsletterValidator>;

export type NewsletterIllustration = t.TypeOf<
	typeof NewsletterIllustrationValidator
>;

// See corresponding scala definition in the frontend project
// https://github.com/guardian/frontend/blob/c70a2d5d1a1374e0de0e9cf408116c7b76569bd0/common/app/services/newsletters/model/NewsletterResponse.scala
export const NewsletterResponseValidator = t.type({
	...baseNewsletterModel,
	description: NonEmptyString,
	frequency: NonEmptyString,
	brazeSubscribeAttributeName: NonEmptyString,
	brazeSubscribeAttributeNameAlternate: optional(t.array(t.string)),
	brazeSubscribeEventNamePrefix: NonEmptyString,
	brazeNewsletterName: NonEmptyString,
	emailEmbed: EmailEmbedWithDescriptionValidator,
	cancelled: t.boolean,
});
export type NewsletterResponse = t.TypeOf<typeof NewsletterResponseValidator>;

export const CancelledEmailNewsletterType = t.type({
	...baseNewsletterModel,
	cancelled: t.literal(true),
});
