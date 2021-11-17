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

export const EmailNewsletterType = t.type({
	name: NonEmptyString,
	identityName: NonEmptyString,
	theme: NonEmptyString,
	group: NonEmptyString,
	description: NonEmptyString,
	frequency: NonEmptyString,
	listId: t.number,
	listIdV1: t.number,
	brazeSubscribeAttributeName: NonEmptyString,
	brazeSubscribeEventNamePrefix: NonEmptyString,
	brazeNewsletterName: NonEmptyString,
	emailEmbed: EmailEmbedType,
	signupPage: optional(t.string),
	exampleUrl: optional(t.string),
	illustration: optional(NewsletterIllustrationType),
});

export type EmailEmbed = t.TypeOf<typeof EmailEmbedType>;
export type EmailNewsletter = t.TypeOf<typeof EmailNewsletterType>;
export type NewsletterIllustration = t.TypeOf<
	typeof NewsletterIllustrationType
>;
