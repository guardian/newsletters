import { parseStringifiedCSV } from './csv';

const inputWithNoQuotes = `
head_A,head_B
body_1_A,body_1_B

body_2_A,body_2_B`;
const expectedOutputWithNoQuotes: string[][] = [
	['head_A', 'head_B'],
	['body_1_A', 'body_1_B'],
	['body_2_A', 'body_2_B'],
];

const inputWithQuotes = `
"head_A, with comma",head_B
body_1_A,"body_1_B
with a line break, comma too"
body_2_A,body_2_B`;
const expectedOutputWithQuotes: string[][] = [
	['"head_A, with comma"', 'head_B'],
	['body_1_A', '"body_1_B\nwith a line break, comma too"'],
	['body_2_A', 'body_2_B'],
];

describe('parseStringifiedCSV', () => {
	it('splits rows by line breaks and cells by commas, ignoring empty lines', () => {
		expect(parseStringifiedCSV(inputWithNoQuotes)).toEqual(
			expectedOutputWithNoQuotes,
		);
	});

	it('ignores line breaks and commas inside quotes', () => {
		expect(parseStringifiedCSV(inputWithQuotes)).toEqual(
			expectedOutputWithQuotes,
		);
	});
});
