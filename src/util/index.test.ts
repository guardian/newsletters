import {
	camelise,
	capitalise,
	getBrazeAttributeName,
	replaceLastSpaceByNonBreakingSpace,
} from './';

describe('camelise', () => {
	it('camelise', () => {
		expect(camelise('News roundups')).toEqual('newsRoundups');
	});
});

describe('capitalise', () => {
	it('capitalise', () => {
		expect(capitalise('hello')).toEqual('Hello');
	});
});

describe('getBrazeAttributeName', () => {
	it('getBrazeAttributeName', () => {
		expect(getBrazeAttributeName('a_newsletter')).toEqual(
			'ANewsletter_Subscribe_Email',
		);
	});
});

describe('replaceLastSpaceByNonBreakingSpace', () => {
	it('replaceLastSpaceByNonBreakingSpace', () => {
		expect(replaceLastSpaceByNonBreakingSpace('1 2 3')).toEqual(
			'1 2\u00a03',
		);
	});
});
