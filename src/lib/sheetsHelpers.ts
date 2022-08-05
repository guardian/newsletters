import { strict as assert } from 'assert';
import { sheets_v4 as sheetsV4 } from 'googleapis';
import {
	GROUP_INDEX,
	PREVIEW_INDEX,
	SHEET_VERSION,
	THEME_INDEX,
} from '../constants';
import { removeSitePrefix } from '../util';

export const isNonEmptyRow = ({ values }: sheetsV4.Schema$RowData): boolean =>
	!!values && !!values[1].formattedValue;

export const validateSheetData = (
	data: sheetsV4.Schema$Spreadsheet,
): sheetsV4.Schema$RowData[] => {
	assert.ok(
		data &&
			data.sheets &&
			data.sheets[0] &&
			data.sheets[0].data &&
			data.sheets[0].data[0] &&
			data.sheets[0].data[0].rowData,
		'No data retrieved from spreadsheet',
	);
	const { rowData } = data.sheets[0].data[0];
	const firstRow = rowData[0]?.values;

	assert.equal(
		firstRow && firstRow[0].formattedValue,
		SHEET_VERSION,
		`Sheet version expected: ${SHEET_VERSION}`,
	);

	return rowData;
};

const formatPreviewLink = (
	cell: sheetsV4.Schema$CellData,
	i: number,
): string | undefined => {
	if (i === PREVIEW_INDEX) {
		const shouldNotUse =
			cell?.userEnteredFormat?.textFormat?.foregroundColor?.red === 1;

		return shouldNotUse ? undefined : removeSitePrefix(cell.formattedValue);
	}
	return cell.formattedValue as string;
};

// type ReducerOutput = {
// 	result: sheetsV4.Schema$RowData;
// 	lastGroup: string;
// 	lastTheme: string;
// };
// const addGroupAndThemeReducer = (
// 	accumulator: ReducerOutput,
// 	row: sheetsV4.Schema$CellData[],
// ): ReducerOutput => {
// 	const { lastGroup, lastTheme } = accumulator;
// 	const formattedRow = [...row];

// 	// If there are no values in the group or theme columns,
// 	// ensure these are populated with the value of the row above
// 	formattedRow[GROUP_INDEX] = row[GROUP_INDEX] || lastGroup;
// 	formattedRow[THEME_INDEX] = row[THEME_INDEX] || lastTheme;

// 	return {
// 		result: [...accumulator.result, formattedRow],
// 		lastGroup: formattedRow[GROUP_INDEX],
// 		lastTheme: formattedRow[THEME_INDEX],
// 	};
// };

export const prepareRows = (rows: sheetsV4.Schema$RowData[]): string[][] => {
	const dataStartRow = 1;

	const replaceEmptyValue =
		(columnIndex: number, current: (string | undefined)[]) =>
		(value: string | undefined, i: number): string | undefined => {
			if (i === columnIndex) {
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
					?.map(formatPreviewLink)
					.map(replaceEmptyValue(THEME_INDEX, currentTheme))
					.map(
						replaceEmptyValue(GROUP_INDEX, currentGroup),
					) as string[],
		);
};
