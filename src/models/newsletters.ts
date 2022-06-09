import * as t from 'io-ts';
import { optional } from 'io-ts-extra';
import { NonEmptyString } from 'io-ts-types/lib/NonEmptyString';

const NewsletterIllustrationType = t.type({
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

const EmailEmbedType = t.type({
	...baseEmailEmbedModel,
});

// the value for EmailNewsletter.emailEmbed.description comes from the
// "mailDescription" cell or if that if empty, the "description" cell.
// As EmailNewsletter.description (from the "description" cell) is
// NonEmptyString for a CurrentEmailNewsletter, so should
// EmailNewsletter.emailEmbed.description.
const EmailEmbedWithDescriptionType = t.type({
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
	emailEmbed: EmailEmbedType,
	restricted: t.boolean,
	paused: t.boolean,
	emailConfirmation: t.boolean,
	signupPage: optional(t.string),
	exampleUrl: optional(t.string),
	illustration: optional(NewsletterIllustrationType),
	campaignName: optional(t.string),
	campaignCode: optional(t.string),
};

export const CancelledEmailNewsletterType = t.type({
	...baseNewsletterModel,
	cancelled: t.literal(true),
});
export const CurrentEmailNewsletterType = t.type({
	...baseNewsletterModel,
	cancelled: t.literal(false),
	description: NonEmptyString,
	frequency: NonEmptyString,
	brazeSubscribeAttributeName: NonEmptyString,
	brazeSubscribeAttributeNameAlternate: optional(t.array(t.string)),
	brazeSubscribeEventNamePrefix: NonEmptyString,
	brazeNewsletterName: NonEmptyString,
	emailEmbed: EmailEmbedWithDescriptionType,
});
export const EmailNewsletterType = t.type({
	...baseNewsletterModel,
});

export type CurrentEmailNewsletter = t.TypeOf<
	typeof CurrentEmailNewsletterType
>;
export type CancelledEmailNewsletter = t.TypeOf<
	typeof CancelledEmailNewsletterType
>;
export type EmailNewsletter = t.TypeOf<typeof EmailNewsletterType>;
export type NewsletterIllustration = t.TypeOf<
	typeof NewsletterIllustrationType
>;
