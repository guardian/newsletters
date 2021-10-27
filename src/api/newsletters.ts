import { Request, Response } from 'express';
import { Newsletter } from '../types/newsletters';

const getNewslettersFromSheet = (): Newsletter[] => {
	return [
		{
			pillar: 'FEATURES',
			email: 'The Upside',
			previews: 'https://www.theguardian.com/',
			topic: 'Series of same name',
			frequency: 'Weekly, Friday/ad usually, ~12-2pm',
			format: 'Article',
			contact: 'A contact',
			ophanAlert: undefined,
			signUpPage:
				'https://www.theguardian.com/world/2018/feb/12/the-upside-sign-up-for-our-weekly-email',
			notes: undefined,
			treat: 'world/series/the-upside',
		},
	];
};

const getNewsletters = (_: Request, res: Response): void => {
	res.status(200).json(getNewslettersFromSheet());
};

export { getNewsletters };
