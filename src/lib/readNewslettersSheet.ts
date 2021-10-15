import { google } from 'googleapis';

const readNewslettersSheet = async (): Promise<string[][]> => {
	const googleAuth = new google.auth.GoogleAuth({
		scopes: ['https://www.googleapis.com/auth/spreadsheets'],
	});
	const auth = await googleAuth.getClient();
	const googleSheetsInstance = google.sheets({ version: 'v4', auth });

	const spreadsheetId = process.env.SPREADSHEET_ID;
	const { data } = await googleSheetsInstance.spreadsheets.values.get({
		auth,
		spreadsheetId,
		range: 'Emails!A:L',
	});

	return data.values || [];
};

export { readNewslettersSheet };
