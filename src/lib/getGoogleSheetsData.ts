import { google, sheets_v4 as sheetsV4 } from 'googleapis';
import { SHEET_NAME, SHEET_RANGE } from '../constants';
import { getConfigItem } from './config';
import { validateSheetData } from './sheetsHelpers';

const initGoogleSheets = async (): Promise<sheetsV4.Sheets> => {
	const serviceAccountFromConfig = await getConfigItem('google.key');
	const serviceAccountJSON = JSON.parse(serviceAccountFromConfig);

	const auth = new google.auth.GoogleAuth({
		scopes: ['https://www.googleapis.com/auth/spreadsheets'],
	}).fromJSON(serviceAccountJSON);

	return google.sheets({ version: 'v4', auth });
};

export const readNewslettersSheet = async (): Promise<
	sheetsV4.Schema$RowData[]
> => {
	try {
		const googleSheets = await initGoogleSheets();
		const spreadsheetId = await getConfigItem('spreadsheet.id');
		const { data } = await googleSheets.spreadsheets.get({
			spreadsheetId,
			includeGridData: true,
			ranges: [`${SHEET_NAME}!${SHEET_RANGE}`],
		});

		const validatedData = validateSheetData(data);

		return validatedData;
	} catch (err) {
		throw new Error(`Error retrieving google sheet: ${err}`);
	}
};
