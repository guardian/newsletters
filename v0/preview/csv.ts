type ReducerResult = { output: string[]; cell: string; inQuotes: boolean };

const reduceByDelimiter =
	(delimiter: string) =>
	(prev: ReducerResult, el: string): ReducerResult => {
		// If current element is a quote, toggle inQuotes value and include in the cell
		if (el === '"') {
			return {
				...prev,
				cell: `${prev.cell}${el}`,
				inQuotes: !prev.inQuotes,
			};
		}
		// If current element IS the delimiter without being inside quotes,
		// finish the cell and add to the final output
		else if (el === delimiter && !prev.inQuotes) {
			return {
				...prev,
				cell: '',
				output: [...prev.output, prev.cell],
			};
		}
		// Otherwise, continue adding string elements to the current cell value
		else {
			return {
				...prev,
				cell: `${prev.cell}${el}`,
			};
		}
	};

const splitByDelimiter =
	(delimiter: string) =>
	(input: string): string[] => {
		const initReducerValue = { output: [], cell: '', inQuotes: false };
		const { output, cell } = [...input].reduce(
			reduceByDelimiter(delimiter),
			initReducerValue,
		);

		// Ensure the last cell processed in the reducer is added to the final output array
		return [...output, cell];
	};

const stringIsNotEmpty = (str: string): boolean => str.length > 0;

export const parseStringifiedCSV = (csvData: string): string[][] => {
	const rows = splitByDelimiter('\n')(csvData).filter(stringIsNotEmpty);
	const cellsInRows = rows.map(splitByDelimiter(','));
	return cellsInRows;
};
