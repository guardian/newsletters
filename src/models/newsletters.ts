import * as t from 'io-ts';
import { optional } from 'io-ts-extra';
import { NonEmptyString } from 'io-ts-types/lib/NonEmptyString';

const NewsletterIllustrationCodec = t.type({
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

const EmailEmbedCodec = t.type({
	...baseEmailEmbedModel,
});

// The parser sets the value of EmailEmbed.description using the
// "mailDescription" column or the  "description"  column if
// "mailDescription" is empty.
// "Description" is optional on a CancelledEmailNewsletter, but
// is required  as a NonEmptyString on an EmailNewsletter.
// Consequently, EmailEmbed.description will always be a
// NonEmptyString for a (non-cancelled) EmailNewsletter.
const EmailEmbedWithDescriptionCodec = t.type({
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
	emailEmbed: EmailEmbedCodec,
	restricted: t.boolean,
	paused: t.boolean,
	emailConfirmation: t.boolean,
	signupPage: optional(t.string),
	exampleUrl: optional(t.string),
	illustration: optional(NewsletterIllustrationCodec),
	campaignName: optional(t.string),
	campaignCode: optional(t.string),
};

export const BaseEmailNewsletterCodec = t.type({ ...baseNewsletterModel });
export type BaseEmailNewsletter = t.TypeOf<typeof BaseEmailNewsletterCodec>;

export const EmailNewsletterCodec = t.type({
	...baseNewsletterModel,
	cancelled: t.literal(false),
	description: NonEmptyString,
	frequency: NonEmptyString,
	brazeSubscribeAttributeName: NonEmptyString,
	brazeSubscribeAttributeNameAlternate: optional(t.array(t.string)),
	brazeSubscribeEventNamePrefix: NonEmptyString,
	brazeNewsletterName: NonEmptyString,
	emailEmbed: EmailEmbedWithDescriptionCodec,
});

export type EmailNewsletter = t.TypeOf<typeof EmailNewsletterCodec>;

export type NewsletterIllustration = t.TypeOf<
	typeof NewsletterIllustrationCodec
>;

export const NewsletterResponseCodec = t.type({
	...baseNewsletterModel,
	...EmailNewsletterCodec.props,
	cancelled: t.boolean,
});
export type NewsletterResponse = t.TypeOf<typeof NewsletterResponseCodec>;
