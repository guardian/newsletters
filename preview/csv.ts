const splitWhenNotInQuotes = (input: string, delimiter: string): string[] => {
	let inQuotes = false;
	const output = [];
	let part = '';

	for (let pos = 0; pos < input.length; pos++) {
		const c = input[pos];
		if (c === '"') {
			inQuotes = !inQuotes;
		}
		if (c === delimiter && !inQuotes) {
			output.push(part);
			part = '';
		} else {
			part += c;
		}
	}
	output.push(part);
	return output;
};

export const parseStringifiedCSV = (csvData: string): string[][] => {
	const rows = splitWhenNotInQuotes(csvData, '\n').filter(
		(_) => _.length > 0,
	);
	const cellsInRows = rows.map((_) => splitWhenNotInQuotes(_, ','));
	return cellsInRows;
};
