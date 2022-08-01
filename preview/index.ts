import { readFileSync, writeFileSync } from 'fs';
import { NonEmptyString } from 'io-ts-types';
import { getEmailNewsletters, rowToNewsletter } from '../src/jobs/newsletters';
import {
	BaseNewsletter,
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
			'\t\t',
			newsletter.name,
		);
	});
};

const getEmailNewslettersFromLocalCsv = async (
	config: {
		includeCancelled?: boolean;
	} = {},
): Promise<NewsletterResponse[]> => {
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
	const x = unvalidatedNewsletters.filter(Boolean);
	const y = x.reduce((prev, curr) => {
		return {
			...curr,
			group: curr?.group || prev?.group,
			theme: curr?.theme || prev?.theme,
		};
	});

	logFeedback(cellsInRows[0][0], unvalidatedNewslettersWithGroupAndTheme);

	const includeInData = config.includeCancelled
		? (_: unknown): boolean =>
				NewsletterResponseCodec.is(_) ||
				CancelledEmailNewsletterType.is(_)
		: NewsletterResponseCodec.is;

	return unvalidatedNewslettersWithGroupAndTheme.filter(includeInData);
};

const writePreviewJson = async (): Promise<void> => {
	console.log(
		`\nGenerating preview at ${PREVIEW_OUTPUT_FILE_PATH}, using ${
			USE_CODE_DATA ? 'data from CODE' : PREVIEW_DATA_SOURCE_FILE_PATH
		}`,
	);
	const data = USE_CODE_DATA
		? await getEmailNewsletters()
		: await getEmailNewslettersFromLocalCsv({ includeCancelled: false });
	const dataString = JSON.stringify(data);

	await writeFileSync(PREVIEW_OUTPUT_FILE_PATH, dataString);
};

writePreviewJson();
