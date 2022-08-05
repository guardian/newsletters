import { capitalise } from './capitalise';

describe('capitalise', () => {
	const testCases = [
		{ input: 'hello', expected: 'Hello' },
		{ input: 'Hello', expected: 'Hello' },
		{ input: 'h', expected: 'H' },
		{ input: 'H', expected: 'H' },
		{ input: '', expected: '' },
		{ input: 'HELLO', expected: 'HELLO' },
	];

	it.each(testCases)(
		'returns "$expected" for string "$input"',
		({ input, expected }) => {
			expect(capitalise(input)).toEqual(expected);
		},
	);
});
