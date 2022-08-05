import { capitalise } from './capitalise';

export const getBrazeAttributeName = (s: string): string | undefined =>
	s && `${s?.split('_').map(capitalise).join('')}_Subscribe_Email`;
