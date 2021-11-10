import { getConfigItem } from '../util/config';
import { strict as assert } from 'assert';
import { google, sheets_v4 as sheetsV4 } from 'googleapis';

const SHEET_VERSION = '0.1';
const SHEET_NAME = 'Emails';
const SHEET_RANGE = 'A:AD';
const PREVIEW_INDEX = 3;
const GROUP_INDEX = 12;
const THEME_INDEX = 13;

const readNewslettersSheet = async (): Promise<sheetsV4.Schema$RowData[]> => {
	const serviceAccountFromConfig = await getConfigItem('google.key');
	const serviceAccountJSON = JSON.parse(serviceAccountFromConfig);

	const auth = new google.auth.GoogleAuth({
		scopes: ['https://www.googleapis.com/auth/spreadsheets'],
	}).fromJSON(serviceAccountJSON);

	const googleSheetsInstance = google.sheets({ version: 'v4', auth });

	const spreadsheetId = await getConfigItem('spreadsheet.id');
	const { data } = await googleSheetsInstance.spreadsheets.get({
		spreadsheetId,
		includeGridData: true,
		ranges: [`${SHEET_NAME}!${SHEET_RANGE}`],
	});

	assert.ok(
		data &&
			data.sheets &&
			data.sheets[0] &&
			data.sheets[0].data &&
			data.sheets[0].data[0] &&
			data.sheets[0].data[0].rowData &&
			data.sheets[0].data[0].rowData,
		'No data retrieved from spreadsheet',
	);

	assert.equal(
		(
			data.sheets[0].data[0].rowData[0]
				?.values as sheetsV4.Schema$CellData[]
		)[0].formattedValue,
		SHEET_VERSION,
		`Sheet version expected: ${SHEET_VERSION}`,
	);

	return data.sheets[0].data[0].rowData;
};

const isDataRow = ({ values }: sheetsV4.Schema$RowData): boolean =>
	!!values && !!values[1].formattedValue;

const removeSitePrefix = (s: string | undefined | null): string | undefined =>
	s?.replace('https://www.theguardian.com', '')?.trim();

const formatPreviewLinks = (
	v: sheetsV4.Schema$CellData,
	i: number,
): string | undefined => {
	if (i === PREVIEW_INDEX) {
		if (v?.userEnteredFormat?.textFormat?.foregroundColor?.red === 1)
			return undefined;
		return removeSitePrefix(v.formattedValue);
	}
	return v.formattedValue as string;
};

const prepareRows = (rows: sheetsV4.Schema$RowData[]): string[][] => {
	const dataStartRow = 1;

	const format =
		(index: number, current: (string | undefined)[]) =>
		(value: string | undefined, i: number): string | undefined => {
			if (i === index) {
				if (value) current[0] = value;

				return current[0] as string;
			}
			return value;
		};
	const currentGroup: (string | undefined)[] = [];
	const currentTheme: (string | undefined)[] = [];

	return rows
		.slice(dataStartRow)
		.filter(isDataRow)
		.map(
			({ values }) =>
				values
					?.map(formatPreviewLinks)
					.map(format(THEME_INDEX, currentTheme))
					.map(format(GROUP_INDEX, currentGroup)) as string[],
		);
};

export {
	PREVIEW_INDEX,
	GROUP_INDEX,
	THEME_INDEX,
	prepareRows,
	readNewslettersSheet,
};
