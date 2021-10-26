import { APIGatewayProxyHandler } from 'aws-lambda';
import awsServerlessExpress from 'aws-serverless-express';
import * as dotenv from 'dotenv';
import express from 'express';
import { getNewsletters } from './api/newsletters';

dotenv.config();
const app = express();
app.use(express.json({ limit: '50mb' }));

app.get('/newsletters', getNewsletters);

// If local then don't wrap in serverless
const PORT = process.env.PORT;
if (process.env.NODE_ENV === 'development') {
	app.listen(PORT, () => console.log(`Listening on port ${PORT}`));
} else {
	const server = awsServerlessExpress.createServer(app);
	const handler: APIGatewayProxyHandler = (event, context) => {
		awsServerlessExpress.proxy(server, event, context);
	};
	exports.handler = handler;
}
