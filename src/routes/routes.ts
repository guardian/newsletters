import { Request, Response, Router } from 'express';
import { getGroupedEmailNewsletters } from '../controllers/newsletters';

const router = Router();

router.get('/newsletters/grouped', async (_: Request, res: Response) => {
	try {
		res.status(200).json(await getGroupedEmailNewsletters());
	} catch (e) {
		console.log(e);
		res.status(500).json({ error: (e as Error).message });
	}
});

export { router };
