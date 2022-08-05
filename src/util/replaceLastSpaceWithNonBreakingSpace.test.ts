import { replaceLastSpaceWithNonBreakingSpace } from './replaceLastSpaceWithNonBreakingSpace';

describe('replaceLastSpaceWithNonBreakingSpace', () => {
	const testCases = [
		{ input: '1 2 3', expected: '1 2\u00a03' },
		{ input: '', expected: '' },
		{ input: '1 2 3 ', expected: '1 2 3\u00a0' },
		{
			input: 'Sign up for newsletter',
			expected: 'Sign up for\u00a0newsletter',
		},
	];

	it.each(testCases)(
		'returns "$expected" for input of "$input"',
		({ input, expected }) => {
			expect(replaceLastSpaceWithNonBreakingSpace(input)).toEqual(
				expected,
			);
		},
	);
});
