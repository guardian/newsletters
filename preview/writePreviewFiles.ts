import { readFileSync, writeFileSync } from 'fs';
import { getEmailNewsletters } from '../src/jobs/newsletters';

const populateTemplate = async (): Promise<void> => {
	const data = await getEmailNewsletters();
	const dataString = JSON.stringify(data);
	const template = await readFileSync(
		'./preview/_previewTemplate.html',
	).toString();

	const output = template.replace('<!-- DATA PLACEHOLDER -->', dataString);
	await writeFileSync('./preview/preview.html', output);
	await writeFileSync('./preview/preview.json', dataString);
};

populateTemplate();
