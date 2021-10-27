import { APIGatewayProxyHandler } from 'aws-lambda';
import awsServerlessExpress from 'aws-serverless-express';
import * as dotenv from 'dotenv';
import express, { json } from 'express';
import { router } from './routes/routes';

dotenv.config();
const app = express();
app.use(json({ limit: '50mb' }));

app.use('/', router);

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
