export const replaceLastSpaceWithNonBreakingSpace = (s: string): string =>
	s?.replace(/\s([^\s]*)$/, '\u00a0$1');
