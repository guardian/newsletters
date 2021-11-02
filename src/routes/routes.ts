import { Request, Response, Router } from 'express';
import { getEmailNewsletters } from '../controllers/newsletters';

const router = Router();

router.get('/newsletters', async (_: Request, res: Response) => {
	try {
		res.status(200).json(await getEmailNewsletters());
	} catch (e) {
		console.log(e);
		res.status(500).json({ error: (e as Error).message });
	}
});

export { router };
