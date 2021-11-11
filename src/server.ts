import { APIGatewayProxyHandler } from 'aws-lambda';
import awsServerlessExpress from 'aws-serverless-express';
import express, { json } from 'express';
import { router } from './routes/routes';

const app = express();
app.use(json({ limit: '50mb' }));

app.use('/', router);

if (process.env.NODE_ENV === 'development') {
	const PORT = process.env.PORT || 4000;
	app.listen(PORT, () => console.log(`Listening on port ${PORT}`));
} else {
	const server = awsServerlessExpress.createServer(app);
	const handler: APIGatewayProxyHandler = (event, context) => {
		awsServerlessExpress.proxy(server, event, context);
	};
	exports.handler = handler;
}
