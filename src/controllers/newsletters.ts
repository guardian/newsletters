import {
	GROUP_INDEX,
	ORDER_INDEX,
	prepareRows,
	PREVIEW_INDEX,
	readNewslettersSheet,
	THEME_INDEX,
} from '../lib/googleNewsletterSheets';
import { EmailNewsletter, GroupedNewsletters } from '../models/newsletters';
import {
	camelise,
	getBrazeAttributeName,
	replaceLastSpaceByNonBreakingSpace,
} from '../util';

const getIllutration = (circle: string): object | undefined => {
	if (!circle) return;
	return { circle };
};

const rowToNewsletter = ({
	2: name,
	[PREVIEW_INDEX]: exampleUrl,
	6: frequency,
	[THEME_INDEX]: theme,
	16: description,
	17: listIdv1,
	18: listId,
	19: id,
	20: brazeSubscribeEventNamePrefix,
	21: brazeNewsletterName,
	22: brazeSubscribeAttributeName,
	23: mailName,
	24: mailTitle,
	25: mailDescription,
	26: mailSuccessDescription,
	27: mailHexCode,
	28: mailImageUrl,
	29: illustration,
}: string[]): EmailNewsletter => ({
	id,
	name,
	brazeNewsletterName,
	brazeSubscribeAttributeName:
		brazeSubscribeAttributeName ||
		getBrazeAttributeName(brazeSubscribeEventNamePrefix),
	brazeSubscribeEventNamePrefix,
	theme,
	description: description,
	frequency,
	exactTargetListId: parseInt(listId),
	listIdv1: parseInt(listIdv1),
	listId: parseInt(listId),
	exampleUrl,
	emailEmbed: {
		name: mailName || name,
		title: replaceLastSpaceByNonBreakingSpace(
			mailTitle || `Sign up for ${mailName || name}`,
		),
		description: mailDescription ? mailDescription : description,
		successHeadline: 'Check your email inbox and confirm your subscription',
		successDescription: mailSuccessDescription || 'Thanks for subscribing!',
		hexCode: mailHexCode || '#DCDCDC',
		imageUrl: mailImageUrl?.length > 0 ? mailImageUrl : undefined,
	},
	illustration: getIllutration(illustration),
});

const getGroupedNewsletters = (
	groups: string[],
	rows: string[][],
): GroupedNewsletters => {
	const results: GroupedNewsletters = {};

	groups.forEach((g) => {
		const nl = rows.filter(
			({ [GROUP_INDEX]: group }) =>
				group.toUpperCase() === g.toUpperCase(),
		);
		results[camelise(nl[0][GROUP_INDEX])] = {
			displayName: g,
			newsletters: nl
				.sort(
					({ [ORDER_INDEX]: a }, { [ORDER_INDEX]: b }) =>
						parseInt(a) - parseInt(b),
				)
				.map(rowToNewsletter),
		};
	});
	return results;
};

const getGroupedEmailNewsletters = async (): Promise<GroupedNewsletters> => {
	const rows = await readNewslettersSheet();
	const preparedRows = prepareRows(rows);

	const groups = [
		...new Set(preparedRows.map(({ [GROUP_INDEX]: group }) => group)),
	];
	return getGroupedNewsletters(groups, preparedRows);
};

export { getGroupedEmailNewsletters };
