import * as t from 'io-ts';
import { optional } from 'io-ts-extra';
import { NonEmptyString } from 'io-ts-types/lib/NonEmptyString';

const NewsletterIllustrationType = t.type({
	circle: t.string,
});

const EmailEmbedType = t.type({
	name: NonEmptyString,
	title: NonEmptyString,
	description: NonEmptyString,
	successHeadline: NonEmptyString,
	successDescription: NonEmptyString,
	hexCode: NonEmptyString,
	imageUrl: optional(t.string), //deprecated
});

const baseNewsletterModel = {
	name: NonEmptyString,
	identityName: NonEmptyString,
	cancelled: t.boolean,
	theme: NonEmptyString,
	group: NonEmptyString,
	description: NonEmptyString,
	frequency: NonEmptyString,
	listId: t.number,
	listIdV1: t.number,
	brazeSubscribeAttributeName: NonEmptyString,
	brazeSubscribeAttributeNameAlternate: optional(t.array(t.string)),
	brazeSubscribeEventNamePrefix: NonEmptyString,
	brazeNewsletterName: NonEmptyString,
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
});
export const EmailNewsletterType = t.type({
	...baseNewsletterModel,
});

export type EmailEmbed = t.TypeOf<typeof EmailEmbedType>;
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
