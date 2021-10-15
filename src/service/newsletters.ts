import { readNewslettersSheet } from '../lib/readNewslettersSheet';
import { Newsletter } from '../types/newsletters';

const getNewslettersFromSheet = async (): Promise<Newsletter[]> => {
	const rows = await readNewslettersSheet();
	const newsletters: Newsletter[] = rows.slice(1).map((r: string[]) => ({
		pillar: r[0],
		email: r[1],
		previews: r[2],
		topic: r[3],
		frequency: r[4],
		format: r[5],
		contact: r[6],
		ophanAlert: r[7],
		signUpPage: r[8],
		notes: r[9],
		treat: r[10],
	}));
	return newsletters;
};

export { getNewslettersFromSheet };
