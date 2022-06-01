import { readFileSync, writeFileSync } from 'fs';
import { getEmailNewsletters, rowToNewsletter } from '../src/jobs/newsletters';
import {
	EmailNewsletter,
	EmailNewsletterType,
} from '../src/models/newsletters';

const USE_LIVE_DATA = !!process.env.USE_LIVE_DATA;
console.log({ USE_LIVE_DATA });

const splitAtCommasNotInQuotes = (input: string): string[] => {
	let pos = 0;
	let inQuotes = false;
	const output = [];
	let part = '';

	for (pos = 0; pos < input.length; pos++) {
		const c = input[pos];
		if (c === '"') {
			inQuotes = !inQuotes;
		}
		if (c === ',' && !inQuotes) {
			output.push(part);
			part = '';
		} else {
			part += c;
		}
	}

	return output;
};

const getNewslettersFromLocalCsv = async (): Promise<EmailNewsletter[]> => {
	const csvData = await readFileSync('./preview/sampleData.csv').toString();
	const rows = csvData.split('\n').filter((_) => _.length > 0);
	const cellsInRows = rows.map(splitAtCommasNotInQuotes);
	let lastGroup = '';

	cellsInRows.forEach((row) => {
		if (row[0]) {
			lastGroup = row[0];
		}
		row[0] = lastGroup;
	});

	console.log('index\tmatch\tname');
	cellsInRows.forEach((row, index) => {
		console.log(index, '\t', EmailNewsletterType.is(row), '\t', row[1]);
	});

	return cellsInRows.map(rowToNewsletter);
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
