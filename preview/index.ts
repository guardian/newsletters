import { readFileSync, writeFileSync } from 'fs';
import { NonEmptyString } from 'io-ts-types';
import { getEmailNewsletters, rowToNewsletter } from '../src/jobs/newsletters';
import {
	EmailNewsletter,
	EmailNewsletterType,
} from '../src/models/newsletters';
import { parseStringifiedCSV } from './csv';

const USE_LIVE_DATA = !!process.env.USE_LIVE_DATA;
const PREVIEW_OUTPUT_FILE_PATH = './preview/preview.json';
const PREVIEW_DATA_SOURCE_FILE_PATH = './preview/sampleData.csv';

const logFeedback = (
	versionNumber: string,
	newsletters: EmailNewsletter[],
): void => {
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
};

const getEmailNewslettersFromLocalCsv = async (): Promise<
	EmailNewsletter[]
> => {
	const csvData = await readFileSync(
		PREVIEW_DATA_SOURCE_FILE_PATH,
	).toString();
	const cellsInRows = parseStringifiedCSV(csvData);
	// rowToNewsletter casts its results as EmailNewsletter, but doesn't validate
	// the values - this is done later by EmailNewsletterType.is
	const unvalidatedNewsletters = cellsInRows.slice(1).map(rowToNewsletter);

	let lastGroup = '_NO_GROUP_';
	let lastTheme = '_NO_Theme_';

	unvalidatedNewsletters.forEach((newsletter) => {
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

	logFeedback(cellsInRows[0][0], unvalidatedNewsletters);
	return unvalidatedNewsletters.filter(EmailNewsletterType.is);
};

const writePreviewJson = async (): Promise<void> => {
	console.log(
		`\nGenerating preview at ${PREVIEW_OUTPUT_FILE_PATH}, using ${
			USE_LIVE_DATA ? 'live data' : PREVIEW_DATA_SOURCE_FILE_PATH
		}`,
	);
	const data = USE_LIVE_DATA
		? await getEmailNewsletters()
		: await getEmailNewslettersFromLocalCsv();
	const dataString = JSON.stringify(data);

	await writeFileSync(PREVIEW_OUTPUT_FILE_PATH, dataString);
};

writePreviewJson();
