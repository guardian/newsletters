const capitalise = (s: string): string =>
	s.charAt(0).toUpperCase() + s.slice(1);

const camelise = (s: string): string =>
	s
		.split(' ')
		.reduce(
			(p, v, i) => p + (i ? capitalise(v) : v.toLocaleLowerCase()),
			'',
		);

const getBrazeAttributeName = (s: string): string =>
	`${s?.split('_').map(capitalise).join('')}_Subscribe_Email`;

const replaceLastSpaceByNonBreakingSpace = (s: string): string =>
	s.replace(/\s([^\s]*)$/, '\u00a0$1');

export {
	camelise,
	capitalise,
	getBrazeAttributeName,
	replaceLastSpaceByNonBreakingSpace,
};
