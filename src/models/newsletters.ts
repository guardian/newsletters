type NewsletterIllustration = {
	circle?: string;
};

type EmailEmbed = {
	name: string;
	title: string;
	description: string;
	successHeadline: string;
	successDescription: string;
	hexCode: string;
	imageUrl?: string; //deprecated
};

export type EmailNewsletter = {
	name: string;
	id: string;
	theme: string;
	group: string;
	//teaser: string; //deprecated for description
	description: string;
	frequency: string;
	exactTargetListId: number;
	listId: number;
	listIdv1: number;
	brazeSubscribeAttributeName: string;
	brazeSubscribeEventNamePrefix: string;
	brazeNewsletterName: string;
	emailEmbed: EmailEmbed;
	signupPage?: string;
	exampleUrl?: string;
	triggerId?: number;
	illustration?: NewsletterIllustration;
};
