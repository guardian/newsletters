import { readFileSync, writeFileSync } from 'fs';
import { NonEmptyString } from 'io-ts-types';
import { getEmailNewsletters, rowToNewsletter } from '../src/jobs/newsletters';
import {
	EmailNewsletter,
	EmailNewsletterType,
} from '../src/models/newsletters';
import { parseStringifiedCSV } from '../src/util/csv';

const USE_LIVE_DATA = !!process.env.USE_LIVE_DATA;
console.log({ USE_LIVE_DATA });

const getNewslettersFromLocalCsv = async (): Promise<EmailNewsletter[]> => {
	const csvData = await readFileSync('./preview/sampleData.csv').toString();
	const cellsInRows = parseStringifiedCSV(csvData);
	const versionNumber = cellsInRows[0][0];
	const newsletters = cellsInRows.slice(1).map(rowToNewsletter);

	let lastGroup = '_NO_GROUP_';
	let lastTheme = '_NO_Theme_';

	newsletters.forEach((newsletter) => {
		if (newsletter.group) {
			lastGroup = newsletter.group;
		} else {
			newsletter.group = lastGroup as NonEmptyString;
		}
		if (newsletter.theme) {
			lastTheme = newsletter.theme;
		} else {
			newsletter.theme = lastTheme as NonEmptyString;
		}
	});

	console.log({ versionNumber });
	console.log('INDEX\t MATCH\t NAME');
	newsletters.forEach((newsletter, index) => {
		console.log(
			index,
			'\t',
			EmailNewsletterType.is(newsletter),
			'\t',
			newsletter.name,
		);
	});

	return newsletters.filter(EmailNewsletterType.is);
};

const populateTemplate = async (): Promise<void> => {
	const data = USE_LIVE_DATA
		? await getEmailNewsletters()
		: await getNewslettersFromLocalCsv();
	const dataString = JSON.stringify(data);
	const template = await readFileSync(
		'./preview/_previewTemplate.html',
	).toString();

	const output = template.replace('<!-- DATA PLACEHOLDER -->', dataString);
	await writeFileSync('./preview/preview.html', output);
	await writeFileSync('./preview/preview.json', dataString);
};

populateTemplate();
