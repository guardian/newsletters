import { readFileSync, writeFileSync } from 'fs';
import { NonEmptyString } from 'io-ts-types';
import {
	getEmailNewsletters,
	getEmailNewslettersIncludingCancelled,
	rowToNewsletter,
} from '../src/jobs/newsletters';
import {
	CancelledEmailNewsletter,
	CancelledEmailNewsletterType,
	EmailNewsletter,
	EmailNewsletterType,
	isNewsletterOrCancelledNewsletter,
} from '../src/models/newsletters';
import { parseStringifiedCSV } from './csv';

const USE_CODE_DATA = !!process.env.USE_CODE_DATA;
const INCLUDE_CANCELLED = !!process.env.INCLUDE_CANCELLED;
const PREVIEW_OUTPUT_FILE_PATH = './preview/preview.json';
const PREVIEW_DATA_SOURCE_FILE_PATH = './preview/sampleData.csv';

const logListOfResults = (
	newsletters: (EmailNewsletter | CancelledEmailNewsletter)[],
): void => {
	console.log('INDEX\tVALID\tCurrent\t CANCELLED\tNAME');
	newsletters.forEach((newsletter, index) => {
		console.log(
			index,
			'\t',
			isNewsletterOrCancelledNewsletter(newsletter),
			'\t',
			EmailNewsletterType.is(newsletter),
			'\t',
			CancelledEmailNewsletterType.is(newsletter),
			'\t\t',
			newsletter.name,
		);
	});
	console.log('\n');
};

const describeOutput = (
	newsletters: (EmailNewsletter | CancelledEmailNewsletter)[],
): void => {
	console.log(
		`OUTPUT${
			INCLUDE_CANCELLED ? '(all included)' : '(cancelled excluded)'
		} to ${PREVIEW_OUTPUT_FILE_PATH}:`,
		{
			total: newsletters.length,
			current: newsletters.filter(EmailNewsletterType.is).length,
			cancelled: newsletters.filter(CancelledEmailNewsletterType.is)
				.length,
		},
	);
};

const getEmailNewslettersFromLocalCsv = async (): Promise<
	(EmailNewsletter | CancelledEmailNewsletter)[]
> => {
	const csvData = await readFileSync(
		PREVIEW_DATA_SOURCE_FILE_PATH,
	).toString();
	const cellsInRows = parseStringifiedCSV(csvData);
	// rowToNewsletter casts its results as EmailNewsletter, but doesn't validate
	// the values - this is done later by EmailNewsletter.is
	const unvalidatedNewsletters = cellsInRows.slice(1).map(rowToNewsletter);

	// The spreadsheet only fills the 'group' and 'theme' column when they change
	// so the values need to be filled from the last non-empty value from a previous
	// row.
	// If the first row of data does not have these columns populated, the first
	// group will have empty values, so will fail the EmailNewsletter.is test
	let lastGroup = '';
	let lastTheme = '';

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

	console.log('\nSAMPLE CSV VERSION NUMBER CELL:', cellsInRows[0][0]);
	logListOfResults(unvalidatedNewsletters);

	const includeInData = INCLUDE_CANCELLED
		? isNewsletterOrCancelledNewsletter
		: EmailNewsletterType.is;

	return unvalidatedNewsletters.filter(includeInData);
};

const writePreviewJson = async (): Promise<void> => {
	console.log(
		`\nGenerating preview using ${
			USE_CODE_DATA ? 'data from CODE' : PREVIEW_DATA_SOURCE_FILE_PATH
		}`,
	);
	const data = USE_CODE_DATA
		? INCLUDE_CANCELLED
			? await getEmailNewslettersIncludingCancelled()
			: await getEmailNewsletters()
		: await getEmailNewslettersFromLocalCsv();

	describeOutput(data);
	await writeFileSync(PREVIEW_OUTPUT_FILE_PATH, JSON.stringify(data));
};

writePreviewJson();
