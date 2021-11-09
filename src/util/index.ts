const capitalise = (s: string): string =>
	s.charAt(0).toUpperCase() + s.slice(1);

const getBrazeAttributeName = (s: string): string =>
	`${s?.split('_').map(capitalise).join('')}_Subscribe_Email`;

const replaceLastSpaceByNonBreakingSpace = (s: string): string =>
	s.replace(/\s([^\s]*)$/, '\u00a0$1');

const removeSitePrefix = (s: string | undefined | null): string | undefined =>
	s?.replace('https://www.theguardian.com', '')?.trim();

export {
	capitalise,
	getBrazeAttributeName,
	removeSitePrefix,
	replaceLastSpaceByNonBreakingSpace,
};
