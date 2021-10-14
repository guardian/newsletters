import { Request, Response } from 'express';
import { getNewslettersFromSheet } from '../service/newsletters';

const getNewsletters = (_: Request, res: Response): void => {
	res.status(200).json(getNewslettersFromSheet());
};

export { getNewsletters };
