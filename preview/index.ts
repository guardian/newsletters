import { readFileSync, writeFileSync } from 'fs';
import {
	getEmailNewsletters,
	getNewsletterFromRowData,
	validateNewsletter,
} from '../src/jobs/newsletters';
import {
	CancelledEmailNewsletterType,
	NewsletterResponseCodec,
} from '../src/models/newsletters';
import type { NewsletterResponse } from '../src/models/newsletters';
import { parseStringifiedCSV } from './csv';

const USE_CODE_DATA = !!process.env.USE_CODE_DATA;
const PREVIEW_OUTPUT_FILE_PATH = './preview/preview.json';
const PREVIEW_DATA_SOURCE_FILE_PATH = './preview/sampleData.csv';

const logFeedback = (
	versionNumber: string,
	newsletters: NewsletterResponse[],
): void => {
	console.log({ versionNumber });
	console.log('INDEX\tVALID\tCANCELLED\tNAME');
	newsletters.forEach((newsletter, index) => {
		console.log(
			index,
			'\t',
			NewsletterResponseCodec.is(newsletter),
			'\t',
			CancelledEmailNewsletterType.is(newsletter),
			'\t',
			newsletter.name,
		);
	});
};

const getEmailNewslettersFromLocalCsv = async (): Promise<
	NewsletterResponse[]
> => {
	const csvData = readFileSync(PREVIEW_DATA_SOURCE_FILE_PATH).toString();
	const cellsInRows = parseStringifiedCSV(csvData);

	// rowToNewsletter casts its results as EmailNewsletter, but doesn't validate
	// the values - this is done later by the `is` function
	const newsletters = cellsInRows.slice(1).map(getNewsletterFromRowData);

	// The spreadsheet only fills the 'group' and 'theme' column when they change
	// so the values need to be filled from the last non-empty value from a previous
	// row.
	// If the first row of data does not have these columns populated, the first
	// group will have empty values, so will fail the `is` test

	// TODO: Remove the any types
	const addGroupAndThemeReducer = (result: any, curr: any): any => {
		const prev = result[result.length - 1];
		return [
			...result,
			{
				...curr,
				group: curr?.group || prev?.group,
				theme: curr?.theme || prev?.theme,
			},
		];
	};

	const validatedNewsletters = newsletters
		.reduce(addGroupAndThemeReducer, [])
		.filter(Boolean)
		.map(validateNewsletter)
		.filter(NewsletterResponseCodec.is);

	logFeedback(cellsInRows[0][0], validatedNewsletters);

	return validatedNewsletters;
};

const writePreviewJson = async (): Promise<void> => {
	console.log(
		`\nGenerating preview at ${PREVIEW_OUTPUT_FILE_PATH}, using ${
			USE_CODE_DATA ? 'data from CODE' : PREVIEW_DATA_SOURCE_FILE_PATH
		}`,
	);
	const data = USE_CODE_DATA
		? await getEmailNewsletters()
		: await getEmailNewslettersFromLocalCsv();
	const dataString = JSON.stringify(data);

	writeFileSync(PREVIEW_OUTPUT_FILE_PATH, dataString);
};

writePreviewJson();
