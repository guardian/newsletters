/** Capitalises the first character of a given string */
export const capitalise = (s: string): string =>
	s && s.charAt(0).toUpperCase() + s.slice(1);
