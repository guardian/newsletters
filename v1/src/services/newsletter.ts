import mockNewsletters from '../mocks/newsletterResponse.json';
import { NewslettersResponse } from '../models/newsletter';

const getAllNewsletters = async () => {
	const data = mockNewsletters;
	const parsedResponse = NewslettersResponse.parse(data);
	// console.dir(parsedResponse, { depth: null }); // WIP
	return parsedResponse;
};

export { getAllNewsletters };
