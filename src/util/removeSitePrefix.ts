import { SITE_PREFIX } from '../constants';

export const removeSitePrefix = (
	s: string | null | undefined,
): string | undefined => s?.replace(SITE_PREFIX, '')?.trim();
