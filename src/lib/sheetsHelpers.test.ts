import { sheets_v4 as sheetsV4 } from 'googleapis';
import { prepareRows } from './sheetsHelpers';

const mockMiddleValues = Array.from(Array(18), (_, index) => ({
	formattedValue: `${index}`,
})).slice(2);

const middleResults = Array.from(Array(18), (_, index) => `${index}`).slice(2);

const rows = [
	[],
	{
		values: [
			{ formattedValue: 'theme for rows 1 and 2' },

			...mockMiddleValues,
			{ formattedValue: '18' },
			{ formattedValue: '19' },
			{
				formattedValue:
					'value for preview column formatted red, which should be filtered out and replaced with undefined',
				userEnteredFormat: {
					textFormat: { foregroundColor: { red: 1 } },
				},
			},
		],
	} as sheetsV4.Schema$RowData,
	{
		values: [
			{ formattedValue: '' },
			...mockMiddleValues,
			{ formattedValue: '18' },
			{ formattedValue: '19' },
			{
				formattedValue:
					'value for preview column, not formatted in red, should not be filtered out',
				userEnteredFormat: {
					textFormat: { foregroundColor: { blue: 1 } },
				},
			},
		],
	} as sheetsV4.Schema$RowData,
	{
		values: [
			{ formattedValue: 'theme for rows 3 and 4' },
			...mockMiddleValues,
		],
	} as sheetsV4.Schema$RowData,
	{
		values: [{ formattedValue: '' }, ...mockMiddleValues],
	} as sheetsV4.Schema$RowData,
] as sheetsV4.Schema$RowData[];

describe('prepare rows', () => {
	const expectedResults = [
		['theme for rows 1 and 2', ...middleResults, '18', '19'],
		[
			'theme for rows 1 and 2',
			...middleResults,
			'18',
			'19',
			'value for preview column, not formatted in red, should not be filtered out',
		],
		['theme for rows 3 and 4', ...middleResults],
		['theme for rows 3 and 4', ...middleResults],
	];

	it('will replace values in the "preview" column with undefined if they are formatted red and replace empty values for the "theme" column with the last non-empty "theme" from a preview row', () => {
		const got = prepareRows(rows);
		expect(got).toEqual(expectedResults);
	});
});
