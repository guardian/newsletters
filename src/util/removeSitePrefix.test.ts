import { SITE_PREFIX } from '../constants';
import { removeSitePrefix } from './removeSitePrefix';

describe('removeSitePrefix', () => {
	const testCases = [
		{ input: `Hello`, expected: 'Hello' },
		{ input: `${SITE_PREFIX}Hello`, expected: 'Hello' },
		{ input: `Hello ${SITE_PREFIX} Hello`, expected: 'Hello  Hello' },
		{ input: ` ${SITE_PREFIX}Hello `, expected: 'Hello' },
		{ input: null, expected: undefined },
		{ input: undefined, expected: undefined },
		{ input: '', expected: '' },
	];

	it.each(testCases)(
		'returns $expected for input of $input',
		({ input, expected }) => {
			expect(removeSitePrefix(input)).toEqual(expected);
		},
	);
});
