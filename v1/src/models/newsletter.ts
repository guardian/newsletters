import { z } from 'zod';

// TODO - go through and check fields optional / nullable

const BrazeVariablesSchema = {
	brazeSubscribeAttributeName: z.optional(z.string()),
	brazeSubscribeAttributeNameAlternate: z.optional(z.array(z.string())),
	brazeSubscribeEventNamePrefix: z.optional(z.string()),
	brazeNewsletterName: z.optional(z.string()),
	campaignName: z.optional(z.string()),
	campaignCode: z.optional(z.string()),
};

const EmailEmbedSchema = z.object({
	name: z.string(),
	title: z.string(),
	description: z.optional(z.string()),
	successHeadline: z.string(),
	successDescription: z.string(),
	hexCode: z.string(),
	imageUrl: z.optional(z.string()),
});

const BaseNewsletterSchema = z.object({
	name: z.string(),
	identityName: z.string(),
	cancelled: z.boolean(),
	restricted: z.boolean(),
	paused: z.boolean(),
	emailConfirmation: z.boolean(),
	theme: z.string(),
	group: z.string(),
	description: z.optional(z.string()),
	regionFocus: z.optional(z.string()),
	frequency: z.optional(z.string()),
	listId: z.number(),
	listIdV1: z.number(),
	emailEmbed: EmailEmbedSchema,
	signupPage: z.optional(z.string()),
	exampleUrl: z.optional(z.string()),
	illustration: z.optional(z.object({ circle: z.string() })),
});

const NewsletterSchema = BaseNewsletterSchema.extend(BrazeVariablesSchema);

const NewslettersResponse = z.array(NewsletterSchema);

export {
	NewslettersResponse,
	BaseNewsletterSchema,
	BrazeVariablesSchema,
	EmailEmbedSchema,
};
