import SSM from 'aws-sdk/clients/ssm';
import {
	CredentialProviderChain,
	ECSCredentials,
	SharedIniFileCredentials,
} from 'aws-sdk/lib/core';

const Stage = process.env.STAGE ?? 'CODE';
const Path = `/${Stage}/newsletters/newsletters-source`;
type Config = { [key: string]: string };

const ssm: SSM = new SSM({
	credentialProvider: new CredentialProviderChain([
		(): SharedIniFileCredentials =>
			new SharedIniFileCredentials({ profile: 'frontend' }),
		(): ECSCredentials => new ECSCredentials(),
	]),
	region: 'eu-west-1',
});

let state: Config | null = null;

async function fetchConfig(): Promise<Config> {
	if (state == null) {
		state = {};

		const awsParameters = await ssm
			.getParametersByPath({
				Path,
				WithDecryption: true,
			})
			.promise();
		for (const parameter of awsParameters.Parameters ?? []) {
			if (parameter.Name && parameter.Value) {
				const name = parameter.Name.replace(Path, '');
				state[name] = parameter.Value;
			}
		}
		console.log(`Configuration spreadsheet: ${state['spreadsheet.id']}`);
		return state;
	} else {
		return Promise.resolve(state);
	}
}

export async function getConfigItem(key: string): Promise<string> {
	try {
		const config = await fetchConfig();
		if (config[key]) {
			return config[key];
		} else {
			throw new Error(`No config value for key: ${Path}/${key}`);
		}
	} catch (err) {
		throw new Error(`Error retrieving AWS config: ${err}`);
	}
}
