import { strict as assert } from 'assert';
import { google, sheets_v4 as sheetsV4 } from 'googleapis';
import {
	GROUP_INDEX,
	PREVIEW_INDEX,
	SHEET_NAME,
	SHEET_RANGE,
	SHEET_VERSION,
	THEME_INDEX,
} from '../constants';
import { removeSitePrefix } from '../util';
import { getConfigItem } from '../util/config';

const readNewslettersSheet = async (): Promise<sheetsV4.Schema$RowData[]> => {
	try {
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
	} catch (err) {
		throw new Error(`Error retrieving google sheet: ${err}`);
	}
};

const isNonEmptyRow = ({ values }: sheetsV4.Schema$RowData): boolean =>
	!!values && !!values[1].formattedValue;

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

	const replaceEmptyValue =
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
		.filter(isNonEmptyRow)
		.map(
			({ values }) =>
				values
					?.map(formatPreviewLinks)
					.map(replaceEmptyValue(THEME_INDEX, currentTheme))
					.map(
						replaceEmptyValue(GROUP_INDEX, currentGroup),
					) as string[],
		);
};

export { prepareRows, readNewslettersSheet };
