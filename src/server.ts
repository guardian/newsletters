import { Context } from 'aws-lambda';
import awsServerlessExpress from 'aws-serverless-express';
import express from 'express';
import { getNewsletters } from './api/newsletters';

const app = express();
app.use(express.json({ limit: '50mb' }));

app.get('/newsletters', getNewsletters);

// If local then don't wrap in serverless
const PORT = 3000;
if (process.env.NODE_ENV === 'development') {
	app.listen(PORT, () => console.log(`Listening on port ${PORT}`));
} else {
	const server = awsServerlessExpress.createServer(app);
	exports.handler = (event: any, context: Context): void => {
		awsServerlessExpress.proxy(server, event, context);
	};
}
